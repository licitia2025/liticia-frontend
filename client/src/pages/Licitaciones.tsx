import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Search, Calendar, MapPin, Euro, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";

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
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Licitaciones TIC</h1>
          <p className="text-muted-foreground">Explora licitaciones públicas del sector tecnológico</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel de filtros lateral */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card className="shadow-md sticky top-20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filtros
                  </CardTitle>
                  <CardDescription>Refina tu búsqueda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Búsqueda */}
                  <div className="space-y-2">
                    <Label htmlFor="search">Búsqueda</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Título, expediente..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="PUB">Publicada</SelectItem>
                        <SelectItem value="EV">En evaluación</SelectItem>
                        <SelectItem value="ADJ">Adjudicada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tipo de contrato */}
                  <div className="space-y-2">
                    <Label>Tipo de Contrato</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="servicios">Servicios</SelectItem>
                        <SelectItem value="suministros">Suministros</SelectItem>
                        <SelectItem value="obras">Obras</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Presupuesto */}
                  <div className="space-y-2">
                    <Label>Presupuesto</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" placeholder="Mín €" />
                      <Input type="number" placeholder="Máx €" />
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="space-y-2">
                    <Label>Ubicación</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="madrid">Madrid</SelectItem>
                        <SelectItem value="barcelona">Barcelona</SelectItem>
                        <SelectItem value="valencia">Valencia</SelectItem>
                        <SelectItem value="sevilla">Sevilla</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Conceptos TIC */}
                  <div className="space-y-2">
                    <Label>Concepto TIC</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="ciberseguridad">Ciberseguridad</SelectItem>
                        <SelectItem value="cloud">Cloud Computing</SelectItem>
                        <SelectItem value="desarrollo">Desarrollo Web</SelectItem>
                        <SelectItem value="ia">IA/ML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" variant="outline">
                    Limpiar filtros
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lista de licitaciones */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Toggle filtros en móvil */}
            <div className="mb-4 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {showFilters ? "Ocultar" : "Mostrar"} Filtros
              </Button>
            </div>

            {/* Resultados */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando <span className="font-semibold">3</span> licitaciones
              </p>
            </div>

            <div className="space-y-4">
              {licitacionesEjemplo.map((lic) => (
                <Card 
                  key={lic.id} 
                  className="shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/licitaciones/${lic.id}`}>
                          <CardTitle className="text-xl hover:text-primary transition-colors">
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
                        <Badge key={concepto} variant="outline" className="hover:bg-accent transition-colors">
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
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

