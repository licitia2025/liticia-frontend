import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Stats() {
  // Datos de ejemplo
  const topTecnologias = [
    { nombre: "Cloud Computing", count: 45, tendencia: "up" },
    { nombre: "Ciberseguridad", count: 38, tendencia: "up" },
    { nombre: "Desarrollo Web", count: 32, tendencia: "stable" },
    { nombre: "Big Data", count: 28, tendencia: "up" },
    { nombre: "DevOps", count: 24, tendencia: "down" },
  ];

  const topConceptos = [
    { nombre: "Transformación Digital", count: 56 },
    { nombre: "Infraestructura TI", count: 42 },
    { nombre: "Soporte y Mantenimiento", count: 38 },
    { nombre: "Consultoría TI", count: 34 },
    { nombre: "Business Intelligence", count: 29 },
  ];

  const evolucionMensual = [
    { mes: "Ene", count: 45 },
    { mes: "Feb", count: 52 },
    { mes: "Mar", count: 48 },
    { mes: "Abr", count: 61 },
    { mes: "May", count: 58 },
    { mes: "Jun", count: 67 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Estadísticas y Análisis</h1>
          <p className="text-muted-foreground">Tendencias y métricas del mercado de licitaciones TIC</p>
        </div>

        {/* Métricas generales */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Licitaciones</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€156.8M</div>
              <p className="text-xs text-green-500">+12% vs periodo anterior</p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presupuesto Promedio</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€127,100</div>
              <p className="text-xs text-muted-foreground">Por licitación</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Tecnologías */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Tecnologías Más Demandadas</CardTitle>
              <CardDescription>Últimos 30 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTecnologias.map((tech, idx) => (
                  <div key={tech.nombre} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-semibold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium">{tech.nombre}</p>
                        <p className="text-sm text-muted-foreground">{tech.count} licitaciones</p>
                      </div>
                    </div>
                    {tech.tendencia === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {tech.tendencia === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Conceptos */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Conceptos TIC Principales</CardTitle>
              <CardDescription>Distribución por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topConceptos.map((concepto) => (
                  <div key={concepto.nombre} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{concepto.nombre}</span>
                      <span className="text-sm text-muted-foreground">{concepto.count}</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(concepto.count / 56) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evolución mensual */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Evolución Mensual</CardTitle>
              <CardDescription>Número de licitaciones publicadas por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-64">
                {evolucionMensual.map((mes) => (
                  <div key={mes.mes} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-primary/20 rounded-t-lg relative" style={{ height: `${(mes.count / 70) * 100}%` }}>
                      <div className="absolute -top-6 left-0 right-0 text-center text-sm font-semibold">
                        {mes.count}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{mes.mes}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Distribución por tipo */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Distribución por Tipo de Contrato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Servicios</Badge>
                  <span className="text-sm font-semibold">58%</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Suministros</Badge>
                  <span className="text-sm font-semibold">32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Obras</Badge>
                  <span className="text-sm font-semibold">10%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Distribución por estado */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Distribución por Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge>Publicadas</Badge>
                  <span className="text-sm font-semibold">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">En evaluación</Badge>
                  <span className="text-sm font-semibold">35%</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Adjudicadas</Badge>
                  <span className="text-sm font-semibold">20%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

