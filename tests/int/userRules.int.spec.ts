// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { isAdmin, isStaff } from '@/access'
import { inviteTtlMs } from '@/users/constants'
import { buildInviteEmail } from '@/users/inviteEmail'
import { checkDelete, checkRoleChange, checkStatusChange, effectiveStatus, inviteState, isActiveAdmin, isActiveUser } from '@/users/rules'
import { normalizeEmail } from '@/users/service'

const admin = { id: 1, role: 'admin', status: 'active' }
const otherAdmin = { id: 2, role: 'admin', status: 'active' }
const editor = { id: 3, role: 'editor', status: 'active' }

describe('user: status akun dan akses', () => {
  it('data lama tanpa status dianggap aktif', () => {
    expect(effectiveStatus({})).toBe('active')
    expect(effectiveStatus({ status: null })).toBe('active')
    expect(effectiveStatus({ status: 'tidak-dikenal' })).toBe('active')
    expect(isActiveUser({ status: undefined })).toBe(true)
  })

  it('akun nonaktif atau masih diundang tidak dianggap staff, walau role-nya admin', () => {
    expect(isStaff({ role: 'admin', status: 'active' })).toBe(true)
    expect(isStaff({ role: 'editor' })).toBe(true) // data lama
    expect(isStaff({ role: 'admin', status: 'disabled' })).toBe(false)
    expect(isStaff({ role: 'editor', status: 'invited' })).toBe(false)
    expect(isAdmin({ role: 'admin', status: 'disabled' })).toBe(false)
    expect(isAdmin({ role: 'editor', status: 'active' })).toBe(false)
    expect(isStaff(null)).toBe(false)
    expect(isActiveAdmin({ id: 9, role: 'admin', status: 'invited' })).toBe(false)
  })
})

describe('user: nonaktifkan / aktifkan', () => {
  it('hanya admin aktif yang boleh', () => {
    expect(checkStatusChange({ actor: editor, target: otherAdmin, next: 'disabled', otherActiveAdmins: 5 })).toMatch(/Hanya admin/)
    expect(checkStatusChange({ actor: { ...admin, status: 'disabled' }, target: editor, next: 'disabled', otherActiveAdmins: 5 })).toMatch(/Hanya admin/)
    expect(checkStatusChange({ actor: admin, target: editor, next: 'disabled', otherActiveAdmins: 1 })).toBeNull()
  })

  it('admin tidak bisa menonaktifkan dirinya sendiri, bahkan bila ada admin lain', () => {
    expect(checkStatusChange({ actor: admin, target: admin, next: 'disabled', otherActiveAdmins: 3 })).toMatch(/sendiri/)
    expect(checkStatusChange({ actor: admin, target: { ...admin, id: '1' }, next: 'disabled', otherActiveAdmins: 3 })).toMatch(/sendiri/)
  })

  it('admin terakhir tidak bisa dinonaktifkan', () => {
    expect(checkStatusChange({ actor: admin, target: otherAdmin, next: 'disabled', otherActiveAdmins: 0 })).toMatch(/terakhir/)
    expect(checkStatusChange({ actor: admin, target: otherAdmin, next: 'disabled', otherActiveAdmins: 1 })).toBeNull()
  })

  it('mengaktifkan kembali selalu boleh bagi admin', () => {
    expect(checkStatusChange({ actor: admin, target: { id: 7, role: 'editor', status: 'disabled' }, next: 'active', otherActiveAdmins: 0 })).toBeNull()
  })
})

describe('user: ganti role', () => {
  it('admin terakhir tidak bisa menurunkan role-nya sendiri', () => {
    const msg = checkRoleChange({ actor: admin, target: admin, nextRole: 'editor', otherActiveAdmins: 0 })
    expect(msg).toMatch(/admin terakhir/i)
    expect(msg).toMatch(/Anda/)
  })

  it('admin boleh menurunkan role sendiri bila ada admin aktif lain', () => {
    expect(checkRoleChange({ actor: admin, target: admin, nextRole: 'editor', otherActiveAdmins: 1 })).toBeNull()
  })

  it('menaikkan role dan mengubah role user lain tidak terhalang', () => {
    expect(checkRoleChange({ actor: admin, target: editor, nextRole: 'admin', otherActiveAdmins: 0 })).toBeNull()
    expect(checkRoleChange({ actor: admin, target: otherAdmin, nextRole: 'editor', otherActiveAdmins: 1 })).toBeNull()
    expect(checkRoleChange({ actor: admin, target: admin, nextRole: 'admin', otherActiveAdmins: 0 })).toBeNull()
  })

  it('menolak role di luar daftar dan pelaku non-admin', () => {
    expect(checkRoleChange({ actor: admin, target: editor, nextRole: 'owner', otherActiveAdmins: 2 })).toMatch(/tidak dikenal/)
    expect(checkRoleChange({ actor: editor, target: editor, nextRole: 'admin', otherActiveAdmins: 2 })).toMatch(/Hanya admin/)
  })
})

describe('user: hapus akun', () => {
  it('tidak bisa menghapus diri sendiri atau admin terakhir', () => {
    expect(checkDelete({ actor: admin, target: admin, otherActiveAdmins: 4 })).toMatch(/sendiri/)
    expect(checkDelete({ actor: admin, target: otherAdmin, otherActiveAdmins: 0 })).toMatch(/terakhir/)
    expect(checkDelete({ actor: admin, target: editor, otherActiveAdmins: 0 })).toBeNull()
    expect(checkDelete({ actor: editor, target: editor, otherActiveAdmins: 4 })).toMatch(/Hanya admin/)
  })
})

describe('user: status undangan', () => {
  const now = new Date('2026-10-24T12:00:00Z')

  it('menurunkan status undangan dari batas waktu', () => {
    expect(inviteState({ status: 'invited', inviteExpiresAt: '2026-10-25T12:00:00Z' }, now)).toBe('pending')
    expect(inviteState({ status: 'invited', inviteExpiresAt: '2026-10-24T11:59:59Z' }, now)).toBe('expired')
    expect(inviteState({ status: 'invited', inviteExpiresAt: null }, now)).toBe('expired')
    expect(inviteState({ status: 'invited', inviteExpiresAt: 'bukan-tanggal' }, now)).toBe('expired')
    expect(inviteState({ status: 'active', inviteExpiresAt: '2026-10-25T12:00:00Z' }, now)).toBe('none')
    expect(inviteState({ status: 'disabled' }, now)).toBe('none')
  })

  it('masa berlaku undangan: bawaan 72 jam, bisa diatur, dan dibatasi', () => {
    const hour = 3_600_000
    expect(inviteTtlMs(undefined)).toBe(72 * hour)
    expect(inviteTtlMs('')).toBe(72 * hour)
    expect(inviteTtlMs('abc')).toBe(72 * hour)
    expect(inviteTtlMs('0')).toBe(72 * hour)
    expect(inviteTtlMs('24')).toBe(24 * hour)
    expect(inviteTtlMs('99999')).toBe(24 * 14 * hour)
  })
})

describe('user: email undangan', () => {
  const base = {
    appName: 'APEX',
    inviterName: 'Dewi',
    role: 'editor' as const,
    link: 'https://cms.example.test/admin/reset/abc123',
    expiresAt: new Date('2026-10-27T05:00:00Z'),
  }

  it('berisi tautan dan batas waktu, tanpa password', () => {
    const mail = buildInviteEmail({ ...base, inviteeName: 'Budi' })
    expect(mail.subject).toContain('APEX')
    expect(mail.text).toContain(base.link)
    expect(mail.html).toContain(`href="${base.link}"`)
    expect(mail.text).toContain('Halo Budi,')
    expect(mail.text).toContain('Editor')
    expect(mail.text).toContain('WIB')
    // Penerima membuat password sendiri; email tidak memuat password sementara dalam bentuk apa pun.
    expect(mail.text).not.toMatch(/sementara|temporary|password\s*[:=]|kata sandi\s*[:=]/i)
    expect(mail.html).not.toMatch(/sementara|temporary|password\s*[:=]|kata sandi\s*[:=]/i)
    expect(mail.text).toMatch(/Buat password/i)
  })

  it('meloloskan teks pengguna dengan aman (HTML dan header)', () => {
    const mail = buildInviteEmail({
      ...base,
      appName: 'APEX\r\nBcc: attacker@evil.test',
      inviterName: '<img src=x onerror=alert(1)>',
      inviteeName: 'A"><script>alert(1)</script>',
    })
    expect(mail.subject).not.toMatch(/[\r\n]/)
    expect(mail.html).not.toContain('<script>')
    expect(mail.html).not.toContain('<img')
    expect(mail.html).toContain('&lt;img')
  })

  it('tanpa nama penerima memakai sapaan netral', () => {
    expect(buildInviteEmail(base).text.startsWith('Halo,')).toBe(true)
  })
})

describe('user: normalisasi email', () => {
  it('merapikan huruf dan spasi, menolak yang tidak valid', () => {
    expect(normalizeEmail('  Budi@Example.TEST ')).toBe('budi@example.test')
    for (const bad of ['', 'budi', 'budi@', '@example.test', 'bu di@example.test', 'a@b', null, undefined, 42, `${'a'.repeat(250)}@example.test`]) {
      expect(normalizeEmail(bad), String(bad)).toBeNull()
    }
  })
})
