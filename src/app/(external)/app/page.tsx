/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React from "react";
import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";

import {
  Organization,
  Invitation,
  OrganizationFormData,
  initialInvitations,
} from "@/components/app/constants";

import { getMyInvitations, InvitationData } from "@/services/authService";

import Header from "@/components/app/Header";
import OrganizationsGrid from "@/components/app/OrganizationsGrid";
import EmptyState from "@/components/app/EmptyState";
import DeleteConfirmationModal from "@/components/app/DeleteConfirmationModal";
import CreateEditOrgModal from "@/components/app/CreateEditOrgModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.staging.soma.emerj.net";

interface ApiOrganization {
	id: string;
	name: string;
	description?: string;
	status?: string;
	memberCount?: number;
	member_count?: number;
	productCount?: number;
	createdOn?: string;
	createdAt?: string;
	lastModifiedOn?: string;
	updatedAt?: string;
}

function OnboardingPageContent() {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [invitations, setInvitations] =
    useState<Invitation[]>(initialInvitations);

  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);

  const [filter, setFilter] = useState<"all" | "my">("all");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    description: "",
    status: "owner",
    memberCount: 1,
  });

  // 🔥 Fetch Organizations
  const fetchOrganizations = useCallback(async () => {
    if (typeof window === "undefined") return;

    setIsLoading(true);

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        toast.error("Not authenticated. Please sign in.");
        router.push("/signin");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/organizations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        toast.error("Session expired. Please sign in again.");
        router.push("/signin");
        return;
      }

      const json = await res.json();
      console.log("📦 Organizations API Response:", json);
      const list: ApiOrganization[] = json?.data?.content ?? json?.data ?? [];
      console.log("📦 Extracted organizations list:", list);

      const mapped: Organization[] = list.map((org) => ({
        id: org.id,
        name: org.name,
        description: org.description ?? "",
        status: (org.status as "owner" | "admin") ?? "owner",
        memberCount: org.memberCount ?? org.member_count ?? 1,
        productCount: org.productCount ?? 0,
        createdAt: new Date(org.createdOn ?? org.createdAt ?? Date.now()),
        updatedAt: org.lastModifiedOn
          ? new Date(org.lastModifiedOn)
          : org.updatedAt
          ? new Date(org.updatedAt)
          : undefined,
        isOwner: true,
        deleted: false,
      }));

      setOrganizations(mapped);

      // if (mapped.length > 0) {
      //   localStorage.setItem("organizationId", mapped[0].id);
      // }
    } catch (err) {
      toast.error("Failed to fetch organizations");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // 🔥 Fetch Pending Invitations
  const fetchPendingInvitations = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) return;
      

      const response = await getMyInvitations({
        status: "PENDING",
        page: 0,
        size: 20,
      });
      console.log("📨 Invitations API Response:", response);

      if (response.status === "success" || response.status_code === 200) {
        const apiInvitations: InvitationData[] = Array.isArray(response.data)
          ? response.data
          : response.data && "content" in response.data
          ? response.data.content
          : [];
        console.log("📨 Extracted invitations:", apiInvitations);

        // Map API invitations to local Invitation type
        const mappedInvitations: Invitation[] = apiInvitations.map((inv) => ({
          id: inv.id,
          organizationId: inv.organizationId,
          organizationName: inv.organizationName,
          inviterName: inv.inviterName,
          inviteeEmail: inv.inviteeEmail,
          role: inv.role,
          status: inv.status,
          createdOn: inv.createdOn,
          // Legacy fields for backward compatibility
          name: inv.organizationName,
          invitedBy: inv.inviterName,
          daysAgo: Math.floor(
            (Date.now() - new Date(inv.createdOn).getTime()) /
              (1000 * 60 * 60 * 24)
          ),
          accepted: false,
          declined: false,
        }));

        setInvitations(mappedInvitations);
      }
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      fetchOrganizations();
      fetchPendingInvitations();
    }
  }, [fetchOrganizations, fetchPendingInvitations]);

  // 🔥 Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "owner",
      memberCount: 1,
    });
  };

  // 🔥 Input Change Handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "memberCount" ? parseInt(value) || 0 : value,
    }));
  };

  // 🔥 Create or Update Org
  const handleCreateOrUpdate = useCallback(async () => {
    if (!formData.name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    if (typeof window === "undefined") return;

    try {
      setIsSaving(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        toast.error("Not authenticated. Please sign in.");
        router.push("/signin");
        return;
      }

      if (editingOrg) {
        console.log("Editing Org:", editingOrg);
        // UPDATE
        const response = await fetch(
          `${API_BASE_URL}/api/v1/organizations/${editingOrg.id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              description: formData.description,
            }),
          }
        );

        if (!response.ok) {
          toast.error("Failed to update organization");
          return;
        }

        const result = await response.json();

        setOrganizations((prev) =>
          prev.map((org) =>
            org.id === editingOrg.id
              ? {
                  ...org,
                  name: result.data?.name ?? formData.name,
                  description: result.data?.description ?? formData.description,
                  updatedAt: new Date(result.data?.lastModifiedOn),
                }
              : org
          )
        );

        toast.success("Organization updated!");
      } else {
        // CREATE
        const requestBody = {
          name: formData.name.trim(),
          description: formData.description?.trim() || "",
        };
        console.log("Creating org with:", requestBody);
        console.log("Token:", token?.substring(0, 20) + "...");

        const response = await fetch(`${API_BASE_URL}/api/v1/organizations`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify(requestBody),
        });

        const text = await response.text();
        console.log("Create org response:", text);

        if (!response.ok) {
          const errorData = text ? JSON.parse(text) : {};
          toast.error(
            errorData.message ||
              `Failed to create organization (${response.status})`
          );
          return;
        }

        const result = JSON.parse(text);

        if (!result.data) {
          toast.error("Invalid response from server");
          console.error("Invalid response:", result);
          return;
        }

        const newOrg: Organization = {
          id: result.data.id,
          name: result.data.name,
          description: result.data.description || "",
          status: "owner",
          memberCount: 1,
          productCount: 0,
          createdAt: new Date(result.data.createdOn || Date.now()),
          isOwner: true,
          deleted: false,
        };

        setOrganizations((prev) => [...prev, newOrg]);
        // localStorage.setItem("organizationId", newOrg.id);

        toast.success("Organization created!");
      }

      resetForm();
      setEditingOrg(null);
      setShowCreateEditModal(false);
    } catch (error) {
      console.error("Save organization error:", error);
      toast.error("Failed to save organization");
    } finally {
      setIsSaving(false);
    }
  }, [formData, editingOrg, router]);

  // 🔥 Delete
  const handleConfirmDelete = async () => {
    if (!orgToDelete) return;
    if (typeof window === "undefined") return;

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        toast.error("Failed to delete organization");
        return;
      }

      setOrganizations((prev) =>
        prev.filter((org) => org.id !== orgToDelete.id)
      );

      toast.success("Organization deleted");
    } catch {
      toast.error("Error deleting organization");
    } finally {
      setShowDeleteModal(false);
      setOrgToDelete(null);
    }
  };

  // 🔥 Invitations
  const handleAcceptInvitation = async (
    id: string,
    invitationToken?: string
  ) => {
    try {
      // If we have an invitation token, use the token-based endpoint
      if (invitationToken) {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/invitations/accept?token=${encodeURIComponent(
            invitationToken
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          toast.success("Invitation accepted!");
          fetchPendingInvitations();
          fetchOrganizations();
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.message || "Failed to accept invitation");
        }
        return;
      }

      // Fallback: Try the ID-based endpoint with auth
      const authToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!authToken) {
        toast.error("Not authenticated. Please sign in.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/invitations/${id}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Invitation accepted!");
        fetchPendingInvitations();
        fetchOrganizations();
      } else {
        const errorData = await response.json().catch(() => ({}));
        // If the ID-based endpoint doesn't work, show helpful message
        if (response.status === 404 || response.status === 400) {
          toast.error(
            "Please use the invitation link sent to your email to accept this invitation."
          );
        } else {
          toast.error(errorData.message || "Failed to accept invitation");
        }
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (id: string) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        toast.error("Not authenticated. Please sign in.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/invitations/${id}/decline`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.info("Invitation declined");
        fetchPendingInvitations();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to decline invitation");
      }
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast.error("Failed to decline invitation");
    }
  };

  // 🔥 Derived Values
  const activeOrganizations = useMemo(
    () => organizations.filter((o) => !o.deleted),
    [organizations]
  );

  const filteredOrgs = useMemo(
    () =>
      filter === "my"
        ? activeOrganizations.filter((o) => o.isOwner)
        : activeOrganizations,
    [filter, activeOrganizations]
  );

  const myOrgsCount = activeOrganizations.filter((o) => o.isOwner).length;

  const pendingInvitationsCount = invitations.filter(
    (i) => !i.accepted && !i.declined
  ).length;

  // 🔥 Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 border-b-2 border-[#800020] rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header
        invitations={invitations}
        pendingInvitationsCount={pendingInvitationsCount}
        onAccept={handleAcceptInvitation}
        onDecline={handleDeclineInvitation}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeOrganizations.length === 0 ? (
          <EmptyState onCreateOrg={() => setShowCreateEditModal(true)} />
        ) : (
          <OrganizationsGrid
            organizations={organizations}
            filteredOrgs={filteredOrgs}
            myOrgsCount={myOrgsCount}
            filter={filter}
            setFilter={setFilter}
            invitations={invitations}
            onAccept={handleAcceptInvitation}
            onDecline={handleDeclineInvitation}
            onCreateOrg={() => setShowCreateEditModal(true)}
            onEditOrg={(org) => {
              setEditingOrg(org);
              setFormData({
                name: org.name,
                description: org.description,
                status: org.status,
                memberCount: org.memberCount,
              });
              setShowCreateEditModal(true);
            }}
            onDeleteOrg={(id) => {
              const org = organizations.find((o) => o.id === id);
              if (org) {
                setOrgToDelete(org);
                setShowDeleteModal(true);
              }
            }}
            onSelectOrg={(id) => {
              if (typeof window !== "undefined") {
                localStorage.setItem("organizationId", id as string);
                sessionStorage.setItem("organizationId", id as string);
              }
            }}
            hasActiveOrganizations={activeOrganizations.length > 0}
          />
        )}
      </main>

      {/* CREATE / EDIT MODAL */}
      <CreateEditOrgModal
        show={showCreateEditModal}
        editingOrg={editingOrg}
        formData={formData}
        onClose={() => {
          resetForm();
          setEditingOrg(null);
          setShowCreateEditModal(false);
        }}
        onInputChange={handleInputChange}
        onSave={handleCreateOrUpdate}
        isSaving={isSaving}
      />

      {/* DELETE MODAL */}
      {showDeleteModal && orgToDelete && (
        <DeleteConfirmationModal
          organization={orgToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setOrgToDelete(null);
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
}

// Export with dynamic import and SSR disabled
export default dynamicImport(() => Promise.resolve(OnboardingPageContent), {
  ssr: false,
});
