'use client';

import {
  Menu,
  Bell,
  Settings,
  User,
  ChevronDown,
  Building2,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { useSidebar } from '@/providers/sidebar-provider';
import { useBrands } from '@/services/api/brands/brands.queries';
import { Brand } from '@/types/brand.type';
import { useLogout } from '@/services/api/auth/auth.mutations';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

export default function TopNav() {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const router = useRouter();
  const { user } = useAuthStore();

  const { toggleMenuState, isMobileMenuOpen, setIsMobileMenuOpen } =
    useSidebar();
  const [selectedBrand, setSelectedBrand] = useState('all-brands');
  const [selectedRestaurant, setSelectedRestaurant] =
    useState('all-restaurants');

  const { mutate: logout } = useLogout();

  const onClickLogOut = () => {
    logout(
      { sessionId: user?.sessionId as string },
      {
        onSuccess: () => {
          toast.success(t('auth.logout.success') || 'Logout successful');
          router.push('/');
        },
        onError: () => {
          toast.error(t('auth.logout.error') || 'Logout failed');
        },
      },
    );
  };
  // Fetch brands from API
  const { data: brandsResponse, isLoading: isBrandsLoading } = useBrands({
    limit: 100,
  }); // Get all brands for dropdown
  const apiBrands = brandsResponse?.data || [];

  const isRTL = locale === 'ar';

  const handleMenuToggle = () => {
    toggleMenuState();
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper function to get localized name for brands
  const getBrandLocalizedName = (brand: Brand) => {
    return locale === 'ar' && brand.name.ar ? brand.name.ar : brand.name.en;
  };

  // Helper function to get localized name for restaurants
  const getRestaurantLocalizedName = (item: {
    name: { en: string; ar: string };
  }) => {
    return locale === 'ar' ? item.name.ar : item.name.en;
  };

  return (
    <div className="flex items-center justify-between h-full px-4 lg:px-6">
      {/* Left side - Menu toggle and Context Selectors */}
      <div
        className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}
      >
        {/* Desktop Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuToggle}
          className="hidden lg:flex p-2"
          title="Toggle Menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMobileMenuToggle}
          className="lg:hidden p-2"
          title="Toggle Mobile Menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Right side - Actions and Profile */}
      <div
        className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}
      >
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`flex items-center p-2 ${isRTL ? 'space-x-reverse' : ''} space-x-2`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                  alt="User"
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div
                className={`hidden lg:flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role.name[locale]}
                </span>
              </div>
              <ChevronDown className="hidden lg:block h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-56">
            <DropdownMenuLabel>{t('dashboard.myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('dashboard.profile')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('navigation.settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                onClickLogOut();
              }}
              className="text-red-600"
            >
              {t('dashboard.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
