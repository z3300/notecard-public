"use client";

import React, { useState } from 'react';

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  thumbnail?: string | null;
  className?: string;
}

const YouTubeFacade: React.FC<YouTubeFacadeProps> = ({ 
  videoId, 
  title, 
  thumbnail,
  className = "w-full h-full"
}) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Generate thumbnail URL if not provided
  const thumbnailUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const handlePlay = () => {
    setIsIframeLoaded(true);
  };

  if (isIframeLoaded) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        className={className}
        frameBorder="0"
        allowFullScreen
        allow="autoplay"
        title={title}
      />
    );
  }

  return (
    <div 
      className={`${className} relative cursor-pointer group bg-black rounded overflow-hidden`}
      onClick={handlePlay}
    >
      {/* Thumbnail Image */}
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to standard quality thumbnail if maxresdefault fails
          const target = e.target as HTMLImageElement;
          if (target.src.includes('maxresdefault')) {
            target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
        }}
      />
      
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200" />
      
      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-red-600 bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-200 group-hover:scale-110">
          <svg 
            className="w-8 h-8 text-white ml-1" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>

      {/* YouTube Logo (optional) */}
      <div className="absolute bottom-2 right-2 opacity-80">
        <svg 
          className="w-6 h-6 text-white" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </div>

      {/* Hover overlay text */}
      <div className="absolute bottom-4 left-4 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <p className="text-white text-sm font-medium line-clamp-2 drop-shadow-lg">
          {title}
        </p>
      </div>
    </div>
  );
};

export default YouTubeFacade; 