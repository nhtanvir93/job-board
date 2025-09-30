import { useEffect, useState } from "react";

const useIsDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const controller = new AbortController();

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => setIsDarkMode(event.matches), {
        signal: controller.signal,
      });

    return () => controller.abort();
  }, []);

  return isDarkMode;
};

export default useIsDarkMode;
