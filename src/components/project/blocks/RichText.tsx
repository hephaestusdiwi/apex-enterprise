import { Fragment, type ReactNode } from 'react'
import type { RichAlign, RichBlock, RichInline, RichList } from '@/content/types'
import type { TextColor, TextSize } from '@/lib/richStyles'

const COLOR: Record<TextColor, string> = {
  accent: 'text-accent',
  muted: 'text-mute',
}

const SIZE_CLASS: Record<TextSize, string> = {
  small: 'text-[0.85em]',
  large: 'text-[1.35em] leading-tight',
  xlarge: 'text-[1.8em] leading-tight',
}

const ALIGN: Record<RichAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

const BODY_SIZE = {
  base: 'text-base leading-relaxed md:text-lg',
  small: 'text-sm leading-relaxed md:text-[0.95rem]',
} as const

function Inline({ node }: { node: RichInline }) {
  switch (node.type) {
    case 'break':
      return <br />
    case 'link':
      return (
        <a
          href={node.href}
          className="underline underline-offset-4"
          {...(node.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <Inlines nodes={node.children} />
        </a>
      )
    case 'text': {
      let content: ReactNode = node.text
      if (node.bold) content = <strong className="font-semibold">{content}</strong>
      if (node.italic) content = <em>{content}</em>

      const classes = [
        node.underline && node.strike
          ? 'underline-offset-4 [text-decoration-line:underline_line-through]'
          : node.underline
            ? 'underline underline-offset-4'
            : node.strike
              ? 'line-through'
              : '',
        node.color ? COLOR[node.color] : '',
        node.size ? SIZE_CLASS[node.size] : '',
      ]
        .filter(Boolean)
        .join(' ')

      return classes ? <span className={classes}>{content}</span> : <>{content}</>
    }
  }
}

function Inlines({ nodes }: { nodes: RichInline[] }) {
  return (
    <>
      {nodes.map((node, i) => (
        <Fragment key={i}>
          <Inline node={node} />
        </Fragment>
      ))}
    </>
  )
}

function List({ list }: { list: RichList }) {
  const Tag = list.ordered ? 'ol' : 'ul'
  return (
    <Tag className={`space-y-1.5 pl-6 ${list.ordered ? 'list-decimal' : 'list-disc'}`}>
      {list.items.map((item, i) => (
        <li key={i}>
          <Inlines nodes={item.children} />
          {item.nested.map((nested, j) => (
            <div key={j} className="mt-1.5">
              <List list={nested} />
            </div>
          ))}
        </li>
      ))}
    </Tag>
  )
}

const HEADING: Record<2 | 3 | 4, string> = {
  2: 'text-2xl font-medium leading-tight md:text-3xl',
  3: 'text-xl font-medium leading-snug md:text-2xl',
  4: 'text-lg font-medium leading-snug',
}

function Block({ block }: { block: RichBlock }) {
  if (block.type === 'list') return <List list={block} />

  const align = block.align ? ALIGN[block.align] : undefined
  switch (block.type) {
    case 'paragraph':
      return (
        <p className={align}>
          <Inlines nodes={block.children} />
        </p>
      )
    case 'heading': {
      const Tag = `h${block.level}` as 'h2' | 'h3' | 'h4'
      return (
        <Tag className={align ? `${HEADING[block.level]} ${align}` : HEADING[block.level]}>
          <Inlines nodes={block.children} />
        </Tag>
      )
    }
    case 'quote':
      return (
        <blockquote className={align ? `border-l-2 border-accent pl-5 ${align}` : 'border-l-2 border-accent pl-5'}>
          <Inlines nodes={block.children} />
        </blockquote>
      )
  }
}

type Props = {
  blocks: RichBlock[]
  size?: keyof typeof BODY_SIZE
}

export function RichText({ blocks, size = 'base' }: Props) {
  return (
    <div className={`space-y-5 ${BODY_SIZE[size]} [&>:is(h2,h3,h4):not(:first-child)]:mt-8`}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}