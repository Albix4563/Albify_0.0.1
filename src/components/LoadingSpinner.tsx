
import React from 'react';
import { Plane } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Caricamento in corso...' }) => {
  return (
    <div className="flex flex-col items-center justify-center my-8 space-y-3">
      <div className="relative">
        <Plane 
          className="h-10 w-10 text-sky animate-plane-takeoff"
        />
      </div>
      <p className="text-muted-foreground animate-pulse-slow">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
