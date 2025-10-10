import React from 'react';
import { OrderHistoryTable } from '@/components/trading/OrderHistoryTable';

const OrderHistory = () => {
	return (
		<div>
			<h1>Order History</h1>
			<OrderHistoryTable />
		</div>
	);
};

export default OrderHistory;
