import React from 'react';
import Link from 'next/link';
import { Resource } from '@/types'; // Adjust path

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
      {resource.coverImageUrl && <img src={resource.coverImageUrl} alt={resource.title} className="w-full h-32 object-cover rounded-md mb-2" />}
      <h3 className="text-xl font-semibold mb-1">{resource.title}</h3>
      <p className="text-gray-600 text-sm mb-1">By: {resource.seller?.name || 'Unknown Seller'}</p>
      <p className="text-gray-800 font-bold mb-2">${resource.price.toFixed(2)}</p>
      <p className="text-sm text-gray-500 mb-2 truncate">{resource.description}</p>
      <Link href={`/resources/${resource.id}`} className="text-blue-500 hover:underline">
        View Details
      </Link>
    </div>
  );
};
export default ResourceCard;
