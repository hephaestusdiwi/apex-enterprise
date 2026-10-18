export async function register() {
    if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.NODE_ENV !== 'production') return
    if (!process.env.DATABASE_URL) return

    const { default: pg } = await import('pg')
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 })

    try {
        const result = await pool.query('delete from payload_migrations where batch = -1')
        if (result.rowCount) console.log('[apex] Penanda dev-push dihapus dari payload_migrations.')
    } catch (err) {
        if ((err as { code?: string }).code !== '42P01') console.error('[apex] Gagal membersihkan penanda dev-push:', err)
    } finally {
    await pool.end()
    }
}