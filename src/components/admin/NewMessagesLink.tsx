import Link from 'next/link'
import type { ServerProps } from 'payload'
import { isStaff } from '@/access'

export async function NewMessagesLink({ payload, user }: ServerProps) {
    if (!isStaff(user)) return null

    const { totalDocs } = await payload.count({
        collection: 'contacts',
        where: { status: { equals: 'new' } },
    })

    return (
        <Link
        href={`${payload.config.routes.admin}/collections/contacts?where[status][equals]=new`}
        className="nav__link"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
        >
            <span className="nav__link-label">Pesan baru</span>
            {totalDocs > 0 ? (
                <span
                    aria-label={`${totalDocs} pesan baru`}
                    style={{
                        minWidth: 20,
                        padding: '0 6px',
                        borderRadius: 999,
                        background: 'var(--theme-error-500)',
                        color: '#fff',
                        fontSize: 12,
                        lineHeight: '20px',
                        textAlign: 'center',
                    }}
            >
                {totalDocs > 99 ? '99+' : totalDocs }
            </span>
            ): null}
        </Link>
    )
}