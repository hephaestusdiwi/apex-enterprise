'use client'

type Tone = 'accent' | 'ok' | 'warn' | 'danger' | 'info' | 'muted'

const STATUS: Record<string, { label: string; tone: Tone }> = {
    new: {
        label: 'Baru', tone: 'accent'
    },
    read: {
        label: 'Dibaca', tone: 'muted'
    },
    archived: {
        label: 'Diarsipkan', tone: 'muted'
    },
    spam: {
        label: 'Spam', tone: 'danger'
    },
    pending: {
        label: 'Pending', tone: 'warn'
    },
    confirmed: {
        label: 'Dikonfirmasi', tone: 'ok'
    },
    rejected: {
        label: 'Ditolak', tone: 'danger'
    },
    cancelled: {
        label: 'Dibatalkan', tone: 'muted'
    },
    completed: {
        label: 'Selesai', tone: 'info'
    },
    expired: {
        label: 'Kedaluwarsa', tone: 'muted'
    }
}

export function StatusChip({ value }: { value?: unknown }) {
    if (typeof value !== 'string' || value === '') return null
    const status = STATUS[value]
    return <div className={`apex-status${status ? ` apex-status--${status.tone}` : ''}`}>{status?.label ?? value}</div>
}

export function StatusCell({ cellData }:  { cellData?: unknown }) {
    return <StatusChip value={cellData} />
}