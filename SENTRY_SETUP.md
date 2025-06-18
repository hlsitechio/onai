
# Sentry Setup Instructions

Your Sentry integration is now configured with your DSN. Here's how it works:

## Current Configuration
- **DSN**: Already configured in the code
- **PII Collection**: Enabled as requested
- **Environment**: Production only by default

## Development Testing (Optional)
If you want to test Sentry in development, you can:

1. Add this to your environment variables in your hosting platform:
   ```
   VITE_ENABLE_SENTRY=true
   ```

2. Or modify the condition in `sentryConfig.ts` to always initialize

## Source Maps Setup
You mentioned running the source maps command:
```bash
npx @sentry/wizard@latest -i sourcemaps --saas
```

This will help Sentry show readable stack traces in production.

## Features Enabled
- ✅ Error tracking
- ✅ Performance monitoring (10% sampling in production)
- ✅ Session replay (10% normal, 100% on errors)
- ✅ PII collection enabled
- ✅ Filtered common non-critical errors
- ✅ Integration with existing error reporting system

## Testing
Your Sentry integration will automatically start collecting errors in production. You can test it by:
1. Deploying your app
2. Triggering an error
3. Checking your Sentry dashboard

The integration works alongside your existing error reporting system in `src/utils/errorReporter.ts`.
