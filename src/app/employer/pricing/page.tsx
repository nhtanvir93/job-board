import { Metadata } from "next";

import PricingTable from "@/services/clerk/components/PricingTable";

export const metadata: Metadata = {
  description: "Employer can upgrade his subscription plan.",
  title: "Pricing | Job Board",
};

const PricingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <PricingTable />
    </div>
  );
};

export default PricingPage;
