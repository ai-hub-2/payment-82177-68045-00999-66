# Gulf Unified Platform - Standalone App

This is a standalone version of the Gulf Unified Platform that can generate multiple payment links simultaneously without interfering with the main application.

## Features

- **Independent Database**: Uses separate database tables with `standalone_` prefix
- **Multiple Link Generation**: Can create multiple shipping and chalet payment links simultaneously
- **Same Design & Functionality**: Identical UI/UX and features as the main app
- **Isolated Environment**: Completely separate from the main application

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the environment file and update with your Supabase credentials:

```bash
cp .env.example .env
```

Update `.env` with your Supabase URL and API key.

### 3. Set Up Database

Run the database migration to create the standalone tables:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the migration file:
# supabase/migrations/20250101000000_standalone_schema.sql
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Database Schema

The standalone app uses separate tables to avoid conflicts:

- `standalone_chalets` - Chalet listings
- `standalone_shipping_carriers` - Shipping service providers
- `standalone_providers` - Service providers
- `standalone_links` - Generated payment links
- `standalone_payments` - Payment transactions

## Usage

### Creating Shipping Links

1. Navigate to `/create/{country}/shipping`
2. Select a shipping service
3. Enter tracking number and package details
4. Set COD amount if applicable
5. Generate the payment link

### Creating Chalet Links

1. Navigate to `/create/{country}/chalet`
2. Select a chalet
3. Enter guest count and duration
4. Generate the payment link

### Multiple Links

You can create multiple links simultaneously by:
- Opening multiple browser tabs/windows
- Using different browsers
- Running multiple instances of the app

Each link will be completely independent and stored in the standalone database.

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Environment Variables for Production

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_TELEGRAM_BOT_TOKEN` (optional)
- `VITE_TELEGRAM_CHAT_ID` (optional)

## Differences from Main App

- Uses `standalone_` prefixed database tables
- Independent database schema
- Can run simultaneously with main app
- Separate environment configuration
- Isolated link generation

## Support

This standalone app maintains all the functionality of the main Gulf Unified Platform while providing complete isolation for multiple link generation scenarios.