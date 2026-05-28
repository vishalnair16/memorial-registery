import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getTombById, getPersonsByTombId } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ tombId: string }> }) {
  const { tombId } = await params;
  const tomb = getTombById(tombId);

  if (!tomb) {
    return { title: "Tomb Not Found" };
  }

  return {
    title: `Tomb ${tomb.id} - Memorial Registry`,
    description: `Memorial records for persons buried at ${tomb.location}`,
  };
}

export default async function TombPage({ params }: { params: Promise<{ tombId: string }> }) {
  const { tombId } = await params;
  const tomb = getTombById(tombId);

  if (!tomb) {
    notFound();
  }

  const persons = getPersonsByTombId(tombId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Memorial Location
          </h1>
          <p className="text-xl text-gray-600 mb-6">{tomb.location}</p>
          <p className="text-gray-500">
            {persons.length} {persons.length === 1 ? "person is" : "persons are"} buried here
          </p>
        </div>

        {persons.length === 0 ? (
          <Card className="text-center py-12 max-w-2xl mx-auto">
            <p className="text-gray-600">
              No persons are recorded for this tomb yet.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {persons.map((person) => (
              <Card key={person.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/person/${person.id}`}>
                  <div className="flex flex-col h-full cursor-pointer">
                    {person.imagePath && (
                      <div className="relative w-full h-64 -mx-6 -mt-6 mb-4">
                        <Image
                          src={person.imagePath}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {person.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 font-semibold">
                      {person.dateOfBirth} - {person.dateOfDeath}
                    </p>

                    <p className="text-gray-700 mb-6 flex-1">
                      {person.description}
                    </p>

                    <Button variant="primary" className="w-full">
                      View Full Memorial
                    </Button>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
