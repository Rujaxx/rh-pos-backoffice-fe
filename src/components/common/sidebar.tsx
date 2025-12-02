'use client';

import type React from 'react';
import {
  BarChart2,
  Building2,
  Users2,
  Settings,
  Home,
  ShoppingCart,
  FileText,
  TrendingUp,
  Activity,
  UserPlus,
  Clock,
  DollarSign,
  Store,
  Receipt,
  Calendar,
  Utensils,
  Users,
  CreditCard,
  ClipboardList,
  Truck,
  ChevronDown,
  HelpCircle,
  Percent,
  Image as ImageIcon,
  Table,
  CookingPot,
  TicketPercent,
  Sofa,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { useSidebar } from '@/providers/sidebar-provider';

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
  isNew?: boolean;
  children?: SubMenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
  isNew?: boolean;
  children?: SubMenuItem[];
}

interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
}

// Function to generate POS menu data with translations
const getPOSMenuData = (t: (key: string) => string): MenuSection[] => [
  {
    id: 'overview',
    label: t('navigation.overview'),
    items: [
      {
        id: 'dashboard',
        label: t('navigation.dashboard'),
        href: '/dashboard',
        icon: Home,
        children: [
          {
            id: 'analytics',
            label: t('navigation.analytics'),
            href: '/dashboard/analytics',
            icon: BarChart2,
          },
          {
            id: 'reports',
            label: t('navigation.reports'),
            href: '/dashboard/reports',
            icon: FileText,
            children: [
              {
                id: 'sales-reports',
                label: t('navigation.salesReports'),
                href: '/dashboard/reports/sales',
                icon: TrendingUp,
              },
              {
                id: 'staff-reports',
                label: t('navigation.staffReports'),
                href: '/dashboard/reports/staff',
                icon: Users2,
              },
              {
                id: 'financial-reports',
                label: t('navigation.financialReports'),
                href: '/dashboard/reports/financial',
                icon: DollarSign,
              },
            ],
          },
          {
            id: 'real-time',
            label: t('navigation.realTime'),
            href: '/dashboard/realtime',
            icon: Activity,
            isNew: true,
          },
        ],
      },
    ],
  },
  {
    id: 'operations',
    label: t('navigation.operations'),
    items: [
      {
        id: 'brands',
        label: t('navigation.brands'),
        href: '/brands',
        icon: Building2,
      },
      {
        id: 'restaurants',
        label: t('navigation.restaurants'),
        href: '/restaurants',
        icon: Store,
        children: [
          {
            id: 'all-restaurants',
            label: t('navigation.allRestaurants'),
            href: '/restaurants/all',
            icon: Store,
          },
          {
            id: 'table-sections',
            label: t('navigation.tableSections'),
            href: '/restaurants/tablesections',
            icon: Store,
          },
          {
            id: 'tables',
            label: t('navigation.tables'),
            href: '/restaurants/tables',
            icon: Sofa,
          },
          {
            id: 'kitchen-department',
            label: t('navigation.kitchendept'),
            href: '/restaurants/kitchendepartment',
            icon: CookingPot,
          },
          {
            id: 'discounts',
            label: t('navigation.discounts'),
            href: '/restaurants/discounts',
            icon: TicketPercent,
          },
        ],
      },
      {
        id: 'orders',
        label: t('navigation.orders'),
        href: '/orders',
        icon: ShoppingCart,
        badge: '5',
        children: [
          {
            id: 'active-orders',
            label: t('navigation.activeOrders'),
            href: '/orders/active',
            icon: ShoppingCart,
          },
          {
            id: 'pending',
            label: t('navigation.pendingOrders'),
            href: '/orders/pending',
            icon: Clock,
            badge: '3',
          },
          {
            id: 'completed',
            label: t('navigation.completedOrders'),
            href: '/orders/completed',
            icon: Receipt,
          },
          {
            id: 'delivery',
            label: t('navigation.deliveryOrders'),
            href: '/orders/delivery',
            icon: Truck,
          },
        ],
      },
    ],
  },
  {
    id: 'menu',
    label: t('navigation.menuManagement'),
    items: [
      {
        id: 'menu',
        label: t('navigation.menu'),
        href: '/menu-management/menu',
        icon: Utensils,
        // children: [
        //   {
        //     id: 'all-items',
        //     label: t('navigation.allMenuItems'),
        //     href: '/menu/all',
        //     icon: Utensils,
        //   },
        //   {
        //     id: 'pricing',
        //     label: t('navigation.pricing'),
        //     href: '/menu/pricing',
        //     icon: DollarSign,
        //   },
        //   {
        //     id: 'availability',
        //     label: t('navigation.availability'),
        //     href: '/menu/availability',
        //     icon: Clock,
        //   },
        // ],
      },
      {
        id: 'categories',
        label: t('navigation.categories'),
        href: '/menu-management/categories',
        icon: ClipboardList,
      },
    ],
  },
  {
    id: 'staff',
    label: t('navigation.staffManagement'),
    items: [
      {
        id: 'employees',
        label: t('navigation.employees'),
        href: '/employees',
        icon: Users,
        children: [
          {
            id: 'all-employees',
            label: t('navigation.allEmployees'),
            href: '/employees/all',
            icon: Users,
          },
          {
            id: 'roles',
            label: t('navigation.roles'),
            href: '/employees/roles',
            icon: UserPlus,
          },
          {
            id: 'schedules',
            label: t('navigation.workSchedules'),
            href: '/employees/schedules',
            icon: Calendar,
          },
          {
            id: 'payroll',
            label: t('navigation.payroll'),
            href: '/employees/payroll',
            icon: DollarSign,
          },
        ],
      },
    ],
  },
  {
    id: 'taxes',
    label: t('navigation.taxes'),
    items: [
      {
        id: 'tax-config',
        label: t('navigation.taxGroup'),
        href: '/taxgroup/tax-product-group',
        icon: Percent,
      },
    ],
  },
  {
    id: 'reports',
    label: t('navigation.reports'),
    items: [
      {
        id: 'sales-reports',
        label: t('navigation.salesReports'),
        href: '/reports/sales-reports',
        icon: TrendingUp,
      },
    ],
  },
  {
    id: 'finance',
    label: t('navigation.finance'),
    items: [
      {
        id: 'sales',
        label: t('navigation.sales'),
        href: '/sales',
        icon: TrendingUp,
        children: [
          {
            id: 'daily-sales',
            label: t('navigation.dailySales'),
            href: '/sales/daily',
            icon: Calendar,
          },
          {
            id: 'monthly-sales',
            label: t('navigation.monthlySales'),
            href: '/sales/monthly',
            icon: BarChart2,
          },
        ],
      },
      {
        id: 'payments',
        label: t('navigation.payments'),
        href: '/payments',
        icon: CreditCard,
        children: [
          {
            id: 'payment-methods',
            label: t('navigation.paymentMethods'),
            href: '/payments/methods',
            icon: CreditCard,
          },
          {
            id: 'transactions',
            label: t('navigation.transactions'),
            href: '/payments/transactions',
            icon: Receipt,
          },
        ],
      },
    ],
  },
  {
    id: 'image-library',
    label: t('navigation.imageLibrary'),
    items: [
      {
        id: 'image-library',
        label: t('navigation.imageLibrary'),
        href: 'image-library',
        icon: ImageIcon,
      },
    ],
  },
];

// Default menu data - will be updated in component
let menuData: MenuSection[] = [];

export default function Sidebar() {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const {
    menuState,
    isHovered,
    setIsHovered,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isMobile,
  } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const isRTL = locale === 'ar';

  // Update menu data with translations
  menuData = getPOSMenuData(t);

  function handleNavigation() {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  function NavItem({
    item,
    level = 0,
    parentId = '',
  }: {
    item: MenuItem | SubMenuItem;
    level?: number;
    parentId?: string;
  }) {
    const itemId = `${parentId}-${item.id}`;
    const isExpanded = expandedItems.has(itemId);
    const hasChildren = item.children && item.children.length > 0;
    const showText =
      menuState === 'full' ||
      (menuState === 'collapsed' && isHovered) ||
      (isMobile && isMobileMenuOpen);
    const showExpandIcon = hasChildren && showText;

    // Adjust padding based on RTL and level
    const getPaddingClasses = () => {
      if (level === 0) return 'px-3';
      if (level === 1) return isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3';
      return isRTL ? 'pr-12 pl-3' : 'pl-12 pr-3';
    };

    const content = (
      <div
        className={cn(
          'flex items-center py-2 text-sm rounded-md transition-colors sidebar-menu-item hover:bg-gray-50 dark:hover:bg-[#1F1F23] relative group cursor-pointer',
          getPaddingClasses(),
        )}
        onClick={() => {
          if (hasChildren) {
            toggleExpanded(itemId);
          }
        }}
        title={
          menuState === 'collapsed' && !isHovered && !isMobile
            ? item.label
            : undefined
        }
      >
        {item.icon && (
          <item.icon className="h-4 w-4 flex-shrink-0 sidebar-menu-icon" />
        )}

        {showText && (
          <>
            <span
              className={`${isRTL ? 'mr-3' : 'ml-3'} flex-1 transition-opacity duration-200 sidebar-menu-text`}
            >
              {item.label}
            </span>

            {/* Badges and indicators */}
            <div
              className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-1`}
            >
              {item.isNew && (
                <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  New
                </span>
              )}
              {item.badge && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  {item.badge}
                </span>
              )}
              {showExpandIcon && (
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform duration-200',
                    isExpanded ? 'rotate-180' : 'rotate-0',
                  )}
                />
              )}
            </div>
          </>
        )}

        {/* Tooltip for collapsed state when not hovered and not mobile */}
        {menuState === 'collapsed' && !isHovered && !isMobile && (
          <div
            className={`absolute px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 ${
              isRTL ? 'right-full mr-2' : 'left-full ml-2'
            }`}
          >
            {item.label}
            {item.badge && (
              <span className={`text-blue-300 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                ({item.badge})
              </span>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div>
        {item.href && !hasChildren ? (
          <Link href={item.href} onClick={handleNavigation}>
            {content}
          </Link>
        ) : (
          content
        )}
        {hasChildren && isExpanded && showText && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                level={level + 1}
                parentId={itemId}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Calculate sidebar width - expand when collapsed and hovered, or full width on mobile
  const getSidebarWidth = () => {
    if (isMobile) {
      return 'w-64'; // Always full width on mobile
    }
    if (menuState === 'collapsed' && isHovered) {
      return 'w-64'; // Expand to full width when hovered
    }
    return menuState === 'collapsed' ? 'w-16' : 'w-64';
  };

  // Show text if menu is full OR if collapsed and hovered OR on mobile
  const showText =
    menuState === 'full' ||
    (menuState === 'collapsed' && isHovered) ||
    (isMobile && isMobileMenuOpen);

  // On mobile, show sidebar as overlay when isMobileMenuOpen is true
  if (isMobile) {
    return (
      <>
        {/* Mobile sidebar overlay */}
        <nav
          className={`
            fixed inset-y-0 z-[70] w-64 bg-white dark:bg-[#0F0F12]
            transform transition-transform duration-300 ease-in-out
            ${
              isRTL
                ? `right-0 border-l border-gray-200 dark:border-[#1F1F23] ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                  }`
                : `left-0 border-r border-gray-200 dark:border-[#1F1F23] ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                  }`
            }
          `}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full"
              >
                <Image
                  src="/logo.png"
                  alt="RHPOS"
                  width={32}
                  height={32}
                  className="flex-shrink-0"
                />
                <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                  CMSFullForm
                </span>
              </Link>
            </div>

            <div
              className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
              style={{
                scrollbarWidth: 'none' /* Firefox */,
                msOverflowStyle: 'none' /* IE and Edge */,
              }}
            >
              <div className="space-y-6">
                {menuData.map((section) => (
                  <div key={section.id}>
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label">
                      {section.label}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavItem
                          key={item.id}
                          item={item}
                          parentId={section.id}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
              <div className="space-y-1">
                <NavItem
                  item={{
                    id: 'settings',
                    label: 'Settings',
                    href: '/settings',
                    icon: Settings,
                  }}
                />
                <NavItem
                  item={{
                    id: 'help',
                    label: 'Help',
                    href: '/help',
                    icon: HelpCircle,
                  }}
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile overlay backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[65]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <nav
      className={`
        fixed inset-y-0 z-[60] bg-white dark:bg-[#0F0F12]
        transition-all duration-300 ease-in-out
        ${
          menuState === 'hidden'
            ? 'w-0 border-0'
            : `${getSidebarWidth()} ${
                isRTL
                  ? 'right-0 border-l border-gray-200 dark:border-[#1F1F23]'
                  : 'left-0 border-r border-gray-200 dark:border-[#1F1F23]'
              }`
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        overflow: menuState === 'hidden' ? 'hidden' : 'visible',
      }}
    >
      {menuState !== 'hidden' && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
            {showText ? (
              <Link
                href="https://www.rhposs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full"
              >
                <Image
                  src="/logo.png"
                  alt="RHPOS"
                  width={32}
                  height={32}
                  className="flex-shrink-0 hidden dark:block"
                />
                <Image
                  src="/logo.png"
                  alt="RHPOS"
                  width={32}
                  height={32}
                  className="flex-shrink-0 block dark:hidden"
                />
                <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white transition-opacity duration-200">
                  RHPOS
                </span>
              </Link>
            ) : (
              <div className="flex justify-center w-full">
                <Image
                  src="/logo.png"
                  alt="RHPOS"
                  width={32}
                  height={32}
                  className="flex-shrink-0 hidden dark:block"
                />
                <Image
                  src="/logo.png"
                  alt="RHPOS"
                  width={32}
                  height={32}
                  className="flex-shrink-0 block dark:hidden"
                />
              </div>
            )}
          </div>

          <div
            className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
            style={{
              scrollbarWidth: 'none' /* Firefox */,
              msOverflowStyle: 'none' /* IE and Edge */,
            }}
          >
            <div className="space-y-6">
              {menuData.map((section) => (
                <div key={section.id}>
                  {showText && (
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label transition-opacity duration-200">
                      {section.label}
                    </div>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavItem
                        key={item.id}
                        item={item}
                        parentId={section.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem
                item={{
                  id: 'settings',
                  label: 'Settings',
                  href: '/settings',
                  icon: Settings,
                }}
              />
              <NavItem
                item={{
                  id: 'help',
                  label: 'Help',
                  href: '/help',
                  icon: HelpCircle,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
