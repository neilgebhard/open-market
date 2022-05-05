# OpenMarket

A place where you can buy and sell items in an open market. List your items for sale or browse items to buy!

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/)
- **ORM**: [Prisma](https://prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Deployment**: [Vercel](https://vercel.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Headless UI](https://headlessui.dev/)
- **Notifications**: [react-hot-toast](https://react-hot-toast.com/)
- **Emailing**: [nodemailer](https://nodemailer.com/about/)

## Overview

- `components/*` - Modular, re-usable UI components
- `emails/*` - HTML templates for logging in and registration
- `lib/prisma` - Singleton Prisma client
- `pages/*` - Pre-rendered pages using Next.js routing
- `pages/api/*` - [API routes](https://nextjs.org/docs/api-routes/introduction) for DB interactions
- `prisma/*` - Prisma schema and migration history
- `public/*` - Static assets including favicons

## Running Locally

Clone GitHub repository, install the dependencies, and run the development server:

```bash
$ git clone https://github.com/neilgebhard/open-market
$ cd open-market
$ npm i
$ npm run dev
```

Create a `.env` file similar to [`.env.example`](https://github.com/neilgebhard/open-market/blob/main/.env.example).

The app will be run on [http://localhost:3000](http://localhost:3000).

## Working with prisma

- `npx prisma init` - Setup new prisma project
- `prisma migrate` - Create migrations from your prisma schema
- `npx prisma generate` - Generate the prisma client (After making changes to your prisma schema)
- `npx prisma db push` - Sync schema with database (For prototyping)
- `npx prisma migrate dev` - Sync schema with database (Create a migration to keep track of changes & data)
- `npx prisma migrate dev --create-only` - Create a migration file without applying it
- `npx prisma studio` - Access the Prisma Studio database client
