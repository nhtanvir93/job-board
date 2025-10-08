"use client";

import { ReactNode, useEffect, useState } from "react";

const IsBreakpoint = ({
  breakpoint,
  children,
  otherwise,
}: {
  breakpoint: string;
  children: ReactNode;
  otherwise?: ReactNode;
}) => {
  const isBreakpoint = useIsBreakpoint(breakpoint);
  return isBreakpoint ? children : otherwise;
};

function useIsBreakpoint(breakpoint: string) {
  const [isBreakpoint, setIsBreakpoint] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const media = window.matchMedia(`(${breakpoint})`);

    media.addEventListener(
      "change",
      (event) => {
        setIsBreakpoint(event.matches);
      },
      { signal: controller.signal },
    );

    setIsBreakpoint(media.matches);

    return () => controller.abort();
  }, [breakpoint]);

  return isBreakpoint;
}

export default IsBreakpoint;
