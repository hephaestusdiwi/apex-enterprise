import { ROLE_LABEL, type UserRole } from './constants'

const escapeHtml = (value: string): string =>
    value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const oneLine = (value: string): string => value.replace(/[\r\n]+/g, ' ').trim()

const formatExpiry = (date: Date): string =>
  `${date.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Jakarta' })} WIB`

export type InviteEmailInput = {
    appName: string
    inviterName: string
    inviteeName?: string | null
    role: UserRole
    link: string
    expiresAt: Date
}

export function buildInviteEmail(input: InviteEmailInput): { subject: string; html: string; text: string } {
    const app = oneLine(input.appName) || 'APEX'
    const inviter = oneLine(input.inviterName)
    const greeting = input.inviteeName?.trim() ? `Halo ${oneLine(input.inviteeName)},` : 'Halo,'
    const role = ROLE_LABEL[input.role]
    const expiry = formatExpiry(input.expiresAt)

    const text = [
        greeting,
        '',
        `${inviter} mengundang Anda untuk bergabung di panel admin ${app} sebagai ${role}.`,
        '',
        'Buat password Anda lewat tautan berikut (sekali pakai):',
        input.link,
        '',
        `Tautan berlaku sampai ${expiry}. Setelah itu, minta admin mengirim ulang undangan.`,
        'Jika Anda tidak merasa diundang, abaikan email ini.',
    ].join('\n')

    const html = `
        <p>${escapeHtml(greeting)}</p>
        <p><strong>${escapeHtml(inviter)}</strong> mengundang Anda untuk bergabung di panel admin ${escapeHtml(app)} sebagai <strong>${role}</strong>.</p>
        <p><a href="${escapeHtml(input.link)}" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#ff8a3d;color:#1a0f06;font-weight:700;text-decoration:none">Buat password</a></p>
        <p style="color:#555">Tautan hanya bisa dipakai sekali dan berlaku sampai ${escapeHtml(expiry)}. Setelah itu, minta admin mengirim ulang undangan.</p>
        <p style="color:#555">Jika tombol tidak berfungsi, salin tautan ini ke browser:<br />${escapeHtml(input.link)}</p>
        <p style="color:#888">Jika Anda tidak merasa diundang, abaikan email ini.</p>
    `
    return { subject: `Undangan bergabung di ${app}`, html, text }
}