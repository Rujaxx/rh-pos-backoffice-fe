'use client';

import React from 'react';
import { Vendor } from '@/types/vendors.type';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';

interface VendorDetailsModalProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export const VendorDetailsModal: React.FC<VendorDetailsModalProps> = ({
  vendor,
  isOpen,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();

  if (!vendor) return null;

  const details = [
    { label: t('vendors.details.label.name'), value: vendor.name },
    { label: t('vendors.details.label.phone'), value: vendor.phone || '-' },
    { label: t('vendors.details.label.email'), value: vendor.email || '-' },
    {
      label: t('vendors.details.label.gstNumber'),
      value: vendor.gstNumber || '-',
    },
    {
      label: t('vendors.details.label.panNumber'),
      value: vendor.panNumber || '-',
    },
    {
      label: t('vendors.details.label.paymentType'),
      value: vendor.paymentType,
    },
    {
      label: t('vendors.details.label.creditLimit'),
      value: `₹${vendor.creditLimit?.toLocaleString() || '0'}`,
    },
    {
      label: t('vendors.details.label.openingBalance'),
      value: `₹${vendor.openingBalance?.toLocaleString() || '0'}`,
    },
    {
      label: t('vendors.details.label.balanceType'),
      value:
        vendor.balanceType === 'PAYABLE'
          ? t('vendors.details.value.payable')
          : t('vendors.details.value.receivable'),
    },
    {
      label: t('vendors.details.label.status'),
      value: (
        <Badge variant={vendor.isActive ? 'default' : 'secondary'}>
          {vendor.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {vendor.name}
          </DialogTitle>
          <DialogDescription>
            {t('vendors.details.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Vendor Details */}
          <Table>
            <TableBody>
              {details.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-muted-foreground w-1/3">
                    {detail.label}
                  </TableCell>
                  <TableCell>
                    {typeof detail.value === 'string'
                      ? detail.value
                      : detail.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Current Balance */}
          {vendor.currentBalance !== undefined && (
            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-medium text-muted-foreground">
                {t('vendors.details.label.currentBalance')}
              </span>
              <span
                className={`font-bold ${vendor.currentBalance > 0 && vendor.balanceType === 'PAYABLE' ? 'text-destructive' : ''}`}
              >
                {vendor.currentBalance.toLocaleString()}
                <span className="text-xs text-muted-foreground ml-1">
                  (
                  {vendor.balanceType === 'PAYABLE'
                    ? t('vendors.details.value.payable')
                    : t('vendors.details.value.receivable')}
                  )
                </span>
              </span>
            </div>
          )}

          {/* Audit Information */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">
              {t('vendors.details.auditInfo')}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t('vendors.details.label.created')}
                </p>
                <p className="font-medium">
                  {format(new Date(vendor.createdAt), 'dd MMM yyyy, hh:mm a')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('vendors.details.label.createdBy')}: {vendor.createdBy}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t('vendors.details.label.modified')}
                </p>
                <p className="font-medium">
                  {format(new Date(vendor.updatedAt), 'dd MMM yyyy, hh:mm a')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('vendors.details.label.modifiedBy')}:{' '}
                  {vendor.updatedBy || vendor.createdBy}
                </p>
              </div>
            </div>
          </div>

          {/* Block Information */}
          {vendor.blockedAt && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2 text-destructive">
                {t('vendors.details.blockInfo')}
              </h3>
              <div className="bg-destructive/10 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t('vendors.details.label.blockedAt')}
                    </p>
                    <p className="font-medium">
                      {format(
                        new Date(vendor.blockedAt),
                        'dd MMM yyyy, hh:mm a',
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t('vendors.details.label.blockReason')}
                    </p>
                    <p className="font-medium">
                      {vendor.blockReason ||
                        t('vendors.details.value.noReason')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(vendor);
                onClose();
              }}
            >
              {t('vendors.actions.delete') || 'Delete'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
