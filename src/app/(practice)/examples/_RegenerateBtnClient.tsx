"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { generateNewRandomNumber } from "./examples";

const RegenerateBtnClient = () => {
  const router = useRouter();

  async function handleClick() {
    const result = await generateNewRandomNumber();
    console.log(result.message);

    router.refresh();
  }

  return <Button onClick={handleClick}>Regenerate</Button>;
};

export default RegenerateBtnClient;
