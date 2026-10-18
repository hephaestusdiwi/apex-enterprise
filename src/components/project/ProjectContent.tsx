import type { BlockData } from "@/content/types";
import { ProjectBlock } from "./ProjectBlock";

export function ProjectContent({ blocks }: { blocks: BlockData[] }) {
    return (
        <div>
            {blocks.map((block) => (
                <ProjectBlock key={block.id} block={block} />
            ))}
        </div>
    )
}