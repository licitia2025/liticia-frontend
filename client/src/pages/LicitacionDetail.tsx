import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ExternalLink, Calendar, MapPin, Euro, Building2, FileText } from "lucide-react";

// Datos de ejemplo (en producción vendrían de la API)
const licitacionEjemplo = {
  id: 1,
  titulo: "Suministro de un sistema de protección para el correo electrónico de las Cortes de Aragón",
  expediente: "242/2025",
  estado: "EV",
  organo: {
    nombre: "Mesa de las Cortes de Aragón",
    ciudad: "Zaragoza",
    email: "contratacion@cortesaragon.es",
    web: "https://www.cortesaragon.es"
  },
  tipo: "Suministros",
  presupuesto: 66000,
  lugar: "Zaragoza",
  fecha: "2025-10-15",
  fechaLimite: "2025-11-15",
  conceptos: ["Ciberseguridad", "Cloud Computing"],
  stackTecnologico: {
    lenguajes_programacion: [],
    frameworks: [],
    bases_datos: [],
    cloud: ["Microsoft Azure", "Office 365"],
    devops: [],
    otros: ["Microsoft Exchange", "Email Security"]
  },
  resumenTecnico: {
    objetivo: "Implementar una solución de seguridad para correo electrónico que proteja contra spam, phishing, malware y ransomware",
    requisitos_clave: [
      "Integración con Microsoft Exchange y Office 365",
      "Protección contra amenazas avanzadas (ATP)",
      "Cumplimiento normativo RGPD",
      "Alta disponibilidad 99.9%"
    ],
    complejidad: "Media",
    duracion_estimada: "6 meses",
    presupuesto_tipo: "Mediano"
  },
  descripcion: "Suministro e implementación de una solución de seguridad para correo electrónico que incluya protección contra spam, phishing, malware y ransomware. La solución debe integrarse con Microsoft Exchange y Office 365, proporcionando protección en tiempo real y análisis de amenazas avanzadas."
};

export default function LicitacionDetail() {
  const [, params] = useRoute("/licitaciones/:id");
  const id = params?.id;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Botón volver */}
        <Link href="/licitaciones">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a licitaciones
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{licitacionEjemplo.titulo}</h1>
              <p className="text-muted-foreground">
                Expediente: {licitacionEjemplo.expediente}
              </p>
            </div>
            <Badge variant={licitacionEjemplo.estado === "PUB" ? "default" : "secondary"} className="text-lg px-4 py-2">
              {licitacionEjemplo.estado === "PUB" ? "Publicada" : "En evaluación"}
            </Badge>
          </div>

          {/* Información clave */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Presupuesto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{licitacionEjemplo.presupuesto.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">{licitacionEjemplo.tipo}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{licitacionEjemplo.lugar}</div>
                <p className="text-xs text-muted-foreground mt-1">Lugar de ejecución</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha límite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Date(licitacionEjemplo.fechaLimite).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(licitacionEjemplo.fechaLimite).toLocaleDateString('es-ES', { year: 'numeric' })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Complejidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{licitacionEjemplo.resumenTecnico.complejidad}</div>
                <p className="text-xs text-muted-foreground mt-1">{licitacionEjemplo.resumenTecnico.duracion_estimada}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="resumen" className="space-y-4">
          <TabsList>
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="tecnico">Análisis Técnico</TabsTrigger>
            <TabsTrigger value="organo">Órgano Contratante</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{licitacionEjemplo.descripcion}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conceptos TIC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {licitacionEjemplo.conceptos.map((concepto) => (
                    <Badge key={concepto} variant="outline" className="text-sm">
                      {concepto}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tecnico" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Objetivo del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{licitacionEjemplo.resumenTecnico.objetivo}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requisitos Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {licitacionEjemplo.resumenTecnico.requisitos_clave.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stack Tecnológico Identificado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(licitacionEjemplo.stackTecnologico).map(([categoria, tecnologias]) => {
                    if (tecnologias.length === 0) return null;
                    return (
                      <div key={categoria}>
                        <h4 className="text-sm font-semibold mb-2 capitalize">
                          {categoria.replace(/_/g, ' ')}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {tecnologias.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {licitacionEjemplo.organo.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Ubicación</p>
                  <p className="text-muted-foreground">{licitacionEjemplo.organo.ciudad}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Email</p>
                  <p className="text-muted-foreground">{licitacionEjemplo.organo.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Web</p>
                  <a
                    href={licitacionEjemplo.organo.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {licitacionEjemplo.organo.web}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

