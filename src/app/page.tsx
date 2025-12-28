"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CalendarPlus, Search, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ActionCard } from "@/components/home/ActionCard";
import { RecentActivity } from "@/components/home/RecentActivity";
import { TrustSection } from "@/components/home/TrustSection";
import { ServiceHighlights } from "@/components/home/ServiceHighlights";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Welcome / Hero */}
        <HeroSection />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 -mt-8 relative z-20">
          {/* Primary Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <ActionCard
              title="Book a Service"
              description="Schedule a new maintenance visit or repair with our expert technicians."
              icon={CalendarPlus}
              actionText="Book Now"
              className="md:col-span-1"
            />
            <ActionCard
              title="Track Request"
              description="Check the real-time status of your ongoing service requests."
              icon={Search}
              actionText="View Status"
            />
            <ActionCard
              title="Support & Help"
              description="Need assistance? Contact our support team for quick resolutions."
              icon={HelpCircle}
              actionText="Get Help"
            />
          </motion.div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/10">
                <h3 className="font-semibold text-primary mb-2">Pro Tip</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Did you know you can schedule recurring maintenance to avoid unexpected breakdowns?
                </p>
                <button className="text-sm font-medium text-primary hover:underline">
                  Learn more &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Highlights */}
        <ServiceHighlights />

        {/* Cross-Platform Note */}
        <TrustSection />
      </main>

      <Footer />
    </div>
  );
}
