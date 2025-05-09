
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FlightStatus from './FlightStatus';
import FlightMap from './FlightMap';
import { Flight, formatDate, formatDateTime } from '@/services/aviationService';
import { Plane, Calendar, Clock } from 'lucide-react';

interface FlightDetailProps {
  flight: Flight;
}

const FlightDetail: React.FC<FlightDetailProps> = ({ flight }) => {
  return (
    <Card className="shadow-lg border-t-4 border-t-sky mt-6 overflow-hidden">
      <CardHeader className="bg-secondary/50 pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Plane className="h-5 w-5 text-sky" />
              <CardTitle className="text-xl">
                {flight.airline?.name || 'N/A'} {flight.flight?.iata || 'N/A'}
              </CardTitle>
            </div>
            <CardDescription className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> 
              {formatDate(flight.flight_date)}
            </CardDescription>
          </div>
          <FlightStatus status={flight.flight_status} />
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Partenza */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Partenza</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Aeroporto</p>
                <p className="font-medium">{flight.departure?.airport || 'N/A'} ({flight.departure?.iata || 'N/A'})</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orario Programmato</p>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-sky" />
                  <p>{formatDateTime(flight.departure?.scheduled)}</p>
                </div>
              </div>
              {flight.departure?.terminal && (
                <div>
                  <p className="text-sm text-muted-foreground">Terminal</p>
                  <p>{flight.departure.terminal}</p>
                </div>
              )}
              {flight.departure?.gate && (
                <div>
                  <p className="text-sm text-muted-foreground">Gate</p>
                  <p>{flight.departure.gate}</p>
                </div>
              )}
              {flight.departure?.delay && (
                <div className="mt-2">
                  <p className="text-flight-warning font-medium">
                    Ritardo: {flight.departure.delay} minuti
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Arrivo */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Arrivo</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Aeroporto</p>
                <p className="font-medium">{flight.arrival?.airport || 'N/A'} ({flight.arrival?.iata || 'N/A'})</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orario Programmato</p>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-sky" />
                  <p>{formatDateTime(flight.arrival?.scheduled)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orario Stimato</p>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-flight-info" />
                  <p>{formatDateTime(flight.arrival?.estimated)}</p>
                </div>
              </div>
              {flight.arrival?.terminal && (
                <div>
                  <p className="text-sm text-muted-foreground">Terminal</p>
                  <p>{flight.arrival.terminal}</p>
                </div>
              )}
              {flight.arrival?.gate && (
                <div>
                  <p className="text-sm text-muted-foreground">Gate</p>
                  <p>{flight.arrival.gate}</p>
                </div>
              )}
              {flight.arrival?.delay && (
                <div className="mt-2">
                  <p className="text-flight-warning font-medium">
                    Ritardo: {flight.arrival.delay} minuti
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mappa del volo */}
        <div className="mt-6">
          <Separator className="my-4" />
          <h3 className="font-medium text-lg mb-3">Percorso del volo</h3>
          <FlightMap flight={flight} />
        </div>
        
        {/* Informazioni aggiuntive */}
        <div className="mt-6">
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Aeromobile</p>
              <p>{flight.aircraft?.iata || 'N/D'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registrazione</p>
              <p>{flight.aircraft?.registration || 'N/D'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Codice ICAO</p>
              <p>{flight.flight?.icao || 'N/D'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightDetail;
