import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useCart } from "./context/Cart";
const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Shop = lazy(() => import("./pages/Shop"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./components/NotFound"));
const Logout = lazy(() => import("./pages/Logout"));
const UserProfile = lazy(() => import("./pages/GetUserById"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const UpdateProduct = lazy(() => import("./pages/Product/Update_product"));
const CreateProduct = lazy(() => import("./pages/Product/Create_product"));
const AdminDashboard = lazy(() => import("./pages/dasboard/Admin"));
const Create_order = lazy(() => import("./pages/order/Order_Create"));
const Cart = lazy(() => import("./pages/cart/Cart_page"));
const Dashboard = lazy(() => import("./pages/dasboard/User"));
const SearchPage = lazy(() => import("./pages/Search_Page"));
const AllOrders = lazy(() => import("./pages/order/All_Orders"));
const OrdersPage = lazy(() => import("./pages/order/OrderPageUSer"));

const App = () => {



  const { cartItems } = useCart()
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
          <Route path="/products/all" element={<Layout><Shop /></Layout>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Layout><SearchPage /></Layout>} />

          {/* user routes */}
          <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
          <Route path="/account/profile" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />
          <Route path="/account/change-password" element={<ProtectedRoute><Layout><ChangePassword /></Layout></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Layout><Create_order cartItems={cartItems} /></Layout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Layout><Cart /></Layout></ProtectedRoute>} />

          {/* admin routes */}
          <Route path="/product/create" element={<ProtectedRoute><Layout><CreateProduct /></Layout></ProtectedRoute>} />
          <Route path="/product/update/:id" element={<ProtectedRoute><Layout><UpdateProduct /></Layout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
          <Route path="/admin/dashboard/orders" element={<ProtectedRoute><Layout><AllOrders /></Layout></ProtectedRoute>} />

          {/* 404 catch-all — must be LAST */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
