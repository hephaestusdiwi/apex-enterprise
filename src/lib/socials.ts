export const SOCIAL_PLATFORMS = [
    'linkedin',
    'instagram',
    'x',
    'github',
    'facebook',
    'youtube',
    'email',
    'website',
] as const

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    x: 'X',
    github: 'Github',
    facebook: 'Facebook',
    youtube: 'YouTube',
    email: 'Email',
    website: 'Website',
}

export const SOCIAL_OPTIONS = SOCIAL_PLATFORMS.map((value) => ({ label: SOCIAL_LABELS[value], value }))