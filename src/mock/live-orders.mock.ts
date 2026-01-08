import { ClipboardList, ShoppingBag, Truck, Utensils } from 'lucide-react';

export const liveStats = [
  {
    id: 'dine-in',
    title: 'Live Dine-In Orders',
    icon: Utensils,
    type: 'dine-in',
  },
  {
    id: 'pickup',
    title: 'Live Pickup Orders',
    icon: ShoppingBag,
    type: 'pickup',
  },
  {
    id: 'delivery',
    title: 'Live Delivery Orders',
    icon: Truck,
    type: 'delivery',
  },
  {
    id: 'kot',
    title: 'Live KOTs (Items)',
    icon: ClipboardList,
    type: 'kot',
  },
];

export const liveOrders = [
  {
    id: 'Order No 42',
    table: 'table1',
    status: 'Running',
    amount: 300.0,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    // createdAt: new Date(Date.now()).toISOString(), // 5 mins ago
    type: 'dine-in',
    icon: Utensils,
  },
  {
    id: 'Order No 43',
    table: 'table2',
    status: 'Running',
    amount: 200.0,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    type: 'dine-in',
    icon: Utensils,
  },
  {
    id: 'Order No 44',
    table: 'table3',
    status: 'Running',
    amount: 500.0,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    type: 'dine-in',
    icon: Utensils,
  },
  {
    id: 'Order No 45',
    table: 'P 6',
    status: 'Running',
    amount: 134.0,
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    type: 'pickup',
    icon: ShoppingBag,
  },
  {
    id: 'Order No 46',
    table: 'P 6',
    status: 'Running',
    amount: 200.0,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 mins ago
    type: 'pickup',
    icon: ShoppingBag,
  },
  {
    id: 'Order No 46',
    customer: 'Sarfaraz Shaikh',
    status: 'Running',
    amount: 438.0,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    type: 'delivery',
    icon: Truck,
  },
];

export const liveKots = [
  {
    id: 'KOT No 1',
    table: 'table1',
    status: 'Running',
    amount: 300.0,
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3 mins ago
    type: 'dine-in',
    items: 2,
    icon: Utensils,
  },
  {
    id: 'KOT No 2',
    table: 'table2',
    status: 'Completed',
    amount: 200.0,
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 mins ago
    type: 'dine-in',
    items: 5,
    icon: Utensils,
  },
  {
    id: 'KOT No 3',
    table: 'table3',
    status: 'Running',
    amount: 500.0,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    type: 'dine-in',
    items: 2,
    icon: Utensils,
  },
];
