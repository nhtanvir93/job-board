"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { revalidateUserResumeTest, upSertUserResumeTest } from "../examples";

const ModifyBtnClient = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [revalidating, setRevalidating] = useState(false);

  async function handleClick() {
    setLoading(true);

    const result = await upSertUserResumeTest();
    console.log("Updated User Resume Columns", result.updatedColumns);

    setLoading(false);

    router.refresh();
  }

  const handleRevalidateUserResume = async () => {
    setRevalidating(true);

    await revalidateUserResumeTest();

    setRevalidating(true);

    router.refresh();
  };

  return (
    <>
      <Button onClick={handleClick} disabled={loading}>
        Modify
      </Button>
      <Button variant="secondary" onClick={() => router.refresh()}>
        Reload
      </Button>
      <Button
        variant="outline"
        onClick={() => router.refresh()}
        disabled={revalidating}
      >
        Revalidate
      </Button>
    </>
  );
};

export default ModifyBtnClient;
