'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import {
  CrudModal,
  ConfirmationModal,
  useModal,
  useConfirmationModal,
} from '@/components/ui/crud-modal';
import {
  RestaurantFormContent,
  useRestaurantForm,
} from '@/components/restaurants/restaurant-form';
import Layout from '@/components/common/layout';
import Image from 'next/image';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { Restaurant, TableAction } from '@/types/restaurant';
import { RestaurantFormData } from '@/lib/validations/restaurant.validation';
import { toast } from 'sonner';
import { useI18n } from '@/providers/i18n-provider';

const mockRestaurants: Restaurant[] = [
  {
    _id: '101',
    name: { en: 'Pizza Palace - Downtown', ar: 'قصر البيتزا - وسط المدينة' },
    description: {
      en: 'The flagship restaurant of Pizza Palace.',
      ar: 'المطعم الرئيسي لقصر البيتزا.',
    },
    brandId: '1',
    brandName: {
      en: 'Pizza Palace',
      ar: 'قصر البيتزا',
    },
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop&crop=center',
    isActive: true,
    address: {
      street: '456 Main Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
      latitude: 40.7128,
      longitude: -74.006,
    },
    timezone: 'America/New_York',
    startDayTime: '9',
    endDayTime: '23',
    nextResetBillFreq: 'daily',
    nextResetBillDate: '17-09-2025',
    notificationPhone: ['+11234567890'],
    notificationEmails: ['ny-manager@pizzapalace.com'],
    restoCode: 'PP-NYC',
    posLogoutOnClose: true,
    isFeedBackActive: true,
    trnOrGstNo: 'GST123456789',
    customQRcode: ['qr-code-1'],
    deductFromInventory: true,
    multiplePriceSetting: false,
    tableReservation: true,
    autoUpdatePos: true,
    sendReports: { email: true, whatsapp: true, sms: false },
    allowMultipleTax: false,
    generateOrderTypeWiseOrderNo: true,
    smsAndWhatsappSelection: 'both',
    whatsAppChannel: 'whatsapp-channel-1',
    paymentLinkSettings: { onWhatsapp: true, onSms: false },
    eBillSettings: { onEmail: true, onWhatsapp: false, onSms: false },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    inventoryWarehouse: '',
    createdBy: '',
    updatedBy: '',
  },
  {
    _id: '102',
    name: { en: 'Burger House - Central', ar: 'بيت البرغر - المركزي' },
    description: {
      en: 'Central location with a spacious dine-in area.',
      ar: 'موقع مركزي مع منطقة تناول طعام واسعة.',
    },
    brandId: '2',
    brandName: {
      en: 'Burger House',
      ar: 'بيت البرجر - المركزية',
    },
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop&crop=center',
    isActive: false,
    address: {
      street: '789 Central Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      zipCode: '90001',
      latitude: 34.0522,
      longitude: -118.2437,
    },
    timezone: 'America/Los_Angeles',
    startDayTime: '10',
    endDayTime: '22',
    nextResetBillFreq: 'yearly',
    nextResetBillDate: '17-09-2026',
    notificationPhone: ['+11987654321'],
    notificationEmails: ['la-manager@burgerhouse.com'],
    restoCode: 'BH-LAX',
    posLogoutOnClose: false,
    isFeedBackActive: false,
    trnOrGstNo: 'GST123456790',
    customQRcode: ['qr-code-2'],
    deductFromInventory: true,
    multiplePriceSetting: true,
    tableReservation: false,
    autoUpdatePos: false,
    sendReports: { email: true, whatsapp: false, sms: false },
    allowMultipleTax: true,
    generateOrderTypeWiseOrderNo: false,
    smsAndWhatsappSelection: 'sms',
    whatsAppChannel: 'whatsapp-channel-2',
    paymentLinkSettings: { onWhatsapp: false, onSms: true },
    eBillSettings: { onEmail: false, onWhatsapp: false, onSms: true },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    inventoryWarehouse: '',
    createdBy: '',
    updatedBy: '',
  },
];

export default function RestaurantsPage() {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [loading, setLoading] = useState(false);

  // Modal hooks
  const {
    isOpen,
    editingItem: editingRestaurant,
    openModal,
    closeModal,
  } = useModal<Restaurant>();
  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form } = useRestaurantForm(editingRestaurant);

  const columns = [
    {
      id: 'logo',
      label: t('restaurants.logo'),
      accessor: (restaurant: Restaurant) => (
        <div className="flex items-center">
          <div className="relative w-10 h-10">
            <Image
              src={
                restaurant.logo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name.en)}&background=random`
              }
              alt={restaurant.name.en}
              width={40}
              height={40}
              className="rounded-md object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name.en)}&background=random`;
              }}
            />
          </div>
        </div>
      ),
      width: '80px',
    },
    {
      id: 'name',
      label: t('restaurants.name'),
      accessor: (restaurant: Restaurant) => (
        <div>
          <div className="font-medium">
            {restaurant.name[locale] || restaurant.name.en}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'brandName',
      label: t('restaurants.brand'),
      accessor: (restaurant: Restaurant) => (
        <Badge variant="outline">
          {restaurant.brandName[locale] || restaurant.brandName.en}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: 'restoCode',
      label: t('restaurants.restoCode'),
      accessor: (restaurant: Restaurant) => (
        <div className="font-medium">{restaurant.restoCode}</div>
      ),
      sortable: true,
    },
    {
      id: 'nextResetBill',
      label: t('restaurants.nextResetBill'),
      accessor: (restaurant: Restaurant) => (
        <div className="font-medium">
          {t(`restaurants.resetBill.${restaurant.nextResetBillFreq}`)}
        </div>
      ),
      sortable: true,
    },
    {
      id: 'status',
      label: t('restaurants.status'),
      accessor: (restaurant: Restaurant) => (
        <Badge variant={restaurant.isActive ? 'default' : 'secondary'}>
          {restaurant.isActive
            ? t('restaurants.active')
            : t('restaurants.inactive')}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: 'address',
      label: t('restaurants.address'),
      accessor: (restaurant: Restaurant) => (
        <div className="text-sm">
          <div>{restaurant.address.street}</div>
          <div className="text-muted-foreground">
            {restaurant.address.city}, {restaurant.address.country}
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      label: t('restaurants.contact'),
      accessor: (restaurant: Restaurant) => (
        <div className="text-sm">
          <div>{restaurant.notificationPhone[0] || 'N/A'}</div>
          <div className="text-muted-foreground">
            {restaurant.notificationEmails[0] || 'N/A'}
          </div>
        </div>
      ),
    },
  ];

  const actions: TableAction<Restaurant>[] = [
    {
      label: t('restaurants.edit'),
      icon: Edit,
      onClick: (restaurant) => openModal(restaurant),
    },
    {
      label: t('restaurants.delete'),
      icon: Trash2,
      variant: 'destructive',
      onClick: (restaurant) => {
        openConfirmationModal(() => handleDeleteRestaurant(restaurant), {
          title: t('restaurants.deleteRestaurant'),
          description: t('restaurants.deleteConfirmation', {
            restaurantName: restaurant.name.en,
          }),
          confirmButtonText: t('restaurants.deleteRestaurantButton'),
          variant: 'destructive',
        });
      },
      disabled: (restaurant) => restaurant.isActive ?? false,
    },
  ];

  const handleCreateRestaurant = async (data: RestaurantFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find the brand or use a default value
      const foundBrand = mockRestaurants.find(
        (b) => b.brandId === data.brandId
      );
      const brandName = foundBrand?.brandName || {
        en: 'Unknown Brand',
        ar: 'علامة تجارية غير معروفة',
      };

      const newRestaurant: Restaurant = {
        _id: Date.now().toString(),
        ...data,
        brandName,
        createdAt: new Date(),
        updatedAt: new Date(),
        inventoryWarehouse: '',
        createdBy: '',
        updatedBy: '',
      };

      setRestaurants((prev) => [newRestaurant, ...prev]);
      toast.success(t('restaurants.createSuccess'));
      closeModal();
    } catch (error) {
      toast.error(t('restaurants.createError'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRestaurant = async (data: RestaurantFormData) => {
    if (!editingRestaurant) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedRestaurant: Restaurant = {
        ...editingRestaurant,
        ...data,
        updatedAt: new Date(),
      };

      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant._id === editingRestaurant._id
            ? updatedRestaurant
            : restaurant
        )
      );
      toast.success(t('restaurants.updateSuccess'));
      closeModal();
    } catch (error) {
      toast.error(t('restaurants.updateError'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async (restaurantToDelete: Restaurant) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRestaurants((prev) =>
        prev.filter((restaurant) => restaurant._id !== restaurantToDelete._id)
      );
      toast.success(t('restaurants.deleteSuccess'));
      closeConfirmationModal();
    } catch {
      toast.error(t('restaurants.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: RestaurantFormData) => {
    if (editingRestaurant) {
      await handleUpdateRestaurant(data);
    } else {
      await handleCreateRestaurant(data);
    }
  };

  const getModalTitle = () => {
    return editingRestaurant
      ? t('restaurants.form.editTitle', {
          restaurantName: editingRestaurant.name.en,
        })
      : t('restaurants.form.createTitle');
  };

  const getModalDescription = () => {
    return editingRestaurant
      ? t('restaurants.form.editDescription')
      : t('restaurants.form.createDescription');
  };

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              {t('restaurants.title')}
            </h1>
            <p className="text-muted-foreground">{t('restaurants.subtitle')}</p>
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('restaurants.addNewRestaurant')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('restaurants.allRestaurants')}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={restaurants}
              columns={columns}
              actions={actions}
              searchable
              searchPlaceholder={t('restaurants.searchPlaceholder')}
              pagination
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Restaurant CRUD Modal */}
        <CrudModal<RestaurantFormData>
          isOpen={isOpen}
          onClose={closeModal}
          title={getModalTitle()}
          description={getModalDescription()}
          form={form}
          onSubmit={handleFormSubmit}
          loading={loading}
          size="xl">
          <RestaurantFormContent form={form} />
        </CrudModal>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig.title}
          description={confirmationConfig.description}
          loading={loading}
          confirmButtonText={confirmationConfig.confirmButtonText}
          variant={confirmationConfig.variant}
        />
      </div>
    </Layout>
  );
}
