import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import MenuUpload from './screens/MenuUpload';
import OrderDashboard from './screens/OrderDashboard';
import OrderDetails from './screens/OrderDetails';
import OrderStatus from './screens/OrderStatus';
import RefundPanel from './screens/RefundPanel';
import OrderHistory from './screens/OrderHistory';
import RestaurantSettings from './screens/RestaurantSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<MenuUpload />} />
        <Route path="/orders" element={<OrderDashboard />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/orders/:orderId/status" element={<OrderStatus />} />
        <Route path="/orders/:orderId/refund" element={<RefundPanel />} />
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/settings" element={<RestaurantSettings />} />
      </Routes>
    </BrowserRouter>
  );
}
