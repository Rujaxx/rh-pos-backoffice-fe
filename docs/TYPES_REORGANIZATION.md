# Types Reorganization

This document outlines the reorganization of the project's type system from a monolithic `entities.ts` file to a modular structure.

## Changes Made

### ✅ **1. Consolidated Common Types**

- **Before**: `LocalizedName` in `entities.ts` and `MultilingualText` in `common.type.ts` were duplicate types
- **After**: `LocalizedName` is now an alias for `MultilingualText` in `common.type.ts` for semantic clarity

### ✅ **2. Created Module-Based Type Structure**

#### **Auth Types** (`src/types/auth/`)

- `AuthTokens` - Authentication token structure
- `AuthUser` - Authenticated user with tokens
- `LoginCredentials` - Login form data
- `RegisterCredentials` - Registration form data
- `PasswordResetRequest` - Password reset request
- `PasswordResetConfirm` - Password reset confirmation
- `ChangePasswordRequest` - Change password request

#### **User Types** (`src/types/user/`)

- `Role` - User role entity (enhanced with optional fields)
- `User` - User entity (unchanged from original)
- `CreateUserPayload` - User creation payload
- `UpdateUserPayload` - User update payload
- `UserQueryParams` - User query parameters (new)
- `UserStats` - User statistics (new)

### ✅ **3. Updated Import Structure**

- **Before**: All imports from `@/types/entities`
- **After**: Specific imports from `@/types/auth` and `@/types/user`

### ✅ **4. Files Updated**

- `src/components/auth/login-form.tsx` - Updated import
- `src/services/api/users/queries.ts` - Updated import
- `src/services/api/auth/mutations.ts` - Updated imports
- `src/stores/auth.ts` - Updated imports

### ✅ **5. Added Convenience Exports**

- `src/types/index.ts` - Main types index for convenient importing
- `src/types/auth/index.ts` - Auth types index
- `src/types/user/index.ts` - User types index

## Benefits

### **1. Better Organization**

- Types are now logically grouped by domain (auth, user, business entities)
- Easier to find and maintain related types
- Reduced coupling between different parts of the application

### **2. Improved Developer Experience**

- Clearer import statements indicate the purpose of types
- Better IDE auto-completion and navigation
- Reduced risk of circular dependencies

### **3. Enhanced Type Safety**

- Added new types for better API coverage (`UserQueryParams`, `UserStats`)
- Enhanced existing types with optional fields where appropriate
- Maintained backward compatibility through type aliases

### **4. Future Scalability**

- Easy to add new domain-specific types in their own modules
- Clear structure for new developers to follow
- Simplified refactoring when types need to change

## Migration Guide

### **For Existing Code**

Replace imports like:

```typescript
// Old
import { User, LoginCredentials } from '@/types/entities';

// New
import { LoginCredentials } from '@/types/auth';
import { User } from '@/types/user';
```

### **For New Code**

Use the modular imports or the convenience index:

```typescript
// Specific modules (recommended)
import { AuthUser } from '@/types/auth';
import { User, Role } from '@/types/user';

// Convenience index (for multiple types from different modules)
import { AuthUser, User, Role } from '@/types';
```

## File Structure

```
src/types/
├── index.ts                 # Main types index
├── common/
│   └── common.type.ts      # Common types (MultilingualText, LocalizedName)
├── auth/
│   ├── index.ts            # Auth types index
│   └── auth.type.ts        # Auth-related types
├── user/
│   ├── index.ts            # User types index
│   └── user.type.ts        # User-related types
└── [other domain types]    # Brand, Restaurant, Category, etc.
```

## Validation

- ✅ All existing functionality preserved
- ✅ TypeScript compilation passes (no new errors)
- ✅ ESLint passes on all new files
- ✅ Import statements properly updated
- ✅ Backward compatibility maintained
