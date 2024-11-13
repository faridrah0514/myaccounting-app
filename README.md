# My Accounting App

## Prerequisite

- Python

You can use `nodeenv` if you are running multiple Node.js environments. [Learn more about nodeenv](https://pypi.org/project/nodeenv/).

### Install nodeenv with pip

```bash
sudo pip install nodeenv
```

### Create Node Environment

Using Node.js 20.17.0 because Niagahoster's latest Node.js version is 20.17.0.

```bash
nodeenv --node=20.17.0 env
```

### Activate New Environment

```bash
. env/bin/activate
# or
source env/bin/activate
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Modules Used

- **Front-end Component**: [Ant Design](https://ant.design)
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **Database**: MySQL
- **ORM**: [Prisma](https://www.prisma.io)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local Development with Docker

You can use the provided `docker-compose` file for local development. Execute the following command:

```bash
docker-compose -f docker-compose.mysql.yml up -d
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - Your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
