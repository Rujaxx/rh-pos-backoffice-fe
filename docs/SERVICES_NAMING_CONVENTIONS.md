# Services and Stores Naming Conventions

This document outlines the naming conventions for services and stores to make it easier to identify file purposes at a glance.

## Naming Patterns

### **Services (`src/services/api/`)**

Services are organized by domain/feature and follow these patterns:

- **Queries**: `{domain}.queries.ts` - For data fetching operations
- **Mutations**: `{domain}.mutations.ts` - For data modification operations
- **Service Classes**: `{domain}.service.ts` - For service class definitions

#### Examples:

```
src/services/api/
├── auth/
│   ├── auth.mutations.ts    # Authentication mutations (login, logout, etc.)
│   └── auth.queries.ts      # Authentication queries (get current user, etc.)
├── users/
│   ├── users.queries.ts     # User data queries
│   └── users.mutations.ts   # User data mutations
└── brands/
    ├── brands.queries.ts    # Brand data queries
    └── brands.mutations.ts  # Brand data mutations
```

### **Stores (`src/stores/`)**

Store files follow the pattern:

- **Stores**: `{domain}.store.ts` - For state management stores

#### Examples:

```
src/stores/
├── auth.store.ts      # Authentication state management
├── user.store.ts      # User data state management
└── ui.store.ts        # UI state management
```

## Benefits

### **1. Clear File Purpose Identification**

- **Before**: `mutations.ts` could be any domain's mutations
- **After**: `auth.mutations.ts` clearly indicates auth-related mutations

### **2. Better IDE Experience**

- Auto-completion shows domain and type together
- Easier to find files when searching
- Better organization in file explorers

### **3. Consistent Project Structure**

- All team members follow the same naming patterns
- New files are easily categorized
- Reduces cognitive load when navigating code

### **4. Scalability**

- Easy to add new domains with consistent naming
- Clear separation of concerns
- Reduced naming conflicts

## Migration Example

### **Before**

```typescript
// Old structure
src / services / api / auth / mutations.ts;
src / services / api / users / queries.ts;
src / stores / auth.ts;

// Old imports
import { useLogin } from "@/services/api/auth/mutations";
import { useUsers } from "@/services/api/users/queries";
import { useAuthStore } from "@/stores/auth";
```

### **After**

```typescript
// New structure
src / services / api / auth / auth.mutations.ts;
src / services / api / users / users.queries.ts;
src / stores / auth.store.ts;

// New imports
import { useLogin } from "@/services/api/auth/auth.mutations";
import { useUsers } from "@/services/api/users/users.queries";
import { useAuthStore } from "@/stores/auth.store";
```

## File Types Reference

### **Service Files**

| Type            | Purpose                               | Example Content                                   |
| --------------- | ------------------------------------- | ------------------------------------------------- |
| `.queries.ts`   | Data fetching with TanStack Query     | `useGetUsers`, `useGetUserById`                   |
| `.mutations.ts` | Data modification with TanStack Query | `useCreateUser`, `useUpdateUser`, `useDeleteUser` |
| `.service.ts`   | Service class definitions             | `UserService` class with API methods              |

### **Store Files**

| Type        | Purpose                       | Example Content                        |
| ----------- | ----------------------------- | -------------------------------------- |
| `.store.ts` | State management with Zustand | `useAuthStore`, auth state and actions |

## Best Practices

### **1. Consistent Domain Names**

- Use singular form for domain names: `auth`, `user`, `brand` (not `auths`, `users`, `brands`)
- Use descriptive names that match the business domain

### **2. File Organization**

- Group related services in domain folders
- Keep stores at the top level of the stores directory
- Use index files for convenient imports when needed

### **3. Import Patterns**

```typescript
// ✅ Good - Clear and specific
import { useLogin, useLogout } from "@/services/api/auth/auth.mutations";
import { useUsers } from "@/services/api/users/users.queries";
import { useAuthStore } from "@/stores/auth.store";

// ❌ Avoid - Generic and unclear
import { useLogin } from "@/services/api/auth/mutations";
import { useUsers } from "@/services/api/users/queries";
import { useAuthStore } from "@/stores/auth";
```

## Current Implementation

### **Services**

- ✅ `src/services/api/auth/auth.mutations.ts` - Authentication mutations
- ✅ `src/services/api/users/users.queries.ts` - User data queries

### **Stores**

- ✅ `src/stores/auth.store.ts` - Authentication state management

### **Updated Files**

- ✅ `src/components/auth/login-form.tsx` - Updated imports
- ✅ `src/services/api/auth/auth.mutations.ts` - Updated self-imports
- ✅ `src/lib/axios.ts` - Updated auth store import
- ✅ `src/components/providers/query-provider.tsx` - Updated auth store import

## Validation

- ✅ All imports updated successfully
- ✅ TypeScript compilation passes
- ✅ ESLint passes on all renamed files
- ✅ No functionality lost during migration
