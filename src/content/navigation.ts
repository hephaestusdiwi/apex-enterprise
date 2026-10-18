import type { ProjectNeighbors, ProjectSummary } from './types'


export const getNeighbors = (list: ProjectSummary[], slug: string): ProjectNeighbors | null => {
  const index = list.findIndex((item) => item.slug === slug)
  if (index === -1 || list.length < 2) return null

  const previous = list.at((index - 1 + list.length) % list.length)
  const next = list.at((index + 1) % list.length)
  if (!previous || !next) return null

  return {
    previous: { slug: previous.slug, title: previous.title },
    next: { slug: next.slug, title: next.title },
  }
}