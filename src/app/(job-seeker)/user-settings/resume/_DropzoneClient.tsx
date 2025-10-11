"use client";

import { useRouter } from "next/navigation";

import { UploadDropzone } from "@/services/uploadthing/components/UploadThing";

const DropzoneClient = () => {
  const router = useRouter();
  return (
    <UploadDropzone
      endpoint="resumeUploader"
      onClientUploadComplete={() => { router.refresh(); }}
    />
  );
};

export default DropzoneClient;
