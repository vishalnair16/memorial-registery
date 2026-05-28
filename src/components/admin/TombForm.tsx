"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TombFormProps {
  initialData?: { location: string };
  onSuccess?: () => void;
}

export function TombForm({ initialData, onSuccess }: TombFormProps) {
  const router = useRouter();
  const [location, setLocation] = useState(initialData?.location || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tombs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create tomb");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/tombs");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

      <Input
        label="Tomb Location"
        placeholder="e.g., Section A, Row 3, Plot 5"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <Button type="submit" disabled={isLoading} variant="primary">
        {isLoading ? "Creating..." : "Create Tomb"}
      </Button>
    </form>
  );
}
