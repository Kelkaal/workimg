import React from "react";
import { Organization, OrganizationFormData } from "./constants";

interface CreateEditOrgModalProps {
  show: boolean;
  editingOrg: Organization | null;
  formData: OrganizationFormData;
  onClose: () => void;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSave: () => void;
  isSaving?: boolean;
}

const CreateEditOrgModal: React.FC<CreateEditOrgModalProps> = ({
  show,
  editingOrg,
  formData,
  onClose,
  onInputChange,
  onSave,
  isSaving = false,
}) => {
  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {editingOrg ? "Edit Organization" : "Create Organization"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="e.g., Tech Solutions Inc."
                disabled={isSaving}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                placeholder="Brief description of your organization"
                rows={3}
                disabled={isSaving}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition active:scale-[0.98] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-[#800020] text-white rounded-lg font-semibold hover:bg-[#600018] transition shadow-md active:scale-[0.98] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    {editingOrg ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{editingOrg ? "Update" : "Create"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEditOrgModal;
