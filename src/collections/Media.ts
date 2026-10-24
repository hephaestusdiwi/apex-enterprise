import { ValidationError, type CollectionBeforeValidateHook, type CollectionConfig } from 'payload'
import { tr } from 'payload/i18n/tr'
import { adminOnly, staffOnly } from '../access'
import { FONT_MIME_TYPES, checkFontUpload, fontLabelFromFilename } from '../lib/fonts'

/**
 * File font (.woff2/.woff) harus konsisten: ekstensi, isi file (tanda tangan WOFF), dan MIME dari klien.
 * Payload menyimpan MIME kiriman klien untuk file non-gambar, jadi MIME font dinormalkan di sini.
 */
const validateFontUpload: CollectionBeforeValidateHook = ({ data, req }) => {
  const file = req.file
  if (!file || !data) return data

  const check = checkFontUpload({ filename: file.name, mimeType: file.mimetype, data: file.data })
  if (check.kind === 'invalid') {
    throw new ValidationError({ errors: [{ message: check.message, path: 'file' }] })
  }
  if (check.kind === 'font') {
    data.mimeType = check.mimeType
    // Kolom alt wajib; untuk font isi otomatis dari nama file kalau kosong.
    if (typeof data.alt !== 'string' || data.alt.trim() === '') data.alt = fontLabelFromFilename(file.name)
  }
  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'filename',
  },
  hooks: {
    beforeValidate: [validateFontUpload],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Untuk file font, isi nama font (mis. "Inter Regular").',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    // Font hanya format web (woff2/woff). Dipakai di Site Settings > Tipografi.
    mimeTypes: ['image/*', ...FONT_MIME_TYPES],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'medium', width: 960 },
      { name: 'large', width: 1920 },
      { name: 'og', width: 1200, height: 630, fit: 'cover' },
    ],
  },
}