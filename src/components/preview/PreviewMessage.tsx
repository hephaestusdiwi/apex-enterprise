import Link from 'next/link'

export type PreviewMessageReason =
  | 'invalid'
  | 'expired'
  | 'mismatch'
  | 'forbidden'
  | 'not_found'
  | 'incomplete'
  | 'render_error'

const COPY: Record<PreviewMessageReason, { title: string; body: string }> = {
  invalid: {
    title: 'Link preview tidak valid',
    body: 'Link ini rusak atau sudah diubah. Buka preview lagi lewat tombol Preview di editor.',
  },
  expired: {
    title: 'Link preview sudah kedaluwarsa',
    body: 'Demi keamanan, link preview hanya berlaku 30 menit. Tekan Preview lagi di editor untuk membuat link baru.',
  },
  mismatch: {
    title: 'Link preview tidak sesuai',
    body: 'Link ini dibuat untuk dokumen atau akun lain. Buka preview lewat tombol Preview di editor.',
  },
  forbidden: {
    title: 'Anda tidak memiliki izin',
    body: 'Akun yang sedang login tidak boleh membuka preview. Hubungi admin bila ini keliru.',
  },
  not_found: {
    title: 'Draft tidak ditemukan',
    body: 'Draft ini mungkin sudah dihapus atau tidak tersedia untuk akun Anda.',
  },
  incomplete: {
    title: 'Konten belum bisa dirender',
    body: 'Judul belum diisi. Isi judul di editor, simpan draft, lalu buka Preview lagi.',
  },
  render_error: {
    title: 'Preview gagal ditampilkan',
    body: 'Ada bagian konten yang tidak bisa dirender. Periksa blok dan media di editor, lalu coba lagi.',
  },
}

type Props = { reason: PreviewMessageReason; editorHref?: string }

export function PreviewMessage({ reason, editorHref }: Props) {
  const { title, body } = COPY[reason]
  return (
    <section className="mx-auto w-full max-w-xl px-5 pb-24 pt-32 md:px-10 md:pt-40" role="alert">
      <p className="text-xs text-mute">Preview Mode</p>
      <h1 className="mt-3 text-[clamp(1.5rem,2.6vw,2.5rem)] font-medium leading-[1.15] tracking-tight">{title}</h1>
      <p className="mt-4 text-base text-mute">{body}</p>
      <p className="mt-8">
        <Link
          href={editorHref ?? '/admin'}
          className="text-sm underline underline-offset-[6px] can-hover:hover:text-accent"
        >
          {editorHref ? 'Kembali ke Editor' : 'Ke halaman admin'}
        </Link>
      </p>
    </section>
  )
}
