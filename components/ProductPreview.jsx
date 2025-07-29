"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function ProductPreview() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPreviewProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/products?limit=5&sortBy=createdAt&sortOrder=desc"
      );
      const data = await res.json();

      if (data?.success && Array.isArray(data?.data?.products)) {
        setProducts(data.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to load preview products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviewProducts();
  }, []);

  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-blue-600  hover:underline text-sm"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </section>
  );
}
