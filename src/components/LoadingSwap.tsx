import { Loader2Icon } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Props {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
}

const LoadingSwap = ({ isLoading, children, className }: Props) => {
  return (
    <div className="grid items-center justify-items-center">
      <div
        className={cn(
          "col-start-1 col-end-1 row-start-1 row-end-1",
          isLoading ? "invisible" : "visible",
          className,
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "col-start-1 col-end-1 row-start-1 row-end-1",
          isLoading ? "visible" : "invisible",
          className,
        )}
      >
        <Loader2Icon className="animate-spin" />
      </div>
    </div>
  );
};

export default LoadingSwap;
