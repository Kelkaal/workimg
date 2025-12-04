"use client";

import { useOrganizationStore } from "@/stores/organizationStore";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

type CategoryStatus = "Active" | "Empty";

export type Category = {
  id: string;
  name: string;
  description: string;
  products: number;
  percentage: string;
  status: CategoryStatus;
  iconId: string;
  iconSrc: string;
  bgClass: string;
  colorValue: string;
  createdAt: Date;
};

type CategoryContextType = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Omit<Category, "id" | "createdAt">) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
  getTotalProducts: () => number;
  getActiveCategories: () => number;
  getEmptyCategories: () => number;
  organizationId: string | null;
};

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

// API Base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.staging.soma.emerj.net";

interface ApiCategory {
  id?: string | number;
  _id?: string | number;
  name: string;
  description?: string;
  memberCount?: number; // API returns memberCount for product count
  productCount?: number;
  products?: number;
  percentage?: string;
  iconId?: string;
  iconSrc?: string;
  bgClass?: string;
  colorValue?: string;
  color?: string;
  createdAt?: string | Date;
}

// Get saved visual settings from localStorage
function getSavedVisuals(categoryId: string): Partial<Category> {
  if (typeof window === "undefined") return {};
  try {
    const saved = JSON.parse(localStorage.getItem("categoryVisuals") || "{}");
    return saved[categoryId] || {};
  } catch {
    return {};
  }
}

// Transform API response to Category type
function transformApiCategory(apiCategory: ApiCategory): Category {
  // API returns memberCount which represents product count
  const productCount =
    apiCategory.memberCount ||
    apiCategory.productCount ||
    apiCategory.products ||
    0;

  const categoryId = String(apiCategory.id || apiCategory._id || "");

  // Load saved visual settings from localStorage
  const savedVisuals = getSavedVisuals(categoryId);

  return {
    id: categoryId,
    name: apiCategory.name,
    description: apiCategory.description || "",
    products: productCount,
    percentage: apiCategory.percentage || "0% of total",
    status: productCount > 0 ? "Active" : "Empty",
    iconId: savedVisuals.iconId || apiCategory.iconId || "briefcase",
    iconSrc: apiCategory.iconSrc || "/default-icon.png",
    bgClass:
      savedVisuals.bgClass ||
      apiCategory.bgClass ||
      "from-[#3B82F6] to-[#60A5FA]",
    colorValue:
      savedVisuals.colorValue ||
      apiCategory.colorValue ||
      apiCategory.color ||
      "#3B82F6",
    createdAt: apiCategory.createdAt
      ? new Date(apiCategory.createdAt)
      : new Date(),
  };
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  // const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { organizationId, setOrganizationId } = useOrganizationStore();

  // console.log("CategoryProvider rendered. organizationId:", categories);

  const fetchOrganizationId = useCallback(async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token");
      const response = await fetch(`${API_BASE_URL}/api/v1/organizations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error(`Failed to fetch organizations: ${response.status}`);
      const data = await response.json();
      const orgList = data?.data || data || [];
      const firstOrg = orgList[0];
      if (firstOrg) {
        const id = String(firstOrg.id || firstOrg._id);
        setOrganizationId(id);
        localStorage.setItem("organizationId", id);
        sessionStorage.setItem("organizationId", id);
      } else {
        // No organization found - user needs to create one first
        console.warn(
          "No organization found. Please create an organization first."
        );
        setError("No organization found. Please create an organization first.");
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to fetch organizationId";
      console.error("Failed to fetch organizationId", err);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // on first mount only, hydrate from storage if store is empty
    if (!organizationId && typeof window !== "undefined") {
      const storedId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");

      if (storedId) {
        setOrganizationId(storedId);
      } else {
        fetchOrganizationId();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, fetchOrganizationId, setOrganizationId]);

  const refreshCategories = useCallback(async () => {
    if (!organizationId) {
      console.warn("No organizationId yet");
      return;
    }
    console.log("🔄 Fetching categories...");
    try {
      setLoading(true);
      setError(null);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      // console.log("🔑 Using token:", token);
      // console.log("organizationId:", organizationId);

      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${organizationId}/categories?page=0&size=20`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("📥 Categories response status:", response);

      if (!response.ok) {
        if (response.status === 404) {
          console.log("ℹ️ No categories found (404)");
          setCategories([]);
          return;
        }
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = (await response.json()) as
        | { data?: { content?: ApiCategory[] } | ApiCategory[] }
        | ApiCategory[];
      console.log("📦 Categories API response:", JSON.stringify(data, null, 2));

      // Handle different response structures
      let categoryList: ApiCategory[] = [];
      if (Array.isArray(data)) {
        categoryList = data;
      } else if ("data" in data) {
        if (Array.isArray(data.data)) {
          categoryList = data.data;
        } else if (data.data?.content && Array.isArray(data.data.content)) {
          categoryList = data.data.content;
        }
      }

      const transformedCategories = categoryList.map(transformApiCategory);

      // console.log("✅ Transformed categories:", transformedCategories.length);
      setCategories(transformedCategories);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch categories";
      console.error("❌ Fetch categories error:", err);
      setError(errorMessage);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      // not logged in → do nothing
      return;
    }
    if (organizationId) {
      refreshCategories();
    }
  }, [organizationId, refreshCategories]);

  const addCategory = useCallback(
    async (newCategory: Omit<Category, "id" | "createdAt">) => {
      if (!organizationId) {
        console.error("❌ Cannot create category – organizationId is NULL");
        throw new Error("Organization ID is not set");
      }
      // console.log("➕ Creating category:", newCategory);
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token");
        }

        // API only accepts name and description
        const apiPayload = {
          name: newCategory.name,
          description: newCategory.description,
        };

        // Visual settings to save locally after creation
        const visualSettings = {
          iconId: newCategory.iconId,
          colorValue: newCategory.colorValue,
          bgClass: newCategory.bgClass,
        };

        console.log("📤 Create category API payload:", apiPayload);
        console.log("📤 Visual settings to save locally:", visualSettings);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/organizations/${organizationId}/categories`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiPayload),
          }
        );

        // console.log("📥 Create response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Create error:", errorText);
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(
              errorData.message ||
                `Failed to create category: ${response.status}`
            );
          } catch (parseError) {
            if (
              parseError instanceof Error &&
              parseError.message.includes("already exists")
            ) {
              throw parseError;
            }
            throw new Error(`Failed to create category: ${response.status}`);
          }
        }

        const result = (await response.json()) as
          | { data?: ApiCategory }
          | ApiCategory;
        // console.log("✅ Category created:", result);

        const apiData = "data" in result ? result.data : result;
        if (!apiData) {
          throw new Error("No category data in response");
        }

        const categoryId = String(
          (apiData as ApiCategory).id || (apiData as ApiCategory)._id || ""
        );

        // Save visual settings to localStorage
        if (categoryId) {
          const savedVisuals = JSON.parse(
            localStorage.getItem("categoryVisuals") || "{}"
          );
          savedVisuals[categoryId] = visualSettings;
          localStorage.setItem("categoryVisuals", JSON.stringify(savedVisuals));
          console.log(
            "✅ Saved visual settings for category:",
            categoryId,
            visualSettings
          );
        }

        // Transform will now pick up the saved visual settings
        const createdCategory = transformApiCategory(apiData as ApiCategory);

        // Merge with visual settings explicitly
        const categoryWithVisuals: Category = {
          ...createdCategory,
          iconId: visualSettings.iconId || createdCategory.iconId,
          colorValue: visualSettings.colorValue || createdCategory.colorValue,
          bgClass: visualSettings.bgClass || createdCategory.bgClass,
        };

        setCategories((prev) => [categoryWithVisuals, ...prev]);
      } catch (err: unknown) {
        console.error("❌ Create category error:", err);
        throw err instanceof Error
          ? err
          : new Error("Failed to create category");
      }
    },
    [organizationId]
  );

  const updateCategory = useCallback(
    async (id: string, updates: Partial<Category>) => {
      if (!organizationId) {
        throw new Error("No organizationId");
      }
      if (!id) {
        throw new Error("Category ID is required");
      }
      // console.log("✏️ Updating category:", id, updates);
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token");
        }

        // API only accepts name and description
        const apiPayload: { name?: string; description?: string } = {};
        if (updates.name !== undefined) apiPayload.name = updates.name;
        if (updates.description !== undefined)
          apiPayload.description = updates.description;

        // Visual settings (iconId, colorValue, bgClass) are stored locally
        const visualUpdates: Partial<
          Pick<Category, "iconId" | "colorValue" | "bgClass">
        > = {};
        if (updates.iconId !== undefined) visualUpdates.iconId = updates.iconId;
        if (updates.colorValue !== undefined)
          visualUpdates.colorValue = updates.colorValue;
        if (updates.bgClass !== undefined)
          visualUpdates.bgClass = updates.bgClass;

        console.log("📤 Update API payload:", apiPayload);
        console.log("📤 Visual updates (local):", visualUpdates);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/organizations/${organizationId}/categories/${id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiPayload),
          }
        );

        // console.log("📥 Update response status:", response.status);

        if (!response.ok) {
          let errorMessage = "Failed to update category";
          try {
            const errorData = await response.json();
            errorMessage =
              errorData?.message || errorData?.error || errorMessage;
          } catch {
            // If JSON parse fails, try reading as text
            try {
              const text = await response.text();
              if (text) errorMessage = text;
            } catch {}
          }

          console.error("Update category failed:", {
            status: response.status,
            statusText: response.statusText,
            errorMessage,
            url: response.url,
          });

          throw new Error(errorMessage || `HTTP ${response.status}`);
        }

        const result = (await response.json()) as
          | { data?: ApiCategory }
          | ApiCategory;
        // console.log("✅ Category updated:", result);

        const apiData = "data" in result ? result.data : result;
        if (!apiData) {
          throw new Error("No category data in response");
        }

        const updatedFromApi = transformApiCategory(apiData as ApiCategory);

        // Merge API response with visual updates (stored locally)
        setCategories((prev) =>
          prev.map((cat) => {
            if (cat.id === id) {
              return {
                ...updatedFromApi,
                // Preserve visual settings from updates or keep existing
                iconId: visualUpdates.iconId || cat.iconId,
                colorValue: visualUpdates.colorValue || cat.colorValue,
                bgClass: visualUpdates.bgClass || cat.bgClass,
              };
            }
            return cat;
          })
        );

        // Save visual settings to localStorage for persistence
        if (Object.keys(visualUpdates).length > 0) {
          const savedVisuals = JSON.parse(
            localStorage.getItem("categoryVisuals") || "{}"
          );
          savedVisuals[id] = { ...savedVisuals[id], ...visualUpdates };
          localStorage.setItem("categoryVisuals", JSON.stringify(savedVisuals));
        }
      } catch (err: unknown) {
        console.error("❌ Update category error:", err);
        throw err instanceof Error
          ? err
          : new Error("Failed to update category");
      }
    },
    [organizationId]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      if (!organizationId) {
        throw new Error("No organizationId");
      }
      // console.log("🗑️ Deleting category:", id);
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/v1/organizations/${organizationId}/categories/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("📥 Delete response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Delete error:", errorText);
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(
              errorData.message ||
                `Failed to delete category: ${response.status}`
            );
          } catch (parseError) {
            if (
              parseError instanceof Error &&
              parseError.message.includes("Cannot delete")
            ) {
              throw parseError;
            }
            throw new Error(`Failed to delete category: ${response.status}`);
          }
        }

        // console.log("✅ Category deleted");
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } catch (err: unknown) {
        console.error("❌ Delete category error:", err);
        throw err instanceof Error
          ? err
          : new Error("Failed to delete category");
      }
    },
    [organizationId]
  );

  const getTotalProducts = useCallback(() => {
    return categories.reduce((sum, cat) => sum + cat.products, 0);
  }, [categories]);

  const getActiveCategories = useCallback(() => {
    return categories.filter((cat) => cat.status === "Active").length;
  }, [categories]);

  const getEmptyCategories = useCallback(() => {
    return categories.filter((cat) => cat.status === "Empty").length;
  }, [categories]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        addCategory,
        updateCategory,
        deleteCategory,
        refreshCategories,
        getTotalProducts,
        getActiveCategories,
        getEmptyCategories,
        organizationId,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
