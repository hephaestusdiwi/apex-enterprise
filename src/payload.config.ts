import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { SiteSettings } from './globals/SiteSettings'
import { ContactSettings } from './globals/ContactSettings'
import { Projects } from './collections/Projects'
import { Videos } from './collections/Videos'
import { Contacts } from './collections/Contacts'
import { Visits } from './collections/Visits'
import { EditorialReviews } from './collections/EditorialReviews'
import { EditorialNotes } from './collections/EditorialNotes'
import { WorkflowSettings } from './globals/WorkflowSettings'
import { editorialEndpoints } from './editorial/endpoints'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: [
        '/components/admin/EditorialQueue#EditorialQueue',
      ],
      beforeNavLinks: ['/components/admin/NewMessagesLink#NewMessagesLink'],
      views: {
        dashboard: { Component: '/components/admin/Dashboard#Dashboard' },
      },
    },
  },
  collections: [Users, Media, Videos, Projects, Pages, Contacts, Visits, EditorialReviews, EditorialNotes],
  globals: [SiteSettings, ContactSettings, WorkflowSettings],
  endpoints: editorialEndpoints,
  jobs: {
    autoRun: [{ cron: '* * * * *', limit: 10, queue: 'default' }],
    shouldAutoRun: () => process.env.JOBS_AUTORUN !== 'false',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  cors: allowedOrigins,
  csrf: allowedOrigins,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER || 'no-reply@localhost',
        defaultFromName: process.env.SMTP_FROM_NAME || 'APEX',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
          connectionTimeout: 10_000,
          greetingTimeout: 10_000,
          socketTimeout: 15_000,
        },
      })
    : undefined,
  sharp,
  plugins: [],
})
