import { Suspense } from 'react';
import PaymentSettlementContent from './payment-settlement';

export default function PaymentSettlementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSettlementContent />
    </Suspense>
  );
}
