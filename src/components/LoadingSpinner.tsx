import { Loader2Icon } from "lucide-react";
import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const LoadingSpinner = ({
  className,
  ...props
}: ComponentProps<typeof Loader2Icon>) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2Icon
        className={cn("animate-spin size-16", className)}
        {...props}
      />
    </div>
  );
};

export default LoadingSpinner;
