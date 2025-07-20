"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Plus, Minus, Eye } from "lucide-react"
import api from "@/lib/axios.js"

export default function ProductCard({ product, onAddToCart, viewMode = "grid" }) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    try {
      setIsLoading(true)
      const response = await api.post("/cart", {
        productId: product?._id,
        quantity,
      })

      if (response?.data?.success) {
        onAddToCart?.()
        setQuantity(1)
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert(error?.response?.data?.message || "Failed to add to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 0)) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const isOutOfStock = (product?.stock || 0) === 0
  const isLowStock = (product?.stock || 0) <= 5 && (product?.stock || 0) > 0

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex">
          <div className="relative h-32 w-32 flex-shrink-0">
            <Image
              src={product?.image || "/placeholder.svg?height=128&width=128"}
              alt={product?.name || "Product"}
              fill
              className="object-cover"
            />
            {isLowStock && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                Only {product?.stock} left
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">Out of Stock</div>
            )}
          </div>

          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{product?.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product?.description}</p>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-2xl font-bold text-blue-600">${(product?.price || 0).toFixed(2)}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{product?.category}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <Link
                  href={`/products/${product?._id}`}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Link>

                {!isOutOfStock && (
                  <>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={decrementQuantity}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-medium w-8 text-center">{quantity}</span>
                      <button
                        onClick={incrementQuantity}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        disabled={quantity >= (product?.stock || 0)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={isLoading}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>{isLoading ? "Adding..." : "Add to Cart"}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={product?.image || "/placeholder.svg?height=200&width=200"}
          alt={product?.name || "Product"}
          fill
          className="object-cover"
        />
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
            Only {product?.stock} left
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">Out of Stock</div>
        )}
        <Link
          href={`/products/${product?._id}`}
          className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100"
        >
          <div className="bg-white rounded-full p-2">
            <Eye className="h-5 w-5 text-gray-700" />
          </div>
        </Link>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{product?.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product?.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">${(product?.price || 0).toFixed(2)}</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{product?.category}</span>
        </div>

        {!isOutOfStock && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={decrementQuantity}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-medium">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                disabled={quantity >= (product?.stock || 0)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{isLoading ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  )
}
