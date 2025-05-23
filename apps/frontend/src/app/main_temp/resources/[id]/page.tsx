'use client';
import React, { useEffect, useState } from 'react';
import { getResourceById } from '@/services/resourceService'; // Adjust path
import { Resource } from '@/types'; // Adjust path
import { useParams } from 'next/navigation';

const ResourceDetailPage = () => {
  const params = useParams();
  const id = params.id as string; // Will be null if params.id is an array
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchResource = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getResourceById(id);
          setResource(data);
        } catch (err) {
          setError('Failed to fetch resource details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchResource();
    } else {
        // Handle case where id might not be a string (e.g. during initial render or if route is malformed)
        setLoading(false);
        setError("Resource ID is invalid or not provided.");
    }
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading details...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (!resource) return <p className="text-center mt-8">Resource not found.</p>;

  return (
    <div className="container mx-auto p-4">
      {resource.coverImageUrl && (
        <div className="mb-6 overflow-hidden rounded-lg shadow-lg" style={{ maxHeight: '400px' }}>
          <img 
            src={resource.coverImageUrl} 
            alt={resource.title} 
            className="w-full h-full object-contain" // object-contain to see the whole image
          />
        </div>
      )}
      <h1 className="text-4xl font-bold mb-2">{resource.title}</h1>
      <p className="text-xl text-gray-700 mb-2">
        By: <span className="font-semibold">{resource.seller?.name || 'Unknown Seller'}</span>
      </p>
      <p className="text-2xl font-semibold text-blue-600 mb-4">${resource.price.toFixed(2)}</p>
      
      <div className="mt-4 p-4 border rounded-md bg-gray-50">
        <h2 className="text-2xl font-semibold mb-2">Description</h2>
        <div className="prose lg:prose-xl max-w-none">
          <p>{resource.description}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Details:</h3>
        <ul className="list-disc list-inside ml-4 mt-2 text-gray-700">
          <li>Category: {resource.category}</li>
          <li>Subject: {resource.subject}</li>
          <li>Grade Level: {resource.gradeLevel}</li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
          Add to Cart
        </button>
      </div>
      {/* More details, previews etc. can be added here */}
    </div>
  );
};
export default ResourceDetailPage;
