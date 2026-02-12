import { z } from 'zod';
import { PaymentMethod, BalanceType } from '@/types/vendors.type';

export const createVendorSchema = z.object({
  // Required fields
  name: z.string().min(1, 'Supplier name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  restaurantId: z.string().min(1, 'Restaurant is required'),
  brandId: z.string().min(1, 'Brand is required'),

  // Optional fields with defaults
  email: z.email('Invalid email address').optional().or(z.literal('')),
  paymentType: z.enum(PaymentMethod).default(PaymentMethod.CASH),
  creditLimit: z.number().min(0, 'Credit limit cannot be negative').default(0),
  openingBalance: z.number().default(0),
  balanceType: z.enum(BalanceType).default(BalanceType.PAYABLE),
  isActive: z.boolean().default(true),

  // Optional fields
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
});

export type CreateVendorData = z.input<typeof createVendorSchema>;
export type VendorFormData = z.infer<typeof createVendorSchema>;
