'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useUpdateRestaurant } from '@/services/api/restaurants/restaurants.mutations';
import { Restaurant } from '@/types/restaurant';
import { useDigitalOrderSettingsColumns } from '@/components/online-orders/digital-order-settings-columns';
import { RestaurantFormData as RestaurantPayload } from '@/types/restaurant';
import { RestaurantFormData } from '@/lib/validations/restaurant.validation';

import {
  DigitalOrderSettingsFormContent,
  useDigitalOrderSettingsForm,
} from '@/components/online-orders/digital-order-settings-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useActiveBrands } from '@/services/api/brands/brands.queries';
import { CrudModal, useModal } from '@/components/ui/crud-modal';
import { toast } from 'sonner';
import { TanStackTable } from '@/components/ui/tanstack-table';
import Layout from '@/components/common/layout';

export default function DigitalOrderSettingsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('all');

  const { data: restaurantsResponse, isLoading } = useRestaurants();

  const { data: brandsResponse } = useActiveBrands();
  const brands = brandsResponse?.data || [];

  const updateRestaurantMutation = useUpdateRestaurant();

  const {
    isOpen,
    editingItem: editingRestaurant,
    openModal,
    closeModal,
  } = useModal<Restaurant>();

  const handleEdit = useCallback(
    (restaurant: Restaurant) => {
      openModal(restaurant);
    },
    [openModal],
  );

  const columns = useDigitalOrderSettingsColumns(handleEdit);

  const { form } = useDigitalOrderSettingsForm(editingRestaurant);

  const handleSubmit = useCallback(
    async (data: RestaurantFormData) => {
      try {
        if (!editingRestaurant?._id) return;

        const payload = data as unknown as RestaurantPayload;

        await updateRestaurantMutation.mutateAsync({
          id: editingRestaurant._id,
          data: payload,
        });

        closeModal();
      } catch (error) {
        console.error('Failed to update settings:', error);
      }
    },
    [editingRestaurant, updateRestaurantMutation, closeModal],
  );

  const isFormLoading = updateRestaurantMutation.isPending;

  return (
    <Layout>
      <div className="flex flex-col h-full space-y-6 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {t('navigation.digitalOrderSettings') || 'Digital Order Settings'}
            </h2>
            <p className="text-muted-foreground">
              {t('restaurant.managementDescription') ||
                'Manage digital ordering configurations for your restaurants.'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {t('digitalOrders.managementTitle') || 'Digital Order Settings'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    t('common.searchPlaceholder') || 'Search restaurants...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue
                    placeholder={t('common.filterByBrand') || 'Filter by Brand'}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t('common.allBrands') || 'All Brands'}
                  </SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand._id} value={brand._id}>
                      {brand.name.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* DATA TABLE */}
            <TanStackTable
              columns={columns}
              data={restaurantsResponse?.data || []}
            />
          </CardContent>
        </Card>

        {/* EDIT MODAL */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={
            t('navigation.digitalOrderSettings') || 'Digital Order Settings'
          }
          size="xl"
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          submitButtonText={t('common.save') || 'Save Changes'}
        >
          <DigitalOrderSettingsFormContent
            form={form}
            editingRestaurant={editingRestaurant}
          />
        </CrudModal>
      </div>
    </Layout>
  );
}
