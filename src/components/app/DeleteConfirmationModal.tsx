import { AlertTriangle, Trash2 } from "lucide-react";
import React from "react";
import { Organization } from "./constants";

interface DeleteConfirmationModalProps {
  organization: Pick<Organization, "name">;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  organization,
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Delete Organization?
        </h3>
        <p className="text-sm text-gray-600 text-center mb-6">
          Are you sure you want to delete <strong>{organization.name}</strong>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md active:scale-[0.98] hover:cursor-pointer"
          >
            <Trash2 className="h-4 w-4 inline mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default DeleteConfirmationModal;
