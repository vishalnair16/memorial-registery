import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getAllPersons, getAllTombs } from "@/lib/data";
import Link from "next/link";

export const revalidate = 60;

export default function AdminDashboard() {
  const tombs = getAllTombs();
  const persons = getAllPersons();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Memorial Registry Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {tombs.length}
            </div>
            <div className="text-gray-700">Tombs Created</div>
            <Link href="/admin/tombs">
              <Button variant="primary" className="mt-4">
                Manage Tombs
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {persons.length}
            </div>
            <div className="text-gray-700">Persons Added</div>
            <Link href="/admin/persons">
              <Button variant="primary" className="mt-4">
                Manage Persons
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {tombs.reduce((acc, tomb) => acc + tomb.personIds.length, 0)}
            </div>
            <div className="text-gray-700">Total Burials</div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <Link href="/admin/tombs/new">
            <Button variant="primary">Create New Tomb</Button>
          </Link>
          <Link href="/admin/persons/new">
            <Button variant="primary">Add New Person</Button>
          </Link>
          <Link href="/admin/tombs">
            <Button variant="secondary">View All Tombs</Button>
          </Link>
          <Link href="/admin/persons">
            <Button variant="secondary">View All Persons</Button>
          </Link>
        </div>
      </Card>

      {tombs.length === 0 && (
        <Card className="bg-amber-50 border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            Getting Started
          </h3>
          <p className="text-amber-800 mb-4">
            Start by creating a tomb. Then you can add persons who are buried in
            that tomb.
          </p>
          <Link href="/admin/tombs/new">
            <Button variant="primary">Create First Tomb</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
