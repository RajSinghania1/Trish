# Trish Dating App - AI Development Blueprint

## 🎯 Project Overview

**Trish** is a modern, feature-rich dating application built with React Native and Expo. This blueprint provides comprehensive guidance for AI agents to understand, modify, and extend the application.

### Core Features
- **User Authentication** (Supabase Auth)
- **Profile Management** with photo uploads and interests
- **Swipe-based Matching** system
- **Real-time Messaging** with gift sending
- **Digital Wallet** system with points
- **Gift Catalog** for premium interactions
- **Connection Management** (matches, likes, gifts)

### Tech Stack
- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router 4.0.17
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: StyleSheet (no external CSS frameworks)
- **Icons**: Lucide React Native
- **Fonts**: Inter (via @expo-google-fonts)
- **Deployment**: Web (Netlify/Vercel), Mobile (EAS Build)

---

## 📁 Project Structure

```
trish-dating-app/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx            # Home/Discovery screen
│   │   ├── connections.tsx      # Matches and likes
│   │   ├── message/             # Messaging system
│   │   ├── wallet.tsx           # Digital wallet
│   │   └── profile.tsx          # User profile
│   ├── auth/                    # Authentication flows
│   ├── onboarding/              # User onboarding
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Entry point
├── components/                   # Reusable components
│   ├── AuthGuard.tsx            # Authentication wrapper
│   ├── GiftCatalog.tsx          # Gift selection modal
│   ├── AddFundsModal.tsx        # Wallet funding
│   ├── PointPackagesModal.tsx   # Point packages
│   ├── FilterModal.tsx          # Discovery filters
│   └── LocationPicker.tsx       # Location selection
├── contexts/                     # React contexts
│   └── AuthContext.tsx          # Authentication state
├── hooks/                        # Custom hooks
│   ├── useFrameworkReady.ts     # Framework initialization
│   └── useChat.ts               # Chat functionality
├── lib/                         # Utilities and services
│   ├── supabase.ts              # Supabase client
│   └── chatService.ts           # Real-time messaging
├── types/                       # TypeScript definitions
│   └── database.ts              # Database types
└── supabase/migrations/         # Database migrations
```

---

## 🗄️ Database Schema

### Core Tables

#### `profiles`
- User profile information
- Links to Supabase auth users
- Stores: name, age, bio, images, interests, preferences

#### `user_interactions`
- Tracks likes, passes, superlikes
- Unique constraint on sender/recipient pairs
- Triggers match creation on mutual likes

#### `matches`
- Created when users mutually like each other
- Can be created via likes or gifts
- Links to conversations

#### `conversations`
- Chat conversations between matched users
- Tracks last message and timestamp
- Auto-created when matches occur

#### `messages`
- Individual chat messages
- Supports text and gift message types
- Real-time updates via Supabase subscriptions

#### `wallets`
- User digital wallet with point balance
- One wallet per user (unique constraint)
- Tracks spending and earnings

#### `wallet_transactions`
- Transaction history for wallets
- Credit/debit operations
- Detailed descriptions for transparency

#### `gifts` & `sent_gifts`
- Gift catalog and sent gift tracking
- Gifts can create matches when sent
- Status tracking (pending/accepted/rejected)

### Key Database Features
- **Row Level Security (RLS)** on all tables
- **Real-time subscriptions** for messages
- **Triggers** for automatic match/conversation creation
- **Foreign key constraints** for data integrity

---

## 🔐 Authentication Flow

### User Journey
1. **Splash Screen** → **Onboarding** → **Auth Welcome**
2. **Sign Up/Login** → **Profile Setup** → **Main App**
3. **AuthGuard** protects all authenticated routes

### Implementation Details
- Uses Supabase Auth with email/password
- No magic links or social auth (by design)
- Email confirmation disabled for simplicity
- Profile creation happens post-authentication
- Wallet automatically created with 100 points

---

## 🎨 Design System

### Color Palette
- **Primary**: `#E94E87` (Pink)
- **Secondary**: `#8B5CF6` (Purple)
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Neutral**: `#6B7280` (Gray)

### Typography
- **Font Family**: Inter (Regular, Medium, SemiBold, Bold)
- **Sizes**: 12px-48px scale
- **Line Heights**: 120% (headings), 150% (body)

### Spacing System
- **Base Unit**: 8px
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

### Component Patterns
- **Cards**: Rounded corners (12px-20px), subtle shadows
- **Buttons**: Gradient backgrounds, proper states
- **Modals**: Page sheet presentation style
- **Lists**: Clean separators, consistent padding

---

## 🔧 Development Guidelines

### File Organization Rules
- **One component per file** (max 300 lines)
- **Modular architecture** with clear separation
- **Proper imports/exports** (no global variables)
- **Descriptive file names** in kebab-case

### Code Standards
- **TypeScript** for all files
- **StyleSheet.create** for styling (no external CSS)
- **Functional components** with hooks
- **Error boundaries** for graceful failures

### State Management
- **React Context** for global state (auth)
- **Local state** for component-specific data
- **Supabase** for server state and real-time updates

### Platform Considerations
- **Web-first** development approach
- **Platform.select()** for platform-specific code
- **Responsive design** with proper breakpoints
- **Native API fallbacks** for web compatibility

---

## 🚀 Deployment Configuration

### Web Deployment
```json
// netlify.toml
[build]
  publish = "dist"
  command = "npm run build:web"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Mobile Deployment
```json
// eas.json
{
  "build": {
    "production": {
      "ios": { "autoIncrement": true },
      "android": { "autoIncrement": true }
    }
  }
}
```

### Environment Variables
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🛠️ Common Development Tasks

### Adding New Screens
1. Create file in appropriate `app/` directory
2. Export default React component
3. Add to navigation if needed
4. Implement proper TypeScript types

### Database Changes
1. Create new migration file in `supabase/migrations/`
2. Include descriptive comment block
3. Use `IF NOT EXISTS` for safety
4. Enable RLS and create policies
5. Update TypeScript types in `types/database.ts`

### Adding Components
1. Create in `components/` directory
2. Follow naming convention (PascalCase)
3. Include proper TypeScript interfaces
4. Export as default
5. Keep under 300 lines

### Real-time Features
1. Use `chatService` for messaging
2. Subscribe to changes in `useEffect`
3. Clean up subscriptions on unmount
4. Handle connection errors gracefully

---

## 🔍 Debugging Guidelines

### Common Issues
- **Blank screen**: Check font loading and navigation
- **Build errors**: Verify all imports and exports
- **Database errors**: Check RLS policies and permissions
- **Real-time issues**: Verify Supabase connection

### Development Tools
- **Expo Dev Tools**: `npm run dev`
- **Database**: Supabase Dashboard
- **Debugging**: React DevTools, Flipper
- **Testing**: Manual testing on web/mobile

---

## 📦 Key Dependencies

### Core Framework
```json
{
  "expo": "~52.0.30",
  "expo-router": "~4.0.17",
  "react-native": "0.76.5"
}
```

### UI & Styling
```json
{
  "@expo-google-fonts/inter": "^0.4.1",
  "lucide-react-native": "^0.475.0",
  "expo-linear-gradient": "~14.1.3"
}
```

### Backend & Data
```json
{
  "@supabase/supabase-js": "^2.50.3",
  "react-native-url-polyfill": "^2.0.0"
}
```

### Platform Features
```json
{
  "expo-camera": "~16.1.5",
  "expo-haptics": "~14.1.3",
  "react-native-reanimated": "~3.17.4"
}
```

---

## 🎯 AI Development Instructions

### When Modifying This Project:

1. **Understand the Context**
   - This is a dating app with real-time features
   - Users can swipe, match, chat, and send gifts
   - Digital wallet system for monetization

2. **Follow Existing Patterns**
   - Use established component structure
   - Maintain consistent styling approach
   - Follow database schema conventions

3. **Security Considerations**
   - Always implement RLS policies
   - Validate user permissions
   - Sanitize user inputs

4. **Performance Guidelines**
   - Optimize images and assets
   - Use proper list virtualization
   - Implement proper loading states

5. **Testing Approach**
   - Test on both web and mobile
   - Verify real-time functionality
   - Check authentication flows

### Extending Features:

- **New matching algorithms**: Modify discovery logic
- **Additional gift types**: Extend gift catalog
- **Premium features**: Add subscription tiers
- **Social features**: Implement friend systems
- **Advanced messaging**: Add media support

---

## 📚 Additional Resources

- **Expo Documentation**: https://docs.expo.dev/
- **Supabase Docs**: https://supabase.com/docs
- **React Native Guide**: https://reactnative.dev/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## 🤝 Contributing Guidelines

When working on this project:

1. **Read this blueprint thoroughly**
2. **Understand the existing architecture**
3. **Follow established patterns and conventions**
4. **Test changes on multiple platforms**
5. **Update documentation when adding features**
6. **Maintain backward compatibility**
7. **Consider performance implications**

This blueprint serves as a comprehensive guide for any AI agent to understand, modify, and extend the Trish dating app effectively while maintaining code quality and architectural consistency.