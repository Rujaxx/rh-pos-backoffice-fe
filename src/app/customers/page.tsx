'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { PaginationState, SortingState } from '@tanstack/react-table';

import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { TanStackTable } from '@/components/ui/tanstack-table';

import {
  useModal,
  CrudModal,
  ConfirmationModal,
  useConfirmationModal,
} from '@/components/ui/crud-modal';

import {
  getSortOrderForQuery,
  getSortFieldForQuery,
  useCustomersColumns,
} from '@/components/customers/customers-table-columns';

import Layout from '@/components/common/layout';
import { Users } from 'lucide-react';

import { Customer, CustomerQueryParams } from '@/types/customers.type';

import { useCustomers } from '@/services/api/customers/customers.queries';

import {
  useUpdateCustomer,
  useDeleteCustomer,
} from '@/services/api/customers/customers.mutation';

import {
  CustomerFormContent,
  useCustomerForm,
} from '@/components/customers/customers-form';
import { CustomerFormData } from '@/lib/validations/customers.validation';

export default function CustomersPage() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );

  const queryParams = useMemo<CustomerQueryParams>(() => {
    const params: CustomerQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortOrder: getSortOrderForQuery(sorting) || 'desc',
    };

    if (searchTerm.trim()) params.term = searchTerm.trim();

    const sortField = getSortFieldForQuery(sorting);
    if (sortField) params.sortBy = sortField;

    return params;
  }, [pagination, sorting, searchTerm, statusFilter]);

  const { data, isLoading } = useCustomers(queryParams);
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  const customers = data?.data || [];
  const totalCount = data?.meta?.total || 0;

  const {
    isOpen,
    editingItem: editingCustomer,
    openModal,
    closeModal,
  } = useModal<Customer>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  const { form } = useCustomerForm(editingCustomer || null);

  const handleEdit = useCallback(
    (customer: Customer) => {
      openModal(customer);
    },
    [openModal],
  );

  const handleDelete = useCallback(
    (customer: Customer) => {
      openConfirmationModal(
        async () => {
          await deleteCustomerMutation.mutateAsync(customer._id);
        },
        {
          title: t('customer.deleteTitle'),
          description: `${t('customer.deleteMessage')} ${customer.name}?`,
          confirmButtonText: t('common.delete'),
          variant: 'destructive',
        },
      );
    },
    [deleteCustomerMutation, openConfirmationModal, t],
  );

  const columns = useCustomersColumns(handleEdit, handleDelete);

  const handleSubmit = useCallback(
    async (data: CustomerFormData) => {
      if (!editingCustomer) return;

      try {
        await updateCustomerMutation.mutateAsync({
          id: editingCustomer._id,
          data: {
            ...data,
            phoneNumber: editingCustomer.phoneNumber,
          },
        });

        closeModal();
      } catch (err) {
        console.error(err);
      }
    },
    [editingCustomer, updateCustomerMutation, closeModal],
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>{t('customer.title')}</span>
            </h2>
            <p className="text-muted-foreground">{t('customer.subtitle')}</p>
          </div>
        </div>
        {/* TABLE */}
        <Card>
          <CardContent className="p-6">
            <TanStackTable
              data={customers}
              columns={columns}
              totalCount={totalCount}
              isLoading={isLoading}
              searchValue={searchTerm}
              onSearchChange={handleSearch}
              pagination={pagination}
              onPaginationChange={setPagination}
              sorting={sorting}
              onSortingChange={setSorting}
              manualPagination={true}
              manualSorting={true}
              showSearch={true}
              showPagination={true}
              showPageSizeSelector={true}
            />
          </CardContent>
        </Card>

        {/* EDIT MODAL */}
        {editingCustomer && (
          <CrudModal
            isOpen={isOpen}
            onClose={closeModal}
            title={t('customer.edit')}
            form={form}
            onSubmit={handleSubmit}
            loading={updateCustomerMutation.isPending}
          >
            <CustomerFormContent
              form={form}
              editingCustomer={editingCustomer}
            />
          </CrudModal>
        )}

        {/* DELETE CONFIRMATION */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig?.title}
          description={confirmationConfig?.description}
          confirmButtonText={confirmationConfig?.confirmButtonText}
          variant={confirmationConfig?.variant}
          loading={deleteCustomerMutation.isPending}
        />
      </div>
    </Layout>
  );
}
