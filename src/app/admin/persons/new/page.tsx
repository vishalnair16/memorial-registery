import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PersonForm } from "@/components/admin/PersonForm";
import { getAllTombs } from "@/lib/data";
import Link from "next/link";

export const revalidate = 60;

export default function CreatePersonPage() {
  const tombs = getAllTombs();

  if (tombs.length === 0) {
    return (
      <div className="max-w-2xl space-y-6">
        <Link href="/admin/persons" className="text-blue-600 hover:text-blue-700">
          ← Back to Persons
        </Link>
        <Card className="bg-amber-50 border border-amber-200">
          <h2 className="text-lg font-bold text-amber-900 mb-2">No Tombs Available</h2>
          <p className="text-amber-800 mb-4">
            You must create at least one tomb before adding persons. Please create a tomb first.
          </p>
          <Link href="/admin/tombs/new">
            <Button variant="primary">Create a Tomb</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/persons" className="text-blue-600 hover:text-blue-700">
          ← Back to Persons
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Add New Person</h1>
        <p className="text-gray-600 mt-2">Create a new memorial record</p>
      </div>

      <PersonForm tombs={tombs} />
    </div>
  );
}
