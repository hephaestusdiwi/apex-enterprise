import type { BlockData, BlockType } from "@/content/types";
import { BlockShell } from "./BlockShell";
import { blockRegistry, type BlockEntry, type BlockOf } from "./blocks/registry";

function RenderBlock<T extends BlockType>({ block }: { block: BlockOf<T> }) {
    const entry: BlockEntry<T> = blockRegistry[block.type as T]
    const { Component, defaults } = entry
    const layout = {
        width: block.layout.width ?? defaults.width,
        spaceBefore: block.layout.spaceBefore ?? defaults.spaceBefore,
        spaceAfter: block.layout.spaceAfter ?? defaults.spaceAfter,
        motion: block.layout.motion ?? defaults.motion,
    }
    return (
        <BlockShell type={block.type} layout={layout}>
            <Component block={block} />
        </BlockShell>
    )
}

export function ProjectBlock({ block }: { block: BlockData }) {
    return <RenderBlock block={block} />
}