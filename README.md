# APEX — Portfolio CMS

APEX is a portfolio content management system built with Next.js, Payload CMS, and PostgreSQL. It provides a customizable content management experience for managing portfolio projects, pages, media, and website settings.

## Features

- **Content Management:** Manage portfolio projects and pages.
- **Block-based Content Editor:** Compose flexible layouts using reusable content blocks.
- **Media Library:** Upload and manage media with image sizes, focal points, alt text, and captions.
- **Authentication & Access Control:** Manage admin access with role-based permissions.
- **Website Settings:** Configure global website content and navigation.
- **SEO Metadata:** Manage page metadata and search engine optimization.
- **PostgreSQL:** Store application data using PostgreSQL through the Payload database adapter.

## Tech Stack

- **Framework:** Next.js
- **CMS:** Payload CMS
- **Database:** PostgreSQL
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Deployment:** Docker-compatible

## Requirements

Before getting started, ensure you have the following installed:

- Node.js version compatible with the project
- pnpm
- Docker Engine and Docker Compose
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hephaestusdiwi/APEX.git
cd APEX
```

### 2. Configure environment variables

Create a local environment file from the provided example:

```bash
cp .env.example .env
```

Update `DATABASE_URL` in `.env` to point to your PostgreSQL database:

```env
DATABASE_URL=postgresql://portfolio:devpass@127.0.0.1:5432/portfolio
PAYLOAD_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET

# Email notifications for the contact form.
# Leave SMTP_HOST empty to log email messages to the console.
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM_ADDRESS=
SMTP_FROM_NAME=APEX
```

Generate a secure secret for local development:

```bash
openssl rand -base64 32
```

Replace `REPLACE_WITH_A_LONG_RANDOM_SECRET` with the generated value.

**Important:** The database credentials above are examples intended for the local development configuration. Use unique credentials and a securely generated secret in production.

### 3. Start PostgreSQL

APEX includes a Docker Compose configuration for running PostgreSQL locally.

Start the database:

```bash
docker compose up -d postgres
```

Check the service status:

```bash
docker compose ps
```

View database logs if necessary:

```bash
docker compose logs -f postgres
```

The local application connects to PostgreSQL through `127.0.0.1:5432`.

The current Docker Compose configuration starts PostgreSQL only. The Next.js and Payload CMS application runs separately on your development machine.

### 4. Install dependencies

Install the project dependencies:

```bash
pnpm install
```

### 5. Start the development server

```bash
pnpm dev
```

Open the application in your browser:

- **Website:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin

Follow the application's configured initial-administrator setup process before using the admin panel.

**Administrator setup note:** The `users` collection restricts user creation to administrators. Ensure that APEX's first-administrator bootstrap procedure is implemented and available before attempting a fresh installation. Do not enable unrestricted public registration as a workaround.

Changes made in `src/` will be reflected during development through Next.js hot reloading.

## Development

### Database management

PostgreSQL is managed through Docker Compose.

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Stop the database container:

```bash
docker compose stop postgres
```

Restart the database:

```bash
docker compose restart postgres
```

Inspect database logs:

```bash
docker compose logs -f postgres
```

The PostgreSQL data is stored in a persistent Docker volume. Stopping or recreating the container does not normally remove this volume.

Avoid running `docker compose down -v` unless you intentionally want to remove the associated volumes and understand the data-loss implications.

### Environment configuration

The main environment variables are:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Secret used by Payload CMS |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP server port |
| `SMTP_SECURE` | Whether SMTP uses a secure connection |
| `SMTP_USER` | SMTP authentication username |
| `SMTP_PASS` | SMTP authentication password |
| `SMTP_FROM_ADDRESS` | Sender email address |
| `SMTP_FROM_NAME` | Sender display name |

For local development, leave the SMTP configuration empty if you want contact-form email notifications to be written to the console.

Never commit `.env` or production secrets to version control.

## How It Works

APEX uses Payload CMS to manage content and PostgreSQL to persist application data. Next.js renders the public-facing portfolio while Payload provides the admin interface and content APIs.

### Collections

Collections define the content types managed by the CMS. Each collection can have its own fields, validation rules, access control, and hooks.

#### Users

The Users collection provides authentication for the admin panel.

APEX includes role-based access control to distinguish administrative operations from content editing. Collection and field permissions should be enforced on the server, not only through the admin interface.

See the official documentation:

- [Payload Authentication](https://payloadcms.com/docs/authentication/overview)
- [Payload Access Control](https://payloadcms.com/docs/access-control/overview)

#### Projects

Manage portfolio projects, including their content, slugs, media, and publication status.

#### Pages

Manage website pages with structured content blocks and flexible layouts.

#### Media

Manage uploaded images and other media assets. The collection supports image sizes, focal points, and media metadata.

#### Videos

Manage video content used throughout the portfolio, according to the configured collection schema.

### Blocks

APEX uses structured content blocks to compose project and page layouts.

Blocks are defined in `src/blocks/` and rendered through the corresponding frontend components.

This separation makes it possible to extend the content editor without placing all layout logic in a single component.

### Access Control

Access policies are configured within the Payload CMS collections and fields.

Administrative operations should remain protected by server-side authorization. Public requests should only be able to access content explicitly permitted for public access.

### Global Settings

Global configuration is used for website-wide settings such as navigation and homepage content.

## Production

Before deploying APEX to production:

1. Configure the production PostgreSQL connection string.
2. Generate a secure `PAYLOAD_SECRET`.
3. Configure SMTP credentials if email notifications are required.
4. Build and test the application using the production build command.
5. Configure HTTPS and a reverse proxy.
6. Ensure that PostgreSQL is not exposed directly to the public internet.
7. Configure persistent storage and backups for PostgreSQL and uploaded media.
8. Verify user roles, collection permissions, and the initial-administrator setup.
9. Verify that drafts and preview content cannot be accessed publicly without authorization.

Build the application locally to verify the production build:

```bash
pnpm build
```

Use the production start command configured in `package.json` to run the built application.

For Docker deployments, ensure the Dockerfile and Next.js configuration agree on the build output format.

## Deployment

APEX can be deployed to a VPS or another supported hosting environment.

For a single-server deployment, a typical architecture consists of:

- Next.js and Payload CMS
- PostgreSQL
- A reverse proxy such as Nginx or Caddy
- Persistent media storage
- External database and media backups

Docker Compose can be used to orchestrate the application and database services. Ensure that service networking, environment variables, persistent volumes, and health checks are configured for production.

For production environments, consider building the application in CI and deploying the resulting image instead of compiling it on a resource-constrained VPS.

## Troubleshooting

### PostgreSQL connection errors

Verify that PostgreSQL is running:

```bash
docker compose ps
docker compose logs postgres
```

Check that `DATABASE_URL` matches the database credentials, database name, hostname, and port.

When the application runs directly on the host machine, use the published local PostgreSQL port. When the application runs inside Docker on the same network, use the PostgreSQL service hostname instead of `127.0.0.1`.

### Admin panel authentication issues

Verify the `PAYLOAD_SECRET` configuration and confirm that the initial-administrator setup has been completed.

If access is denied, inspect the relevant collection and field access rules rather than bypassing authorization.

### Database persistence

The PostgreSQL data directory is managed by a Docker volume. Avoid deleting volumes during routine restarts or deployments.

Maintain database backups and periodically test restoring them.

## Resources

- [APEX Repository](https://github.com/hephaestusdiwi/APEX)
- [Next.js Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload PostgreSQL Adapter](https://payloadcms.com/docs/database/postgres)
- [Docker Documentation](https://docs.docker.com/)
