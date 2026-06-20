import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import Layout from "./components/Layout";
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
          <Route path="/logout" element={<Logout />} />
          <Route path="/account/profile" element={<Layout><UserProfile /></Layout>} />
          <Route path="/account/change-password" element={<Layout><ChangePassword /></Layout>} />
          <Route path="/checkout" element={<Layout><Create_order cartItems={cartItems} /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/my-orders" element={<Layout><OrdersPage /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />

          {/* admin routes */}
          <Route path="product/create" element={<Layout><CreateProduct /></Layout>} />
          <Route path="product/update/:id" element={<Layout><UpdateProduct /></Layout>} />
          <Route path="admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="admin/dashboard/orders" element={<Layout><AllOrders /></Layout>} />

          {/* 404 catch-all — must be LAST */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
