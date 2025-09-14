"use client"

import React, { useState } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { CrudModal, ConfirmationModal, useModal, useConfirmationModal } from "@/components/ui/crud-modal"
import { BrandFormContent, useBrandForm } from "@/components/brands/brand-form"
import Layout from "@/components/common/layout"
import Image from "next/image"
import { Plus, Edit, Trash2, ExternalLink, Building2 } from "lucide-react"
import { Brand, TableAction } from "@/types/brand"
import { BrandFormData } from "@/lib/validations"
import { toast } from "sonner"

// Mock data - replace with actual API calls
const mockBrands: Brand[] = [
  {
    _id: "1",
    name: { en: "Pizza Palace", ar: "قصر البيتزا" },
    description: { en: "Delicious Italian pizza", ar: "بيتزا إيطالية لذيذة" },
    logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop&crop=center",
    menuLink: "https://menu.pizzapalace.com",
    website: "https://pizzapalace.com",
    isActive: true,
    phone: "+1-234-567-8900",
    fssaiNo: "12345678901234",
    trnOrGstNo: "GST123456789",
    panNo: "ABCDE1234F",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001"
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    _id: "2",
    name: { en: "Burger House", ar: "بيت البرغر" },
    description: { en: "Fresh and juicy burgers", ar: "برغر طازج وشهي" },
    logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop&crop=center",
    menuLink: "https://menu.burgerhouse.com",
    website: "https://burgerhouse.com",
    isActive: false,
    phone: "+1-234-567-8901",
    fssaiNo: "12345678901235",
    trnOrGstNo: "GST123456790",
    panNo: "ABCDE1235F",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      zipCode: "90210"
    },
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18")
  },
  {
    _id: "3",
    name: { en: "Sushi Express", ar: "سوشي إكسبريس" },
    description: { en: "Authentic Japanese sushi", ar: "سوشي ياباني أصيل" },
    logo: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop&crop=center",
    menuLink: "https://menu.sushiexpress.com",
    isActive: true,
    phone: "+1-234-567-8902",
    address: {
      street: "789 Pine Rd",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      zipCode: "94102"
    },
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-05")
  }
]

export default function BrandsPage() {
  const { t } = useTranslation()
  const [brands, setBrands] = useState<Brand[]>(mockBrands)
  const [loading, setLoading] = useState(false)
  
  // Modal hooks
  const { isOpen, editingItem: editingBrand, openModal, closeModal } = useModal<Brand>()
  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal()
  
  // Form hook
  const { form } = useBrandForm(editingBrand)

  const columns = [
    {
      id: "logo",
      label: t('brands.logo'),
      accessor: (brand: Brand) => (
        <div className="flex items-center">
          <div className="relative w-10 h-10">
            <Image
              src={brand.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name.en)}&background=random`}
              alt={brand.name.en}
              width={40}
              height={40}
              className="rounded-md object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name.en)}&background=random`
              }}
            />
          </div>
        </div>
      ),
      width: "80px"
    },
    {
      id: "name",
      label: t('brands.brandName'),
      accessor: (brand: Brand) => (
        <div>
          <div className="font-medium">{brand.name.en}</div>
          {brand.name.ar && (
            <div className="text-sm text-muted-foreground" dir="rtl">
              {brand.name.ar}
            </div>
          )}
        </div>
      ),
      sortable: true
    },
    {
      id: "description",
      label: t('brands.description'),
      accessor: (brand: Brand) => (
        <div className="max-w-xs">
          <div className="truncate">{brand.description.en}</div>
          {brand.description.ar && (
            <div className="text-sm text-muted-foreground truncate" dir="rtl">
              {brand.description.ar}
            </div>
          )}
        </div>
      )
    },
    {
      id: "status",
      label: t('brands.status'),
      accessor: (brand: Brand) => (
        <Badge variant={brand.isActive ? "default" : "secondary"}>
          {brand.isActive 
            ? t('brands.active')
            : t('brands.inactive')
          }
        </Badge>
      ),
      sortable: true
    },
    {
      id: "contact",
      label: t('brands.contact'),
      accessor: (brand: Brand) => (
        <div className="text-sm">
          {brand.phone && <div>{brand.phone}</div>}
          {brand.address.city && brand.address.country && (
            <div className="text-muted-foreground">
              {brand.address.city}, {brand.address.country}
            </div>
          )}
        </div>
      )
    },
    {
      id: "links",
      label: t('brands.links'),
      accessor: (brand: Brand) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(brand.menuLink, '_blank')}
            className="h-8"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            {t('brands.menu')}
          </Button>
          {brand.website && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(brand.website, '_blank')}
              className="h-8"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              {t('brands.site')}
            </Button>
          )}
        </div>
      )
    },
    {
      id: "createdAt",
      label: t('brands.created'),
      accessor: (brand: Brand) => brand.createdAt?.toLocaleDateString() || "N/A",
      sortable: true
    }
  ]

  const actions: TableAction<Brand>[] = [
    {
      label: t('brands.edit'),
      icon: Edit,
      onClick: (brand) => openModal(brand)
    },
    {
      label: t('brands.delete'),
      icon: Trash2,
      variant: "destructive",
      onClick: (brand) => {
        openConfirmationModal(
          () => handleDeleteBrand(brand),
          {
            title: t('brands.deleteBrand'),
            description: t('brands.deleteConfirmation', { brandName: brand.name.en }),
            confirmButtonText: t('brands.deleteBrandButton'),
            variant: "destructive"
          }
        )
      },
      disabled: (brand) => brand.isActive ?? false // Don't allow deleting active brands
    }
  ]

  const handleCreateBrand = async (data: BrandFormData) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newBrand: Brand = {
        _id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setBrands(prev => [newBrand, ...prev])
      toast.success(t('brands.createSuccess'))
    } catch (error) {
      toast.error(t('brands.createError'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBrand = async (data: BrandFormData) => {
    if (!editingBrand) return
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedBrand: Brand = {
        ...editingBrand,
        ...data,
        updatedAt: new Date()
      }
      
      setBrands(prev => prev.map(brand => 
        brand._id === editingBrand._id ? updatedBrand : brand
      ))
      toast.success(t('brands.updateSuccess'))
    } catch (error) {
      toast.error(t('brands.updateError'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBrand = async (brandToDelete: Brand) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBrands(prev => prev.filter(brand => brand._id !== brandToDelete._id))
      toast.success(t('brands.deleteSuccess'))
    } catch {
      toast.error(t('brands.deleteError'))
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (data: BrandFormData) => {
    if (editingBrand) {
      await handleUpdateBrand(data)
    } else {
      await handleCreateBrand(data)
    }
  }

  const getModalTitle = () => {
    return editingBrand 
      ? t('brands.form.editTitle', { brandName: editingBrand.name.en })
      : t('brands.form.createTitle')
  }

  const getModalDescription = () => {
    return editingBrand 
      ? t('brands.form.editDescription')
      : t('brands.form.createDescription')
  }

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              {t('brands.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('brands.subtitle')}
            </p>
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('brands.addNewBrand')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('brands.allBrands')}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={brands}
              columns={columns}
              actions={actions}
              searchable
              searchPlaceholder={t('brands.searchPlaceholder')}
              pagination
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Brand CRUD Modal */}
        <CrudModal<BrandFormData>
          isOpen={isOpen}
          onClose={closeModal}
          title={getModalTitle()}
          description={getModalDescription()}
          form={form}
          onSubmit={handleFormSubmit}
          loading={loading}
          size="xl"
        >
          <BrandFormContent form={form} />
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
  )
}