import type { Metadata } from "next";
import { MaintenanceView } from "@/components/MaintenanceView";

export const metadata: Metadata = {
  title: "Mantenimiento de Plataforma | Procap Natural",
  description: "Servicio temporalmente en pausa técnica por labores programadas de mantenimiento y verificación de licenciamiento operativo.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  return <MaintenanceView />;
}
