
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface FlightStatusProps {
  status: string;
}

const FlightStatus: React.FC<FlightStatusProps> = ({ status }) => {
  let color: string;
  let label: string;

  // Normalizza lo status per gestire variazioni di capitalizzazione
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case 'active':
      color = 'bg-flight-info text-white';
      label = 'In volo';
      break;
    case 'scheduled':
      color = 'bg-sky text-white';
      label = 'Programmato';
      break;
    case 'landed':
      color = 'bg-flight-success text-white';
      label = 'Atterrato';
      break;
    case 'cancelled':
      color = 'bg-flight-danger text-white';
      label = 'Cancellato';
      break;
    case 'diverted':
      color = 'bg-flight-warning text-white';
      label = 'Dirottato';
      break;
    case 'incident':
      color = 'bg-flight-danger text-white';
      label = 'Incidente';
      break;
    default:
      color = 'bg-muted text-muted-foreground';
      label = status || 'Sconosciuto';
  }

  return <Badge className={`${color} px-2 py-1`}>{label}</Badge>;
};

export default FlightStatus;
