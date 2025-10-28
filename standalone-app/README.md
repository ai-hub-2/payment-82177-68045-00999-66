# Gulf Unified Platform - Enhanced for Multiple Links

This is the same Gulf Unified Platform application with enhanced capabilities to generate multiple payment links simultaneously without any interference.

## Features

- **Same Database**: Uses the same database tables as the main application
- **Multiple Link Generation**: Can create multiple shipping and chalet payment links simultaneously
- **Same Design & Functionality**: Identical UI/UX and features as the main app
- **Enhanced Concurrency**: Improved handling of simultaneous link creation

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

The application uses the same database as the main application. No additional setup required.

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Enhanced Features

The application includes improved concurrency handling:

- **Better UUID Generation**: Uses timestamp-based UUIDs to prevent collisions
- **Retry Logic**: Automatically retries link creation if conflicts occur
- **Concurrent Safety**: Multiple users can create links simultaneously
- **Same Database**: Uses existing database tables with enhanced conflict resolution

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
- Multiple users accessing the app at the same time

Each link will be completely independent and stored in the same database with enhanced conflict resolution.

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

- Enhanced UUID generation with timestamp
- Improved retry logic for concurrent operations
- Better error handling for simultaneous link creation
- Same database and functionality
- Optimized for multiple simultaneous users

## Support

This standalone app maintains all the functionality of the main Gulf Unified Platform while providing complete isolation for multiple link generation scenarios.