"use client";

import React, { useState } from 'react';
import { useInventoryData } from '@/contexts/InventoryDataContext';
import { Product } from '@/types/inventory';

export default function CheckInOutModal({ 
  isOpen, 
  onClose, 
  type,
  product
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  type: 'in' | 'out' | null;
  product: Product | null;
}) {
  const { checkIn, checkOut } = useInventoryData();
  const [amount, setAmount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !type) return;
    
    if (type === 'in') {
      checkIn(product.id, amount);
    } else {
      checkOut(product.id, amount);
    }
    
    setAmount(1);
    onClose();
  };

  if (!isOpen || !type || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {type === 'in' ? 'Check In Stock' : 'Check Out Stock'}
        </h2>
        
        {product && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">Current Stock: {product.quantity} units</div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'in' ? 'Amount to Add' : 'Amount to Remove'}
            </label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 text-white rounded-lg text-sm font-medium ${
                type === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {type === 'in' ? 'Check In' : 'Check Out'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}