import React from 'react';
import { OrderHistoryTable } from '@/components/trading/OrderHistoryTable';

const OrderHistory = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Order History</h1>
      <OrderHistoryTable orders={[]} />
    </div>
  );
};

export default OrderHistory;
