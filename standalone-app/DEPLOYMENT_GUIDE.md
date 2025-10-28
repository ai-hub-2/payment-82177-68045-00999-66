# Standalone App Deployment Guide

## Overview

This standalone version of the Gulf Unified Platform can run independently and generate multiple payment links simultaneously without interfering with the main application.

## Key Features

- **Independent Database**: Uses `standalone_` prefixed tables
- **Multiple Link Generation**: Can create unlimited links simultaneously
- **Same Functionality**: Identical features to the main app
- **Isolated Environment**: Completely separate from main application

## Deployment Options

### Option 1: Same Domain, Different Subdomain

Deploy to a subdomain like `standalone.yourdomain.com`:

1. **Netlify Setup**:
   - Create new site from Git repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add custom domain: `standalone.yourdomain.com`

2. **Environment Variables**:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_TELEGRAM_BOT_TOKEN=your_bot_token (optional)
   VITE_TELEGRAM_CHAT_ID=your_chat_id (optional)
   ```

### Option 2: Different Domain

Deploy to a completely different domain:

1. **Domain Setup**:
   - Purchase new domain or use subdomain
   - Point DNS to your hosting provider

2. **Deployment**:
   - Follow same Netlify/Vercel setup as above
   - Use new domain for all configurations

### Option 3: Same Domain, Different Path

Deploy to a path like `yourdomain.com/standalone`:

1. **Build Configuration**:
   - Update `vite.config.ts` to set `base: '/standalone/'`
   - Update all internal links to use `/standalone/` prefix

2. **Server Configuration**:
   - Configure server to serve app at `/standalone/` path
   - Update routing accordingly

## Database Setup

### 1. Create New Supabase Project (Recommended)

For complete isolation:

1. Create new Supabase project
2. Run the migration: `supabase/migrations/20250101000000_standalone_schema.sql`
3. Update environment variables with new project credentials

### 2. Use Same Database with Different Tables

If using the same Supabase project:

1. Run the standalone migration in your existing project
2. The `standalone_` prefixed tables will be created
3. Use same Supabase credentials as main app

## Testing Multiple Links

### Method 1: Multiple Browser Tabs

1. Open the standalone app in multiple browser tabs
2. Create different shipping/chalet links in each tab
3. Verify each link works independently

### Method 2: Different Browsers

1. Open the app in Chrome, Firefox, Safari, etc.
2. Create links in each browser
3. Test cross-browser compatibility

### Method 3: Incognito/Private Mode

1. Open multiple incognito windows
2. Create links in each window
3. Test that sessions don't interfere

## Monitoring and Analytics

### Link Tracking

Each generated link includes:
- Unique ID in database
- Creation timestamp
- Country and service type
- Payment status tracking

### Database Queries

Monitor link generation:
```sql
-- Count links created today
SELECT COUNT(*) FROM standalone_links 
WHERE DATE(created_at) = CURRENT_DATE;

-- View all active links
SELECT * FROM standalone_links 
WHERE status = 'active' 
ORDER BY created_at DESC;
```

## Security Considerations

### Database Isolation

- Standalone tables are completely separate
- No data sharing between main and standalone apps
- Independent RLS policies

### Environment Variables

- Use different Supabase projects for complete isolation
- Separate API keys and tokens
- Independent monitoring and logging

## Maintenance

### Updates

1. **Code Updates**: Deploy to standalone app independently
2. **Database Updates**: Run migrations on standalone tables only
3. **Feature Updates**: Can add standalone-specific features

### Monitoring

- Monitor standalone app separately
- Set up independent error tracking
- Track link generation metrics

## Troubleshooting

### Common Issues

1. **Database Connection**: Verify Supabase credentials
2. **Table Not Found**: Run the standalone migration
3. **Link Generation Fails**: Check database permissions
4. **Payment Issues**: Verify payment table setup

### Debug Steps

1. Check browser console for errors
2. Verify Supabase connection
3. Test database queries directly
4. Check environment variables

## Support

The standalone app maintains all functionality of the main Gulf Unified Platform while providing complete isolation for multiple link generation scenarios.