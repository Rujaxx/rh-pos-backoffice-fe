'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import {
  useModal,
  CrudModal,
  ConfirmationModal,
  useConfirmationModal,
} from '@/components/ui/crud-modal';
import {
  UserFormContent,
  useUserForm,
} from '@/components/restaurant/users/user-form';
import Layout from '@/components/common/layout';
import Image from 'next/image';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Building2,
} from 'lucide-react';
import { User, UserRole, Restaurant, UserTableAction } from '@/types/user.type';
import { UserFormData } from '@/lib/validations/user.validation';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';

// Mock Data - Replace with actual API calls
const mockRoles: UserRole[] = [
  {
    _id: '1',
    name: 'Manager',
    permissions: ['read', 'write', 'delete'],
  },
  {
    _id: '2',
    name: 'Cashier',
    permissions: ['read', 'write'],
  },
  {
    _id: '3',
    name: 'Kitchen Staff',
    permissions: ['read'],
  },
  {
    _id: '4',
    name: 'Waiter',
    permissions: ['read', 'write'],
  },
];

const mockRestaurants: Restaurant[] = [
  {
    _id: 'r1',
    name: {
      en: 'Downtown Branch',
      ar: 'فرع وسط المدينة',
    },
    location: 'Downtown',
  },
  {
    _id: 'r2',
    name: {
      en: 'Mall Branch',
      ar: 'فرع المركز التجاري',
    },
    location: 'Shopping Mall',
  },
  {
    _id: 'r3',
    name: {
      en: 'Airport Branch',
      ar: 'فرع المطار',
    },
    location: 'Airport Terminal',
  },
];

const mockUsers: User[] = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    role: mockRoles[0],
    designation: 'Restaurant Manager',
    restaurants: ['r1', 'r2'],
    isActive: true,
    profileImage: 'https://placehold.co/40x40/aqua/black?font=robot&text=JD',
    lastLogin: new Date('2024-01-15'),
    createdAt: new Date('2024-01-01'),
  },
  {
    _id: '2',
    firstName: 'Sarah',
    lastName: 'Smith',
    username: 'sarahsmith',
    email: 'sarah.smith@example.com',
    phone: '+1234567891',
    role: mockRoles[1],
    designation: 'Lead Cashier',
    restaurants: ['r1'],
    isActive: true,
    lastLogin: new Date('2024-01-14'),
    createdAt: new Date('2024-01-05'),
  },
  {
    _id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    username: 'mikejohnson',
    email: 'mike.johnson@example.com',
    phone: '+1234567892',
    role: mockRoles[2],
    designation: 'Head Chef',
    restaurants: ['r2', 'r3'],
    isActive: false,
    lastLogin: new Date('2024-01-10'),
    createdAt: new Date('2024-01-03'),
  },
  {
    _id: '4',
    firstName: 'Emma',
    lastName: 'Wilson',
    username: 'emmawilson',
    email: 'emma.wilson@example.com',
    phone: '+1234567893',
    role: mockRoles[3],
    designation: 'Senior Waiter',
    restaurants: ['r1', 'r2', 'r3'],
    isActive: true,
    lastLogin: new Date('2024-01-16'),
    createdAt: new Date('2024-01-08'),
  },
];

function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const locale = useIntl().locale as 'en' | 'ar';

  // Modal hooks
  const { isOpen, editingItem, openModal, closeModal } = useModal<User>();
  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form, isEditing } = useUserForm(
    editingItem,
    mockRoles,
    mockRestaurants
  );

  // Helper function to get restaurant names from IDs
  // const getRestaurantNames = (restaurantIds: string[]): string => {
  //   return restaurantIds
  //     .map((id) => mockRestaurants.find((r) => r._id === id)?.name)
  //     .filter(Boolean)
  //     .join(', ');
  // };

  // Table columns configuration
  const columns = [
    {
      id: 'user',
      label: t('users.table.user'),
      sortable: true,
      accessor: (user: User) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-sm">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              @{user.username}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      label: t('users.table.role'),
      sortable: true,
      accessor: (user: User) => (
        <div>
          <div className="font-medium text-sm">{user.role.name}</div>
          <div className="text-xs text-muted-foreground">
            {user.designation}
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      label: t('users.table.contact'),
      accessor: (user: User) => (
        <div className="text-sm">
          <div>{user.email}</div>
          {user.phone && (
            <div className="text-xs text-muted-foreground">{user.phone}</div>
          )}
        </div>
      ),
    },
    {
      id: 'restaurants',
      label: t('users.table.restaurants'),
      accessor: (user: User) => (
        <div className="flex flex-wrap gap-1">
          {user.restaurants.slice(0, 2).map((restaurantId) => {
            const restaurant = mockRestaurants.find(
              (r) => r._id === restaurantId
            );
            return restaurant ? (
              <Badge key={restaurantId} variant="outline" className="text-xs">
                {restaurant.name[locale]}
              </Badge>
            ) : null;
          })}
          {user.restaurants.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{user.restaurants.length - 2} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: 'isActive',
      label: t('users.table.status'),
      sortable: true,
      accessor: (user: User) => (
        <Badge variant={user.isActive ? 'default' : 'secondary'}>
          {user.isActive ? (
            <>
              <UserCheck className="w-3 h-3 mr-1" />
              {t('common.active')}
            </>
          ) : (
            <>
              <UserX className="w-3 h-3 mr-1" />
              {t('common.inactive')}
            </>
          )}
        </Badge>
      ),
    },
    {
      id: 'lastLogin',
      label: t('users.table.lastLogin'),
      sortable: true,
      accessor: (user: User) => (
        <div className="text-sm text-muted-foreground">
          {user.lastLogin
            ? new Date(user.lastLogin).toLocaleDateString()
            : 'Never'}
        </div>
      ),
    },
  ];

  // Table actions configuration
  const actions: UserTableAction<User>[] = [
    {
      label: t('common.edit'),
      icon: Edit,
      onClick: (user) => openModal(user),
      variant: 'default',
    },
    {
      label: t('common.delete'),
      icon: Trash2,
      onClick: (user) => {
        openConfirmationModal(
          async () => {
            await handleDeleteUser(user._id!);
          },
          {
            title: t('users.delete.title'),
            description: t('users.delete.description', {
              name: `${user.firstName} ${user.lastName}`,
            }),
            confirmButtonText: t('common.delete'),
            variant: 'destructive',
          }
        );
      },
      variant: 'destructive',
      disabled: (user) => user._id === '1', // Prevent deleting admin user
    },
  ];

  // CRUD Handlers
  const handleCreateUser = async (data: UserFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const selectedRole = mockRoles.find((role) => role._id === data.role)!;
      const newUser: User = {
        _id: Date.now().toString(),
        ...data,
        role: selectedRole,
        createdAt: new Date(),
        lastLogin: undefined,
      };

      setUsers((prev) => [newUser, ...prev]);
      toast.success(t('users.create.success'));
    } catch (error) {
      console.error('Create user error:', error);
      toast.error(t('users.create.error'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!editingItem?._id) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const selectedRole = mockRoles.find((role) => role._id === data.role)!;
      const updatedUser: User = {
        ...editingItem,
        ...data,
        role: selectedRole,
        updatedAt: new Date(),
      };

      setUsers((prev) =>
        prev.map((user) => (user._id === editingItem._id ? updatedUser : user))
      );
      toast.success(t('users.update.success'));
    } catch (error) {
      console.error('Update user error:', error);
      toast.error(t('users.update.error'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers((prev) => prev.filter((user) => user._id !== userId));
      toast.success(t('users.delete.success'));
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error(t('users.delete.error'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UserFormData) => {
    if (isEditing) {
      await handleUpdateUser(data);
    } else {
      await handleCreateUser(data);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              {t('users.title')}
            </h1>
            <p className="text-muted-foreground">{t('users.subtitle')}</p>
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('users.addUser')}
          </Button>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent>
            <DataTable
              data={users}
              columns={columns}
              actions={actions}
              searchable
              searchPlaceholder={t('users.searchPlaceholder')}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* User Form Modal */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={isEditing ? t('users.edit.title') : t('users.create.title')}
          description={
            isEditing
              ? t('users.edit.description')
              : t('users.create.description')
          }
          form={form}
          onSubmit={handleSubmit}
          loading={loading}
          size="xl">
          <UserFormContent
            form={form}
            roles={mockRoles}
            restaurants={mockRestaurants}
          />
        </CrudModal>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig.title}
          description={confirmationConfig.description}
          loading={loading}
          confirmButtonText={confirmationConfig.confirmButtonText}
          cancelButtonText={t('common.cancel')}
          variant={confirmationConfig.variant}
        />
      </div>
    </Layout>
  );
}

export default UsersPage;
