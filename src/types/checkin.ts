// API condition types
export type ApiCondition = "GOOD" | "DAMAGED" | "FAULTY" | "LOST";

// Display condition types for UI
export type ItemCondition = "Good" | "Fair" | "Poor" | "Damaged";

// Map display condition to API condition
export const conditionToApi: Record<ItemCondition, ApiCondition> = {
  Good: "GOOD",
  Fair: "GOOD",
  Poor: "DAMAGED",
  Damaged: "DAMAGED",
};

export interface CheckInFormData {
  itemName: string;
  quantityReturned: number;
  userId: string;
  condition: ItemCondition;
  notes: string;
  photos: string[];
  checkOutTransactionId?: string;
}

export interface CheckInItemData {
  productId: string;
  productName: string;
  currentPhotos: string[];
  checkOutTransactionId?: string;
  checkedOutQuantity?: number;
}

export interface CheckOutFormData {
  quantity: number;
  userId: string;
  purpose: string;
}

export interface CheckOutItemData {
  productId: string;
  productName: string;
  availableQuantity?: number;
}
