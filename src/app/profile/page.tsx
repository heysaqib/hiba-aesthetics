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
    <div className="bg-brand-cream min-h-screen pt-32 pb-24 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-20">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif text-brand-charcoal tracking-tight">
              Account <span className="text-brand-gold italic">Settings</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-charcoal/40 font-bold">
              Personal sanctuary & preferences
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="space-y-24">
          {/* Profile Section */}
          <section className="max-w-2xl">
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center border border-brand-gold/20">
                <span className="text-brand-gold font-serif text-xl">
                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </span>
              </div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-charcoal">
                Profile Information
              </h2>
            </div>
            <ProfileForm user={user} />
          </section>

          {/* Address Section */}
          <section>
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center border border-brand-gold/20 text-brand-gold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-charcoal">
                Delivery Destinations
              </h2>
            </div>
            <AddressBook 
              addresses={user.addresses || []} 
              isProfileComplete={!!(user.name && user.mobileNumber)} 
            />
          </section>
        </div>
      </div>
    </div>
  );
}
