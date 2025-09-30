import { useEffect } from "react";
import { toast } from "sonner";
import copyMessages from "@/data/copyMessages.json";

export const useCopyProtection = () => {
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      
      const randomMessage = copyMessages[Math.floor(Math.random() * copyMessages.length)];
      
      if (e.clipboardData) {
        e.clipboardData.setData("text/plain", randomMessage);
      }
      
      toast.error("Copy protection active!", {
        description: "Nice try, but copying is disabled during the quiz.",
        duration: 3000,
      });
    };

    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, []);
};
