import { PhotoIcon } from '@heroicons/react/16/solid';
import React, { useState, useEffect } from 'react';

export interface HeroProps {
  src: string | null;
  alt?: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ src, alt = 'Avatar', className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(src === undefined);
  const [imageError, setImageError] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageSrc, setImageSrc ] = useState<string | null>(null);

  const isObjectURL = (str: string) => {
    return str.startsWith('blob:') || str.startsWith('data:');
  }

  useEffect(() => {
    const loadImage = async (src: string) => {
      try {
        if (isObjectURL(src)) {
          setImageSrc(src);
          setImageError(false);
          return;
        }

        const url = new URL(src);
        const image = await fetch(url);
        if (image.ok) {
          const data = await image.blob()
          setImageBlob(data);
        } else {
          setImageError(true);
        }
      } catch (error) {
        setImageError(true);
      }
    }

    if (src !== null) {
      loadImage(src);
    } else {
      setImageSrc(null);
      setImageBlob(null);
      setImageError(false);
      setImageLoaded(true);
    }

  }, [src]);

  useEffect(() => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      setImageSrc(url);

      return () => {
        setImageSrc(null);
        URL.revokeObjectURL(url)
      };
    };
  },  [ imageBlob ]);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const containerClasses = `relative overflow-hidden ${className}`;

  return (
    <div className={`${containerClasses}`}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
      )}
      {imageSrc && !imageError ? (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <div className="bg-gray-200 flex items-center justify-center p-3 h-full">
          <PhotoIcon className="text-gray-400 h-full p-10" />
        </div>
      )}
    </div>
  );
};

export default Hero;