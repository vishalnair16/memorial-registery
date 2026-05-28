import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPersonById, getTombById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ personId: string }> }) {
  const { personId } = await params;
  const person = getPersonById(personId);

  if (!person) {
    return { title: "Person Not Found" };
  }

  return {
    title: `${person.name} - Memorial Registry`,
    description: person.description,
  };
}

export default async function PersonPage({ params }: { params: Promise<{ personId: string }> }) {
  const { personId } = await params;
  const person = getPersonById(personId);

  if (!person) {
    notFound();
  }

  const tomb = getTombById(person.tombId);
  const age = person.dateOfBirth && person.dateOfDeath
    ? new Date(person.dateOfDeath).getFullYear() - new Date(person.dateOfBirth).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href={`/tomb/${person.tombId}`} className="text-blue-600 hover:text-blue-700">
          ← Back to Tomb
        </Link>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            {person.imagePath && (
              <Card className="overflow-hidden">
                <div className="relative w-full h-96">
                  <Image
                    src={person.imagePath}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {person.name}
              </h1>

              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <Badge variant="primary">
                  {person.dateOfBirth} - {person.dateOfDeath}
                </Badge>
                {age !== null && (
                  <Badge variant="secondary">
                    {age} {age === 1 ? "year" : "years"} old
                  </Badge>
                )}
              </div>

              {tomb && (
                <p className="text-gray-600">
                  Resting place: <strong>{tomb.location}</strong>
                </p>
              )}
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {person.description}
              </p>
            </Card>

            {person.history && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Life Story
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {person.history}
                </p>
              </Card>
            )}

            {person.familyMembers && person.familyMembers.length > 0 && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Family
                </h2>
                <div className="space-y-3">
                  {person.familyMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 pb-3 border-b last:border-b-0"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {member.relation.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-600">{member.relation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-gray-600 text-sm">
            Memorial Record ID: <code className="bg-gray-100 px-2 py-1 rounded">{person.id}</code>
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={`/tomb/${person.tombId}`}>
              <Button variant="secondary">Back to Tomb</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
