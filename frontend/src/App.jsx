import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Shop = lazy(() => import("./pages/Shop"));
const NotFound = lazy(() => import("./components/NotFound"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout><Home /> </Layout> } />
          <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/products/all" element={<Layout><Shop /></Layout>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
