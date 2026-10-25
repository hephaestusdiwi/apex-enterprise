import * as migration_20261014_051019_initial from './20261014_051019_initial';
import * as migration_20261015_071612_seo_fields from './20261015_071612_seo_fields';
import * as migration_20261015_164121_og_size from './20261015_164121_og_size';
import * as migration_20261016_064414_logo_header from './20261016_064414_logo_header';
import * as migration_20261016_072034_photoswipe_toggle from './20261016_072034_photoswipe_toggle';
import * as migration_20261017_041300_editorial_workflow from './20261017_041300_editorial_workflow';
import * as migration_20261017_194029_spam_protection from './20261017_194029_spam_protection';
import * as migration_20261017_195137 from './20261017_195137';
import * as migration_20261018_153007_service_packages from './20261018_153007_service_packages';
import * as migration_20261018_163007_booking_availability from './20261018_163007_booking_availability';
import * as migration_20261018_163920 from './20261018_163920';
import * as migration_20261018_171422_bookings from './20261018_171422_bookings';
import * as migration_20261019_141403_booking_notifications from './20261019_141403_booking_notifications';
import * as migration_20261020_174822_booking_reminder from './20261020_174822_booking_reminder';
import * as migration_20261020_180010_blog_posts from './20261020_180010_blog_posts';
import * as migration_20261023_103600_font_settings from './20261023_103600_font_settings';
import * as migration_20261024_180418_users_invites from './20261024_180418_users_invites';

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
    name: '20261017_195137',
  },
  {
    up: migration_20261018_153007_service_packages.up,
    down: migration_20261018_153007_service_packages.down,
    name: '20261018_153007_service_packages',
  },
  {
    up: migration_20261018_163007_booking_availability.up,
    down: migration_20261018_163007_booking_availability.down,
    name: '20261018_163007_booking_availability',
  },
  {
    up: migration_20261018_163920.up,
    down: migration_20261018_163920.down,
    name: '20261018_163920',
  },
  {
    up: migration_20261018_171422_bookings.up,
    down: migration_20261018_171422_bookings.down,
    name: '20261018_171422_bookings',
  },
  {
    up: migration_20261019_141403_booking_notifications.up,
    down: migration_20261019_141403_booking_notifications.down,
    name: '20261019_141403_booking_notifications',
  },
  {
    up: migration_20261020_174822_booking_reminder.up,
    down: migration_20261020_174822_booking_reminder.down,
    name: '20261020_174822_booking_reminder',
  },
  {
    up: migration_20261020_180010_blog_posts.up,
    down: migration_20261020_180010_blog_posts.down,
    name: '20261020_180010_blog_posts',
  },
  {
    up: migration_20261023_103600_font_settings.up,
    down: migration_20261023_103600_font_settings.down,
    name: '20261023_103600_font_settings',
  },
  {
    up: migration_20261024_180418_users_invites.up,
    down: migration_20261024_180418_users_invites.down,
    name: '20261024_180418_users_invites'
  },
];
