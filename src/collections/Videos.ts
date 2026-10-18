import type { CollectionConfig } from "payload";
import path from 'node:path'
import { adminOnly, staffOnly } from '../access'

export const Videos: CollectionConfig = {
    slug: 'videos',
    access: {
        read: () => true,
        create: staffOnly,
        update: staffOnly,
        delete: adminOnly,
    },
    admin: {
        useAsTitle: 'filename',
    },
    fields: [],
    upload: {
        staticDir: path.resolve(process.cwd(), 'media/videos'),
        mimeTypes: ['video/mp4', 'video/webm'],
    },
}