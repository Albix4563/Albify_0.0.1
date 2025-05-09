
import React, { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import FlightDetail from '@/components/FlightDetail';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import { Flight, getFlightByIATA } from '@/services/aviationService';
import { toast } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async (flightCode: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const flightData = await getFlightByIATA(flightCode);
      setFlights(flightData);
      
      if (flightData.length === 0) {
        toast.info(`Nessun volo trovato con codice ${flightCode}`);
      } else if (flightData.length === 1) {
        toast.success(`Trovato ${flightData.length} volo`);
      } else {
        toast.success(`Trovati ${flightData.length} voli`);
      }
      
    } catch (err) {
      setError('Impossibile recuperare le informazioni sul volo. Riprova più tardi.');
      console.error('Errore durante la ricerca:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={() => setError(null)} />;
    }

    if (!hasSearched) {
      return <EmptyState />;
    }

    if (flights.length === 0) {
      return <EmptyState message="Nessun volo trovato con questo codice. Verifica il codice e riprova." />;
    }

    return (
      <div className="space-y-6">
        {flights.map((flight, index) => (
          <FlightDetail key={`${flight.flight.iata}-${index}`} flight={flight} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light/10 to-background transition-colors duration-300">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          {renderResults()}
          
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>Albifly &copy; 2025</p>
            <p className="mt-1">Dati forniti da AviationStack API</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
