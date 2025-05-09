
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plane } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface SearchFormProps {
  onSearch: (flightCode: string) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [flightCode, setFlightCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione base: rimuove spazi e controlla se il codice è vuoto
    const trimmedCode = flightCode.trim().toUpperCase();
    
    if (!trimmedCode) {
      toast.error('Inserisci un codice volo valido');
      return;
    }
    
    // Lunghezza minima per un codice volo valido (almeno 3 caratteri)
    if (trimmedCode.length < 3) {
      toast.error('Il codice volo è troppo corto. Inserisci un codice valido.');
      return;
    }
    
    // Lunghezza massima ragionevole per un codice volo
    if (trimmedCode.length > 8) {
      toast.error('Il codice volo è troppo lungo. Inserisci un codice valido.');
      return;
    }
    
    onSearch(trimmedCode);
  };

  return (
    <Card className="p-6 shadow-md bg-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center justify-center">
            <Plane className="h-8 w-8 text-sky" />
            <h2 className="text-2xl font-semibold ml-2 text-center">Albifly</h2>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="flightCode">Codice Volo</Label>
          <div className="flex space-x-2">
            <Input
              id="flightCode"
              placeholder="Es. TK900, UAE95, VOE2HV"
              value={flightCode}
              onChange={(e) => setFlightCode(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !flightCode.trim()}
              className="bg-sky hover:bg-sky-dark"
            >
              Cerca
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Inserisci il codice completo del volo (es. TK900, UAE95, VOE2HV)
          </p>
        </div>
      </form>
    </Card>
  );
};

export default SearchForm;
