import { ReactNode, Suspense } from "react";

interface Props {
  condition: () => Promise<boolean>;
  children: ReactNode;
  loadingFallback?: ReactNode;
  otherwise?: ReactNode;
}

export function AsyncIf(props: Props) {
  return (
    <Suspense fallback={props.loadingFallback}>
      <AsyncIfSuspense {...props} />
    </Suspense>
  );
}

const AsyncIfSuspense = async ({
  condition,
  children,
  otherwise,
}: Omit<Props, "loadingFallback">) => {
  return (await condition()) ? children : otherwise;
};
