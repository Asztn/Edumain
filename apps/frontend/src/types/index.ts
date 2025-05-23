export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subject: string;
  gradeLevel: string;
  coverImageUrl?: string;
  seller: Pick<User, 'id' | 'name'>; // Or full User type
  // Add other fields as needed
}
