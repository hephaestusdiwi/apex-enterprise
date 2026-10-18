export type ParsedVideo = {
    provider: 'vimeo' | 'youtube'
    src: string
}

const YOUTUBE_ID = /^[\w-]{11}$/

export const parseVideoUrl = (input: string): ParsedVideo | null => {
    let url: URL
    try {
        url = new URL(input.trim())
    } catch {
        return null
    }
    if (url.protocol !== 'https:') return null

    const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '')
    const parts = url.pathname.split('/').filter(Boolean)

    let youtubeId: string | null | undefined
    if (host === 'youtu.be') {
        youtubeId = parts[0]
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
        if (url.pathname === '/watch') youtubeId = url.searchParams.get('v')
            else if (['embed', 'shorts', 'live', 'v'].includes(parts[0] ?? '')) youtubeId = parts[1]
    }
        if (youtubeId && YOUTUBE_ID.test(youtubeId))
            return { provider: 'youtube', src: `https://www.youtube-nocookie.com/embed/${youtubeId}` }

    if (host === 'vimeo.com' || host ===  'player.vimeo.com') {
        const segments = parts[0] === 'video' ? parts.slice(1) : parts
        const id = segments[0]
        const hash = segments[1] ?? url.searchParams.get('h')
        if (id && /^\d+$/.test(id)) {
            const query = hash && /^[0-9a-f]+$/i.test(hash) ? `?h=${hash}` : ''
            return { provider: 'vimeo', src: `https://player.vimeo.com/video/${id}${query}` }
        }
    }

    return null
}