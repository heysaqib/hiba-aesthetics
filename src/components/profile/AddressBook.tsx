"use client";

import { useState } from "react";
import { addAddress, deleteAddress, updateAddress, setPrimaryAddress } from "@/features/auth/auth-actions";
import { Loader2, Plus, Trash2, X, Lock, Edit2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddressBookProps {
  addresses: any[];
  isProfileComplete: boolean;
}

export default function AddressBook({ addresses, isProfileComplete }: AddressBookProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = editingAddress 
      ? await updateAddress(editingAddress._id, formData)
      : await addAddress(formData);
    
    setIsLoading(false);
    if (result.success) {
      setIsAdding(false);
      setEditingAddress(null);
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
    }
  }

  async function handleSetPrimary(id: string) {
    setIsLoading(true);
    const result = await setPrimaryAddress(id);
    setIsLoading(false);
    if (result.success) {
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Remove this destination?")) {
      const result = await deleteAddress(id);
      if (result.success) {
        router.refresh();
      }
    }
  }

  return (
    <div className="space-y-12">
      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
        {addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address._id} className="group relative">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal">
                  {address.name} {address.isDefault && <span className="ml-2 text-brand-gold italic">(Primary)</span>}
                </h4>
                <div className="flex items-center space-x-3">
                  {!address.isDefault && (
                    <button 
                      onClick={() => handleSetPrimary(address._id)}
                      className="text-[9px] uppercase tracking-widest font-bold text-brand-charcoal/20 hover:text-brand-gold transition-colors"
                      title="Set as Primary"
                    >
                      Make Primary
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setEditingAddress(address);
                      setIsAdding(true);
                    }}
                    className="text-brand-charcoal/10 hover:text-brand-gold transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(address._id)}
                    className="text-brand-charcoal/10 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-sm text-brand-charcoal/60 font-light leading-relaxed">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p className="pt-2 text-[10px] font-bold tracking-wider text-brand-charcoal/30">{address.mobile}</p>
              </div>

              <div className={`absolute -left-4 top-0 bottom-0 w-px transition-colors ${address.isDefault ? "bg-brand-gold" : "bg-brand-gold/0 group-hover:bg-brand-gold/50"}`} />
            </div>
          ))
        ) : (
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/20 md:col-span-2">No destinations saved yet.</p>
        )}

        {/* Add New Trigger */}
        {!isAdding && (
          isProfileComplete ? (
            <button 
              onClick={() => {
                setEditingAddress(null);
                setIsAdding(true);
              }}
              className="flex items-center space-x-4 text-brand-charcoal/30 hover:text-brand-gold transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-full border border-dashed border-brand-charcoal/20 flex items-center justify-center group-hover:border-brand-gold">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">New Destination</span>
            </button>
          ) : (
            <div className="flex items-center space-x-4 text-brand-charcoal/20 md:col-span-2 bg-brand-charcoal/[0.02] p-6 border border-dashed border-brand-charcoal/10">
              <Lock className="w-4 h-4" />
              <p className="text-[10px] uppercase tracking-[0.15em] font-bold italic">
                Please secure your Full Name and Mobile Number above to unlock delivery addresses.
              </p>
            </div>
          )
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="pt-12 border-t border-brand-charcoal/5 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-charcoal">
              {editingAddress ? "Edit Destination" : "New Destination"}
            </h3>
            <button 
              onClick={() => {
                setIsAdding(false);
                setEditingAddress(null);
              }} 
              className="text-brand-charcoal/20 hover:text-brand-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="mb-8 text-red-500 text-[10px] uppercase tracking-widest font-bold bg-red-50/50 p-4 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/30">Recipient Name</label>
              <input name="name" defaultValue={editingAddress?.name} required className="w-full border-b border-brand-charcoal/10 bg-transparent py-2 outline-none focus:border-brand-gold text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/30">Contact Number</label>
              <input name="mobile" defaultValue={editingAddress?.mobile} required className="w-full border-b border-brand-charcoal/10 bg-transparent py-2 outline-none focus:border-brand-gold text-sm font-medium" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/30">Street Address</label>
              <input name="street" defaultValue={editingAddress?.street} required className="w-full border-b border-brand-charcoal/10 bg-transparent py-2 outline-none focus:border-brand-gold text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/30">City</label>
              <input name="city" defaultValue={editingAddress?.city} required className="w-full border-b border-brand-charcoal/10 bg-transparent py-2 outline-none focus:border-brand-gold text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/30">State</label>
              <input name="state" defaultValue={editingAddress?.state} required className="w-full border-b border-brand-charcoal/10 bg-transparent py-2 outline-none focus:border-brand-gold text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/30">Zip Code</label>
              <input name="zipCode" defaultValue={editingAddress?.zipCode} required className="w-full border-b border-brand-charcoal/10 bg-transparent py-2 outline-none focus:border-brand-gold text-sm font-medium" />
            </div>
            
            <div className="md:col-span-2 flex items-center justify-between pt-4">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" name="isDefault" defaultChecked={editingAddress?.isDefault} className="w-3.5 h-3.5 border-brand-charcoal/20 rounded-none checked:bg-brand-gold accent-brand-gold" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/30 group-hover:text-brand-charcoal transition-colors">Set as primary</span>
              </label>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="inline-flex items-center justify-center space-x-3 bg-brand-gold text-white px-10 py-4 hover:bg-brand-charcoal transition-all duration-300 disabled:opacity-50 shadow-md active:scale-[0.98] min-w-[200px]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                      {editingAddress ? "Update Destination" : "Save Destination"}
                    </span>
                    {editingAddress ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
