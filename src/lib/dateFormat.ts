export const formatDateId = (ymd: string) =>
    new Intl.DateTimeFormat('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    }).format(new Date(`${ymd}T00:00:00Z`))