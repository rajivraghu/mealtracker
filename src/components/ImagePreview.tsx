import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

export default function ImagePreview({ imageUrl, onImageUpload, isLoading }: ImagePreviewProps) {
  return (
    <div className="w-48 h-48 rounded-lg overflow-hidden">
      <label className={`cursor-pointer block w-full h-full ${isLoading ? 'opacity-50' : ''}`}>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageUpload}
          disabled={isLoading}
        />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Meal preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Add meal photo</span>
          </div>
        )}
      </label>
    </div>
  );
}