import { Card, CardContent } from '@/components/ui/card';
import { FileDown, FileText } from 'lucide-react';

interface Props {
  totalAmount: number;
  totalOrders: number;
}

export function PaymentSummaryCards({ totalAmount, totalOrders }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Total Collection</p>
          <p className="text-2xl font-bold">
            {totalAmount.toFixed(2)} ({totalOrders})
          </p>
        </CardContent>
      </Card>

      <Card className="flex items-center justify-center">
        <FileText className="h-6 w-6 mr-2" />
        <span className="font-medium">Payment Report with Order Details</span>
      </Card>

      <Card className="flex items-center justify-center">
        <FileDown className="h-6 w-6 mr-2" />
        <span className="font-medium">Download Payment Report</span>
      </Card>
    </div>
  );
}
