// Servizio per gestire le coordinate degli aeroporti

// Interfaccia per le coordinate geografiche
export interface GeoCoordinates {
  lat: number;
  lng: number;
}

// Interfaccia per i dati dell'aeroporto
export interface Airport {
  iata: string;
  name: string;
  coordinates: GeoCoordinates;
}

// Funzione per ottenere le coordinate di un aeroporto dal codice IATA
export const getAirportCoordinates = async (iataCode: string): Promise<GeoCoordinates | null> => {
  // Prima cerca nella mappa locale
  const airportCoordinates = new Map<string, GeoCoordinates>([
    // Aeroporti italiani
    ['FCO', { lat: 41.8002, lng: 12.2388 }], // Roma Fiumicino
    ['MXP', { lat: 45.6306, lng: 8.7281 }],  // Milano Malpensa
    ['LIN', { lat: 45.4545, lng: 9.2767 }],  // Milano Linate
    ['VCE', { lat: 45.5053, lng: 12.3519 }], // Venezia Marco Polo
    ['NAP', { lat: 40.8847, lng: 14.2908 }], // Napoli Capodichino
    ['CTA', { lat: 37.4668, lng: 15.0664 }], // Catania Fontanarossa
    ['PMO', { lat: 38.1824, lng: 13.0998 }], // Palermo Punta Raisi
    ['BLQ', { lat: 44.5354, lng: 11.2887 }], // Bologna Guglielmo Marconi
    ['BGY', { lat: 45.6689, lng: 9.7003 }], // Bergamo Orio al Serio
    ['SUF', { lat: 38.9054, lng: 16.2423 }], // Lamezia Terme
    // Aeroporti internazionali principali
    ['CDG', { lat: 49.0097, lng: 2.5479 }],   // Parigi Charles de Gaulle
    ['LHR', { lat: 51.4700, lng: -0.4543 }],  // Londra Heathrow
    ['FRA', { lat: 50.0379, lng: 8.5622 }],   // Francoforte
    ['AMS', { lat: 52.3105, lng: 4.7683 }],   // Amsterdam Schiphol
    ['MAD', { lat: 40.4983, lng: -3.5676 }],  // Madrid Barajas
    ['BCN', { lat: 41.2974, lng: 2.0833 }],   // Barcellona El Prat
    ['IST', { lat: 41.2606, lng: 28.7425 }],  // Istanbul
    ['DXB', { lat: 25.2532, lng: 55.3657 }],  // Dubai
    ['JFK', { lat: 40.6413, lng: -73.7781 }], // New York JFK
    ['LAX', { lat: 33.9416, lng: -118.4085 }], // Los Angeles
    ['SFO', { lat: 37.6213, lng: -122.3790 }], // San Francisco
    ['HND', { lat: 35.5494, lng: 139.7798 }], // Tokyo Haneda
    ['SYD', { lat: 33.9399, lng: 151.1753 }], // Sydney
  ]);

  const local = airportCoordinates.get(iataCode);
  if (local) return local;

  // Se non trovato localmente, prova a recuperare tramite API Google Gemini
  try {
    const apiKey = "AIzaSyBo_TfxmyjXkDsVhrNOFprnZ34zxq88Hyo";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const prompt = `Dammi solo le coordinate (latitudine e longitudine) dell'aeroporto con codice IATA ${iataCode} in formato JSON come {\"lat\":..., \"lng\":...}`;
    const body = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error("Errore nella risposta API Gemini");
    const data = await response.json();
    // Parsing della risposta Gemini
    let text = "";
    if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
      text = data.candidates[0].content.parts[0].text;
    }
    // Estrai JSON dalle risposte Gemini
    let coords = null;
    try {
      const match = text.match(/\{[^}]+\}/);
      if (match) {
        coords = JSON.parse(match[0]);
      }
    } catch (e) {
      // parsing fallito
    }
    if (coords && typeof coords.lat === "number" && typeof coords.lng === "number") {
      return { lat: coords.lat, lng: coords.lng };
    }
    return null;
  } catch (error) {
    console.error("Errore nel recupero delle coordinate da Gemini:", error);
    return null;
  }
};

// Funzione per calcolare il punto medio tra due coordinate
export const getMidpoint = (coord1: GeoCoordinates, coord2: GeoCoordinates): GeoCoordinates => {
  return {
    lat: (coord1.lat + coord2.lat) / 2,
    lng: (coord1.lng + coord2.lng) / 2
  };
};

// Funzione per calcolare i limiti della mappa che includono entrambi i punti
export const getBounds = (coord1: GeoCoordinates, coord2: GeoCoordinates): [[number, number], [number, number]] => {
  const latMin = Math.min(coord1.lat, coord2.lat);
  const latMax = Math.max(coord1.lat, coord2.lat);
  const lngMin = Math.min(coord1.lng, coord2.lng);
  const lngMax = Math.max(coord1.lng, coord2.lng);
  
  // Aggiungiamo un po' di margine
  const latMargin = (latMax - latMin) * 0.1;
  const lngMargin = (lngMax - lngMin) * 0.1;
  
  return [
    [latMin - latMargin, lngMin - lngMargin],
    [latMax + latMargin, lngMax + lngMargin]
  ];
};