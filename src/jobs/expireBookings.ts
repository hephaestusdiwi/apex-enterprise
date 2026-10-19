import type { TaskConfig } from 'payload'

export const expireBookingsTask: TaskConfig<'expireBookings'> = {
  slug: 'expireBookings',
  label: 'Kedaluwarsakan booking pending',
  schedule: [{ cron: '*/10 * * * *', queue: 'default' }],
  outputSchema: [{ name: 'expired', type: 'number' }],
  handler: async ({ req }) => {
    const { payload } = req
    const { docs } = await payload.find({
      collection: 'bookings',
      where: { and: [{ status: { equals: 'pending' } }, { holdUntil: { less_than: new Date().toISOString() } }] },
      limit: 100,
      depth: 0,
    })

    let expired = 0
    for (const d of docs) {
      try {
        await payload.update({ collection: 'bookings', id: d.id, data: { status: 'expired' } })
        expired++
      } catch (err) {
        payload.logger.error({ err, msg: `Gagal mengedaluwarsakan booking ${d.code}` })
      }
    }
    return { output: { expired } }
  },
}