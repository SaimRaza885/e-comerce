import { useState, useEffect } from "react";
import api from "../api/axios";

export const useProducts = (params = {}) => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/product/all", { params });
            if (res.data.success) {
                setProducts(res.data.data.products);
                setPagination(res.data.data.pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [JSON.stringify(params)]);

    return { products, pagination, loading, error, refetch: fetchProducts };
};
