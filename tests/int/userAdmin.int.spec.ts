// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { Users } from '@/collections/Users'
import { inviteState } from '@/users/rules'
import * as service from '@/users/service'
import { inviteUser, resendInvite, setUserStatus, type Actor } from '@/users/service'

let payload: Payload

const PASSWORD = 'Test-Passw0rd!'
const NEW_PASSWORD = 'Brand-New-Passw0rd!'
const PREFIX = '__test__users-'
const stamp = Date.now()
let counter = 0

type SentMail = { to: unknown; subject: string; html: string; text: string }
const sent: SentMail[] = []
let failNextSend = false
const logged: string[] = []

const original: { email?: unknown; sendEmail?: unknown } = {}

// Adapter email palsu: menampung semua email, baik lewat payload.sendEmail maupun adapter (mis. lupa password bawaan Payload).
const capture = async (message: SentMail) => {
  if (failNextSend) {
    failNextSend = false
    throw new Error('SMTP down')
  }
  sent.push(message)
}
const fakeAdapter = { name: 'test', defaultFromAddress: 'test@example.test', defaultFromName: 'Test', sendEmail: capture }

const emailOf = (tag: string) => `${PREFIX}${tag}-${stamp}-${counter++}@example.test`

const asActor = (doc: { id: number; email: string; name?: string | null; role?: string | null; status?: string | null }): Actor => ({
  id: doc.id,
  email: doc.email,
  name: doc.name,
  role: doc.role,
  status: doc.status,
})

const makeUser = async (tag: string, role: 'admin' | 'editor' = 'editor', status: 'active' | 'invited' | 'disabled' = 'active') =>
  payload.create({ collection: 'users', data: { email: emailOf(tag), password: PASSWORD, role, status } })

/** Token undangan hanya ada di tautan email; tes membacanya dari email yang "terkirim". */
const tokenFrom = (mail: SentMail): string => {
  const match = /\/admin\/reset\/([a-f0-9]+)/.exec(mail.text)
  if (!match) throw new Error('Tautan undangan tidak ada di email')
  return match[1]!
}

const rawUser = (id: number) =>
  payload.db.findOne<{ id: number } & Record<string, unknown>>({ collection: 'users', where: { id: { equals: id } } })

const rejection = async (promise: Promise<unknown>): Promise<string> => {
  try {
    await promise
  } catch (error) {
    return (error as Error).message
  }
  throw new Error('Seharusnya ditolak, tetapi berhasil')
}

beforeAll(async () => {
  payload = await getPayload({ config: await config })

  // Email palsu: tidak ada SMTP sungguhan, dan setiap email yang terkirim bisa diperiksa.
  original.email = payload.email
  original.sendEmail = payload.sendEmail
  payload.email = fakeAdapter as never
  payload.sendEmail = capture as never

  // Rekam semua log: token undangan tidak boleh muncul di mana pun.
  for (const level of ['info', 'warn', 'error', 'debug'] as const) {
    const real = payload.logger[level].bind(payload.logger)
    vi.spyOn(payload.logger, level).mockImplementation(((...args: unknown[]) => {
      logged.push(JSON.stringify(args, (_k, v) => (v instanceof Error ? v.message : v)))
      return real(...(args as [never]))
    }) as never)
  }
}, 60_000)

afterEach(() => {
  vi.restoreAllMocks()
})

afterAll(async () => {
  payload.email = original.email as never
  payload.sendEmail = original.sendEmail as never
  await payload.delete({ collection: 'users', where: { email: { like: PREFIX } } })
}, 60_000)

beforeEach(() => {
  sent.length = 0
  failNextSend = false
})

describe('undangan user lewat email', () => {
  it('membuat akun berstatus diundang, mengirim tautan sekali pakai, dan tidak mengirim password', async () => {
    const admin = await makeUser('admin', 'admin')
    const email = emailOf('invitee')

    const result = await inviteUser(payload, asActor(admin), { email: email.toUpperCase(), name: ' Budi ', role: 'editor' })
    expect(result).toMatchObject({ ok: true, email })
    // Hasil API tidak memuat token atau password.
    expect(JSON.stringify(result)).not.toMatch(/token|password|reset/i)

    const user = await rawUser((result as { id: number }).id)
    expect(user).toMatchObject({ email, name: 'Budi', role: 'editor', status: 'invited' })
    const doc = await payload.findByID({ collection: 'users', id: (result as { id: number }).id, depth: 0 })
    expect(doc.status).toBe('invited')
    expect(doc.invitedBy).toBe(admin.id)
    expect(new Date(doc.invitedAt!).getTime()).toBeLessThanOrEqual(Date.now())
    const hours = (new Date(doc.inviteExpiresAt!).getTime() - Date.now()) / 3_600_000
    expect(hours).toBeGreaterThan(71)
    expect(hours).toBeLessThanOrEqual(72)
    expect(inviteState(doc)).toBe('pending')

    expect(sent).toHaveLength(1)
    expect(sent[0]!.to).toBe(email)
    expect(sent[0]!.text).toMatch(/^Halo Budi,/)
    expect(sent[0]!.text).toContain('http://localhost:3000/admin/reset/')
    expect(sent[0]!.text).not.toContain(PASSWORD)
    // Password acak yang dipakai akun tidak pernah dikirim: tidak ada string sepanjang itu di email selain token.
    expect(sent[0]!.text).not.toMatch(/[A-Za-z0-9_-]{60,}/)

    const token = tokenFrom(sent[0]!)
    expect(logged.join('\n')).not.toContain(token)
  })

  it('akun yang diundang belum bisa login, dan tidak ada jalan login dengan password tebakan', async () => {
    const admin = await makeUser('admin', 'admin')
    const invited = await inviteUser(payload, asActor(admin), { email: emailOf('belum-aktif'), role: 'editor' })
    const email = sent.at(-1)!.to as string
    expect(invited.ok).toBe(true)

    const wrong = await rejection(payload.login({ collection: 'users', data: { email: 'tidak-ada@example.test', password: 'x' } }))
    const blocked = await rejection(payload.login({ collection: 'users', data: { email, password: PASSWORD } }))
    // Pesan sama dengan password salah: status akun tidak bocor.
    expect(blocked).toBe(wrong)
  })

  it('penerima membuat password sendiri lewat tautan: akun menjadi aktif dan tautan tidak bisa dipakai lagi', async () => {
    const admin = await makeUser('admin', 'admin')
    const invited = (await inviteUser(payload, asActor(admin), { email: emailOf('terima'), role: 'editor' })) as { id: number; email: string }
    const token = tokenFrom(sent.at(-1)!)

    const done = await payload.resetPassword({ collection: 'users', data: { token, password: NEW_PASSWORD }, overrideAccess: true })
    expect(done.token).toBeTruthy()

    const doc = await payload.findByID({ collection: 'users', id: invited.id, depth: 0 })
    expect(doc.status).toBe('active')
    expect(doc.activatedAt).toBeTruthy()
    expect(doc.inviteExpiresAt).toBeNull()

    const login = await payload.login({ collection: 'users', data: { email: invited.email, password: NEW_PASSWORD } })
    expect(login.user?.status).toBe('active')

    // Sekali pakai.
    await expect(payload.resetPassword({ collection: 'users', data: { token, password: 'Another-Passw0rd!' }, overrideAccess: true })).rejects.toThrow()
    expect(logged.join('\n')).not.toContain(token)
  })

  it('undangan kedaluwarsa tidak bisa dipakai maupun login, dan kirim ulang menerbitkan tautan baru', async () => {
    const admin = await makeUser('admin', 'admin')
    const invited = (await inviteUser(payload, asActor(admin), { email: emailOf('kedaluwarsa'), role: 'editor' })) as { id: number; email: string }
    const oldToken = tokenFrom(sent.at(-1)!)

    // Majukan waktu: undangan dan token kedaluwarsa, pengiriman terakhir sudah lama.
    const past = new Date(Date.now() - 3_600_000).toISOString()
    await payload.update({
      collection: 'users',
      id: invited.id,
      data: { inviteExpiresAt: past, invitedAt: new Date(Date.now() - 72 * 3_600_000).toISOString(), resetPasswordExpiration: past } as never,
    })
    const expired = await payload.findByID({ collection: 'users', id: invited.id, depth: 0 })
    expect(inviteState(expired)).toBe('expired')

    await expect(payload.resetPassword({ collection: 'users', data: { token: oldToken, password: NEW_PASSWORD }, overrideAccess: true })).rejects.toThrow()
    await expect(payload.login({ collection: 'users', data: { email: invited.email, password: NEW_PASSWORD } })).rejects.toThrow()

    sent.length = 0
    expect(await resendInvite(payload, asActor(admin), invited.id)).toEqual({ ok: true })
    expect(sent).toHaveLength(1)
    const newToken = tokenFrom(sent[0]!)
    expect(newToken).not.toBe(oldToken)
    expect(inviteState(await payload.findByID({ collection: 'users', id: invited.id, depth: 0 }))).toBe('pending')

    // Tautan lama mati; tautan baru berfungsi.
    await expect(payload.resetPassword({ collection: 'users', data: { token: oldToken, password: NEW_PASSWORD }, overrideAccess: true })).rejects.toThrow()
    await payload.resetPassword({ collection: 'users', data: { token: newToken, password: NEW_PASSWORD }, overrideAccess: true })
    expect((await payload.findByID({ collection: 'users', id: invited.id, depth: 0 })).status).toBe('active')
  })

  it('kirim ulang: tautan sebelumnya langsung tidak berlaku dan ada jeda antar pengiriman', async () => {
    const admin = await makeUser('admin', 'admin')
    const invited = (await inviteUser(payload, asActor(admin), { email: emailOf('resend'), role: 'editor' })) as { id: number }
    const firstToken = tokenFrom(sent.at(-1)!)

    // Baru saja dikirim: ditahan.
    const tooSoon = await resendInvite(payload, asActor(admin), invited.id)
    expect(tooSoon).toMatchObject({ ok: false, status: 429 })

    await payload.update({ collection: 'users', id: invited.id, data: { invitedAt: new Date(Date.now() - 120_000).toISOString() } })
    expect(await resendInvite(payload, asActor(admin), invited.id)).toEqual({ ok: true })
    await expect(payload.resetPassword({ collection: 'users', data: { token: firstToken, password: NEW_PASSWORD }, overrideAccess: true })).rejects.toThrow()
  })

  it('menolak input tidak valid, email yang sudah ada, pelaku non-admin, dan SMTP yang belum dikonfigurasi', async () => {
    const admin = await makeUser('admin', 'admin')
    const editor = await makeUser('editor', 'editor')
    const existing = await makeUser('existing', 'editor')

    expect(await inviteUser(payload, asActor(admin), { email: 'bukan-email' })).toMatchObject({ ok: false, status: 400 })
    expect(await inviteUser(payload, asActor(admin), { email: emailOf('x'), role: 'owner' })).toMatchObject({ ok: false, status: 400 })
    expect(await inviteUser(payload, asActor(admin), { email: emailOf('x'), name: 'N'.repeat(121) })).toMatchObject({ ok: false, status: 400 })
    expect(await inviteUser(payload, asActor(admin), { email: existing.email })).toMatchObject({ ok: false, status: 409 })
    expect(await inviteUser(payload, asActor(editor), { email: emailOf('x') })).toMatchObject({ ok: false, status: 403 })
    expect(await resendInvite(payload, asActor(editor), existing.id)).toMatchObject({ ok: false, status: 403 })
    expect(await resendInvite(payload, asActor(admin), existing.id)).toMatchObject({ ok: false, status: 409 }) // sudah aktif
    expect(await resendInvite(payload, asActor(admin), 999_999_999)).toMatchObject({ ok: false, status: 404 })

    // Email sama yang sudah diundang diarahkan ke "kirim ulang".
    const email = emailOf('dua-kali')
    await inviteUser(payload, asActor(admin), { email })
    const again = await inviteUser(payload, asActor(admin), { email })
    expect(again).toMatchObject({ ok: false, status: 409, message: expect.stringContaining('Kirim ulang') })

    // Adapter bawaan "console" tidak mengirim apa pun: tolak terang-terangan, jangan buat akun yatim.
    const before = (await payload.count({ collection: 'users' })).totalDocs
    payload.email = { name: 'console' } as never
    const unconfigured = await inviteUser(payload, asActor(admin), { email: emailOf('tanpa-smtp') })
    payload.email = fakeAdapter as never
    expect(unconfigured).toMatchObject({ ok: false, status: 503 })
    expect((await payload.count({ collection: 'users' })).totalDocs).toBe(before)
  })

  it('email gagal terkirim: tidak ada akun yatim yang tersisa', async () => {
    const admin = await makeUser('admin', 'admin')
    const email = emailOf('gagal-kirim')
    failNextSend = true
    const result = await inviteUser(payload, asActor(admin), { email })
    expect(result).toMatchObject({ ok: false, status: 502 })
    const found = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
    expect(found.totalDocs).toBe(0)

    // Percobaan berikutnya berhasil.
    expect(await inviteUser(payload, asActor(admin), { email })).toMatchObject({ ok: true })
  })
})

describe('nonaktifkan / aktifkan user', () => {
  it('menonaktifkan memutus sesi yang berjalan, mencatat pelaku, dan memblokir login', async () => {
    const admin = await makeUser('admin', 'admin')
    const editor = await makeUser('editor', 'editor')

    const session = await payload.login({ collection: 'users', data: { email: editor.email, password: PASSWORD } })
    const headers = new Headers({ Authorization: `JWT ${session.token}` })
    expect((await payload.auth({ headers })).user?.id).toBe(editor.id)

    expect(await setUserStatus(payload, asActor(admin), editor.id, 'disabled')).toEqual({ ok: true, status: 'disabled' })

    const doc = await payload.findByID({ collection: 'users', id: editor.id, depth: 0 })
    expect(doc.status).toBe('disabled')
    expect(doc.disabledBy).toBe(admin.id)
    expect(doc.disabledAt).toBeTruthy()

    // Token lama tidak lagi mengautentikasi, dan login baru ditolak dengan pesan yang sama seperti password salah.
    expect((await payload.auth({ headers })).user).toBeNull()
    const wrong = await rejection(payload.login({ collection: 'users', data: { email: 'tidak-ada@example.test', password: 'x' } }))
    expect(await rejection(payload.login({ collection: 'users', data: { email: editor.email, password: PASSWORD } }))).toBe(wrong)
  })

  it('mengaktifkan kembali memulihkan login', async () => {
    const admin = await makeUser('admin', 'admin')
    const editor = await makeUser('editor', 'editor', 'disabled')
    expect(await setUserStatus(payload, asActor(admin), editor.id, 'disabled')).toMatchObject({ ok: false, status: 409 }) // sudah nonaktif
    expect(await setUserStatus(payload, asActor(admin), editor.id, 'active')).toEqual({ ok: true, status: 'active' })
    await expect(payload.login({ collection: 'users', data: { email: editor.email, password: PASSWORD } })).resolves.toBeTruthy()
    expect(await setUserStatus(payload, asActor(admin), editor.id, 'active')).toMatchObject({ ok: false, status: 409 }) // sudah aktif
  })

  it('menonaktifkan undangan yang belum diterima mematikan tautannya; mengaktifkannya kembali perlu undangan ulang', async () => {
    const admin = await makeUser('admin', 'admin')
    const invited = (await inviteUser(payload, asActor(admin), { email: emailOf('dicabut'), role: 'editor' })) as { id: number }
    const token = tokenFrom(sent.at(-1)!)

    expect(await setUserStatus(payload, asActor(admin), invited.id, 'disabled')).toEqual({ ok: true, status: 'disabled' })
    await expect(payload.resetPassword({ collection: 'users', data: { token, password: NEW_PASSWORD }, overrideAccess: true })).rejects.toThrow()

    // Belum pernah menyelesaikan undangan: kembali ke "diundang", bukan langsung aktif.
    expect(await setUserStatus(payload, asActor(admin), invited.id, 'active')).toEqual({ ok: true, status: 'invited' })
    expect((await payload.findByID({ collection: 'users', id: invited.id, depth: 0 })).status).toBe('invited')
  })

  it('akun nonaktif atau diundang tidak bisa menghidupkan diri lewat lupa password publik', async () => {
    const admin = await makeUser('admin', 'admin')
    const disabled = await makeUser('nonaktif', 'editor', 'disabled')
    const active = await makeUser('aktif', 'editor')
    const invited = (await inviteUser(payload, asActor(admin), { email: emailOf('diundang'), role: 'editor' })) as { id: number; email: string }
    const inviteToken = tokenFrom(sent.at(-1)!)
    sent.length = 0

    await payload.forgotPassword({ collection: 'users', data: { email: disabled.email }, overrideAccess: true })
    await payload.forgotPassword({ collection: 'users', data: { email: invited.email }, overrideAccess: true })
    expect((await rawUser(disabled.id))?.resetPasswordToken ?? null).toBeNull()
    expect(sent).toHaveLength(0)
    // Token undangan yang beredar tidak tertimpa oleh permintaan publik.
    await expect(payload.resetPassword({ collection: 'users', data: { token: inviteToken, password: NEW_PASSWORD }, overrideAccess: true })).resolves.toBeTruthy()
    expect(invited.id).toBeTruthy()

    // Akun aktif tetap bisa memakai lupa password seperti biasa.
    await payload.forgotPassword({ collection: 'users', data: { email: active.email }, overrideAccess: true })
    expect(typeof (await rawUser(active.id))?.resetPasswordToken).toBe('string')
  })

  it('menolak: menonaktifkan diri sendiri, pelaku non-admin, dan akun yang tidak ada', async () => {
    const admin = await makeUser('admin', 'admin')
    await makeUser('admin-lain', 'admin') // ada admin lain, dan tetap tidak boleh menonaktifkan diri sendiri
    const editor = await makeUser('editor', 'editor')

    expect(await setUserStatus(payload, asActor(admin), admin.id, 'disabled')).toMatchObject({ ok: false, status: 409, message: expect.stringContaining('sendiri') })
    expect(await setUserStatus(payload, asActor(editor), admin.id, 'disabled')).toMatchObject({ ok: false, status: 403 })
    expect(await setUserStatus(payload, asActor(admin), 999_999_999, 'disabled')).toMatchObject({ ok: false, status: 404 })
    expect((await payload.findByID({ collection: 'users', id: admin.id, depth: 0 })).status).toBe('active')
  })

  it('admin yang dinonaktifkan kehilangan hak admin walau token lamanya masih ada', async () => {
    const admin = await makeUser('admin', 'admin')
    const other = await makeUser('admin-dua', 'admin')
    await setUserStatus(payload, asActor(admin), other.id, 'disabled')
    expect(await setUserStatus(payload, asActor({ ...other, status: 'disabled' }), admin.id, 'disabled')).toMatchObject({ ok: false, status: 403 })
  })
})

describe('role dan perlindungan admin terakhir (edit lewat REST/admin)', () => {
  it('admin mengubah role dan jejaknya tercatat; field server tidak bisa dipalsukan', async () => {
    const admin = await makeUser('admin', 'admin')
    const target = await makeUser('target', 'editor')

    const updated = await payload.update({
      collection: 'users',
      id: target.id,
      data: { role: 'admin', name: 'Nama Baru', status: 'disabled', invitedBy: admin.id, disabledBy: admin.id, roleChangedBy: target.id } as never,
      user: { ...admin, collection: 'users' },
      overrideAccess: false,
    })
    expect(updated.role).toBe('admin')
    expect(updated.name).toBe('Nama Baru')
    const doc = await payload.findByID({ collection: 'users', id: target.id, depth: 0 })
    expect(doc.roleChangedBy).toBe(admin.id)
    expect(doc.roleChangedAt).toBeTruthy()
    // Upaya mengisi status dan jejak audit lewat API biasa diabaikan.
    expect(doc.status).toBe('active')
    expect(doc.invitedBy ?? null).toBeNull()
    expect(doc.disabledBy ?? null).toBeNull()
  })

  it('editor tidak bisa menaikkan role atau mengubah statusnya sendiri', async () => {
    const editor = await makeUser('editor', 'editor')
    await payload.update({
      collection: 'users',
      id: editor.id,
      data: { role: 'admin', status: 'active', name: 'Saya' } as never,
      user: { ...editor, collection: 'users' },
      overrideAccess: false,
    })
    const doc = await payload.findByID({ collection: 'users', id: editor.id, depth: 0 })
    expect(doc.role).toBe('editor')
    expect(doc.name).toBe('Saya')
    expect(doc.roleChangedBy ?? null).toBeNull()
  })

  it('admin boleh menurunkan role sendiri bila masih ada admin aktif lain', async () => {
    const admin = await makeUser('admin', 'admin')
    await makeUser('admin-lain', 'admin')
    const updated = await payload.update({
      collection: 'users',
      id: admin.id,
      data: { role: 'editor' },
      user: { ...admin, collection: 'users' },
      overrideAccess: false,
    })
    expect(updated.role).toBe('editor')
  })

  it('admin terakhir tidak bisa menurunkan role sendiri atau menghapus akunnya', async () => {
    const admin = await makeUser('admin', 'admin')
    // Basis data bersama bisa berisi admin sungguhan; di sini kita simulasikan "tidak ada admin aktif lain".
    vi.spyOn(service, 'countOtherActiveAdmins').mockResolvedValue(0)

    const demote = await rejection(
      payload.update({ collection: 'users', id: admin.id, data: { role: 'editor' }, user: { ...admin, collection: 'users' }, overrideAccess: false }),
    )
    expect(demote).toMatch(/admin terakhir/i)
    expect((await payload.findByID({ collection: 'users', id: admin.id, depth: 0 })).role).toBe('admin')

    const removeSelf = await rejection(
      payload.delete({ collection: 'users', id: admin.id, user: { ...admin, collection: 'users' }, overrideAccess: false }),
    )
    expect(removeSelf).toMatch(/sendiri/)
    expect(await payload.findByID({ collection: 'users', id: admin.id, depth: 0, disableErrors: true })).toBeTruthy()
  })

  it('admin tidak bisa menghapus admin terakhir, tetapi bisa menghapus user biasa', async () => {
    const admin = await makeUser('admin', 'admin')
    const lastAdmin = await makeUser('admin-terakhir', 'admin')
    const editor = await makeUser('editor', 'editor')

    vi.spyOn(service, 'countOtherActiveAdmins').mockResolvedValue(0)
    expect(await rejection(payload.delete({ collection: 'users', id: lastAdmin.id, user: { ...admin, collection: 'users' }, overrideAccess: false }))).toMatch(/terakhir/)
    vi.restoreAllMocks()

    await payload.delete({ collection: 'users', id: editor.id, user: { ...admin, collection: 'users' }, overrideAccess: false })
    expect(await payload.findByID({ collection: 'users', id: editor.id, depth: 0, disableErrors: true })).toBeNull()
  })
})

describe('pembuatan user dan akses', () => {
  it('tidak ada pembuatan user lewat API biasa, bahkan oleh admin (hanya undangan)', async () => {
    const admin = await makeUser('admin', 'admin')
    const denied = await rejection(
      payload.create({
        collection: 'users',
        data: { email: emailOf('langsung'), password: 'Pass-Passw0rd!', role: 'editor' },
        user: { ...admin, collection: 'users' },
        overrideAccess: false,
      }),
    )
    expect(denied).toMatch(/not allowed|forbidden|izin/i)
  })

  it('editor hanya melihat akunnya sendiri; admin melihat semua', async () => {
    const admin = await makeUser('admin', 'admin')
    const editor = await makeUser('editor', 'editor')
    const asEditor = await payload.find({ collection: 'users', where: { email: { like: PREFIX } }, user: { ...editor, collection: 'users' }, overrideAccess: false })
    expect(asEditor.docs.map((d) => d.id)).toEqual([editor.id])
    const asAdmin = await payload.find({ collection: 'users', where: { email: { like: PREFIX } }, user: { ...admin, collection: 'users' }, overrideAccess: false, limit: 500 })
    expect(asAdmin.docs.length).toBeGreaterThan(1)
  })

  it('user pertama selalu admin dan aktif', async () => {
    const hook = Users.hooks!.beforeChange![0]!
    const req = { payload: { count: async () => ({ totalDocs: 0 }) }, user: null, context: {} } as never
    const first = await hook({ data: { role: 'editor' }, operation: 'create', req, collection: Users as never, context: {} } as never)
    expect(first).toMatchObject({ role: 'admin' })
    const notFirst = await hook({
      data: { role: 'editor' },
      operation: 'create',
      req: { payload: { count: async () => ({ totalDocs: 3 }) }, user: null, context: {} } as never,
      collection: Users as never,
      context: {},
    } as never)
    expect(notFirst).toMatchObject({ role: 'editor' })
  })

  it('akun lama (sebelum ada status) tetap bisa login dan dianggap aktif', async () => {
    const legacy = await makeUser('lama', 'editor')
    // Simulasi baris dari sebelum migrasi: status NULL.
    await payload.db.drizzle.execute(`update users set status = null where id = ${legacy.id}` as never)
    await expect(payload.login({ collection: 'users', data: { email: legacy.email, password: PASSWORD } })).resolves.toBeTruthy()
  })
})
