import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QRDownload } from "@/components/qr/QRDownload";
import { getAllTombs, getPersonsByTombId } from "@/lib/data";
import Link from "next/link";

export const revalidate = 60;

export default function TombsPage() {
  const tombs = getAllTombs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tombs</h1>
          <p className="text-gray-600 mt-1">Manage memorial tomb locations</p>
        </div>
        <Link href="/admin/tombs/new">
          <Button variant="primary">Create New Tomb</Button>
        </Link>
      </div>

      {tombs.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-600 mb-4">No tombs created yet.</p>
          <Link href="/admin/tombs/new">
            <Button variant="primary">Create First Tomb</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tombs.map((tomb) => {
            const persons = getPersonsByTombId(tomb.id);
            return (
              <Card key={tomb.id}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {tomb.id}
                    </h3>
                    <p className="text-gray-600 mb-4">{tomb.location}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {persons.length}{" "}
                      {persons.length === 1 ? "person" : "persons"} buried
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/admin/tombs/${tomb.id}`}>
                        <Button variant="secondary">View Details</Button>
                      </Link>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    {persons.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Persons:
                        </h4>
                        <ul className="space-y-1">
                          {persons.map((person) => (
                            <li
                              key={person.id}
                              className="text-sm text-gray-700"
                            >
                              • {person.name} ({person.dateOfBirth} -{" "}
                              {person.dateOfDeath})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-gray-900 mb-3">
                        QR Code:
                      </p>
                      <QRDownload tombId={tomb.id} />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
