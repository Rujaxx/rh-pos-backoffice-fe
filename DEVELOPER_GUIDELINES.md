# Developer Guidelines: Creating New Sidenav Pages

## 1. Folder & File Structure
- Create a new folder under `src/app/` for your page (e.g., `categories`).
- Add a `page.tsx` file as the route entry.
- Place related components in `src/components/{module}/` (e.g., `src/components/categories/`).

## 2. Page Component (`page.tsx`)
- Use the default export for the main page.
- Import shared UI components from `@/components/ui/`.
- Import your module’s components (e.g., forms, tables).
- Example:
  ```tsx
  import { CategoryForm } from "@/components/categories/category-form"
  import { DataTable } from "@/components/ui/data-table"
  // ...existing code...
  ```

## 3. Sidenav Integration
- Update `src/components/common/sidebar.tsx` to add your page link.
- Example:
  ```tsx
  { path: "/categories", label: "Categories", icon: <CategoryIcon /> }
  ```

## 4. Form Implementation
- Use **React Hook Form** for form state management.
- Use **shadcn/ui Form** components for UI consistency.
- Use **Zod** for schema validation.
- Example:
  ```tsx
  import { useForm } from "react-hook-form"
  import { zodResolver } from "@hookform/resolvers/zod"
  import { z } from "zod"
  import { Form, FormField, Input, Button } from "@/components/ui/form"

  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    // ...other fields...
  })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "" }
  })

  // In your component:
  <Form {...form}>
    <FormField name="name" control={form.control} render={({ field }) => (
      <Input {...field} label="Name" />
    )} />
    <Button type="submit">Save</Button>
  </Form>
  ```

## 5. Table Implementation
- Use **TanStack Table** for data tables.
- Use the shared `DataTable` component from `@/components/ui/data-table`.
- Example:
  ```tsx
  import { DataTable } from "@/components/ui/data-table"
  // Define columns and data
  <DataTable columns={columns} data={data} />
  ```

## 6. Validation
- Always use **Zod** for schema validation.
- Integrate Zod with React Hook Form using `zodResolver`.

## 7. Internationalization (i18n)
- Use the translation hook from `src/hooks/useTranslation.ts`.
- Add new keys to `messages/en.json` and `messages/ar.json`.

## 8. Styling
- Use Tailwind CSS utility classes.
- Follow dark/light mode conventions.

## 9. Example Directory Structure
```
src/
  app/
    categories/
      page.tsx
  components/
    categories/
      category-form.tsx
      category-table.tsx
```

## 10. Best Practices
- Keep components modular and reusable.
- Use shadcn/ui components for all forms, dialogs, and UI elements.
- Use React Hook Form + Zod for all forms.
- Use TanStack Table for all tables.
- Keep business logic out of UI components when possible.

---

**Reference:**  
Check the brands module (`src/app/brands/page.tsx`, `src/components/brands/brand-form.tsx`) for a working example of these patterns.
