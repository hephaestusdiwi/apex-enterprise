import { ProjectContent } from '@/components/project/ProjectContent'
import { withDefaultSlots } from '@/content/slots'
import type { PageData } from '@/content/types'

export function PageView({ page }: { page: PageData }) {
  const blocks = withDefaultSlots({ title: page.title, meta: [], blocks: page.blocks })
  return (
    <article className="pt-28 md:pt-36">
      <ProjectContent blocks={blocks} />
    </article>
  )
}