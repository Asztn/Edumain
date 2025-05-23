import ResourceList from '@/components/resources/ResourceList'; // Adjust path
export default function ResourcesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Explore Resources</h1>
      <ResourceList />
    </div>
  );
}
