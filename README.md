# 30 Days, 30 Projects Challenge

This repository documents my journey of completing 30 projects in 30 days. It's a personal challenge to learn, grow, and build a strong portfolio.

## Tech Stack

This project is built with the following technologies:

- **Next.js:** A React framework for building server-side rendered and static websites.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Supabase:** An open-source Firebase alternative for building secure and scalable backends.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file:

`NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
`NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anonymous key.

You can find these in your Supabase project settings.

## Database Setup

1. **Create a new Supabase project:** Go to [Supabase](https.supabase.com) and create a new project.
2. **Run the setup script:** In the Supabase SQL editor, run the script in `supabase-setup.sql` to create the `projects` table and set up row-level security policies.

## Getting Started

To get a local copy up and running, follow these simple steps.

1. **Clone the repo**
   ```sh
   git clone https://github.com/Anjila-26/AnjiCodes-Blogging-Website.git
   ```
2. **Install NPM packages**
   ```sh
   npm install
   ```
3. **Run the development server**
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- **`/app`:** Contains the main application logic and pages.
- **`/components`:** Contains reusable React components.
- **`/lib`:** Contains shared libraries and helper functions, including the Supabase client.
- **`/public`:** Contains static assets like images and fonts.

## Deployment

This project is deployed on Vercel. Any pushes to the `main` branch will automatically trigger a new deployment.
