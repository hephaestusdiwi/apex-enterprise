import Link from 'next/link'
import type { ReactNode } from 'react'
import { Gutter } from '@payloadcms/ui'
import type { SanitizedPermissions, ServerProps, TypedUser } from 'payload'
import { isStaff } from '@/access'
import {
  displayName,
  fullDate,
  getDashboardData,
  greetingFor,
  splitHero,
  timeAgo,
  type DashboardImage,
  type DashboardPage,
  type DashboardProject,
  type DashboardStatus,
} from '@/lib/dashboard'
import { publicPath } from '@/preview/urls'
import { PreviewCell } from './PreviewCell'
import { TrafficStats } from './TrafficStats'

type Props = ServerProps & {
  initPageResult?: { req?: { user?: TypedUser | null } }
}

type Action = 'read' | 'create'

const can = (permissions: SanitizedPermissions | undefined, slug: string, action: Action): boolean =>
  Boolean(permissions?.collections?.[slug]?.[action])

const canGlobal = (permissions: SanitizedPermissions | undefined, slug: string): boolean =>
  Boolean(permissions?.globals?.[slug]?.read)

const STATUS_LABEL: Record<DashboardStatus, string> = { published: 'Terbit', draft: 'Draft' }

// --- Ikon kecil (dekoratif, disembunyikan dari screen reader) ---

const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

const PlusIcon = () => (
  <Icon>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
const ArrowIcon = () => (
  <Icon>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)
const ImageIcon = () => (
  <Icon>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="m21 16-5-5-8 8" />
  </Icon>
)
const PlayIcon = () => (
  <Icon>
    <path d="m8 5 11 7-11 7V5Z" />
  </Icon>
)

// --- Bagian-bagian kecil ---

function Chip({ status }: { status: DashboardStatus }) {
  return (
    <span className={`apex-chip apex-chip--${status}`}>
      <span className="apex-chip__dot" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  )
}

function VideoBadge() {
  return (
    <span className="apex-chip" title="Proyek ini punya cover video">
      <PlayIcon />
      Video
    </span>
  )
}

function Cover({ image, eager = false, sizes }: { image: DashboardImage; eager?: boolean; sizes: string }) {
  return (
    // <img> biasa dipakai di admin: ukuran sudah dibuat Payload (imageSizes) dan tidak perlu optimizer Next.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="apex-cover"
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      alt=""
      width={image.width}
      height={image.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={{ objectPosition: image.position }}
    />
  )
}

function Unavailable({ what }: { what: string }) {
  return (
    <p className="apex-empty" role="status">
      {what} belum bisa dimuat. Coba muat ulang halaman; detail kesalahan ada di log server.
    </p>
  )
}

function Hero({ project, admin, now }: { project: DashboardProject; admin: string; now: Date }) {
  const editHref = `${admin}/collections/projects/${project.id}`
  const live = project.status === 'published' ? publicPath('projects', project.slug) : null

  return (
    <article className={`apex-hero${project.image ? '' : ' apex-hero--empty'}`} aria-labelledby="apex-hero-title">
      {project.image ? (
        <Cover image={project.image} eager sizes="(min-width: 1100px) 760px, 100vw" />
      ) : (
        <span className="apex-hero__placeholder">
          <ImageIcon />
          Belum ada gambar
        </span>
      )}

      <div className="apex-hero__body">
        <p className="apex-eyebrow">Terakhir diperbarui</p>
        <h2 id="apex-hero-title" className="apex-hero__title">
          {project.title}
        </h2>
        <div className="apex-hero__meta">
          <Chip status={project.status} />
          {project.hasVideo ? <VideoBadge /> : null}
          <time dateTime={project.updatedAt} title={fullDate(project.updatedAt)}>
            Diperbarui {timeAgo(project.updatedAt, now)}
          </time>
        </div>
        <div className="apex-hero__actions">
          <Link href={editHref} className="apex-btn apex-btn--primary">
            Edit proyek
          </Link>
          <PreviewCell rowData={{ id: project.id }} collectionSlug="projects" />
          {live ? (
            <a href={live} className="apex-btn" target="_blank" rel="noopener noreferrer">
              Lihat di situs
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function ProjectCard({ project, admin, now }: { project: DashboardProject; admin: string; now: Date }) {
  return (
    <li>
      <Link
        href={`${admin}/collections/projects/${project.id}`}
        className="apex-card"
        aria-label={`Buka proyek ${project.title} (${STATUS_LABEL[project.status]})`}
      >
        {project.image ? (
          <Cover image={project.image} sizes="(min-width: 1100px) 220px, 45vw" />
        ) : (
          <span className="apex-card__placeholder">
            <ImageIcon />
          </span>
        )}
        <span className="apex-card__shade" aria-hidden="true" />
        <span className="apex-card__badges">
          <Chip status={project.status} />
          {project.hasVideo ? <VideoBadge /> : null}
        </span>
        <span className="apex-card__body">
          <span className="apex-card__title">{project.title}</span>
          <time className="apex-card__time" dateTime={project.updatedAt} title={fullDate(project.updatedAt)}>
            {timeAgo(project.updatedAt, now)}
          </time>
        </span>
      </Link>
    </li>
  )
}

function PageRow({ page, admin, now }: { page: DashboardPage; admin: string; now: Date }) {
  return (
    <li>
      <Link href={`${admin}/collections/pages/${page.id}`} className="apex-row">
        <span className="apex-row__title">{page.title}</span>
        <span className="apex-row__meta">
          <Chip status={page.status} />
          <time dateTime={page.updatedAt} title={fullDate(page.updatedAt)}>
            {timeAgo(page.updatedAt, now)}
          </time>
        </span>
      </Link>
    </li>
  )
}

/** Dashboard admin APEX. Dipasang lewat admin.components.views.dashboard.Component. */
export async function Dashboard(props: Props) {
  const { payload, permissions, initPageResult } = props
  // Untuk pengecekan akses pakai user penuh dari request, bukan user yang sudah disaring akses field.
  const user = initPageResult?.req?.user ?? props.user

  if (!user || !isStaff(user as { role?: string | null })) {
    return (
      <Gutter>
        <p>Akun ini tidak memiliki akses ke dashboard.</p>
      </Gutter>
    )
  }

  const admin = payload.config.routes.admin
  const now = new Date()
  const data = await getDashboardData(payload, user as unknown as Parameters<typeof getDashboardData>[1])

  const { hero, rest } = splitHero(data.projects?.recent ?? [])
  const canCreateProject = can(permissions, 'projects', 'create')
  const canCreatePage = can(permissions, 'pages', 'create')

  const summary = [
    data.projects
      ? `${data.projects.total - data.projects.drafts} proyek terbit, ${data.projects.drafts} draft`
      : null,
    data.messages ? `${data.messages.unread} pesan baru` : null,
  ].filter(Boolean)

  const shortcuts = [
    can(permissions, 'media', 'read') ? { href: `${admin}/collections/media`, label: 'Media' } : null,
    can(permissions, 'videos', 'read') ? { href: `${admin}/collections/videos`, label: 'Video' } : null,
    canGlobal(permissions, 'site-settings') ? { href: `${admin}/globals/site-settings`, label: 'Pengaturan situs' } : null,
    canGlobal(permissions, 'contact-settings')
      ? { href: `${admin}/globals/contact-settings`, label: 'Pengaturan kontak' }
      : null,
  ].filter((item): item is { href: string; label: string } => item !== null)

  return (
    <Gutter>
      <div className="apex-dash">
        <header className="apex-dash__header">
          <div>
            <h1 className="apex-dash__title">
              {greetingFor(now)}, {displayName(user)}
            </h1>
            {summary.length > 0 ? <p className="apex-dash__sub">{summary.join(' · ')}</p> : null}
          </div>
          <div className="apex-dash__actions">
            {canCreateProject ? (
              <Link href={`${admin}/collections/projects/create`} className="apex-btn apex-btn--primary">
                <PlusIcon />
                Tambah Proyek
              </Link>
            ) : null}
            {canCreatePage ? (
              <Link href={`${admin}/collections/pages/create`} className="apex-btn">
                <PlusIcon />
                Buat Halaman
              </Link>
            ) : null}
          </div>
        </header>

        <div className="apex-dash__layout">
          <div className="apex-dash__main">
            {data.projects === null ? (
              <Unavailable what="Daftar proyek" />
            ) : hero ? (
              <Hero project={hero} admin={admin} now={now} />
            ) : (
              <section className="apex-hero apex-hero--empty apex-hero--blank">
                <div className="apex-hero__body">
                  <h2 className="apex-hero__title">Belum ada proyek</h2>
                  <p className="apex-dash__sub">Tambahkan karya pertama untuk mengisi dashboard ini.</p>
                  {canCreateProject ? (
                    <div className="apex-hero__actions">
                      <Link href={`${admin}/collections/projects/create`} className="apex-btn apex-btn--primary">
                        <PlusIcon />
                        Tambah Proyek
                      </Link>
                    </div>
                  ) : null}
                </div>
              </section>
            )}

            {data.projects && rest.length > 0 ? (
              <section aria-labelledby="apex-projects-title">
                <div className="apex-section__head">
                  <h2 id="apex-projects-title">Proyek lainnya</h2>
                  {can(permissions, 'projects', 'read') ? (
                    <Link href={`${admin}/collections/projects`} className="apex-link">
                      Lihat semua ({data.projects.total})
                      <ArrowIcon />
                    </Link>
                  ) : null}
                </div>
                <ul className="apex-grid">
                  {rest.map((project) => (
                    <ProjectCard key={project.id} project={project} admin={admin} now={now} />
                  ))}
                </ul>
              </section>
            ) : data.projects && hero && can(permissions, 'projects', 'read') ? (
              <Link href={`${admin}/collections/projects`} className="apex-link">
                Lihat semua proyek
                <ArrowIcon />
              </Link>
            ) : null}
          </div>

          <aside className="apex-dash__aside" aria-label="Ringkasan">
            <section className="apex-panel" aria-labelledby="apex-messages-title">
              <div className="apex-section__head">
                <h2 id="apex-messages-title">
                  Pesan baru
                  {data.messages && data.messages.unread > 0 ? (
                    <span className="apex-count" aria-label={`${data.messages.unread} pesan baru`}>
                      {data.messages.unread > 99 ? '99+' : data.messages.unread}
                    </span>
                  ) : null}
                </h2>
                {can(permissions, 'contacts', 'read') ? (
                  <Link href={`${admin}/collections/contacts`} className="apex-link">
                    Lihat semua
                    <ArrowIcon />
                  </Link>
                ) : null}
              </div>
              {data.messages === null ? (
                <Unavailable what="Pesan kontak" />
              ) : data.messages.recent.length === 0 ? (
                <p className="apex-empty">Tidak ada pesan baru.</p>
              ) : (
                <ul className="apex-list">
                  {data.messages.recent.map((message) => (
                    <li key={message.id}>
                      <Link href={`${admin}/collections/contacts/${message.id}`} className="apex-row">
                        <span className="apex-row__title">{message.subject ?? `Pesan dari ${message.name}`}</span>
                        <span className="apex-row__text">{message.excerpt}</span>
                        <span className="apex-row__meta">
                          <span>{message.name}</span>
                          <time dateTime={message.createdAt} title={fullDate(message.createdAt)}>
                            {timeAgo(message.createdAt, now)}
                          </time>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="apex-panel" aria-labelledby="apex-pages-title">
              <div className="apex-section__head">
                <h2 id="apex-pages-title">Halaman</h2>
                {can(permissions, 'pages', 'read') ? (
                  <Link href={`${admin}/collections/pages`} className="apex-link">
                    Lihat semua{data.pages ? ` (${data.pages.total})` : ''}
                    <ArrowIcon />
                  </Link>
                ) : null}
              </div>
              {data.pages === null ? (
                <Unavailable what="Daftar halaman" />
              ) : data.pages.recent.length === 0 ? (
                <p className="apex-empty">Belum ada halaman.</p>
              ) : (
                <ul className="apex-list">
                  {data.pages.recent.map((page) => (
                    <PageRow key={page.id} page={page} admin={admin} now={now} />
                  ))}
                </ul>
              )}
            </section>

            {shortcuts.length > 0 ? (
              <nav className="apex-panel" aria-label="Pintasan">
                <div className="apex-section__head">
                  <h2>Pintasan</h2>
                </div>
                <ul className="apex-shortcuts">
                  {shortcuts.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="apex-shortcut">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </aside>
        </div>

        <div className="apex-dash__traffic">
          <TrafficStats i18n={props.i18n} payload={payload} user={props.user} />
        </div>
      </div>
    </Gutter>
  )
}
