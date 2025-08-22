import React, { Suspense, lazy, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import Layout from "./components/Layout";;
const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Shop = lazy(() => import("./pages/Shop"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./components/NotFound"));
const Logout = lazy(() => import("./pages/Logout"));
const UserProfile = lazy(() => import("./pages/GetUserById"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));

const App = () => {

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout><Home /> </Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/products/all" element={<Layout><Shop /></Layout>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="account/profile" element={<UserProfile />} />
          <Route path="account/change-password" element={<ChangePassword />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
