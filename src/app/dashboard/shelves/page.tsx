"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Package,
  Edit2,
  Trash2,
  X,
  Search,
  MapPin,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  getShelves,
  createShelf,
  updateShelf,
  deleteShelf,
  Shelf,
} from "@/services/shelfService";

export default function ShelvesPage() {
  const router = useRouter();
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
  });

  const fetchShelves = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getShelves();
      if (response.status === "success" || response.status_code === 200) {
        const shelvesList = Array.isArray(response.data)
          ? response.data
          : (response.data as { content?: Shelf[] })?.content || [];
        setShelves(shelvesList);
      }
    } catch (error) {
      console.error("Failed to fetch shelves:", error);
      toast.error("Failed to load shelves");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShelves();
  }, [fetchShelves]);

  const handleCreateShelf = async () => {
    if (!formData.name.trim()) {
      toast.error("Shelf name is required");
      return;
    }

    setIsSaving(true);
    try {
      const response = await createShelf(formData);
      if (
        response.status === "success" ||
        response.status_code === 201 ||
        response.status_code === 200
      ) {
        toast.success("Shelf created successfully!");
        setShowCreateModal(false);
        setFormData({ name: "", description: "", address: "" });
        fetchShelves();
      } else {
        toast.error(response.message || "Failed to create shelf");
      }
    } catch (error) {
      toast.error("Failed to create shelf");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateShelf = async () => {
    if (!selectedShelf || !formData.name.trim()) {
      toast.error("Shelf name is required");
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateShelf(selectedShelf.id, formData);
      if (response.status === "success" || response.status_code === 200) {
        toast.success("Shelf updated successfully!");
        setShowEditModal(false);
        setSelectedShelf(null);
        setFormData({ name: "", description: "", address: "" });
        fetchShelves();
      } else {
        toast.error(response.message || "Failed to update shelf");
      }
    } catch (error) {
      toast.error("Failed to update shelf");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteShelf = async () => {
    if (!selectedShelf) return;

    setIsSaving(true);
    try {
      const response = await deleteShelf(selectedShelf.id);
      if (
        response.status === "success" ||
        response.status_code === 200 ||
        response.status_code === 204
      ) {
        toast.success("Shelf deleted successfully!");
        setShowDeleteModal(false);
        setSelectedShelf(null);
        fetchShelves();
      } else {
        toast.error(response.message || "Failed to delete shelf");
      }
    } catch (error) {
      toast.error("Failed to delete shelf");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (shelf: Shelf) => {
    setSelectedShelf(shelf);
    setFormData({
      name: shelf.name,
      description: shelf.description || "",
      address: shelf.address || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (shelf: Shelf) => {
    setSelectedShelf(shelf);
    setShowDeleteModal(true);
  };

  const filteredShelves = shelves.filter(
    (shelf) =>
      shelf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shelf.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-b-2 border-[#800020] rounded-full animate-spin" />
          <p className="text-gray-600">Loading shelves...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <DashboardHeader
          title="Shelves"
          subtitle="Manage your inventory locations"
          rightContent={
            <button
              onClick={() => {
                setFormData({ name: "", description: "", address: "" });
                setShowCreateModal(true);
              }}
              className="h-10 px-4 bg-[#800020] text-white text-base font-medium rounded-lg flex items-center gap-2 hover:bg-[#6a0019] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Shelf
            </button>
          }
        />

        <div className="px-4 sm:px-6 py-6 space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search shelves..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
            />
          </div>

          {/* Shelves Grid */}
          {filteredShelves.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <LayoutGrid className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No shelves found</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] transition-colors"
              >
                Create your first shelf
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShelves.map((shelf) => (
                <div
                  key={shelf.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/dashboard/shelves/${shelf.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#800020]/10 rounded-lg flex items-center justify-center">
                      <LayoutGrid className="w-6 h-6 text-[#800020]" />
                    </div>
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openEditModal(shelf)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit shelf"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      {!shelf.isDefault && (
                        <button
                          onClick={() => openDeleteModal(shelf)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete shelf"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {shelf.name}
                    {shelf.isDefault && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </h3>
                  {shelf.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {shelf.description}
                    </p>
                  )}
                  {shelf.address && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{shelf.address}</span>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>Click to view products</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Shelf Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Create New Shelf
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shelf Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                  placeholder="e.g., Shelf A1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="Brief description of this shelf"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                  placeholder="Shelf location (e.g., Aisle 3, Row 2)"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateShelf}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] transition-colors disabled:opacity-50"
              >
                {isSaving ? "Creating..." : "Create Shelf"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shelf Modal */}
      {showEditModal && selectedShelf && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Shelf</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shelf Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateShelf}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Shelf Modal */}
      {showDeleteModal && selectedShelf && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Delete Shelf</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedShelf.name}</span>?
                This action cannot be undone and all product associations will
                be removed.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteShelf}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Deleting..." : "Delete Shelf"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
