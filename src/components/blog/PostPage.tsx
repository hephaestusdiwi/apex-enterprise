import Image from 'next/image'
import Link from 'next/link'
import { ProjectContent } from '@/components/project/ProjectContent'
import type { PostData, PostSummary } from '@/content/types'
import { formatPostDate, blogHref } from '@/lib/postFormat'
import { readingMinutes } from '@/lib/readingTime'
import { PostCard } from './PostCard'

/** Kolom yang sama dengan block konten (75% layar di desktop), supaya header sejajar dengan isi. */
const COLUMN = 'mx-auto w-full px-5 md:w-3/4 md:max-w-[96rem] md:px-0'

type Props = {
  post: PostData
  related: PostSummary[]
}

export function PostPage({ post, related }: Props) {
  const date = formatPostDate(post.publishedAt)
  const minutes = readingMinutes(post.blocks)

  return (
    <article className="pt-28 md:pt-36">
      <header className={COLUMN}>
        <div className="max-w-3xl">
          <Link
            href={blogHref()}
            className="text-xs text-mute transition-colors can-hover:hover:text-accent"
          >
            ← Semua artikel
          </Link>
          {post.category ? (
            <p className="mt-8 text-xs text-mute">
              <Link
                href={blogHref({ kategori: post.category.slug })}
                className="underline underline-offset-4 transition-colors can-hover:hover:text-accent"
              >
                {post.category.title}
              </Link>
            </p>
          ) : null}
          <h1 className="mt-4 text-[clamp(2rem,3.4vw,3.75rem)] font-medium leading-[1.1] tracking-tight">
            {post.title}
          </h1>
          {post.excerpt ? <p className="mt-6 text-lg leading-relaxed text-mute md:text-xl">{post.excerpt}</p> : null}
          <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-xs text-mute">
            {post.authorName ? <span>{post.authorName}</span> : null}
            {date ? <time dateTime={post.publishedAt ?? undefined}>{date}</time> : null}
            <span>{minutes} menit baca</span>
          </p>
        </div>
      </header>

      {post.cover ? (
        <figure className={`${COLUMN} mt-10 md:mt-14`}>
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            width={post.cover.width}
            height={post.cover.height}
            priority
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="h-auto w-full"
          />
        </figure>
      ) : null}

      <div className="mt-12 md:mt-16">
        <ProjectContent blocks={post.blocks} />
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="related-posts" className="mt-28 px-[4%] md:mt-40">
          <h2 id="related-posts" className="text-xl font-medium md:text-2xl">
            Artikel lainnya
          </h2>
          <ul className="mt-8 grid gap-10 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <PostCard post={item} headingLevel="h3" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
