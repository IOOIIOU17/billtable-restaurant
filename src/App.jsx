import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import MenuUpload from './screens/MenuUpload';
import OrderDashboard from './screens/OrderDashboard';
import OrderDetails from './screens/OrderDetails';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<MenuUpload />} />
        <Route path="/orders" element={<OrderDashboard />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
