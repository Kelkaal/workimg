"use client";

import { Download, Check, X, Eye, CreditCard, Plus, Pencil, Trash2 } from "lucide-react";
import PageHeader from "@/components/dashboard/DashboardHeader";

export default function BillingPage() {
  return (
    <>
      <PageHeader
        title="Billing & Plans"
        subtitle="Manage your subscription and billing information"
        rightContent={
          <>
            <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              <Check className="w-3 h-3" />
              Professional Plan
            </button>
            <button className="flex items-center gap-2 bg-[#800020] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#600018] transition-colors">
              <Download className="w-3.5 h-3.5" />
              Download Invoice
            </button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Current Plan Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900">Current Plan</h2>
              <p className="text-sm text-gray-600">Professional Plan - Billed Monthly</p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$49</span>
                <span className="text-lg text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600">Next billing: February 28, 2025</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-[#800020]">5,000</div>
              <div className="text-xs text-gray-600 mt-1">Items Limit</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-[#800020]">25</div>
              <div className="text-xs text-gray-600 mt-1">Users</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-[#800020]">50GB</div>
              <div className="text-xs text-gray-600 mt-1">Storage</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-[#800020]">24/7</div>
              <div className="text-xs text-gray-600 mt-1">Support</div>
            </div>
          </div>
        </div>

        {/* Choose Your Plan Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="text-sm text-gray-600">Select the perfect plan for your inventory management needs</p>
            
            {/* Toggle */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Monthly</span>
              <div className="relative w-11 h-6 bg-gray-200 rounded-full cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
              <span className="text-sm text-gray-600">Yearly <span className="text-[#800020] font-semibold">(Save 20%)</span></span>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Free Plan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">$0</span>
                  <span className="text-sm text-gray-600">/month</span>
                </div>
                <p className="text-xs text-gray-600">Perfect for small teams getting started</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">100 items • 3 users • 1GB storage</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Basic reporting • Email support</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <X className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Advanced features • API access</span>
                </div>
              </div>

              <button className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Current Plan
              </button>
            </div>

            {/* Basic Plan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Basic</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">$19</span>
                  <span className="text-sm text-gray-600">/month</span>
                </div>
                <p className="text-xs text-gray-600">Great for growing businesses</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">1,000 items • 10 users • 10GB storage</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Advanced reporting • Priority support</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Low stock alerts</span>
                </div>
              </div>

              <button className="w-full py-2.5 bg-[#800020] text-white rounded-lg text-sm font-medium hover:bg-[#600018] transition-colors">
                Upgrade to Basic
              </button>
            </div>

            {/* Professional Plan - Current */}
            <div className="bg-white rounded-xl border-2 border-[#800020] shadow-sm p-4 space-y-4 relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#800020] text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                CURRENT
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Professional</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">$49</span>
                  <span className="text-sm text-gray-600">/month</span>
                </div>
                <p className="text-xs text-gray-600">Perfect for established businesses</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">5,000 items • 25 users • 50GB storage</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Advanced analytics • 24/7 support</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Custom fields • Basic API access</span>
                </div>
              </div>

              <button className="w-full py-2.5 border border-[#800020] text-[#800020] rounded-lg text-sm font-medium hover:bg-[#800020] hover:text-white transition-colors">
                Manage Plan
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">$99</span>
                  <span className="text-sm text-gray-600">/month</span>
                </div>
                <p className="text-xs text-gray-600">For large organizations with complex needs</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited items & users • 500GB storage</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Advanced insights • Dedicated manager</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Custom integrations • Full API</span>
                </div>
              </div>

              <button className="w-full py-2.5 bg-[#800020] text-white rounded-lg text-sm font-medium hover:bg-[#600018] transition-colors">
                Upgrade to Enterprise
              </button>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900">Billing History</h2>
              <p className="text-sm text-gray-600">View and download your past invoices</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export All
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Plan</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">#INV-2025-001</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Jan 28, 2025</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Professional</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">$49.00</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      <Check className="w-2.5 h-2.5" />
                      Paid
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-4">
                      <button className="text-[#800020] hover:text-[#600018]">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">#INV-2024-012</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Dec 28, 2024</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Professional</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">$49.00</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      <Check className="w-2.5 h-2.5" />
                      Paid
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-4">
                      <button className="text-[#800020] hover:text-[#600018]">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">#INV-2024-011</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Nov 28, 2024</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Basic</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">$19.00</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      <Check className="w-2.5 h-2.5" />
                      Paid
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-4">
                      <button className="text-[#800020] hover:text-[#600018]">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              <p className="text-sm text-gray-600">Manage your payment information</p>
            </div>
            <button className="flex items-center gap-2 bg-[#800020] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#600018] transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add Payment Method
            </button>
          </div>

          {/* Payment Card */}
          <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-xs text-gray-600">Expires 12/2027</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-green-800 bg-green-100 px-2 py-1 rounded">Default</span>
              <button className="text-gray-400 hover:text-gray-600">
                <Pencil className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}