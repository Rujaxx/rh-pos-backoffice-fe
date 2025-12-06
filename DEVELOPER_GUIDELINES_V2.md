# RH POS Backoffice Frontend Development Guidelines

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Creating New Pages](#2-creating-new-pages)
3. [Forms Implementation](#3-forms-implementation)
4. [Table Implementation](#4-table-implementation)
5. [Validation](#5-validation)
6. [Internationalization](#6-internationalization)
7. [State Management](#7-state-management)
8. [UI Components](#8-ui-components)
9. [Best Practices](#9-best-practices)

## 1. Project Structure

### 1.1. Directory Layout

```
src/
  app/                    # Next.js 13+ app directory
    (auth)/              # Authentication routes
    dashboard/           # Dashboard routes
    brands/             # Module-specific routes
  components/
    ui/                 # Shared UI components
    {module}/          # Module-specific components
  hooks/               # Custom React hooks
  lib/                 # Utilities and helpers
  providers/           # Context providers
  types/               # TypeScript types
messages/
  en.json             # English translations
  ar.json             # Arabic translations
```

## 2. Creating New Pages

### 2.1. Page Structure

```tsx
// src/app/{module}/page.tsx
export default function ModulePage() {
  return (
    <div className="container space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('module.title')}</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          {t('common.create')}
        </Button>
      </div>
      <ModuleTable data={data} />
      <CreateModuleModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}
```

### 2.2. Sidenav Integration

Add your route to `src/components/common/sidebar.tsx`:

```tsx
{
  path: "/module",
  label: t("module.title"),
  icon: <ModuleIcon />,
  permission: "module.view"
}
```

## 3. Forms Implementation

### 3.1. Schema Definition

```tsx
// src/lib/validations/{module}.ts
import { z } from 'zod';

export const moduleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  translations: z.object({
    en: z.string(),
    ar: z.string(),
  }),
});

export type ModuleFormData = z.infer<typeof moduleSchema>;
```

### 3.2. Form Component

```tsx
// src/components/{module}/module-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

export function ModuleForm() {
  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: '',
      status: 'active',
    },
  });

  return (
    <Form {...form}>
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('module.form.name')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Other fields */}
    </Form>
  );
}
```

### 3.3. Form Validation

```tsx
const onSubmit = async (data: ModuleFormData) => {
  const result = validateFormSubmission(
    moduleSchema,
    data,
    (validData) => {
      // Success handling
      toast.success(t('module.messages.created'));
    },
    (errors) => {
      // Error handling
      toast.error(formatValidationErrors(errors)[0]);
    },
  );
};
```

## 4. Table Implementation

### 4.1. Column Definition

```tsx
// src/components/{module}/module-table.tsx
const columns: ColumnDef<Module>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('module.table.name')} />
    ),
  },
  {
    accessorKey: 'status',
    header: t('module.table.status'),
    cell: ({ row }) => (
      <Badge
        variant={row.getValue('status') === 'active' ? 'success' : 'secondary'}
      >
        {t(`module.status.${row.getValue('status')}`)}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={() => handleEdit(row.original)}
        onDelete={() => handleDelete(row.original.id)}
      />
    ),
  },
];
```

### 4.2. Table Component

```tsx
export function ModuleTable({ data }: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="name"
      pagination
      sorting
    />
  );
}
```

## 5. Validation

### 5.1. Custom Validation Rules

```tsx
// src/lib/validations/{module}.ts
export const customFieldValidation = z
  .string()
  .refine((value) => customValidationLogic(value), {
    message: 'Custom validation message',
  });
```

### 5.2. Error Handling

```tsx
try {
  const validData = await validateFormData(moduleSchema, formData);
  // Process valid data
} catch (error) {
  if (error instanceof z.ZodError) {
    const errors = formatValidationErrors(error);
    // Handle validation errors
  }
}
```

## 6. Internationalization

### 6.1. Translation Structure

Follow the established dot notation pattern in `messages/en.json`:

```json
{
  "module.title": "Module Name",
  "module.form.name": "Name",
  "module.form.description": "Description",
  "module.form.status": "Status",
  "module.table.name": "Name",
  "module.table.status": "Status",
  "module.table.actions": "Actions",
  "module.messages.created": "Successfully created",
  "module.messages.updated": "Successfully updated",
  "module.messages.deleted": "Successfully deleted"
}
```

### 6.2. Using Translations

```tsx
const { t } = useTranslation()

// Usage
<h1>{t("module.title")}</h1>
<FormLabel>{t("module.form.name")}</FormLabel>
```

## 7. State Management

### 7.1. Local State

- Use React's useState for component-level state
- Use useReducer for complex state logic
- Implement proper loading and error states

### 7.2. Form State

- Use React Hook Form for form state management
- Implement proper validation states
- Show appropriate error messages

## 8. UI Components

### 8.1. Available Components

- Use shadcn/ui components for consistency
- Use our custom wrapper components when available
- Follow the established design patterns

### 8.2. Modal Implementation

```tsx
import { CrudModal } from '@/components/ui/crud-modal';

export function CreateModuleModal({ open, onOpenChange }: CrudModalProps) {
  return (
    <CrudModal
      title={t('module.create.title')}
      open={open}
      onOpenChange={onOpenChange}
    >
      <ModuleForm />
    </CrudModal>
  );
}
```

## 9. Best Practices

### 9.1. Code Organization

- Keep components small and focused
- Use custom hooks for reusable logic
- Follow the established naming conventions
- Use TypeScript for better type safety

### 9.2. Performance

- Implement proper memoization (useMemo, useCallback)
- Use proper key props in lists
- Optimize re-renders
- Lazy load components when appropriate

### 9.3. Error Handling

- Implement proper error boundaries
- Show appropriate error states
- Handle API errors gracefully
- Provide meaningful error messages

### 9.4. Testing

- Write unit tests for critical functionality
- Test error cases and edge conditions
- Use proper mocking for external dependencies

## Reference Implementation

Check the brands module for a complete example:

- `src/app/brands/page.tsx`
- `src/components/brands/brand-form.tsx`
- `src/components/brands/brand-table.tsx`
- `src/lib/validations/brand.ts`
