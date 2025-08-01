import { memo } from 'react';

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

const LoadingSkeleton = memo(({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4', 
  variant = 'rectangular' 
}: LoadingSkeletonProps) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${width} ${height} ${className}`}
      style={{
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton;