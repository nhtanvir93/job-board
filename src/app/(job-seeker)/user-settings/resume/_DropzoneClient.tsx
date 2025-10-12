"use client";

import { useRouter } from "next/navigation";

import { revalidateUserResume } from "@/features/users/actions/revalidateCache";
import { UploadDropzone } from "@/services/uploadthing/components/UploadThing";

const DropzoneClient = ({ userId }: { userId: string }) => {
  const router = useRouter();
  return (
    <UploadDropzone
      endpoint="resumeUploader"
      onClientUploadComplete={async () => {
        await revalidateUserResume(userId);
        router.refresh();
      }}
    />
  );
};

export default DropzoneClient;
