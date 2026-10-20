import type { TaskConfig } from 'payload'
import { sendDueReminders } from '@/lib/bookingReminders'

export const bookingRemindersTask: TaskConfig<'bookingReminders'> = {
  slug: 'bookingReminders',
  label: 'Kirim reminder booking H-1',
  schedule: [{ cron: '0 * * * *', queue: 'default' }], // tiap jam; jam 08.00 WIB ditangani di fungsinya
  outputSchema: [{ name: 'sent', type: 'number' }],
  handler: async ({ req }) => ({ output: { sent: await sendDueReminders(req.payload) } }),
}