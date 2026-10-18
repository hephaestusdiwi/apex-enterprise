import type { GlobalConfig } from 'payload'
import { adminOnly, staffOnly } from '../access'

export const WorkflowSettings: GlobalConfig = {
    slug: 'workflow-settings',
    label: 'Pengaturan Workflow',
    access: {
        read: staffOnly,
        update: adminOnly,
    },
    fields: [
        {
            name: 'requireApproval',
            type: 'checkbox',
            label: 'Wajib disetujui reviewer sebelum di publish',
            defaultValue: false,
            admin: {
                description:
                'Aktif: editor hanya bisa mempublikasikan (termasuk lewat jadwal) konten yang sudah disetujui dan tidak berubah sesudahnya. Admin selalu boleh.',
            },
        },
        {
        name: 'notifyByEmail',
        type: 'checkbox',
        label: 'Kirim notifikasi email',
        defaultValue: true,
        admin: {
            description: 'Email ke reviewer saat review diminta, dan ke peminta saat ada keputusan atau catatan baru.',
        },
        },
    ],
}