export interface FamilyMember {
  relation: string;
  name: string;
}

export interface Person {
  id: string;
  name: string;
  dateOfBirth: string;
  dateOfDeath: string;
  tombId: string;
  description: string;
  imagePath: string;
  familyMembers: FamilyMember[];
  history: string;
  createdAt: string;
}

export interface Tomb {
  id: string;
  location: string;
  personIds: string[];
  createdAt: string;
}
