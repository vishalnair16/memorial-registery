import { Card } from "@/components/ui/Card";
import { TombForm } from "@/components/admin/TombForm";
import Link from "next/link";

export default function CreateTombPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/tombs" className="text-blue-600 hover:text-blue-700">
          ← Back to Tombs
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Create New Tomb</h1>
        <p className="text-gray-600 mt-2">Add a new tomb location to the registry</p>
      </div>

      <Card>
        <TombForm />
      </Card>
    </div>
  );
}
