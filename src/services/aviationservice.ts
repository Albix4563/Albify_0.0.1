import { toast } from "sonner";

const API_ENDPOINT = "https://api.aviationstack.com/v1/flights";
const API_KEY = "430e8f0bdbbcafd9117e296a4dc75bea"; // Questa chiave è un esempio e potrebbe non funzionare

export interface Flight {
  flight_date: string;
  flight_status: "scheduled" | "active" | "landed" | "cancelled" | "incident" | "diverted" | string;
  departure?: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string | null;
    gate: string | null;
    delay: number | null;
    scheduled: string | null;
    estimated: string | null;
    actual: string | null;
    estimated_runway: string | null;
    actual_runway: string | null;
  };
  arrival?: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string | null;
    gate: string | null;
    baggage: string | null;
    delay: number | null;
    scheduled: string | null;
    estimated: string | null;
    actual: string | null;
    estimated_runway: string | null;
    actual_runway: string | null;
  };
  airline?: {
    name: string;
    iata: string;
    icao: string;
  };
  flight?: {
    number: string;
    iata: string;
    icao: string;
    codeshared?: {
      airline_name: string;
      airline_iata: string;
      airline_icao: string;
      flight_number: string;
      flight_iata: string;
      flight_icao: string;
    } | null;
  };
  aircraft?: {
    registration: string | null;
    iata: string | null;
    icao: string | null;
    icao24: string | null;
  } | null;
  live?: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
  } | null;
}

export interface ApiResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: Flight[];
}

export const getFlightByIATA = async (flightIATA: string): Promise<Flight[]> => {
  try {
    console.log(`Cercando volo con codice IATA: ${flightIATA}`);
    
    const url = `${API_ENDPOINT}?access_key=${API_KEY}&flight_iata=${flightIATA}`;
    console.log(`URL richiesta: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Errore API: Status ${response.status}`);
      const errorText = await response.text();
      console.error(`Dettaglio errore: ${errorText}`);
      throw new Error(`Errore API: Status ${response.status}`);
    }
    
    const data: ApiResponse = await response.json();
    console.log(`Risposta API ricevuta:`, data);
    
    if (data.data.length === 0) {
      console.log(`Nessun volo trovato per il codice IATA: ${flightIATA}`);
      return [];
    }
    
    return data.data;
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Errore sconosciuto durante la richiesta del volo';
    
    console.error(`Errore durante la richiesta: ${errorMessage}`, error);
    toast.error(`Errore durante la ricerca del volo: ${errorMessage}`);
    throw error;
  }
};

export const formatDateTime = (dateTimeStr: string | undefined): string => {
  if (!dateTimeStr) return 'N/D';
  
  try {
    console.log(`Formattazione data originale: ${dateTimeStr}`);
    
    // Correggiamo il problema del fuso orario: l'API fornisce date in UTC+2
    let date: Date;
    
    // Verifichiamo se la data è in formato ISO e contiene informazioni sul fuso orario
    const hasTimezone = dateTimeStr.includes('Z') || dateTimeStr.includes('+') || dateTimeStr.includes('-');
    
    if (hasTimezone) {
      // Se ha già informazioni sul fuso orario, creiamo la data
      date = new Date(dateTimeStr);
      console.log(`Data con timezone: ${date.toISOString()}`);
      
      // Sottraiamo 2 ore per compensare la differenza di fuso orario
      date = new Date(date.getTime() - 2 * 60 * 60 * 1000);
      console.log(`Data corretta (sottratte 2 ore): ${date.toISOString()}`);
    } else {
      // Se non ha informazioni sul fuso orario, assumiamo che sia UTC
      // ma sottraiamo 2 ore per compensare la differenza
      date = new Date(dateTimeStr + 'Z');
      date = new Date(date.getTime() - 2 * 60 * 60 * 1000);
      console.log(`Data corretta (sottratte 2 ore): ${date.toISOString()}`);
    }
    
    // Convertiamo esplicitamente al fuso orario italiano (UTC+1 o UTC+2 con ora legale)
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Rome', // Impostiamo esplicitamente il fuso orario italiano
      hour12: false // Formato 24 ore
    };
    
    const formattedDate = new Intl.DateTimeFormat('it-IT', options).format(date);
    console.log(`Data formattata: ${formattedDate}`);
    
    return formattedDate;
  } catch (error) {
    console.error(`Errore nella formattazione della data: ${dateTimeStr}`, error);
    return dateTimeStr;
  }
};

export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return 'N/D';
  
  try {
    console.log(`Formattazione data originale: ${dateStr}`);
    
    // Correggiamo il problema del fuso orario: l'API fornisce date in UTC+2
    let date: Date;
    
    // Verifichiamo se la data è in formato ISO e contiene informazioni sul fuso orario
    const hasTimezone = dateStr.includes('Z') || dateStr.includes('+') || dateStr.includes('-');
    
    if (hasTimezone) {
      // Se ha già informazioni sul fuso orario, creiamo la data
      date = new Date(dateStr);
      console.log(`Data con timezone: ${date.toISOString()}`);
      
      // Sottraiamo 2 ore per compensare la differenza di fuso orario
      date = new Date(date.getTime() - 2 * 60 * 60 * 1000);
      console.log(`Data corretta (sottratte 2 ore): ${date.toISOString()}`);
    } else {
      // Se non ha informazioni sul fuso orario, assumiamo che sia UTC
      // ma sottraiamo 2 ore per compensare la differenza
      date = new Date(dateStr + 'Z');
      date = new Date(date.getTime() - 2 * 60 * 60 * 1000);
      console.log(`Data corretta (sottratte 2 ore): ${date.toISOString()}`);
    }
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Europe/Rome' // Impostiamo esplicitamente il fuso orario italiano
    };
    
    const formattedDate = new Intl.DateTimeFormat('it-IT', options).format(date);
    console.log(`Data formattata: ${formattedDate}`);
    
    return formattedDate;
  } catch (error) {
    console.error(`Errore nella formattazione della data: ${dateStr}`, error);
    return dateStr;
  }
};
