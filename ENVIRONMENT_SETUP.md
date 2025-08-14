# Environment Setup for Marmum Admin

## Required Environment Variables

Update your `.env` file in the marmum-admin directory with the following variables:

### Supabase Configuration (Required)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Important Notes:

1. **Remove ALL Clerk-related environment variables** - we now use Supabase authentication
2. **Remove the old DATABASE_URL** - this was for the previous Prisma setup
3. **Use the same Supabase credentials** as your marmum-2025 project to access the same database
4. The admin panel will read from the `campaign_entries` table in Supabase
5. Admin users should be created directly in your Supabase Auth dashboard
6. Make sure your Supabase project has the correct table structure (see marmum-2025/supabase-schema.sql)

### To update your .env file:

1. Open `/Users/anotheritdude/Documents/GitHub/nextjs/marmum/marmum-admin/.env`
2. Remove all Clerk-related variables (`NEXT_PUBLIC_CLERK_*`, `CLERK_*`)
3. Remove the `DATABASE_URL` line
4. Add the three Supabase environment variables listed above
5. Use the same values from your marmum-2025 project's .env file

### Creating Admin Users:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" to create a new admin user
4. Use this email/password to sign in to the admin panel
