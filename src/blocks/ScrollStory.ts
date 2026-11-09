import type { Block } from 'payload'
import { layoutField } from '../fields/layout'
import { richTextEditor } from '../fields/richText'

type Sibling = { preset?: string } | undefined

const isPreset =
  (...presets: string[]) =>
  (_: unknown, siblingData: unknown): boolean =>
    presets.includes((siblingData as Sibling)?.preset ?? '')

const MIN_PANELS = 2
const MAX_PANELS = 8

/**
 * Block storytelling visual untuk halaman, project, dan artikel.
 * Satu block, tiga tampilan (preset) dan satu pilihan gaya animasi level tinggi:
 * editor tidak perlu mengatur detail teknis animasi.
 */
export const ScrollStoryBlock: Block = {
  slug: 'scrollStory',
  interfaceName: 'ScrollStoryBlock',
  labels: { singular: 'Cerita Scroll', plural: 'Cerita Scroll' },
  fields: [
    {
      name: 'preset',
      type: 'select',
      required: true,
      defaultValue: 'cinematic',
      label: 'Tampilan',
      admin: {
        description:
          'Sinematik: gambar/video layar penuh dengan judul besar. Terbagi: gambar dan teks berdampingan (bertumpuk di HP). Showcase menempel: visual tetap terlihat sementara teks berganti saat halaman discroll.',
      },
      options: [
        { label: 'Sinematik — media layar penuh + judul besar', value: 'cinematic' },
        { label: 'Terbagi — media dan teks berdampingan', value: 'split' },
        { label: 'Showcase menempel — visual tetap, teks berganti saat scroll', value: 'sticky' },
      ],
    },
    {
      name: 'animation',
      type: 'select',
      defaultValue: 'auto',
      label: 'Gaya animasi',
      admin: {
        description:
          'Efek yang berjalan saat bagian ini discroll. "Otomatis" memilih yang paling cocok untuk tampilan di atas. Pengunjung yang mengaktifkan "kurangi gerakan" di perangkatnya tidak melihat animasi; kontennya tetap tampil utuh.',
      },
      options: [
        { label: 'Otomatis (disarankan)', value: 'auto' },
        { label: 'Tanpa animasi', value: 'none' },
        { label: 'Muncul halus — teks dan media naik pelan', value: 'fade' },
        { label: 'Tirai — gambar terbuka dari atas ke bawah', value: 'reveal' },
        { label: 'Zoom sinematik — gambar mengecil perlahan mengikuti scroll', value: 'zoom' },
        { label: 'Parallax — gambar bergeser lebih lambat dari teks', value: 'parallax' },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Label kecil (opsional)',
      admin: { description: 'Teks pendek di atas judul, mis. "Studi kasus" atau "Bab 1".' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Judul',
      admin: { description: 'Judul besar bagian ini. Singkat lebih kuat (maksimal sekitar 8 kata).' },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Teks pendamping (opsional)',
      editor: richTextEditor(),
      admin: {
        description: 'Satu-dua paragraf pendek. Untuk "Showcase menempel", teks diisi di tiap panel.',
        condition: isPreset('cinematic', 'split'),
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar',
      admin: {
        description:
          'Gunakan gambar landscape beresolusi tinggi (minimal 1920 px untuk Sinematik). Titik fokus yang diatur di Media menentukan bagian yang tetap terlihat saat dipotong. Untuk Sinematik, gambar ini juga dipakai sebagai cadangan kalau video belum termuat.',
        condition: isPreset('cinematic', 'split'),
      },
      validate: (value: unknown, { siblingData }: { siblingData: unknown }) => {
        if (!isPreset('cinematic', 'split')(undefined, siblingData)) return true
        return value ? true : 'Pilih gambar.'
      },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'videos',
      label: 'Video latar (opsional)',
      admin: {
        description:
          'Video pendek yang berputar tanpa suara di belakang judul. Dijeda otomatis saat di luar layar atau bila pengunjung memilih "kurangi gerakan" (yang tampil gambar saja). Pakai file kecil (di bawah 8 MB).',
        condition: isPreset('cinematic'),
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'textPosition',
          type: 'select',
          defaultValue: 'bottom',
          label: 'Posisi teks',
          admin: { width: '50%', condition: isPreset('cinematic') },
          options: [
            { label: 'Bawah kiri', value: 'bottom' },
            { label: 'Tengah', value: 'center' },
          ],
        },
        {
          name: 'overlay',
          type: 'select',
          defaultValue: 'medium',
          label: 'Gelapkan gambar',
          admin: {
            width: '50%',
            description: 'Naikkan kalau teks sulit dibaca di atas gambar yang terang.',
            condition: isPreset('cinematic'),
          },
          options: [
            { label: 'Ringan', value: 'soft' },
            { label: 'Sedang', value: 'medium' },
            { label: 'Kuat', value: 'strong' },
          ],
        },
      ],
    },
    {
      name: 'mediaSide',
      type: 'select',
      defaultValue: 'right',
      label: 'Posisi gambar',
      admin: { condition: isPreset('split') },
      options: [
        { label: 'Gambar di kiri', value: 'left' },
        { label: 'Gambar di kanan', value: 'right' },
      ],
    },
    {
      name: 'stickySide',
      type: 'select',
      defaultValue: 'left',
      label: 'Posisi visual yang menempel',
      admin: {
        description: 'Di HP, visual tampil di atas teks tiap panel (tidak menempel).',
        condition: isPreset('sticky'),
      },
      options: [
        { label: 'Visual di kiri, teks di kanan', value: 'left' },
        { label: 'Visual di kanan, teks di kiri', value: 'right' },
      ],
    },
    {
      name: 'panels',
      type: 'array',
      label: 'Panel cerita',
      labels: { singular: 'Panel', plural: 'Panel' },
      maxRows: MAX_PANELS,
      admin: {
        description: `Tiap panel = satu langkah cerita: teks di satu sisi, visualnya menempel di sisi lain. Isi ${MIN_PANELS}–${MAX_PANELS} panel; urutkan dengan menyeret.`,
        condition: isPreset('sticky'),
      },
      validate: (value: unknown, { siblingData }: { siblingData: unknown }) => {
        if (!isPreset('sticky')(undefined, siblingData)) return true
        const rows = Array.isArray(value) ? value.length : 0
        if (rows < MIN_PANELS) return `Isi minimal ${MIN_PANELS} panel.`
        if (rows > MAX_PANELS) return `Maksimal ${MAX_PANELS} panel.`
        return true
      },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Judul panel' },
        {
          name: 'body',
          type: 'richText',
          label: 'Teks panel (opsional)',
          editor: richTextEditor(),
          admin: { description: 'Satu paragraf pendek sudah cukup.' },
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Gambar panel',
          admin: { description: 'Gambar yang menempel saat panel ini aktif. Rasio yang sama antar panel terlihat paling rapi.' },
        },
      ],
    },
    // Animasi lama (reveal/parallax) disembunyikan: block ini punya gaya animasi sendiri di atas.
    layoutField({ motion: false }),
  ],
}
