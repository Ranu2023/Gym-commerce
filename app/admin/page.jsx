// "use client";

// import type React from "react";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   Package,
//   Users,
//   ShoppingCart,
//   DollarSign,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   Tag,
//   BarChart3,
// } from "lucide-react";
// import type { Product, Coupon, AuthUser } from "@/lib/types";
// import api from "@/lib/axios";

// interface DashboardStats {
//   totalProducts: number;
//   totalUsers: number;
//   totalOrders: number;
//   totalRevenue: number;
//   recentOrders: number;
//   activeCoupons: number;
// }

// export default function AdminDashboard() {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [coupons, setCoupons] = useState<Coupon[]>([]);
//   const [stats, setStats] = useState<DashboardStats>({
//     totalProducts: 0,
//     totalUsers: 0,
//     totalOrders: 0,
//     totalRevenue: 0,
//     recentOrders: 0,
//     activeCoupons: 0,
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<
//     "products" | "coupons" | "analytics"
//   >("products");
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [showCouponModal, setShowCouponModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
//   const [couponStats, setCouponStats] = useState<any[]>([]);
//   const [productForm, setProductForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     stock: "",
//     category: "",
//     image: "",
//     isActive: true,
//   });
//   const [couponForm, setCouponForm] = useState({
//     code: "",
//     discount: "",
//     influencerName: "",
//     isActive: true,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (!userData) {
//       router.push("/login");
//       return;
//     }

//     const parsedUser = JSON.parse(userData);
//     if (parsedUser.role !== "admin") {
//       router.push("/");
//       return;
//     }

//     setUser(parsedUser);
//     fetchData();
//   }, [router]);

//   const fetchData = async () => {
//     try {
//       await Promise.all([
//         fetchProducts(),
//         fetchCoupons(),
//         fetchStats(),
//         fetchCouponStats(),
//       ]);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await api.get("/admin/products");
//       if (response.data.success) {
//         setProducts(response?.data?.data?.products);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const fetchCoupons = async () => {
//     try {
//       const response = await api.get("/admin/coupons");
//       if (response.data.success) {
//         setCoupons(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching coupons:", error);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await api.get("/admin/dashboard-stats");
//       if (response.data.success) {
//         setStats(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//     }
//   };

//   const fetchCouponStats = async () => {
//     try {
//       const response = await api.get("/admin/coupon-stats");
//       if (response.data.success) {
//         setCouponStats(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching coupon stats:", error);
//     }
//   };

//   const handleImageUpload = async (file: File) => {
//     setUploadingImage(true);
//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       const response = await api.post("/upload/image", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.data.success) {
//         setProductForm({ ...productForm, image: response.data.data.url });
//       } else {
//         alert("Failed to upload image");
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       alert("Failed to upload image");
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!productForm.name || !productForm.price || !productForm.stock) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const productData = {
//         ...productForm,
//         price: Number.parseFloat(productForm.price),
//         stock: Number.parseInt(productForm.stock),
//       };

//       let response;
//       if (editingProduct) {
//         response = await api.put(
//           `/admin/products/${editingProduct._id}`,
//           productData
//         );
//       } else {
//         response = await api.post("/admin/products", productData);
//       }

//       if (response.data.success) {
//         alert(
//           editingProduct
//             ? "Product updated successfully!"
//             : "Product created successfully!"
//         );
//         setShowProductModal(false);
//         setEditingProduct(null);
//         setProductForm({
//           name: "",
//           description: "",
//           price: "",
//           stock: "",
//           category: "",
//           image: "",
//           isActive: true,
//         });
//         fetchProducts();
//       }
//     } catch (error: any) {
//       alert(error.response?.data?.message || "Failed to save product");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCouponSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (
//       !couponForm.code ||
//       !couponForm.discount ||
//       !couponForm.influencerName
//     ) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const couponData = {
//         ...couponForm,
//         discount: Number.parseFloat(couponForm.discount),
//       };

//       let response;
//       if (editingCoupon) {
//         response = await api.put(
//           `/admin/coupons/${editingCoupon._id}`,
//           couponData
//         );
//       } else {
//         response = await api.post("/admin/coupons", couponData);
//       }

//       if (response.data.success) {
//         alert(
//           editingCoupon
//             ? "Coupon updated successfully!"
//             : "Coupon created successfully!"
//         );
//         setShowCouponModal(false);
//         setEditingCoupon(null);
//         setCouponForm({
//           code: "",
//           discount: "",
//           influencerName: "",
//           isActive: true,
//         });
//         fetchCoupons();
//         fetchCouponStats();
//       }
//     } catch (error: any) {
//       alert(error.response?.data?.message || "Failed to save coupon");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteProduct = async (productId: string) => {
//     if (!confirm("Are you sure you want to delete this product?")) return;

//     try {
//       const response = await api.delete(`/admin/products/${productId}`);
//       if (response.data.success) {
//         alert("Product deleted successfully!");
//         fetchProducts();
//       }
//     } catch (error: any) {
//       alert(error.response?.data?.message || "Failed to delete product");
//     }
//   };

//   const handleDeleteCoupon = async (couponId: string) => {
//     if (!confirm("Are you sure you want to delete this coupon?")) return;

//     try {
//       const response = await api.delete(`/admin/coupons/${couponId}`);
//       if (response.data.success) {
//         alert("Coupon deleted successfully!");
//         fetchCoupons();
//         fetchCouponStats();
//       }
//     } catch (error: any) {
//       alert(error.response?.data?.message || "Failed to delete coupon");
//     }
//   };

//   const openEditProduct = (product: Product) => {
//     setEditingProduct(product);
//     setProductForm({
//       name: product.name,
//       description: product.description,
//       price: product.price.toString(),
//       stock: product.stock.toString(),
//       category: product.category,
//       image: product.image,
//       isActive: product.isActive,
//     });
//     setShowProductModal(true);
//   };

//   console.log(products, "this is the products");

//   const openEditCoupon = (coupon: Coupon) => {
//     setEditingCoupon(coupon);
//     setCouponForm({
//       code: coupon.code,
//       discount: coupon.discount.toString(),
//       influencerName: coupon.influencerName,
//       isActive: coupon.isActive,
//     });
//     setShowCouponModal(true);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {[...Array(4)]?.map((_, index) => (
//                 <div key={index} className="bg-white rounded-lg shadow-md p-6">
//                   <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                   <div className="h-8 bg-gray-300 rounded"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//           <p className="text-gray-600 mt-2">Manage your gym supplement store</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">
//                   Total Products
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {stats.totalProducts}
//                 </p>
//               </div>
//               <Package className="h-8 w-8 text-blue-600" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Users</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {stats.totalUsers}
//                 </p>
//               </div>
//               <Users className="h-8 w-8 text-green-600" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">
//                   Total Orders
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {stats.totalOrders}
//                 </p>
//               </div>
//               <ShoppingCart className="h-8 w-8 text-purple-600" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">
//                   Total Revenue
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ${stats.totalRevenue.toFixed(2)}
//                 </p>
//               </div>
//               <DollarSign className="h-8 w-8 text-yellow-600" />
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             Quick Actions
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Link
//               href="/admin/orders"
//               className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Package className="h-5 w-5" />
//               <span>Manage Orders</span>
//             </Link>
//             <button
//               onClick={() => setShowProductModal(true)}
//               className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <Plus className="h-5 w-5" />
//               <span>Add Product</span>
//             </button>
//             <button
//               onClick={() => setShowCouponModal(true)}
//               className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
//             >
//               <Tag className="h-5 w-5" />
//               <span>Add Coupon</span>
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow-md">
//           <div className="border-b border-gray-200">
//             <nav className="-mb-px flex space-x-8 px-6">
//               <button
//                 onClick={() => setActiveTab("products")}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "products"
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Products ({products?.length})
//               </button>
//               <button
//                 onClick={() => setActiveTab("coupons")}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "coupons"
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Coupons ({coupons?.length})
//               </button>
//               <button
//                 onClick={() => setActiveTab("analytics")}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "analytics"
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Analytics
//               </button>
//             </nav>
//           </div>

//           <div className="p-6">
//             {/* Products Tab */}
//             {activeTab === "products" && (
//               <div>
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Products
//                   </h3>
//                   <button
//                     onClick={() => setShowProductModal(true)}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//                   >
//                     <Plus className="h-4 w-4" />
//                     <span>Add Product</span>
//                   </button>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Product
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Category
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Price
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Stock
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Status
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {products &&
//                         products?.map((product) => (
//                           <tr key={product._id}>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex items-center">
//                                 <img
//                                   className="h-10 w-10 rounded-lg object-cover"
//                                   src={
//                                     product.image ||
//                                     "/placeholder.svg?height=40&width=40"
//                                   }
//                                   alt={product.name}
//                                 />
//                                 <div className="ml-4">
//                                   <div className="text-sm font-medium text-gray-900">
//                                     {product.name}
//                                   </div>
//                                   <div className="text-sm text-gray-500">
//                                     {product.description.slice(0, 50)}...
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                               {product.category}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                               ${product.price.toFixed(2)}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                               {product.stock}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span
//                                 className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                   product.isActive
//                                     ? "bg-green-100 text-green-800"
//                                     : "bg-red-100 text-red-800"
//                                 }`}
//                               >
//                                 {product.isActive ? "Active" : "Inactive"}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                               <button
//                                 onClick={() =>
//                                   router.push(`/products/${product._id}`)
//                                 }
//                                 className="text-blue-600 hover:text-blue-900"
//                                 title="View Product"
//                               >
//                                 <Eye className="h-4 w-4" />
//                               </button>
//                               <button
//                                 onClick={() => openEditProduct(product)}
//                                 className="text-green-600 hover:text-green-900"
//                                 title="Edit Product"
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteProduct(product._id)}
//                                 className="text-red-600 hover:text-red-900"
//                                 title="Delete Product"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {products?.length === 0 && (
//                   <div className="text-center py-12">
//                     <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">
//                       No products found
//                     </h3>
//                     <p className="text-gray-500 mb-4">
//                       Get started by adding your first product.
//                     </p>
//                     <button
//                       onClick={() => setShowProductModal(true)}
//                       className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       Add Product
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Coupons Tab */}
//             {activeTab === "coupons" && (
//               <div>
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Coupons
//                   </h3>
//                   <button
//                     onClick={() => setShowCouponModal(true)}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//                   >
//                     <Plus className="h-4 w-4" />
//                     <span>Add Coupon</span>
//                   </button>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Code
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Influencer
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Discount
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Usage Count
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Status
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {coupons?.map((coupon) => (
//                         <tr key={coupon._id}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {coupon.code}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {coupon.influencerName}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {coupon.discount}%
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {coupon.usageCount}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span
//                               className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                 coupon.isActive
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-red-100 text-red-800"
//                               }`}
//                             >
//                               {coupon.isActive ? "Active" : "Inactive"}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                             <button
//                               onClick={() => openEditCoupon(coupon)}
//                               className="text-green-600 hover:text-green-900"
//                               title="Edit Coupon"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteCoupon(coupon._id)}
//                               className="text-red-600 hover:text-red-900"
//                               title="Delete Coupon"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {coupons?.length === 0 && (
//                   <div className="text-center py-12">
//                     <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">
//                       No coupons found
//                     </h3>
//                     <p className="text-gray-500 mb-4">
//                       Create your first coupon code.
//                     </p>
//                     <button
//                       onClick={() => setShowCouponModal(true)}
//                       className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       Add Coupon
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Analytics Tab */}
//             {activeTab === "analytics" && (
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-6">
//                   Coupon Analytics
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {couponStats?.map((stat) => (
//                     <div
//                       key={stat._id}
//                       className="bg-white border rounded-lg p-6"
//                     >
//                       <div className="flex items-center justify-between mb-4">
//                         <div>
//                           <h4 className="text-lg font-semibold text-gray-900">
//                             {stat.code}
//                           </h4>
//                           <p className="text-sm text-gray-600">
//                             by {stat.influencerName}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-2xl font-bold text-blue-600">
//                             {stat.usageCount}
//                           </div>
//                           <div className="text-sm text-gray-500">uses</div>
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">Discount:</span>
//                           <span className="font-medium">{stat.discount}%</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">Total Savings:</span>
//                           <span className="font-medium text-green-600">
//                             ${(stat.totalSavings || 0).toFixed(2)}
//                           </span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">Status:</span>
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs ${
//                               stat.isActive
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-red-100 text-red-800"
//                             }`}
//                           >
//                             {stat.isActive ? "Active" : "Inactive"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {couponStats?.length === 0 && (
//                   <div className="text-center py-12">
//                     <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">
//                       No analytics data
//                     </h3>
//                     <p className="text-gray-500">
//                       Analytics will appear once coupons are used.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Product Modal */}
//         {showProductModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   {editingProduct ? "Edit Product" : "Add New Product"}
//                 </h3>

//                 <form onSubmit={handleProductSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Product Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={productForm.name}
//                       onChange={(e) =>
//                         setProductForm({ ...productForm, name: e.target.value })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description
//                     </label>
//                     <textarea
//                       value={productForm.description}
//                       onChange={(e) =>
//                         setProductForm({
//                           ...productForm,
//                           description: e.target.value,
//                         })
//                       }
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Price *
//                       </label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={productForm.price}
//                         onChange={(e) =>
//                           setProductForm({
//                             ...productForm,
//                             price: e.target.value,
//                           })
//                         }
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Stock *
//                       </label>
//                       <input
//                         type="number"
//                         value={productForm.stock}
//                         onChange={(e) =>
//                           setProductForm({
//                             ...productForm,
//                             stock: e.target.value,
//                           })
//                         }
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Category
//                     </label>
//                     <select
//                       value={productForm.category}
//                       onChange={(e) =>
//                         setProductForm({
//                           ...productForm,
//                           category: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">Select Category</option>
//                       <option value="Protein">Protein</option>
//                       <option value="Pre-Workout">Pre-Workout</option>
//                       <option value="Post-Workout">Post-Workout</option>
//                       <option value="Vitamins">Vitamins</option>
//                       <option value="Creatine">Creatine</option>
//                       <option value="Fat Burners">Fat Burners</option>
//                       <option value="Mass Gainers">Mass Gainers</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Product Image
//                     </label>
//                     <div className="space-y-2">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           if (file) handleImageUpload(file);
//                         }}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       />
//                       {uploadingImage && (
//                         <p className="text-sm text-blue-600">
//                           Uploading image...
//                         </p>
//                       )}
//                       {productForm.image && (
//                         <img
//                           src={productForm.image || "/placeholder.svg"}
//                           alt="Product preview"
//                           className="w-20 h-20 object-cover rounded-md"
//                         />
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="isActive"
//                       checked={productForm.isActive}
//                       onChange={(e) =>
//                         setProductForm({
//                           ...productForm,
//                           isActive: e.target.checked,
//                         })
//                       }
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label
//                       htmlFor="isActive"
//                       className="ml-2 block text-sm text-gray-900"
//                     >
//                       Active Product
//                     </label>
//                   </div>

//                   <div className="flex space-x-3 mt-6">
//                     <button
//                       type="submit"
//                       disabled={isSubmitting || uploadingImage}
//                       className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//                     >
//                       {isSubmitting
//                         ? "Saving..."
//                         : editingProduct
//                         ? "Update Product"
//                         : "Add Product"}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowProductModal(false);
//                         setEditingProduct(null);
//                         setProductForm({
//                           name: "",
//                           description: "",
//                           price: "",
//                           stock: "",
//                           category: "",
//                           image: "",
//                           isActive: true,
//                         });
//                       }}
//                       className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Coupon Modal */}
//         {showCouponModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//               <div className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
//                 </h3>

//                 <form onSubmit={handleCouponSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Coupon Code *
//                     </label>
//                     <input
//                       type="text"
//                       value={couponForm.code}
//                       onChange={(e) =>
//                         setCouponForm({
//                           ...couponForm,
//                           code: e.target.value.toUpperCase(),
//                         })
//                       }
//                       placeholder="e.g., SAVE20"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Discount Percentage *
//                     </label>
//                     <input
//                       type="number"
//                       min="1"
//                       max="100"
//                       value={couponForm.discount}
//                       onChange={(e) =>
//                         setCouponForm({
//                           ...couponForm,
//                           discount: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Influencer Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={couponForm.influencerName}
//                       onChange={(e) =>
//                         setCouponForm({
//                           ...couponForm,
//                           influencerName: e.target.value,
//                         })
//                       }
//                       placeholder="e.g., John Doe"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="couponActive"
//                       checked={couponForm.isActive}
//                       onChange={(e) =>
//                         setCouponForm({
//                           ...couponForm,
//                           isActive: e.target.checked,
//                         })
//                       }
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label
//                       htmlFor="couponActive"
//                       className="ml-2 block text-sm text-gray-900"
//                     >
//                       Active Coupon
//                     </label>
//                   </div>

//                   <div className="flex space-x-3 mt-6">
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//                     >
//                       {isSubmitting
//                         ? "Saving..."
//                         : editingCoupon
//                         ? "Update Coupon"
//                         : "Add Coupon"}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowCouponModal(false);
//                         setEditingCoupon(null);
//                         setCouponForm({
//                           code: "",
//                           discount: "",
//                           influencerName: "",
//                           isActive: true,
//                         });
//                       }}
//                       className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Tag,
  BarChart3,
  X,
  Upload,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: 0,
    activeCoupons: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponStats, setCouponStats] = useState([]);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
    image: "", // Keep for backward compatibility
    isActive: true,
  });
  const [couponForm, setCouponForm] = useState({
    code: "",
    discount: "",
    influencerName: "",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }

      const parsedUser = JSON.parse(userData);
      if (parsedUser?.role !== "admin") {
        router.push("/");
        return;
      }

      setUser(parsedUser);
      fetchData();
    } catch (error) {
      console.error("Error initializing admin dashboard:", error);
      router.push("/login");
    }
  }, [router]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchProducts(),
        fetchCoupons(),
        fetchStats(),
        fetchCouponStats(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/admin/products");
      if (response?.data?.success) {
        setProducts(response?.data?.data?.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await api.get("/admin/coupons");
      if (response?.data?.success) {
        setCoupons(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/dashboard-stats");
      if (response?.data?.success) {
        setStats(response?.data?.data || {});
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchCouponStats = async () => {
    try {
      const response = await api.get("/admin/coupon-stats");
      if (response?.data?.success) {
        setCouponStats(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching coupon stats:", error);
    }
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const formData = new FormData();

      // Append all files with the name "images"
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      const response = await api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.success) {
        const uploadedUrls =
          response?.data?.data?.urls ||
          [response?.data?.data?.url].filter(Boolean);
        const newImages = [...(productForm?.images || []), ...uploadedUrls];

        setProductForm({
          ...productForm,
          images: newImages,
          image: newImages?.[0] || "", // Set first image as primary
        });

        console.log("Images uploaded successfully:", uploadedUrls);
      } else {
        throw new Error(response?.data?.message || "Failed to upload images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload images"
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove) => {
    try {
      const updatedImages =
        productForm?.images?.filter((_, index) => index !== indexToRemove) ||
        [];
      setProductForm({
        ...productForm,
        images: updatedImages,
        image: updatedImages?.[0] || "",
      });
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const moveImage = (fromIndex, toIndex) => {
    try {
      const updatedImages = [...(productForm?.images || [])];
      const [movedImage] = updatedImages.splice(fromIndex, 1);
      updatedImages.splice(toIndex, 0, movedImage);

      setProductForm({
        ...productForm,
        images: updatedImages,
        image: updatedImages?.[0] || "",
      });
    } catch (error) {
      console.error("Error moving image:", error);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!productForm?.name || !productForm?.price || !productForm?.stock) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (
        (!productForm?.images || productForm?.images?.length === 0) &&
        !productForm?.image
      ) {
        toast.error("Please add at least one product image");
        return;
      }

      setIsSubmitting(true);

      const productData = {
        ...productForm,
        price: Number.parseFloat(productForm?.price || "0"),
        stock: Number.parseInt(productForm?.stock || "0"),
        images: productForm?.images || [],
        image: productForm?.images?.[0] || productForm?.image || "",
      };

      let response;
      if (editingProduct) {
        response = await api.put(`/admin/products`, {
          ...productData,
          id: editingProduct?._id,
        });
      } else {
        response = await api.post("/admin/products", productData);
      }

      if (response?.data?.success) {
        alert(
          editingProduct
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
        setShowProductModal(false);
        setEditingProduct(null);
        setProductForm({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "",
          images: [],
          image: "",
          isActive: true,
        });
        await fetchProducts();
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error?.response?.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !couponForm?.code ||
        !couponForm?.discount ||
        !couponForm?.influencerName
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      setIsSubmitting(true);

      const couponData = {
        ...couponForm,
        discount: Number.parseFloat(couponForm?.discount || "0"),
      };

      let response;
      if (editingCoupon) {
        response = await api.put(
          `/admin/coupons/${editingCoupon?._id}`,
          couponData
        );
      } else {
        response = await api.post("/admin/coupons", couponData);
      }

      if (response?.data?.success) {
        alert(
          editingCoupon
            ? "Coupon updated successfully!"
            : "Coupon created successfully!"
        );
        setShowCouponModal(false);
        setEditingCoupon(null);
        setCouponForm({
          code: "",
          discount: "",
          influencerName: "",
          isActive: true,
        });
        await fetchCoupons();
        await fetchCouponStats();
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      alert(error?.response?.data?.message || "Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      if (!confirm("Are you sure you want to delete this product?")) return;

      const response = await api.delete(`/admin/products/?id=${productId}`);
      if (response?.data?.success) {
        toast.success("Product deleted successfully!");
        await fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error?.response?.data?.message || "Failed to delete product");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      if (!confirm("Are you sure you want to delete this coupon?")) return;

      const response = await api.delete(`/admin/coupons/${couponId}`);
      if (response?.data?.success) {
        toast.success("Coupon deleted successfully!");
        await fetchCoupons();
        await fetchCouponStats();
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error(error?.response?.data?.message || "Failed to delete coupon");
    }
  };

  const openEditProduct = (product) => {
    try {
      setEditingProduct(product);
      setProductForm({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price?.toString() || "",
        stock: product?.stock?.toString() || "",
        category: product?.category || "",
        images: product?.images || (product?.image ? [product?.image] : []),
        image: product?.image || "",
        isActive: product?.isActive ?? true,
      });
      setShowProductModal(true);
    } catch (error) {
      console.error("Error opening edit product modal:", error);
    }
  };

  const openEditCoupon = (coupon) => {
    try {
      setEditingCoupon(coupon);
      setCouponForm({
        code: coupon?.code || "",
        discount: coupon?.discount?.toString() || "",
        influencerName: coupon?.influencerName || "",
        isActive: coupon?.isActive ?? true,
      });
      setShowCouponModal(true);
    } catch (error) {
      console.error("Error opening edit coupon modal:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)]?.map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your gym supplement store</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalProducts || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalUsers || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalOrders || 0}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹ {(stats?.totalRevenue || 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/orders"
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Package className="h-5 w-5" />
              <span>Manage Orders</span>
            </Link>
            <button
              onClick={() => setShowProductModal(true)}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => setShowCouponModal(true)}
              className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Tag className="h-5 w-5" />
              <span>Add Coupon</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("products")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "products"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Products ({products?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("coupons")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "coupons"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Coupons ({coupons?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Products
                  </h3>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Images
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products &&
                        products?.map((product) => (
                          <tr key={product?._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={
                                    product?.images?.[0] ||
                                    product?.image ||
                                    "/placeholder.svg?height=40&width=40" ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg"
                                  }
                                  alt={product?.name || "Product"}
                                  onError={(e) => {
                                    e.target.src =
                                      "/placeholder.svg?height=40&width=40";
                                  }}
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product?.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product?.description?.slice(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product?.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹ {(product?.price || 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product?.stock || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center space-x-1">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {(product?.images?.length || 0) +
                                    (product?.image &&
                                    !product?.images?.includes(product?.image)
                                      ? 1
                                      : 0)}{" "}
                                  images
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  product?.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {product?.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() =>
                                  router.push(`/products/${product?._id}`)
                                }
                                className="text-blue-600 hover:text-blue-900"
                                title="View Product"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openEditProduct(product)}
                                className="text-green-600 hover:text-green-900"
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteProduct(product?._id)
                                }
                                className="text-red-600 hover:text-red-900"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {products?.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Get started by adding your first product.
                    </p>
                    <button
                      onClick={() => setShowProductModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Product
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Coupons Tab */}
            {activeTab === "coupons" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Coupons
                  </h3>
                  <button
                    onClick={() => setShowCouponModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Coupon</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Influencer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Discount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usage Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {coupons?.map((coupon) => (
                        <tr key={coupon?._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {coupon?.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {coupon?.influencerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {coupon?.discount}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {coupon?.usageCount || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                coupon?.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {coupon?.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => openEditCoupon(coupon)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit Coupon"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon?._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Coupon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {coupons?.length === 0 && (
                  <div className="text-center py-12">
                    <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No coupons found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Create your first coupon code.
                    </p>
                    <button
                      onClick={() => setShowCouponModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Coupon
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Coupon Analytics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {couponStats?.map((stat) => (
                    <div
                      key={stat?._id}
                      className="bg-white border rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {stat?.code}
                          </h4>
                          <p className="text-sm text-gray-600">
                            by {stat?.influencerName}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {stat?.usageCount || 0}
                          </div>
                          <div className="text-sm text-gray-500">uses</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-medium">{stat?.discount}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Savings:</span>
                          <span className="font-medium text-green-600">
                            ${(stat?.totalSavings || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              stat?.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {stat?.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {couponStats?.length === 0 && (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No analytics data
                    </h3>
                    <p className="text-gray-500">
                      Analytics will appear once coupons are used.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>

                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={productForm?.name || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={productForm?.category || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Protein">Protein</option>
                        <option value="Pre-Workout">Pre-Workout</option>
                        <option value="Post-Workout">Post-Workout</option>
                        <option value="Vitamins">Vitamins</option>
                        <option value="Creatine">Creatine</option>
                        <option value="Fat Burners">Fat Burners</option>
                        <option value="Mass Gainers">Mass Gainers</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={productForm?.description || ""}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm?.price || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock *
                      </label>
                      <input
                        type="number"
                        value={productForm?.stock || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            stock: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Enhanced Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images *
                    </label>
                    <div className="space-y-4">
                      {/* Drag and Drop Upload Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          dragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-900">
                            Drop images here or click to upload
                          </p>
                          <p className="text-sm text-gray-500">
                            Support for multiple images (JPEG, PNG, WebP up to
                            5MB each)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) handleImageUpload(files);
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        >
                          Choose Files
                        </label>
                      </div>

                      {uploadingImages && (
                        <div className="flex items-center justify-center space-x-2 text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm">Uploading images...</span>
                        </div>
                      )}

                      {/* Display uploaded images */}
                      {productForm?.images &&
                        productForm?.images?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                              Uploaded Images ({productForm?.images?.length})
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {productForm?.images?.map((imageUrl, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={imageUrl || "/placeholder.svg"}
                                    alt={`Product image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md border"
                                    onError={(e) => {
                                      e.target.src = "/placeholder.svg";
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                  {index === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                      Primary
                                    </div>
                                  )}
                                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                    {index + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              The first image will be used as the primary
                              product image. You can reorder by removing and
                              re-uploading.
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={productForm?.isActive ?? true}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isActive: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Active Product
                    </label>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting || uploadingImages}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting
                        ? "Saving..."
                        : editingProduct
                        ? "Update Product"
                        : "Add Product"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductModal(false);
                        setEditingProduct(null);
                        setProductForm({
                          name: "",
                          description: "",
                          price: "",
                          stock: "",
                          category: "",
                          images: [],
                          image: "",
                          isActive: true,
                        });
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Coupon Modal */}
        {showCouponModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
                </h3>

                <form onSubmit={handleCouponSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      value={couponForm?.code || ""}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g., SAVE20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={couponForm?.discount || ""}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          discount: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Influencer Name *
                    </label>
                    <input
                      type="text"
                      value={couponForm?.influencerName || ""}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          influencerName: e.target.value,
                        })
                      }
                      placeholder="e.g., John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="couponActive"
                      checked={couponForm?.isActive ?? true}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          isActive: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="couponActive"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Active Coupon
                    </label>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "Saving..."
                        : editingCoupon
                        ? "Update Coupon"
                        : "Add Coupon"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCouponModal(false);
                        setEditingCoupon(null);
                        setCouponForm({
                          code: "",
                          discount: "",
                          influencerName: "",
                          isActive: true,
                        });
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
