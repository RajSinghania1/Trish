# Trish Dating App - Deployment Guide

This guide covers deploying the Trish dating app to various platforms including web, iOS, and Android.

## Prerequisites

1. **Expo CLI**: Install globally
   ```bash
   npm install -g @expo/cli
   ```

2. **EAS CLI**: For mobile app builds
   ```bash
   npm install -g eas-cli
   ```

3. **Accounts Required**:
   - Expo account (free)
   - Apple Developer account ($99/year for iOS)
   - Google Play Console account ($25 one-time for Android)

## Environment Setup

1. **Create `.env` file** with your Supabase credentials:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Configure Supabase**:
   - Set up your Supabase project
   - Run the migrations in the `supabase/migrations` folder
   - Configure RLS policies
   - Set up authentication

## Web Deployment

### Option 1: Netlify (Recommended)

1. **Build for web**:
   ```bash
   npm run build:web
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build:web`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Custom Domain** (Optional):
   - Configure custom domain in Netlify settings
   - Update Supabase site URL settings

### Option 2: Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   npm run build:web
   vercel --prod
   ```

### Option 3: Manual Hosting

1. **Build**:
   ```bash
   npm run build:web
   ```

2. **Upload** the `dist` folder to any static hosting service

## Mobile App Deployment

### Setup EAS (Expo Application Services)

1. **Login to Expo**:
   ```bash
   eas login
   ```

2. **Configure project**:
   ```bash
   eas build:configure
   ```

### iOS Deployment

1. **Prerequisites**:
   - Apple Developer account
   - iOS distribution certificate
   - App Store Connect app record

2. **Build for iOS**:
   ```bash
   npm run build:ios
   ```

3. **Submit to App Store**:
   ```bash
   npm run submit:ios
   ```

4. **App Store Review**:
   - Ensure app complies with App Store guidelines
   - Provide app description, screenshots, and metadata
   - Submit for review (typically 1-7 days)

### Android Deployment

1. **Prerequisites**:
   - Google Play Console account
   - Android keystore (EAS can generate one)

2. **Build for Android**:
   ```bash
   npm run build:android
   ```

3. **Submit to Google Play**:
   ```bash
   npm run submit:android
   ```

4. **Play Store Review**:
   - Upload to Google Play Console
   - Complete store listing
   - Submit for review (typically 1-3 days)

## Development Builds

For testing with native features:

1. **Create development build**:
   ```bash
   eas build --profile development
   ```

2. **Install Expo Dev Client** on your device

3. **Start development server**:
   ```bash
   npm run dev
   ```

## Preview Builds

For internal testing:

1. **Create preview build**:
   ```bash
   npm run preview
   ```

2. **Share with testers** using the generated QR code or link

## Environment Variables

### Production Environment Variables

Set these in your deployment platform:

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# App Configuration
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_API_URL=https://your-api.com
```

### Platform-Specific Configuration

Update `app.json` with your specific details:

```json
{
  "expo": {
    "name": "Trish",
    "slug": "trish-dating-app",
    "ios": {
      "bundleIdentifier": "com.yourcompany.trish"
    },
    "android": {
      "package": "com.yourcompany.trish"
    }
  }
}
```

## Security Considerations

1. **Environment Variables**:
   - Never commit `.env` files
   - Use platform-specific environment variable settings
   - Rotate API keys regularly

2. **App Store Security**:
   - Enable App Transport Security (iOS)
   - Use HTTPS for all API calls
   - Implement certificate pinning for production

3. **Database Security**:
   - Configure Supabase RLS policies
   - Use row-level security
   - Implement proper authentication

## Monitoring and Analytics

1. **Expo Analytics**:
   - Built-in crash reporting
   - Performance monitoring
   - User analytics

2. **Supabase Analytics**:
   - Database performance
   - API usage
   - User activity

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check EAS build logs
   - Verify all dependencies are compatible
   - Ensure environment variables are set

2. **Web Deployment Issues**:
   - Check build output for errors
   - Verify routing configuration
   - Test locally with `npx serve dist`

3. **Mobile App Rejections**:
   - Review platform guidelines
   - Test on physical devices
   - Ensure proper permissions are requested

### Support Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Supabase Documentation](https://supabase.com/docs)

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build:web
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

This setup provides a complete deployment pipeline for your Trish dating app across all platforms.