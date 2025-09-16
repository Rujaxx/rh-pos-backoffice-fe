import { z } from 'zod';

// User validation schema
export const userSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    ),
  email: z.email('Please enter a valid email address'),
  phone: z
    .string()
    .min(0)
    .refine(
      (val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val),
      'Please enter a valid phone number'
    ),
  role: z.string().min(1, 'Role is required'),
  designation: z
    .string()
    .min(1, 'Designation is required')
    .max(100, 'Designation must be less than 100 characters'),
  restaurants: z
    .array(z.string())
    .min(1, 'At least one restaurant must be assigned'),
  isActive: z.boolean(),
  profileImage: z.string().min(0),
});

export type UserFormData = z.infer<typeof userSchema>;
