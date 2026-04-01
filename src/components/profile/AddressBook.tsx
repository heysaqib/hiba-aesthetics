"use client";

import { useState } from "react";
import { addAddress, deleteAddress } from "@/features/auth/auth-actions";
import { Loader2, Plus, Trash2, MapPin } from "lucide-react";

export default function AddressBook({ addresses }: { addresses: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    await addAddress(formData);
    setIsLoading(false);
    setIsAdding(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this address?")) {
      await deleteAddress(id);
    }
  }

  return (
    <div className="space-y-8">
      {/* Address Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address._id} className="border border-brand-charcoal/10 p-6 relative bg-white/50 backdrop-blur-sm group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-brand-cream p-2 rounded-full">
                <MapPin className="w-4 h-4 text-brand-charcoal/40" />
              </div>
              <button 
                onClick={() => handleDelete(address._id)}
                className="text-brand-charcoal/20 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-sm tracking-wide uppercase">{address.name}</p>
              <p className="text-xs text-brand-charcoal/60">{address.mobile}</p>
              <p className="text-sm pt-2">{address.street}</p>
              <p className="text-sm">{address.city}, {address.state} {address.zipCode}</p>
            </div>
            {address.isDefault && (
              <div className="mt-4 inline-block bg-brand-charcoal text-white text-[8px] px-2 py-1 uppercase tracking-widest font-bold">
                Default
              </div>
            )}
          </div>
        ))}

        {/* Add New Button */}
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="border-2 border-dashed border-brand-charcoal/10 p-6 flex flex-col items-center justify-center space-y-2 hover:border-brand-gold transition-colors group h-full"
          >
            <Plus className="w-6 h-6 text-brand-charcoal/20 group-hover:text-brand-gold transition-colors" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-charcoal/40">Add New Address</span>
          </button>
        )}
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-white/50 backdrop-blur-sm border border-brand-charcoal/10 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold">New Delivery Address</h3>
            <button onClick={() => setIsAdding(false)} className="text-xs uppercase tracking-widest text-brand-charcoal/40 hover:text-brand-charcoal">Cancel</button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Recipient Name</label>
              <input name="name" required className="w-full border-b border-brand-charcoal/20 bg-transparent py-2 outline-none focus:border-brand-charcoal text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Contact Number</label>
              <input name="mobile" required className="w-full border-b border-brand-charcoal/20 bg-transparent py-2 outline-none focus:border-brand-charcoal text-sm" />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Street Address</label>
              <input name="street" required className="w-full border-b border-brand-charcoal/20 bg-transparent py-2 outline-none focus:border-brand-charcoal text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">City</label>
              <input name="city" required className="w-full border-b border-brand-charcoal/20 bg-transparent py-2 outline-none focus:border-brand-charcoal text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">State / Province</label>
              <input name="state" required className="w-full border-b border-brand-charcoal/20 bg-transparent py-2 outline-none focus:border-brand-charcoal text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Zip Code</label>
              <input name="zipCode" required className="w-full border-b border-brand-charcoal/20 bg-transparent py-2 outline-none focus:border-brand-charcoal text-sm" />
            </div>
            <div className="sm:col-span-2 flex items-center space-x-2 py-2">
              <input type="checkbox" name="isDefault" id="isDefault" className="w-4 h-4 accent-brand-charcoal" />
              <label htmlFor="isDefault" className="text-xs uppercase tracking-widest font-medium text-brand-charcoal/60">Set as default address</label>
            </div>
            <div className="sm:col-span-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brand-charcoal text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-gold transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
