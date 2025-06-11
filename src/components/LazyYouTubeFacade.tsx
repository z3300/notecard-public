"use client";

import React, { useState, useEffect, useRef } from 'react';

interface LazyYouTubeFacadeProps {
  videoId: string;
  title: string;
  thumbnail?: string | null;
  className?: string;
}

const LazyYouTubeFacade: React.FC<LazyYouTubeFacadeProps> = ({ 
  videoId, 
  title, 
  thumbnail,
  className = "w-full h-full"
}) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate thumbnail URL
  const thumbnailUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlay = () => {
    setIsIframeLoaded(true);
  };

  if (isIframeLoaded) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        className={className}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; encrypted-media"
        title={title}
        loading="lazy"
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`${className} relative cursor-pointer group bg-gray-900 rounded overflow-hidden`}
      onClick={handlePlay}
    >
      {/* Skeleton loader while not in view */}
      {!isInView && (
        <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Thumbnail Image - only load when in view */}
      {isInView && (
        <>
          <img
            src={thumbnailUrl}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              // Fallback to standard quality thumbnail if maxresdefault fails
              const target = e.target as HTMLImageElement;
              if (target.src.includes('maxresdefault')) {
                target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              } else if (target.src.includes('hqdefault')) {
                // If even hqdefault fails, show a placeholder
                setImageLoaded(true);
                target.style.display = 'none';
              }
            }}
            loading="lazy"
          />
          
          {/* Loading state for image */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="text-gray-400">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
          
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-200 group-hover:scale-110 shadow-lg">
              <svg 
                className="w-8 h-8 text-white ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          {/* YouTube Logo */}
          <div className="absolute bottom-2 right-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
            <svg 
              className="w-6 h-6 text-white drop-shadow-md" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>

          {/* Hover overlay with title */}
          <div className="absolute bottom-4 left-4 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-white text-sm font-medium line-clamp-2 drop-shadow-lg">
              {title}
            </p>
          </div>

          {/* Click to play instruction */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              Click to play
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default LazyYouTubeFacade; 