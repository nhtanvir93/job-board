"use client";

import { ComponentPropsWithRef, useTransition } from "react";
import { toast } from "sonner";

import LoadingSwap from "./LoadingSwap";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

interface ConfirmableAction {
  action: () => Promise<{ error: boolean; message?: string }>;
  requireConfirmation?: boolean;
  confirmationMessage?: string;
}

type Props = Omit<ComponentPropsWithRef<typeof Button>, "onClick"> &
  ConfirmableAction;

const ActionButton = ({
  action,
  requireConfirmation,
  confirmationMessage = "This action cannot be undone.",
  ...props
}: Props) => {
  const [isLoading, startTransition] = useTransition();

  const performActon = () => {
    startTransition(async () => {
      const data = await action();
      if (data.error) {
        toast.error(data.message ?? "Error");
      }
    });
  };

  if (requireConfirmation) {
    return (
      <AlertDialog open={isLoading ? true : undefined}>
        <AlertDialogTrigger asChild>
          <Button {...props} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={performActon}>
              <LoadingSwap isLoading={isLoading}>Yes</LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button {...props} disabled={isLoading} onClick={performActon}>
      <LoadingSwap
        isLoading={isLoading}
        className="inline-flex items-center gap-2"
      >
        {props.children}
      </LoadingSwap>
    </Button>
  );
};

export default ActionButton;
