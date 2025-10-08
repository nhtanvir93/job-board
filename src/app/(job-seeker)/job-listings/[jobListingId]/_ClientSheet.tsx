"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";

import { Sheet } from "@/components/ui/sheet";

const ClientSheet = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (open) return;

        setIsOpen(false);

        router.push(`/?${searchParams.toString()}`);
      }}
      modal
    >
      {children}
    </Sheet>
  );
};

export default ClientSheet;
