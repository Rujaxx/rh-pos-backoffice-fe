"use client"

import { Menu, Search, Bell, Settings, User, ChevronDown, Building2, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { LanguageSwitcher } from "./language-switcher"
import { useTranslation } from "@/hooks/useTranslation"
import { useI18n } from "@/providers/i18n-provider"
import { useSidebar } from "@/providers/sidebar-provider"

export default function TopNav() {
  const { t } = useTranslation()
  const { locale } = useI18n()
  const {
    toggleMenuState,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useSidebar()
  const [selectedBrand, setSelectedBrand] = useState("all-brands")
  const [selectedRestaurant, setSelectedRestaurant] = useState("all-restaurants")
  
  const isRTL = locale === 'ar'

  const handleMenuToggle = () => {
    toggleMenuState()
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Mock data - in real app this would come from API
  const brands = [
    { id: "all-brands", name: { en: "All Brands", ar: "جميع العلامات التجارية" } },
    { id: "tasty-bites", name: { en: "Tasty Bites", ar: "لذائذ الطعم" } },
    { id: "pizza-palace", name: { en: "Pizza Palace", ar: "قصر البيتزا" } },
    { id: "burger-kingdom", name: { en: "Burger Kingdom", ar: "مملكة البرجر" } },
  ]

  const restaurants = [
    { id: "all-restaurants", name: { en: "All Restaurants", ar: "جميع المطاعم" }, brandId: "all" },
    { id: "downtown-tasty", name: { en: "Downtown Tasty Bites", ar: "لذائذ الطعم وسط البلد" }, brandId: "tasty-bites" },
    { id: "mall-tasty", name: { en: "Mall Tasty Bites", ar: "لذائذ الطعم المول" }, brandId: "tasty-bites" },
    { id: "pizza-branch1", name: { en: "Pizza Palace - Branch 1", ar: "قصر البيتزا - الفرع 1" }, brandId: "pizza-palace" },
    { id: "burger-main", name: { en: "Burger Kingdom Main", ar: "مملكة البرجر الرئيسي" }, brandId: "burger-kingdom" },
  ]

  // Filter restaurants based on selected brand
  const filteredRestaurants = selectedBrand === "all-brands" 
    ? restaurants 
    : restaurants.filter(r => r.brandId === selectedBrand || r.id === "all-restaurants")
    
  // Helper function to get localized name
  const getLocalizedName = (item: { name: { en: string; ar: string } }) => {
    return locale === 'ar' ? item.name.ar : item.name.en
  }

  return (
    <div className="flex items-center justify-between h-full px-4 lg:px-6">
      {/* Left side - Menu toggle and Context Selectors */}
      <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
        {/* Desktop Menu Toggle */}
        <Button variant="ghost" size="sm" onClick={handleMenuToggle} className="hidden lg:flex p-2" title="Toggle Menu">
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

        {/* Context Selectors - Brand and Restaurant */}
        <div className={`hidden sm:flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
          {/* Brand Selector */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
            <Building2 className="h-4 w-4 text-gray-500" />
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('dashboard.selectBrand')} />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {getLocalizedName(brand)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Restaurant Selector */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
            <Store className="h-4 w-4 text-gray-500" />
            <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('dashboard.selectRestaurant')} />
              </SelectTrigger>
              <SelectContent>
                {filteredRestaurants.map((restaurant) => (
                  <SelectItem key={restaurant.id} value={restaurant.id}>
                    {getLocalizedName(restaurant)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Center - Search (hidden on mobile) */}
      <div className={`hidden md:flex flex-1 max-w-md ${isRTL ? 'mx-4' : 'mx-4'}`}>
        <div className="relative w-full">
          <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            type="search"
            placeholder={t('dashboard.searchPlaceholder')}
            className={`bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
          />
        </div>
      </div>

      {/* Right side - Actions and Profile */}
      <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
        {/* Mobile Search */}
        <Button variant="ghost" size="sm" className="md:hidden p-2">
          <Search className="h-4 w-4" />
        </Button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-4 w-4" />
          <Badge className={`absolute -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white ${isRTL ? '-left-1' : '-right-1'}`}>
            3
          </Badge>
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="sm" className="p-2">
          <Settings className="h-4 w-4" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`flex items-center p-2 ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="User" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className={`hidden lg:flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                <span className="text-sm font-medium text-gray-900 dark:text-white">John Doe</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.administrator')}</span>
              </div>
              <ChevronDown className="hidden lg:block h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
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
            <DropdownMenuItem className="text-red-600">{t('dashboard.signOut')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
