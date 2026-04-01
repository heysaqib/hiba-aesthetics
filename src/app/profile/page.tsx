import { getUserProfile } from "@/features/auth/auth-actions";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import AddressBook from "@/components/profile/AddressBook";
import LogoutButton from "@/components/profile/LogoutButton";

export default async function ProfilePage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="bg-brand-cream min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-brand-charcoal/10 pb-8">
          <div>
            <h1 className="text-4xl font-serif text-brand-charcoal mb-2">My Profile</h1>
            <p className="text-brand-charcoal/60">Manage your personal information and delivery addresses.</p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Personal Details Section */}
          <div className="md:col-span-1">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-charcoal mb-6">Personal Details</h2>
            <ProfileForm user={user} />
          </div>

          {/* Addresses Section */}
          <div className="md:col-span-2">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-charcoal mb-6">Address Book</h2>
            <AddressBook addresses={user.addresses || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
