import { UserRole } from '@/types/user.type';

export const mockRoles: UserRole[] = [
  {
    _id: '1',
    name: {
      en: 'Manager',
      ar: 'مدير',
    },
    permissions: [
      'manageUsers',
      'manageRoles',
      'viewOrders',
      'processOrders',
      'voidOrders',
      'viewMenu',
      'editMenu',
      'viewReports',
      'managePayments',
    ],
    isActive: true,
  },
  {
    _id: '2',
    name: {
      en: 'Cashier',
      ar: 'محاسب',
    },
    permissions: ['viewOrders', 'processOrders', 'viewMenu', 'managePayments'],
    isActive: true,
  },
  {
    _id: '3',
    name: {
      en: 'Chef',
      ar: 'شيف',
    },
    permissions: ['viewOrders', 'processOrders', 'viewMenu'],
    isActive: true,
  },
  {
    _id: '4',
    name: {
      en: 'Waiter',
      ar: 'نادل',
    },
    permissions: ['viewOrders', 'processOrders', 'viewMenu'],
    isActive: false,
  },
];

export const initialMockRoles: UserRole[] = [
  {
    _id: '1',
    name: {
      en: 'Manager',
      ar: 'مدير',
    },
    permissions: [
      'read',
      'write',
      'delete',
      'manageUsers',
      'manageRoles',
      'viewOrders',
      'processOrders',
      'voidOrders',
      'viewMenu',
      'editMenu',
      'viewReports',
      'managePayments',
    ],
    isActive: true,
  },
  {
    _id: '2',
    name: {
      en: 'Cashier',
      ar: 'محاسب',
    },
    permissions: [
      'read',
      'write',
      'viewOrders',
      'processOrders',
      'viewMenu',
      'managePayments',
    ],
    isActive: true,
  },
  {
    _id: '3',
    name: {
      en: 'Chef',
      ar: 'شيف',
    },
    permissions: ['read', 'viewOrders', 'processOrders', 'viewMenu'],
    isActive: true,
  },
  {
    _id: '4',
    name: {
      en: 'Waiter',
      ar: 'نادل',
    },
    permissions: ['read', 'write', 'viewOrders', 'processOrders', 'viewMenu'],
    isActive: false,
  },
];
