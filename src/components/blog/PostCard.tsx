import Image from 'next/image'
import Link from 'next/link'
import type { PostSummary } from '@/content/types'
import { focalPosition } from '@/lib/focal'
import { formatPostDate } from '@/lib/postFormat'

type Props = {
    post: PostSummary
    headingLevel?: 'h2' | 'h3'
    priority?: boolean
}

export function PostCard({ post, headingLevel = 'h2', priority = false }: Props) {
    const Heading = headingLevel
    const date = formatPostDate(post.publishedAt)

    return (
        <article className="group">
            <Link
                href={`/blog/${post.slug}`}
                className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
                <div className="relative aspect-[3/2] overflow-hidden bg-white/5">
                {post.cover ? (
                    <Image
                    src={post.cover.src}
                    alt=""
                    fill
                    priority={priority}
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 100vw"
                    className="object-cover transition-transform duration-500 motion-reduce:transition-none can-hover:group-hover:scale-[1.03]"
                    style={{ objectPosition: focalPosition(post.cover) }}
                    />
                ) : null}
                </div>

                <p className="mt-4 flex flex-wrap gap-x-3 text-xs text-mute">
                {post.category ? <span>{post.category.title}</span> : null}
                {date ? <time dateTime={post.publishedAt ?? undefined}>{date}</time> : null}
                </p>
                <Heading className="mt-2 text-xl font-medium leading-snug tracking-tight transition-colors md:text-2xl can-hover:group-hover:text-accent">
                {post.title}
                </Heading>
                {post.excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mute">{post.excerpt}</p> : null}
            </Link>
        </article>
    )
}