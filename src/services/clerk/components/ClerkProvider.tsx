"use client";

import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ReactNode, Suspense } from "react";

import useIsDarkMode from "@/hooks/useIsDarkMode";

const ClerkProvider = ({ children }: { children: ReactNode }) => {
  const isDarkMode = useIsDarkMode();
  return (
    <Suspense fallback={<p>Loading Clerk...</p>}>
      <OriginalClerkProvider
        appearance={isDarkMode ? { baseTheme: [dark] } : undefined}
      >
        {children}
      </OriginalClerkProvider>
    </Suspense>
  );
};

export default ClerkProvider;
