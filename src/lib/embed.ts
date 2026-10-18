export const EMBED_HOSTS: readonly string[] = [
    'www.youtube-nocookie.com',
    'player.vimeo.com',
    'open.spotify.com',
    'w.soundcloud.com',
    'codepen.io',
]

export const isAllowedEmbedUrl = (input: string): boolean => {
    try {
        const url = new URL(input.trim())
        return url.protocol === 'https:' && EMBED_HOSTS.includes(url.hostname)
    } catch {
        return false
    }
}