import {
    AlignFeature,
    BlockquoteFeature,
    BoldFeature,
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    ItalicFeature,
    LinkFeature,
    OrderedListFeature,
    ParagraphFeature,
    StrikethroughFeature,
    TextStateFeature,
    UnderlineFeature,
    UnorderedListFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { TEXT_COLORS, TEXT_SIZES } from '@/lib/richStyles'

export const richTextEditor = () =>
    lexicalEditor({
        features: [
            ParagraphFeature(),
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            BoldFeature(),
            ItalicFeature(),
            UnderlineFeature(),
            StrikethroughFeature(),
            TextStateFeature({
                state: {
                    color: {
                        accent: { label: TEXT_COLORS.accent.label, css: { color: TEXT_COLORS.accent.preview } },
                        muted: { label: TEXT_COLORS.accent.label, css : { color: TEXT_COLORS.muted.preview } },
                    },
                    size: {
                        small: { label: TEXT_SIZES.small.label, css: { 'font-size': TEXT_SIZES.small.preview } },
                        large: { label: TEXT_SIZES.small.label, css: { 'font-size': TEXT_SIZES.small.preview } },
                        xlarge: { label: TEXT_SIZES.small.label, css: { 'font-size': TEXT_SIZES.small.preview } },
                    },
                },
            }),
            AlignFeature(),
            UnorderedListFeature(),
            OrderedListFeature(),
            BlockquoteFeature(),
            LinkFeature(),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
        ],
    })