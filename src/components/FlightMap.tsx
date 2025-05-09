import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLngBounds, LatLngTuple } from 'leaflet';
import { Flight } from '@/services/aviationService';
import { getAirportCoordinates, GeoCoordinates, getBounds } from '@/services/airportService';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '@/components/theme-provider';

// Risolve il problema delle icone di Leaflet in React
import L from 'leaflet';
import planeIcon from '/airplane.svg';

// Risolve il problema delle icone di default mancanti in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Icona personalizzata per l'aereo
const airplaneIcon = new Icon({
  iconUrl: `/plane.png`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface FlightMapProps {
  flight: Flight;
}

const FlightMap: React.FC<FlightMapProps> = ({ flight }) => {
  const { theme } = useTheme();
  const [departureCoords, setDepartureCoords] = useState<GeoCoordinates | null>(null);
  const [arrivalCoords, setArrivalCoords] = useState<GeoCoordinates | null>(null);
  const [midpointCoords, setMidpointCoords] = useState<GeoCoordinates | null>(null);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [estimatedPlaneCoords, setEstimatedPlaneCoords] = useState<GeoCoordinates | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      setLoading(true);
      try {
        if (flight.departure?.iata && flight.arrival?.iata) {
          const depCoords = await getAirportCoordinates(flight.departure.iata);
          const arrCoords = await getAirportCoordinates(flight.arrival.iata);

          if (depCoords && arrCoords) {
            setDepartureCoords(depCoords);
            setArrivalCoords(arrCoords);

            // Calcolo posizione stimata dell'aereo
            let estimatedCoords = null;
            if (flight.departure.scheduled && flight.arrival.scheduled) {
              const depTime = new Date(flight.departure.scheduled).getTime();
              const arrTime = new Date(flight.arrival.scheduled).getTime();
              const now = Date.now();
              if (now <= depTime) {
                estimatedCoords = depCoords;
              } else if (now >= arrTime) {
                estimatedCoords = arrCoords;
              } else {
                // Calcolo avanzamento temporale preciso
                const progress = (now - depTime) / (arrTime - depTime);
                // Interpolazione lineare precisa su tutta la retta
                const lat = depCoords.lat + (arrCoords.lat - depCoords.lat) * progress;
                const lng = depCoords.lng + (arrCoords.lng - depCoords.lng) * progress;
                estimatedCoords = { lat, lng };
              }
            } else {
              // fallback: punto medio
              estimatedCoords = {
                lat: (depCoords.lat + arrCoords.lat) / 2,
                lng: (depCoords.lng + arrCoords.lng) / 2
              };
            }
            setMidpointCoords(estimatedCoords);
            setEstimatedPlaneCoords(estimatedCoords);

            // Calcola i limiti della mappa
            const bounds = L.latLngBounds(
              L.latLng(depCoords.lat, depCoords.lng),
              L.latLng(arrCoords.lat, arrCoords.lng)
            );
            setMapBounds(bounds);
          }
        }
      } catch (error) {
        console.error('Errore nel recupero delle coordinate:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [flight]);

  if (loading || !departureCoords || !arrivalCoords || !midpointCoords) {
    return <div className="h-64 bg-secondary/30 rounded-md flex items-center justify-center">Caricamento mappa...</div>;
  }

  const flightPath: LatLngTuple[] = [
    [departureCoords.lat, departureCoords.lng],
    [arrivalCoords.lat, arrivalCoords.lng]
  ];

  return (
    <div className="h-64 rounded-md overflow-hidden border border-border shadow-sm">
      <MapContainer
        bounds={mapBounds || undefined}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url={`https://{s}.basemaps.cartocdn.com/${theme === 'dark' ? 'dark' : 'light'}_all/{z}/{x}/{y}.png`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Marker per l'aeroporto di partenza */}
        <Marker position={[departureCoords.lat, departureCoords.lng]}>
          <Popup>
            <strong>Partenza:</strong> {flight.departure?.airport} ({flight.departure?.iata})
          </Popup>
        </Marker>
        
        {/* Marker per l'aeroporto di arrivo */}
        <Marker position={[arrivalCoords.lat, arrivalCoords.lng]}>
          <Popup>
            <strong>Arrivo:</strong> {flight.arrival?.airport} ({flight.arrival?.iata})
          </Popup>
        </Marker>
        
        {/* Marker per l'aereo a metà percorso */}
        {estimatedPlaneCoords && (
          <Marker 
            position={[estimatedPlaneCoords.lat, estimatedPlaneCoords.lng]}
            icon={airplaneIcon}
            rotationAngle={(() => {
              // Calcolo angolo tra partenza e arrivo (corretto rispetto al nord geografico)
              if (!departureCoords || !arrivalCoords) return 0;
              const toRad = (deg: number) => deg * Math.PI / 180;
              const toDeg = (rad: number) => rad * 180 / Math.PI;
              const lat1 = toRad(departureCoords.lat);
              const lat2 = toRad(arrivalCoords.lat);
              const dLon = toRad(arrivalCoords.lng - departureCoords.lng);
              const y = Math.sin(dLon) * Math.cos(lat2);
              const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
              let brng = Math.atan2(y, x);
              brng = toDeg(brng);
              return (brng + 360) % 360;
            })()}
            rotationOrigin="center"
          >
            <Popup>
              <strong>Volo stimato:</strong> {flight.airline?.name} {flight.flight?.iata}<br />
              Posizione stimata calcolata in tempo reale
            </Popup>
          </Marker>
        )}
        
        {/* Linea che rappresenta il percorso del volo */}
        <Polyline positions={flightPath} color={theme === 'dark' ? "#ffffff" : "#3b82f6"} weight={3} opacity={0.7} />
      </MapContainer>
    </div>
  );
};

export default FlightMap;