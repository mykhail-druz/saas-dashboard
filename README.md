# Analytics Pro Dashboard

A modern, feature-rich SaaS admin dashboard built with Next.js 16, Supabase, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication** - Supabase Auth with email/password
- 📊 **Dashboard** - KPI cards, charts, and analytics
- 👥 **User Management** - Full CRUD operations for users
- 📈 **Reports** - Create and manage analytics reports
- 📝 **Activity Log** - Track all system activities
- 🔌 **Integrations** - Manage API integrations and keys
- 💳 **Billing** - Subscription and payment management
- 🔔 **Notifications** - Real-time notification center
- ⚙️ **Settings** - User and application settings
- 🎨 **Modern UI** - Built with shadcn/ui components
- 🌙 **Dark Mode** - Full dark mode support
- 🔒 **Security** - Row Level Security (RLS) policies
- ⚡ **Real-time** - Supabase Realtime subscriptions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Auth)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Tables**: TanStack Table
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Real-time**: Supabase Realtime subscriptions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd saas-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:

The database schema and migrations are already created. Make sure your Supabase project is configured:

- Database migrations are in `supabase/migrations/`
- TypeScript types are generated in `types/database.types.ts`

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
saas-dashboard/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── dashboard/       # Main dashboard
│   │   ├── users/           # User management
│   │   ├── reports/         # Reports
│   │   ├── activity/        # Activity log
│   │   ├── integrations/    # Integrations
│   │   ├── billing/         # Billing
│   │   ├── notifications/   # Notifications
│   │   ├── settings/        # Settings
│   │   └── layout.tsx       # Protected layout
│   ├── proxy.ts             # Route protection (Next.js 16)
│   └── layout.tsx           # Root layout
├── components/
│   ├── charts/              # Chart components
│   ├── forms/               # Form components
│   ├── tables/              # Table components
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── supabase/            # Supabase client setup
│   └── utils.ts             # Utility functions
├── types/
│   └── database.types.ts    # Database types
└── supabase/
    └── migrations/          # Database migrations
```

## Database Schema

The application uses the following main tables:

- `profiles` - User profiles (linked to auth.users)
- `users` - Users for admin panel
- `reports` - Analytics reports
- `activity_logs` - System activity logs
- `integrations` - API integrations
- `subscriptions` - User subscriptions
- `notifications` - User notifications
- `analytics_events` - Analytics events for charts

All tables have Row Level Security (RLS) policies enabled.

## Authentication

The application uses Supabase Auth for authentication:

- Email/password authentication
- Protected routes using proxy.ts (Next.js 16)
- Session management with cookies
- User profiles linked to auth.users

## Development

### Adding New Components

Use shadcn/ui CLI to add new components:

```bash
npx shadcn@latest add [component-name]
```

### Database Migrations

Migrations are in `supabase/migrations/`. Use Supabase MCP tools or Supabase CLI to apply migrations.

### Type Generation

TypeScript types are automatically generated from the database schema using Supabase MCP tools.

## Building for Production

```bash
npm run build
npm start
```

## Contributing

This is a portfolio project. Feel free to use it as inspiration for your own projects.

## License

MIT
