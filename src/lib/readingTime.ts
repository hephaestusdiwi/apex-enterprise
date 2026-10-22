import type { BlockData, RichBlock, RichInline, RichList } from '@/content/types'
import { block } from 'sharp'

const WORDS_PER_MINUTE = 200

export const countWords = (text: string): number => {
    const trimmed = text.trim()
    return trimmed === '' ? 0 : trimmed.split(/\s+/).length
}

const inlineText = (nodes: RichInline[]): string =>
    nodes
        .map((node) => (node.type === 'text' ? node.text : node.type === 'link' ? inlineText(node.children) : ' '))
        .join('')

    const listText = (list: RichList): string =>
        list.items.map((item) => `${inlineText(item.children)} ${item.nested.map(listText).join(' ')}`).join(' ')

    const richText = (blocks: RichBlock[]): string =>
        blocks.map((block) => (block.type === 'list' ? listText(block) : inlineText(block.children))).join(' ')

    const blockText = (block: BlockData): string => {
        switch (block.type) {
            case 'text':
            case 'imageText':
                return richText(block.content)
            case 'heading':
            case 'quote':
                return block.text
            case 'list':
                return block.items.join(' ')
            default:
                return ''
        }
    }

    export const countWordsInBlocks = (blocks: BlockData[]): number =>
        countWords(blocks.map(blockText).join(' '))

    export const readingMinutes = (blocks: BlockData[]): number =>
        Math.max(1, Math.ceil(countWordsInBlocks(blocks) / WORDS_PER_MINUTE))