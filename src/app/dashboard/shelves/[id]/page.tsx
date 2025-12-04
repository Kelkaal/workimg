"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Plus,
  Search,
  Trash2,
  Edit2,
  LayoutGrid,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  getShelves,
  getShelfProducts,
  addProductToShelf,
  updateShelfProductQuantity,
  removeProductFromShelf,
  Shelf,
  ShelfProduct,
} from "@/services/shelfService";
import { useProductStore } from "@/stores/productStore";

export default function ShelfDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shelfId = params?.id as string;

  const { products: allProducts, fetchProducts } = useProductStore();

  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [shelfProducts, setShelfProducts] = useState<ShelfProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditQuantityModal, setShowEditQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShelfProduct | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const fetchShelfData = useCallback(async () => {
    if (!shelfId) return;

    setLoading(true);
    try {
      // Fetch shelf details
      const shelvesResponse = await getShelves();
      if (
        shelvesResponse.status === "success" ||
        shelvesResponse.status_code === 200
      ) {
        const shelvesList = Array.isArray(shelvesResponse.data)
          ? shelvesResponse.data
          : (shelvesResponse.data as { content?: Shelf[] })?.content || [];
        const foundShelf = shelvesList.find((s) => s.id === shelfId);
        setShelf(foundShelf || null);
      }

      // Fetch shelf products
      const productsResponse = await getShelfProducts(shelfId);
      if (
        productsResponse.status === "success" ||
        productsResponse.status_code === 200
      ) {
        const productsList = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : (productsResponse.data as { content?: ShelfProduct[] })?.content ||
            [];
        setShelfProducts(productsList);
      }
    } catch (error) {
      console.error("Failed to fetch shelf data:", error);
      toast.error("Failed to load shelf data");
    } finally {
      setLoading(false);
    }
  }, [shelfId]);

  useEffect(() => {
    fetchShelfData();
    fetchProducts();
  }, [fetchShelfData, fetchProducts]);

  const handleAddProduct = async () => {
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    setIsSaving(true);
    try {
      // Find product details for mock
      const selectedProd = allProducts.find((p) => p.id === selectedProductId);
      const response = await addProductToShelf(
        shelfId,
        selectedProductId,
        quantity,
        selectedProd
          ? {
              name: selectedProd.name,
              sku: selectedProd.sku,
              photoUrl: selectedProd.photoUrl,
              categoryName: selectedProd.categoryName,
            }
          : undefined
      );
      if (
        response.status === "success" ||
        response.status_code === 201 ||
        response.status_code === 200
      ) {
        toast.success("Product added to shelf!");
        setShowAddProductModal(false);
        setSelectedProductId("");
        setQuantity(1);
        fetchShelfData();
      } else {
        toast.error(response.message || "Failed to add product");
      }
    } catch (error) {
      toast.error("Failed to add product to shelf");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateQuantity = async () => {
    if (!selectedProduct) return;
    if (quantity < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateShelfProductQuantity(
        shelfId,
        selectedProduct.productId,
        quantity
      );
      if (response.status === "success" || response.status_code === 200) {
        toast.success("Quantity updated!");
        setShowEditQuantityModal(false);
        setSelectedProduct(null);
        setQuantity(1);
        fetchShelfData();
      } else {
        toast.error(response.message || "Failed to update quantity");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    if (
      !confirm("Are you sure you want to remove this product from the shelf?")
    )
      return;

    try {
      const response = await removeProductFromShelf(shelfId, productId);
      if (
        response.status === "success" ||
        response.status_code === 200 ||
        response.status_code === 204
      ) {
        toast.success("Product removed from shelf");
        fetchShelfData();
      } else {
        toast.error(response.message || "Failed to remove product");
      }
    } catch (error) {
      toast.error("Failed to remove product");
    }
  };

  const openEditQuantityModal = (product: ShelfProduct) => {
    setSelectedProduct(product);
    setQuantity(product.quantity);
    setShowEditQuantityModal(true);
  };

  // Filter products not already in shelf for the add modal
  const availableProducts = allProducts.filter(
    (p) => !shelfProducts.some((sp) => sp.productId === p.id)
  );

  const filteredShelfProducts = shelfProducts.filter(
    (p) =>
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-b-2 border-[#800020] rounded-full animate-spin" />
          <p className="text-gray-600">Loading shelf...</p>
        </div>
      </div>
    );
  }

  if (!shelf) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LayoutGrid className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Shelf not found</p>
          <button
            onClick={() => router.push("/dashboard/shelves")}
            className="px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019]"
          >
            Back to Shelves
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <DashboardHeader
          title={shelf.name}
          subtitle={shelf.description || "Shelf inventory"}
          rightContent={
            <button
              onClick={() => {
                setSelectedProductId("");
                setQuantity(1);
                setShowAddProductModal(true);
              }}
              className="h-10 px-4 bg-[#800020] text-white text-base font-medium rounded-lg flex items-center gap-2 hover:bg-[#6a0019] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          }
        />

        <div className="px-4 sm:px-6 py-6 space-y-6">
          {/* Back button */}
          <button
            onClick={() => router.push("/dashboard/shelves")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shelves
          </button>

          {/* Shelf Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#800020]/10 rounded-lg flex items-center justify-center">
                <LayoutGrid className="w-8 h-8 text-[#800020]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {shelf.name}
                </h2>
                {shelf.description && (
                  <p className="text-gray-500">{shelf.description}</p>
                )}
                {shelf.address && (
                  <p className="text-sm text-gray-400 mt-1">{shelf.address}</p>
                )}
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold text-[#800020]">
                  {shelfProducts.length}
                </p>
                <p className="text-sm text-gray-500">Products</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products in this shelf..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
            />
          </div>

          {/* Products Table */}
          {filteredShelfProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No products in this shelf</p>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019]"
              >
                Add your first product
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredShelfProducts.map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                            {product.photoUrl ? (
                              <Image
                                src={product.photoUrl}
                                alt={product.productName}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {product.productName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.sku || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.categoryName || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-gray-900">
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditQuantityModal(product)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Edit quantity"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() =>
                              handleRemoveProduct(product.productId)
                            }
                            className="p-2 hover:bg-red-50 rounded-lg"
                            title="Remove from shelf"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Add Product to Shelf
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                >
                  <option value="">Choose a product...</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} {product.sku ? `(${product.sku})` : ""}
                    </option>
                  ))}
                </select>
                {availableProducts.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    All products are already in this shelf
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddProductModal(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={isSaving || !selectedProductId}
                className="flex-1 px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] disabled:opacity-50"
              >
                {isSaving ? "Adding..." : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quantity Modal */}
      {showEditQuantityModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Update Quantity
              </h3>
              <button
                onClick={() => setShowEditQuantityModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  {selectedProduct.productName}
                </p>
                <p className="text-sm text-gray-500">
                  Current quantity: {selectedProduct.quantity}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditQuantityModal(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateQuantity}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] disabled:opacity-50"
              >
                {isSaving ? "Updating..." : "Update Quantity"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
