"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { ProfileSection } from "./components/ProfileSection";
import { OrdersSection } from "./components/OrdersSection";
import { CartSection } from "./components/CartSection";
import { SecuritySection } from "./components/SecuritySection";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/lib/user-store";
import { RouteGuard } from "@/components/route-guard";

type ProfileSectionType = "profile" | "orders" | "cart" | "security" | "logout";

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useUserStore();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ProfileSectionType>("profile");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  if (activeSection === "logout") {
    handleLogout();
    return null;
  }

  return (
    <RouteGuard protectedRoutes={["/profile"]}>
      <div className="min-h-screen bg-[#0b0b0b]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <Sidebar
              user={user}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
                >
                  {activeSection === "profile" && <ProfileSection user={user} />}
                  {activeSection === "orders" && <OrdersSection />}
                  {activeSection === "cart" && <CartSection />}
                  {activeSection === "security" && <SecuritySection user={user} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

