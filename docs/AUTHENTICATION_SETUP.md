# Authentication Setup Guide

This guide explains how to use the authentication system implemented in your Next.js + Strapi application.

## Overview

The authentication system includes:

- **Strapi Backend**: Users-permissions plugin configured
- **Next.js Frontend**: React context, components, and API routes
- **Type Safety**: Full TypeScript support
- **UI Components**: Login/Register forms with modern design

## Files Created/Modified

### Strapi Configuration

- `strapi/config/plugins.ts` - Users-permissions plugin configuration

### Next.js Context & Services

- `next/context/auth-context.tsx` - Authentication context and hooks
- `next/lib/auth.ts` - Authentication service utilities

### UI Components

- `next/components/ui/input.tsx` - Input component
- `next/components/ui/label.tsx` - Label component
- `next/components/ui/card.tsx` - Card components
- `next/components/ui/alert.tsx` - Alert component
- `next/components/ui/dialog.tsx` - Dialog component
- `next/components/auth/login-form.tsx` - Login form
- `next/components/auth/register-form.tsx` - Register form
- `next/components/auth/auth-modal.tsx` - Authentication modal
- `next/components/auth/protected-route.tsx` - Protected route wrapper
- `next/components/auth/auth-button.tsx` - Example auth button

### API Routes

- `next/app/api/auth/login/route.ts` - Login API endpoint
- `next/app/api/auth/register/route.ts` - Register API endpoint
- `next/app/api/auth/forgot-password/route.ts` - Forgot password API
- `next/app/api/auth/reset-password/route.ts` - Reset password API

### Layout Updates

- `next/app/[locale]/layout.tsx` - Added AuthProvider

## Environment Variables

Make sure your `.env` file includes:

```env
NEXT_PUBLIC_API_URL=http://localhost:1337
```

## Getting Started

### 1. Start Strapi Server

```bash
cd strapi
npm run develop
```

### 2. Start Next.js Server

```bash
cd next
npm run dev
```

### 3. Configure Strapi Admin

1. Go to `http://localhost:1337/admin`
2. Create your admin account
3. Go to Settings > Users & Permissions > Roles
4. Configure permissions for:
   - **Public**: What unauthenticated users can access
   - **Authenticated**: What logged-in users can access

## Usage Examples

### Using the Auth Context

```tsx
import { useAuth } from '@/context/auth-context';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login('email@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Using the Auth Modal

```tsx
import { AuthModal } from '@/components/auth/auth-modal';

function MyComponent() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div>
      <button onClick={() => setShowAuth(true)}>Sign In</button>
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultMode="login" // or "register"
      />
    </div>
  );
}
```

### Using Protected Routes

```tsx
import { ProtectedRoute } from '@/components/auth/protected-route';

function MyPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Using the Auth Button

```tsx
import { AuthButton } from '@/components/auth/auth-button';

function Navbar() {
  return (
    <nav>
      <div>My App</div>
      <AuthButton />
    </nav>
  );
}
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with code

### Strapi Endpoints

- `POST /api/auth/local` - Strapi login
- `POST /api/auth/local/register` - Strapi registration
- `POST /api/auth/forgot-password` - Strapi forgot password
- `POST /api/auth/reset-password` - Strapi reset password
- `GET /api/users/me` - Get current user (requires token)

## User Object Structure

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  role: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
  created_at: string;
  updated_at: string;
}
```

## Security Features

- **JWT Tokens**: Secure authentication tokens
- **Password Validation**: Minimum 6 characters
- **Email Validation**: Proper email format required
- **Error Handling**: Comprehensive error messages
- **Type Safety**: Full TypeScript support
- **Local Storage**: Persistent login sessions

## Customization

### Styling

All components use Tailwind CSS and can be customized by modifying the className props.

### Validation

Password requirements can be modified in the register form component.

### Token Expiration

JWT token expiration can be configured in `strapi/config/plugins.ts`.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure Strapi CORS is configured for your Next.js domain
2. **Token Expired**: Check JWT secret configuration in Strapi
3. **Registration Fails**: Verify users-permissions plugin is enabled
4. **UI Components Not Working**: Ensure all dependencies are installed

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
NODE_ENV=development
```

## Next Steps

1. **Email Configuration**: Set up email provider in Strapi for password resets
2. **Social Login**: Add Google/Facebook login providers
3. **User Profiles**: Create user profile management pages
4. **Role Management**: Implement role-based access control
5. **Two-Factor Authentication**: Add 2FA support

## Support

For issues or questions:

1. Check the Strapi documentation
2. Review the Next.js authentication patterns
3. Check browser console for errors
4. Verify environment variables are set correctly
