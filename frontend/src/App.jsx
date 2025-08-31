import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import Layout from "./components/Layout";
import { useCart } from "./context/Cart";
import ProtectedRoute from "./components/ProtectedRoute"
import { useAuth } from "./context/AuthContext";
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
const ProductImagesUpdate = lazy(() => import("./pages/Product/Update_product_images"));
const Create_order = lazy(() => import("./pages/order/Order_Create"));
const Cart = lazy(() => import("./pages/cart/Cart.jsx"));
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
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFound />} />

          {/* user routes */}
          <Route path="/logout" element={

            <Logout />

          } />
          <Route path="account/profile" element={

            <UserProfile />

          } />
          <Route path="account/change-password" element={

            <ChangePassword />

          } />
          <Route path="/checkout" element={

            <Create_order cartItems={cartItems} />

          } />
          <Route path="/dashboard" element={

            <Dashboard />

          } />
          <Route path="/dashboard/my-orders" element={

            <OrdersPage />

          } />
          <Route path="/cart" element={

            <Cart />

          } />

          {/* admin routes */}
          <Route path="product/create" element={
            <CreateProduct />

          } />
          <Route path="product/update/:id" element={
            <UpdateProduct />

          } />
          <Route path="admin/dashboard" element={
            <AdminDashboard />

          } />
          <Route path="product/images/update/:id" element={

            <ProductImagesUpdate />

          } />
          <Route path="admin/dashboard/orders" element={
            <AllOrders />

          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
