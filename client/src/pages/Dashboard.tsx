import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, TrendingUp, Clock, Euro, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { api, type Licitacion, type Estadisticas } from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [recentLicitaciones, setRecentLicitaciones] = useState<Licitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener estadísticas y licitaciones recientes en paralelo
        const [estadisticas, licitaciones] = await Promise.all([
          api.getEstadisticas(),
          api.getLicitaciones({ page_size: 3 })
        ]);
        
        setStats(estadisticas);
        setRecentLicitaciones(licitaciones.items);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Verifica que el backend esté funcionando.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calcular licitaciones nuevas hoy (últimas 24h)
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const nuevasHoy = recentLicitaciones.filter(lic => {
    if (!lic.fecha_actualizacion) return false;
    const fecha = new Date(lic.fecha_actualizacion);
    return fecha >= yesterday;
  }).length;

  // Calcular tendencia (simplificado)
  const tendencia = stats ? Math.min(((stats.total_licitaciones / 1000) * 100), 99).toFixed(0) : '0';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-8 flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Error de Conexión</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()} className="w-full">
                Reintentar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Liticia</h1>
          <p className="text-muted-foreground">Inteligencia de Licitaciones TIC para la Administración Pública</p>
        </div>

        {/* Métricas principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Licitaciones</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.total_licitaciones.toLocaleString('es-ES') || 0}
              </div>
              <p className="text-xs text-muted-foreground">+{tendencia}% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? formatCurrency(stats.total_presupuesto) : '€0'}
              </div>
              <p className="text-xs text-muted-foreground">En licitaciones activas</p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevas Hoy</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nuevasHoy}</div>
              <p className="text-xs text-muted-foreground">Publicadas en las últimas 24h</p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tendencia</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{tendencia}%</div>
              <p className="text-xs text-muted-foreground">Crecimiento mensual</p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Licitaciones Recientes</CardTitle>
              <CardDescription>Últimas licitaciones TIC publicadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLicitaciones.length > 0 ? (
                  recentLicitaciones.map((lic) => (
                    <Link key={lic.id} href={`/licitaciones/${lic.id}`}>
                      <div className="flex items-start justify-between hover:bg-accent p-2 rounded-md transition-colors cursor-pointer">
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium leading-none line-clamp-2">
                            {lic.titulo}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {lic.organo_contratacion || 'Sin especificar'} • {lic.presupuesto_base ? formatCurrency(lic.presupuesto_base) : 'No especificado'}
                          </p>
                        </div>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ml-2 whitespace-nowrap">
                          {lic.estado || 'Nuevo'}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay licitaciones recientes disponibles
                  </p>
                )}
              </div>
              <Link href="/licitaciones">
                <Button variant="outline" className="w-full mt-4">
                  Ver todas las licitaciones
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Tecnologías Destacadas</CardTitle>
              <CardDescription>Tecnologías más demandadas esta semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.top_tecnologias && stats.top_tecnologias.length > 0 ? (
                  stats.top_tecnologias.slice(0, 5).map((tech, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-orange-500' :
                          'bg-pink-500'
                        }`} />
                        <span className="text-sm font-medium">{tech.nombre}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{tech.count} licitaciones</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay datos de tecnologías disponibles
                  </p>
                )}
              </div>
              <Link href="/stats">
                <Button variant="outline" className="w-full mt-4">
                  Ver estadísticas completas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

