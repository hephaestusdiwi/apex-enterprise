import * as migration_20261014_051019_initial from './20261014_051019_initial';
import * as migration_20261015_071612_seo_fields from './20261015_071612_seo_fields';
import * as migration_20261015_164121_og_size from './20261015_164121_og_size';
import * as migration_20261016_064414_logo_header from './20261016_064414_logo_header';
import * as migration_20261016_072034_photoswipe_toggle from './20261016_072034_photoswipe_toggle';
import * as migration_20261017_041300_editorial_workflow from './20261017_041300_editorial_workflow';
import * as migration_20261017_194029_spam_protection from './20261017_194029_spam_protection';
import * as migration_20261017_195137 from './20261017_195137';

export const migrations = [
  {
    up: migration_20261014_051019_initial.up,
    down: migration_20261014_051019_initial.down,
    name: '20261014_051019_initial',
  },
  {
    up: migration_20261015_071612_seo_fields.up,
    down: migration_20261015_071612_seo_fields.down,
    name: '20261015_071612_seo_fields',
  },
  {
    up: migration_20261015_164121_og_size.up,
    down: migration_20261015_164121_og_size.down,
    name: '20261015_164121_og_size',
  },
  {
    up: migration_20261016_064414_logo_header.up,
    down: migration_20261016_064414_logo_header.down,
    name: '20261016_064414_logo_header',
  },
  {
    up: migration_20261016_072034_photoswipe_toggle.up,
    down: migration_20261016_072034_photoswipe_toggle.down,
    name: '20261016_072034_photoswipe_toggle',
  },
  {
    up: migration_20261017_041300_editorial_workflow.up,
    down: migration_20261017_041300_editorial_workflow.down,
    name: '20261017_041300_editorial_workflow',
  },
  {
    up: migration_20261017_194029_spam_protection.up,
    down: migration_20261017_194029_spam_protection.down,
    name: '20261017_194029_spam_protection',
  },
  {
    up: migration_20261017_195137.up,
    down: migration_20261017_195137.down,
    name: '20261017_195137'
  },
];
