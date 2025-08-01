// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   ArrowLeft,
//   ShoppingCart,
//   Plus,
//   Minus,
//   Star,
//   Package,
//   Shield,
//   Truck,
// } from "lucide-react";
// import type { Product } from "@/lib/types";
// import api from "@/lib/axios";

// export default function ProductDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     if (params.id) {
//       fetchProduct(params.id as string);
//     }
//   }, [params.id]);

//   const fetchProduct = async (productId: string) => {
//     try {
//       const response = await api.get(`/products/${productId}`);
//       if (response.data.success) {
//         setProduct(response.data.data);
//         // Fetch related products from the same category
//         fetchRelatedProducts(response.data.data.category, productId);
//       }
//     } catch (error) {
//       console.error("Error fetching product:", error);
//       router.push("/products");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchRelatedProducts = async (
//     category: string,
//     currentProductId: string
//   ) => {
//     try {
//       const response = await api.get("/products");
//       if (response.data.success) {
//         const filtered = response.data.data
//           .filter(
//             (p: Product) =>
//               p.category === category && p._id !== currentProductId
//           )
//           .slice(0, 4);
//         setRelatedProducts(filtered);
//       }
//     } catch (error) {
//       console.error("Error fetching related products:", error);
//     }
//   };

//   const handleAddToCart = async () => {
//     try {
//       setIsAddingToCart(true);
//       const response = await api.post("/cart", {
//         productId: product?._id,
//         quantity,
//       });

//       if (response.data.success) {
//         alert("Product added to cart successfully!");
//         setQuantity(1);
//       }
//     } catch (error: any) {
//       console.error("Error adding to cart:", error);
//       alert(error.response?.data?.message || "Failed to add to cart");
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   const incrementQuantity = () => {
//     if (product && quantity < product.stock) {
//       setQuantity(quantity + 1);
//     }
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(quantity - 1);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="animate-pulse">
//             <div className="h-6 bg-gray-300 rounded w-32 mb-8"></div>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <div className="h-96 bg-gray-300 rounded-lg"></div>
//               <div className="space-y-4">
//                 <div className="h-8 bg-gray-300 rounded"></div>
//                 <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                 <div className="h-6 bg-gray-300 rounded w-1/2"></div>
//                 <div className="h-20 bg-gray-300 rounded"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             Product Not Found
//           </h1>
//           <button
//             onClick={() => router.push("/products")}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Back to Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Back Button */}
//         <button
//           onClick={() => router.back()}
//           className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
//         >
//           <ArrowLeft className="h-5 w-5" />
//           <span>Back</span>
//         </button>

//         {/* Product Details */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
//             {/* Product Image */}
//             <div className="relative">
//               <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
//                 <Image
//                   src={product.image || "/placeholder.svg?height=500&width=500"}
//                   alt={product.name}
//                   fill
//                   className="object-cover"
//                   priority
//                 />
//                 {product.stock <= 5 && product.stock > 0 && (
//                   <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                     Only {product.stock} left
//                   </div>
//                 )}
//                 {product.stock === 0 && (
//                   <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                     Out of Stock
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Product Info */}
//             <div className="space-y-6">
//               <div>
//                 <div className="flex items-center space-x-2 mb-2">
//                   <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                     {product.category}
//                   </span>
//                 </div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-4">
//                   {product.name}
//                 </h1>
//                 <div className="flex items-center space-x-2 mb-4">
//                   <div className="flex text-yellow-400">
//                     {[...Array(5)]?.map((_, i) => (
//                       <Star key={i} className="h-5 w-5 fill-current" />
//                     ))}
//                   </div>
//                   <span className="text-gray-600">(4.8) • 127 reviews</span>
//                 </div>
//                 <p className="text-4xl font-bold text-blue-600 mb-6">
//                   ${product.price.toFixed(2)}
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   Description
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed">
//                   {product.description}
//                 </p>
//               </div>

//               {/* Features */}
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="text-center p-4 bg-gray-50 rounded-lg">
//                   <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
//                   <p className="text-sm font-medium text-gray-900">
//                     Lab Tested
//                   </p>
//                 </div>
//                 <div className="text-center p-4 bg-gray-50 rounded-lg">
//                   <Package className="h-6 w-6 text-blue-500 mx-auto mb-2" />
//                   <p className="text-sm font-medium text-gray-900">
//                     Premium Quality
//                   </p>
//                 </div>
//                 <div className="text-center p-4 bg-gray-50 rounded-lg">
//                   <Truck className="h-6 w-6 text-purple-500 mx-auto mb-2" />
//                   <p className="text-sm font-medium text-gray-900">
//                     Fast Shipping
//                   </p>
//                 </div>
//               </div>

//               {/* Quantity and Add to Cart */}
//               {product.stock > 0 && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Quantity
//                     </label>
//                     <div className="flex items-center space-x-4">
//                       <div className="flex items-center border border-gray-300 rounded-lg">
//                         <button
//                           onClick={decrementQuantity}
//                           className="p-2 hover:bg-gray-100 transition-colors"
//                           disabled={quantity <= 1}
//                         >
//                           <Minus className="h-4 w-4" />
//                         </button>
//                         <span className="px-4 py-2 font-medium">
//                           {quantity}
//                         </span>
//                         <button
//                           onClick={incrementQuantity}
//                           className="p-2 hover:bg-gray-100 transition-colors"
//                           disabled={quantity >= product.stock}
//                         >
//                           <Plus className="h-4 w-4" />
//                         </button>
//                       </div>
//                       <span className="text-sm text-gray-500">
//                         {product.stock} available
//                       </span>
//                     </div>
//                   </div>

//                   <button
//                     onClick={handleAddToCart}
//                     disabled={isAddingToCart}
//                     className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <ShoppingCart className="h-5 w-5" />
//                     <span>
//                       {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
//                     </span>
//                   </button>
//                 </div>
//               )}

//               {product.stock === 0 && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                   <p className="text-red-800 font-medium">
//                     This product is currently out of stock.
//                   </p>
//                   <p className="text-red-600 text-sm mt-1">
//                     We'll notify you when it's back in stock.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Related Products */}
//         {relatedProducts?.length > 0 && (
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">
//               Related Products
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {relatedProducts?.map((relatedProduct) => (
//                 <div
//                   key={relatedProduct._id}
//                   onClick={() => router.push(`/products/${relatedProduct._id}`)}
//                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
//                 >
//                   <div className="relative h-48">
//                     <Image
//                       src={
//                         relatedProduct.image ||
//                         "/placeholder.svg?height=200&width=200"
//                       }
//                       alt={relatedProduct.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="p-4">
//                     <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
//                       {relatedProduct.name}
//                     </h3>
//                     <p className="text-2xl font-bold text-blue-600">
//                       ${relatedProduct.price.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Package,
  Shield,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "@/lib/axios";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params?.id) {
      fetchProduct(params.id);
    }
  }, [params?.id]);

  const fetchProduct = async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      if (response?.data?.success) {
        setProduct(response?.data?.data);
        // Fetch related products from the same category
        if (response?.data?.data?.category) {
          await fetchRelatedProducts(response?.data?.data?.category, productId);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      router.push("/products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      const response = await api.get("/products");
      if (response?.data?.success) {
        const filtered =
          response?.data?.data
            ?.filter(
              (p) => p?.category === category && p?._id !== currentProductId
            )
            ?.slice(0, 4) || [];
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const response = await api.post("/cart", {
        productId: product?._id,
        quantity,
      });

      if (response?.data?.success) {
        alert("Product added to cart successfully!");
        setQuantity(1);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const incrementQuantity = () => {
    try {
      if (product && quantity < (product?.stock || 0)) {
        setQuantity(quantity + 1);
      }
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  const decrementQuantity = () => {
    try {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    } catch (error) {
      console.error("Error decrementing quantity:", error);
    }
  };

  // Get all available images
  const getAllImages = () => {
    try {
      if (!product) return [];

      const images = [];

      // Add images from the images array
      if (product?.images && Array.isArray(product?.images)) {
        images.push(...product?.images?.filter(Boolean));
      }

      // Add the single image if it's not already in the images array
      if (product?.image && !images?.includes(product?.image)) {
        images.unshift(product?.image);
      }

      return images?.filter(Boolean) || [];
    } catch (error) {
      console.error("Error getting all images:", error);
      return [];
    }
  };

  const allImages = getAllImages();

  const nextImage = () => {
    try {
      if (allImages?.length > 1) {
        setCurrentImageIndex((prev) => (prev + 1) % allImages?.length);
      }
    } catch (error) {
      console.error("Error navigating to next image:", error);
    }
  };

  const prevImage = () => {
    try {
      if (allImages?.length > 1) {
        setCurrentImageIndex(
          (prev) => (prev - 1 + allImages?.length) % allImages?.length
        );
      }
    } catch (error) {
      console.error("Error navigating to previous image:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={
                    allImages?.[currentImageIndex] ||
                    "/placeholder.svg?height=500&width=500"
                  }
                  alt={product?.name || "Product"}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=500&width=500";
                  }}
                />
                {(product?.stock || 0) <= 5 && (product?.stock || 0) > 0 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Only {product?.stock} left
                  </div>
                )}
                {(product?.stock || 0) === 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </div>
                )}

                {/* Image Navigation */}
                {allImages?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              {/* Image Thumbnails */}
              {allImages?.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {allImages?.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={imageUrl || "/placeholder.svg?height=64&width=64"}
                        alt={`${product?.name || "Product"} ${index + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=64&width=64";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {product?.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product?.name}
                </h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)]?.map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600">(4.8) • 127 reviews</span>
                </div>
                <p className="text-4xl font-bold text-blue-600 mb-6">
                  ₹ {(product?.price || 0).toFixed(2)}{" "}
                  <span className="line-through text-gray-500 text-xl">
                    ₹ 799
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product?.description}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    Lab Tested
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Package className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    Premium Quality
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Truck className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    Fast Shipping
                  </p>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              {(product?.stock || 0) > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={decrementQuantity}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={incrementQuantity}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={quantity >= (product?.stock || 0)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        {product?.stock} available
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>
                      {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
                    </span>
                  </button>
                </div>
              )}

              {(product?.stock || 0) === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">
                    This product is currently out of stock.
                  </p>
                  <p className="text-red-600 text-sm mt-1">
                    We'll notify you when it's back in stock.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts?.map((relatedProduct) => (
                <div
                  key={relatedProduct?._id}
                  onClick={() =>
                    router.push(`/products/${relatedProduct?._id}`)
                  }
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="relative h-48">
                    <Image
                      src={
                        relatedProduct?.images?.[0] ||
                        relatedProduct?.image ||
                        "/placeholder.svg?height=200&width=200" ||
                        "/placeholder.svg"
                      }
                      alt={relatedProduct?.name || "Product"}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=200";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
                      {relatedProduct?.name}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹ {(relatedProduct?.price || 0).toFixed(2)}{" "}
                      <span className="line-through text-gray-500 text-xl">
                        ₹ 799
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
