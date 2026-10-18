import { withDefaultSlots } from '@/content/slots'
import type { ProjectData, ProjectNeighbors } from '@/content/types'
import { ProjectContent } from './ProjectContent'
import { ProjectHero } from './ProjectHero'
import { ProjectNavigation } from './ProjectNavigation'

type Props = {
  project: ProjectData
  neighbors: ProjectNeighbors | null
}

export function ProjectPage({ project, neighbors }: Props) {
  const hasTitleSlot = project.blocks.some((block) => block.type === 'titleSlot')
  const titleInHero = Boolean(project.hero) && !hasTitleSlot

  return (
    <article className={project.hero ? undefined : 'pt-28 md:pt-36'}>
      <ProjectHero hero={project.hero} title={titleInHero ? project.title : null} />
      <ProjectContent blocks={withDefaultSlots(project, { titleInHero })} />
      {neighbors ? <ProjectNavigation neighbors={neighbors} /> : null}
    </article>
  )
}