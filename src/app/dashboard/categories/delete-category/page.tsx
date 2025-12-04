/* eslint-disable react-hooks/set-state-in-effect */
"use client"; // Important: This page runs only on the client

import { useEffect, useState } from "react";
import { getSafeToken } from "@/services/authService"; // Your SSR-safe helper
import { deleteOrganization } from "@/services/authService"; // Example API call
import { useRouter } from "next/navigation";

export default function DeleteCategoryPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // ✅ Safe client-only access
    const storedToken = getSafeToken();
    if (!storedToken) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }
    setToken(storedToken);
    setLoading(false);
  }, []);

  const handleDelete = async (categoryId: number) => {
    if (!token) return;
    try {
      const res = await deleteOrganization(categoryId); // or deleteCategory if you have
      if (res.status === "success") {
        alert("Category deleted successfully!");
        router.push("/dashboard/categories");
      } else {
        alert(`Error: ${res.message}`);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message || "Failed to delete category.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Delete Category</h1>
      <button
        onClick={() => handleDelete(123)} // Replace 123 with dynamic categoryId
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Category
      </button>
    </div>
  );
}
