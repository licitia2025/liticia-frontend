import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Search, Filter, Calendar, MapPin, Euro } from "lucide-react";

// Datos de ejemplo (en producción vendrían de la API)
const licitacionesEjemplo = [
  {
    id: 1,
    titulo: "Suministro de un sistema de protección para el correo electrónico",
    expediente: "242/2025",
    organo: "Mesa de las Cortes de Aragón",
    tipo: "Suministros",
    presupuesto: 66000,
    lugar: "Zaragoza",
    estado: "EV",
    conceptos: ["Ciberseguridad", "Cloud Computing"],
    fecha: "2025-10-15"
  },
  {
    id: 2,
    titulo: "Servicio de soporte técnico y actualización de sistema PAE",
    expediente: "A-08/26",
    organo: "Universidad Autónoma de Madrid",
    tipo: "Servicios",
    presupuesto: 55125,
    lugar: "Madrid",
    estado: "EV",
    conceptos: ["Soporte y Mantenimiento", "Desarrollo Web"],
    fecha: "2025-10-14"
  },
  {
    id: 3,
    titulo: "Suministro de actualizaciones de licencias de CATIA",
    expediente: "34259/25",
    organo: "CSIC",
    tipo: "Suministros",
    presupuesto: 138000,
    lugar: "Madrid",
    estado: "PUB",
    conceptos: ["Software", "Licencias"],
    fecha: "2025-10-13"
  }
];

export default function Licitaciones() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Licitaciones TIC</h1>
          <p className="text-muted-foreground">Explora licitaciones públicas del sector tecnológico</p>
        </div>

        {/* Búsqueda y filtros */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, expediente u órgano..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Lista de licitaciones */}
        <div className="space-y-4">
          {licitacionesEjemplo.map((lic) => (
            <Card key={lic.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/licitaciones/${lic.id}`}>
                      <CardTitle className="text-xl hover:text-primary cursor-pointer">
                        {lic.titulo}
                      </CardTitle>
                    </Link>
                    <CardDescription className="mt-2">
                      {lic.organo} • Expediente: {lic.expediente}
                    </CardDescription>
                  </div>
                  <Badge variant={lic.estado === "PUB" ? "default" : "secondary"}>
                    {lic.estado === "PUB" ? "Publicada" : "En evaluación"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">
                      €{lic.presupuesto.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">• {lic.tipo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {lic.lugar}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(lic.fecha).toLocaleDateString('es-ES')}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {lic.conceptos.map((concepto) => (
                    <Badge key={concepto} variant="outline">
                      {concepto}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Paginación */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

