import Image from 'next/image'
import type { TeamBlockData, TeamMemberData } from '@/content/types'
import { focalPosition } from '@/lib/focal'

function MemberCard({ member }: { member: TeamMemberData }) {
  const { photo, name, role, bio, socials } = member
  return (
    <article className="flex h-full flex-col">
      {/* Rasio foto seragam untuk semua anggota; fokus crop mengikuti focal point dari Media. */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        <Image
          src={photo.src}
          alt={photo.alt || name}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 36vw, 100vw"
          className="object-cover"
          style={{ objectPosition: focalPosition(photo) }}
        />
      </div>
      <div className="mt-5 space-y-2">
        <h3 className="text-xl font-medium leading-tight tracking-tight md:text-2xl">{name}</h3>
        {role ? <p className="text-sm font-medium text-accent md:text-base">{role}</p> : null}
        {bio ? <p className="text-sm leading-relaxed text-mute md:text-base">{bio}</p> : null}
      </div>
      {socials.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {socials.map((social, i) => {
            const external = /^https?:/i.test(social.href)
            return (
              <li key={`${social.platform}-${i}`}>
                <a
                  href={social.href}
                  aria-label={`${social.label} ${name}`}
                  className="underline underline-offset-[6px] transition-colors can-hover:hover:text-accent"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {social.label}
                  {external ? <span aria-hidden="true"> ↗</span> : null}
                </a>
              </li>
            )
          })}
        </ul>
      ) : null}
    </article>
  )
}

export function TeamView({ block }: { block: TeamBlockData }) {
  const { title, subtitle, members } = block
  if (members.length === 0) return null

  return (
    <div>
      {title || subtitle ? (
        <header className="mb-10 max-w-3xl space-y-4 md:mb-16">
          {title ? <h2 className="text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl">{title}</h2> : null}
          {subtitle ? <p className="text-lg leading-relaxed text-mute md:text-xl">{subtitle}</p> : null}
        </header>
      ) : null}
      <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
        {members.map((member) => (
          <li key={member.id}>
            <MemberCard member={member} />
          </li>
        ))}
      </ul>
    </div>
  )
}
