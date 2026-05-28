import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getAllPersons, getTombById } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

export default function PersonsPage() {
  const persons = getAllPersons();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Persons</h1>
          <p className="text-gray-600 mt-1">Manage memorial person records</p>
        </div>
        <Link href="/admin/persons/new">
          <Button variant="primary">Add New Person</Button>
        </Link>
      </div>

      {persons.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-600 mb-4">No persons added yet.</p>
          <Link href="/admin/persons/new">
            <Button variant="primary">Add First Person</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {persons.map((person) => {
            const tomb = getTombById(person.tombId);
            return (
              <Card key={person.id}>
                <div className="flex flex-col h-full">
                  {person.imagePath && (
                    <div className="relative w-full h-48 mb-4 -mx-6 -mt-6">
                      <Image
                        src={person.imagePath}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {person.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {person.dateOfBirth} - {person.dateOfDeath}
                  </p>

                  <p className="text-sm text-gray-700 mb-3 flex-1">
                    {person.description}
                  </p>

                  {tomb && (
                    <p className="text-xs text-gray-500 mb-4">
                      Tomb: {tomb.id} - {tomb.location}
                    </p>
                  )}

                  <Link href={`/person/${person.id}`}>
                    <Button variant="secondary" className="w-full">
                      View Memorial
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
