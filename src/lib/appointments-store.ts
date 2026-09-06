export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  location_name: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_by?: 'client_web' | 'capilarbot_ai' | 'admin';
  created_at?: string;
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    client_name: "Carlos Mario Restrepo",
    client_phone: "3104589922",
    location_name: "Sede Bogotá (Chicó Norte)",
    service_name: "Instalación de Prótesis Capilar ($300.000 COP)",
    appointment_date: "2026-09-08",
    appointment_time: "10:00 AM",
    status: "confirmed",
    notes: "Interesado en Sistema Mixto o París. Llega en vehículo.",
    created_by: "client_web",
    created_at: new Date().toISOString()
  },
  {
    id: "apt-2",
    client_name: "Andrés Felipe Gómez",
    client_phone: "3158872341",
    location_name: "Sede Cali (Edificio María Mercedes)",
    service_name: "Valoración Capilar Gratuita",
    appointment_date: "2026-09-09",
    appointment_time: "03:00 PM",
    status: "pending",
    notes: "Consulta por recesión en entradas frontales.",
    created_by: "capilarbot_ai",
    created_at: new Date().toISOString()
  }
];
