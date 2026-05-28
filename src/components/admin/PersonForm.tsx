"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Tomb } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PersonFormProps {
  tombs: Tomb[];
  onSuccess?: () => void;
}

interface FamilyMember {
  relation: string;
  name: string;
}

export function PersonForm({ tombs, onSuccess }: PersonFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    dateOfDeath: "",
    tombId: tombs[0]?.id || "",
    description: "",
    history: "",
  });

  useEffect(() => {
    if (tombs.length > 0 && !formData.tombId) {
      setFormData((prev) => ({ ...prev, tombId: tombs[0].id }));
    }
  }, [tombs, formData.tombId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFamilyMember = () => {
    setFamilyMembers([...familyMembers, { relation: "", name: "" }]);
  };

  const handleRemoveFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const handleFamilyMemberChange = (
    index: number,
    field: keyof FamilyMember,
    value: string
  ) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("dateOfDeath", formData.dateOfDeath);
      formDataToSend.append("tombId", formData.tombId);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("history", formData.history);
      formDataToSend.append("familyMembers", JSON.stringify(familyMembers));

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const response = await fetch("/api/persons", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create person");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/persons");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <Card>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Assign to Tomb
            </label>
            <select
              value={formData.tombId}
              onChange={(e) =>
                setFormData({ ...formData, tombId: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a tomb</option>
              {tombs.map((tomb) => (
                <option key={tomb.id} value={tomb.id}>
                  {tomb.id} - {tomb.location}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
            required
          />
          <Input
            label="Date of Death"
            type="date"
            value={formData.dateOfDeath}
            onChange={(e) =>
              setFormData({ ...formData, dateOfDeath: e.target.value })
            }
            required
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Photo</h3>
        <div className="space-y-4">
          <Input
            label="Upload Photo"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="relative w-32 h-40">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Biography</h3>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="A brief description of the person"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Life History
            </label>
            <textarea
              placeholder="A longer account of the person's life"
              value={formData.history}
              onChange={(e) =>
                setFormData({ ...formData, history: e.target.value })
              }
              rows={5}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Family Members</h3>
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddFamilyMember}
          >
            Add Member
          </Button>
        </div>
        <div className="space-y-3">
          {familyMembers.map((member, index) => (
            <div key={index} className="flex gap-2 items-end">
              <Input
                placeholder="Relation (e.g., Son, Daughter)"
                value={member.relation}
                onChange={(e) =>
                  handleFamilyMemberChange(index, "relation", e.target.value)
                }
              />
              <Input
                placeholder="Name"
                value={member.name}
                onChange={(e) =>
                  handleFamilyMemberChange(index, "name", e.target.value)
                }
              />
              <Button
                type="button"
                variant="danger"
                onClick={() => handleRemoveFamilyMember(index)}
                className="whitespace-nowrap"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Button type="submit" disabled={isLoading} variant="primary">
        {isLoading ? "Creating..." : "Create Person"}
      </Button>
    </form>
  );
}
