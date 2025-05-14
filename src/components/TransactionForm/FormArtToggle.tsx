import React, { useState } from "react";
import { TransactionForm } from "./TransactionForm";
import { ArtisticTransactionForm } from "./ArtisticTransactionForm";
import { Palette, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./ArtisticForm.css";

interface FormArtToggleProps {
  defaultArtistic?: boolean;
}

export function FormArtToggle({ defaultArtistic = false }: FormArtToggleProps) {
  const [isArtistic, setIsArtistic] = useState(defaultArtistic);

  return (
    <div className="relative">
      {/* Toggle button floating in fixed position */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => setIsArtistic(!isArtistic)}
          className={`
            rounded-full w-14 h-14 p-0 shadow-lg 
            ${isArtistic 
              ? "bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700" 
              : "bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"}
          `}
          aria-label={isArtistic ? "Switch to standard view" : "Switch to artistic view"}
        >
          {isArtistic ? (
            <Layout className="h-6 w-6 text-white" />
          ) : (
            <Palette className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>

      {/* Form components */}
      {isArtistic ? (
        <ArtisticTransactionForm />
      ) : (
        <TransactionForm />
      )}
    </div>
  );
}
