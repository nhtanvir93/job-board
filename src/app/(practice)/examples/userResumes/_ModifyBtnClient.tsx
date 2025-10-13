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

    setLoading(false);

    router.refresh();
  }

  const handleRevalidateUserResume = async () => {
    setRevalidating(true);

    await revalidateUserResumeTest();

    setRevalidating(false);
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
        onClick={handleRevalidateUserResume}
        disabled={revalidating}
      >
        Revalidate
      </Button>
    </>
  );
};

export default ModifyBtnClient;
