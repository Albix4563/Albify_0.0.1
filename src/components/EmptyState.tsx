
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plane } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = 'Inserisci un codice volo per iniziare la ricerca' 
}) => {
  return (
    <Card className="shadow-md mt-6 bg-secondary/30">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <Plane className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
