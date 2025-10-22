import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Search, Calendar, MapPin, Euro, SlidersHorizontal, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || 'https://liticia-backend.onrender.com/api/v1';

interface Licitacion {
  id: number;
  titulo: string;
  titulo_adaptado: string | null;
  expediente: string | null;
  organo_contratacion: string | null;
  tipo_contrato: string | null;
  presupuesto_base: number | null;
  lugar_ejecucion: string | null;
  estado: string | null;
  conceptos_tic: string[] | null;
  fecha_actualizacion: string;
  fecha_limite_presentacion: string | null;
  fecha_publicacion: string | null;
}

interface ApiResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: Licitacion[];
}

type EstadoFiltro = 'todas' | 'publicadas' | 'en_plazo' | 'ultimos_dias' | 'adjudicadas';
type OrdenTipo = 'relevante' | 'fecha_publicacion' | 'fecha_actualizacion' | 'fecha_limite' | 'presupuesto_desc' | 'presupuesto_asc' | 'fecha_vencimiento' | 'fecha_adjudicacion';

export default function Licitaciones() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>('todas');
  const [ordenamiento, setOrdenamiento] = useState<OrdenTipo>('relevante');

  useEffect(() => {
    fetchLicitaciones();
  }, [page]);

  const fetchLicitaciones = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/licitaciones/?page=${page}&limit=20`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: ApiResponse = await response.json();
      setLicitaciones(data.items);
      setTotalPages(data.total_pages);
      setTotal(data.total);
    } catch (err) {
      console.error('Error fetching licitaciones:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const isPublishedToday = (fechaPublicacion: string | null): boolean => {
    if (!fechaPublicacion) return false;
    const today = new Date();
    const pubDate = new Date(fechaPublicacion);
    return (
      pubDate.getDate() === today.getDate() &&
      pubDate.getMonth() === today.getMonth() &&
      pubDate.getFullYear() === today.getFullYear()
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return 'N/A';
    }
  };

  const getDaysUntilDeadline = (fechaLimite: string | null): number | null => {
    if (!fechaLimite) return null;
    const today = new Date();
    const deadline = new Date(fechaLimite);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filtrarPorEstado = (lic: Licitacion): boolean => {
    if (estadoFiltro === 'todas') return true;
    
    const daysUntilDeadline = getDaysUntilDeadline(lic.fecha_limite_presentacion);
    
    switch (estadoFiltro) {
      case 'publicadas':
        return lic.estado === 'publicada';
      case 'en_plazo':
        return daysUntilDeadline !== null && daysUntilDeadline > 7;
      case 'ultimos_dias':
        return daysUntilDeadline !== null && daysUntilDeadline >= 0 && daysUntilDeadline <= 7;
      case 'adjudicadas':
        return lic.estado === 'adjudicada' || lic.estado === 'resuelta';
      default:
        return true;
    }
  };

  const ordenarLicitaciones = (lics: Licitacion[]): Licitacion[] => {
    const sorted = [...lics];
    
    switch (ordenamiento) {
      case 'fecha_publicacion':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.fecha_publicacion || a.fecha_actualizacion).getTime();
          const dateB = new Date(b.fecha_publicacion || b.fecha_actualizacion).getTime();
          return dateB - dateA;
        });
      case 'fecha_actualizacion':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.fecha_actualizacion).getTime();
          const dateB = new Date(b.fecha_actualizacion).getTime();
          return dateB - dateA;
        });
      case 'fecha_limite':
        return sorted.sort((a, b) => {
          if (!a.fecha_limite_presentacion) return 1;
          if (!b.fecha_limite_presentacion) return -1;
          const dateA = new Date(a.fecha_limite_presentacion).getTime();
          const dateB = new Date(b.fecha_limite_presentacion).getTime();
          return dateA - dateB;
        });
      case 'presupuesto_desc':
        return sorted.sort((a, b) => (b.presupuesto_base || 0) - (a.presupuesto_base || 0));
      case 'presupuesto_asc':
        return sorted.sort((a, b) => (a.presupuesto_base || 0) - (b.presupuesto_base || 0));
      case 'fecha_vencimiento':
        return sorted.sort((a, b) => {
          if (!a.fecha_limite_presentacion) return 1;
          if (!b.fecha_limite_presentacion) return -1;
          const dateA = new Date(a.fecha_limite_presentacion).getTime();
          const dateB = new Date(b.fecha_limite_presentacion).getTime();
          return dateB - dateA;
        });
      case 'fecha_adjudicacion':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.fecha_actualizacion).getTime();
          const dateB = new Date(b.fecha_actualizacion).getTime();
          return dateB - dateA;
        });
      case 'relevante':
      default:
        return sorted;
    }
  };

  const filteredLicitaciones = ordenarLicitaciones(
    licitaciones
      .filter(lic =>
        searchTerm === "" || 
        lic.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lic.expediente && lic.expediente.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(filtrarPorEstado)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8">
        {/* Filtros de estado en tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={estadoFiltro === 'todas' ? 'default' : 'outline'}
              onClick={() => setEstadoFiltro('todas')}
            >
              Todas
            </Button>
            <Button
              variant={estadoFiltro === 'publicadas' ? 'default' : 'outline'}
              onClick={() => setEstadoFiltro('publicadas')}
            >
              Publicadas
            </Button>
            <Button
              variant={estadoFiltro === 'en_plazo' ? 'default' : 'outline'}
              onClick={() => setEstadoFiltro('en_plazo')}
            >
              En plazo
            </Button>
            <Button
              variant={estadoFiltro === 'ultimos_dias' ? 'default' : 'outline'}
              onClick={() => setEstadoFiltro('ultimos_dias')}
            >
              Últimos días
            </Button>
            <Button
              variant={estadoFiltro === 'adjudicadas' ? 'default' : 'outline'}
              onClick={() => setEstadoFiltro('adjudicadas')}
            >
              Adjudicadas
            </Button>
          </div>

          {/* Barra de búsqueda y ordenamiento */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título o expediente..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 md:w-auto w-full">
              <Label className="whitespace-nowrap text-sm">Ordenar por:</Label>
              <Select value={ordenamiento} onValueChange={(value) => setOrdenamiento(value as OrdenTipo)}>
                <SelectTrigger className="md:w-[280px] w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevante">Más relevante</SelectItem>
                  <SelectItem value="fecha_publicacion">Fecha publicación más reciente</SelectItem>
                  <SelectItem value="fecha_actualizacion">Fecha de última actualización</SelectItem>
                  <SelectItem value="fecha_limite">Fecha límite más próxima</SelectItem>
                  <SelectItem value="presupuesto_desc">Presupuesto: de mayor a menor</SelectItem>
                  <SelectItem value="presupuesto_asc">Presupuesto: de menor a mayor</SelectItem>
                  <SelectItem value="fecha_vencimiento">Fecha de vencimiento más reciente</SelectItem>
                  <SelectItem value="fecha_adjudicacion">Fecha de adjudicación más reciente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tipo de Contrato */}
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
                    <div className="flex gap-2">
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

                  <Button className="w-full" variant="outline" onClick={() => {
                    setSearchTerm("");
                    setEstadoFiltro('todas');
                    setOrdenamiento('relevante');
                  }}>
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
                {loading ? (
                  "Cargando..."
                ) : error ? (
                  <span className="text-destructive">Error: {error}</span>
                ) : (
                  <>
                    Mostrando <span className="font-semibold">{filteredLicitaciones.length}</span> de{" "}
                    <span className="font-semibold">{total}</span> licitaciones
                  </>
                )}
              </p>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <Card className="shadow-md">
                <CardContent className="py-12 text-center">
                  <p className="text-destructive mb-4">Error al cargar las licitaciones</p>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button onClick={fetchLicitaciones}>Reintentar</Button>
                </CardContent>
              </Card>
            )}

            {/* Licitaciones list */}
            {!loading && !error && (
              <div className="space-y-4">
                {filteredLicitaciones.length === 0 ? (
                  <Card className="shadow-md">
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No se encontraron licitaciones</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredLicitaciones.map((lic) => (
                    <Card 
                      key={lic.id} 
                      className="shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/licitaciones/${lic.id}`}>
                              <CardTitle className="text-xl hover:text-primary transition-colors">
                                {lic.titulo_adaptado || lic.titulo}
                              </CardTitle>
                            </Link>
                            <CardDescription className="mt-2">
                              {lic.organo_contratacion || 'Organismo no especificado'}
                              {lic.expediente && ` • Expediente: ${lic.expediente}`}
                            </CardDescription>
                          </div>
                          {isPublishedToday(lic.fecha_publicacion || lic.fecha_actualizacion) && (
                            <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                              HOY
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Euro className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {lic.presupuesto_base 
                                ? `€${lic.presupuesto_base.toLocaleString()}` 
                                : 'No especificado'}
                            </span>
                            {lic.tipo_contrato && (
                              <span className="text-muted-foreground">• {lic.tipo_contrato}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {lic.lugar_ejecucion || 'No especificado'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(lic.fecha_limite_presentacion || lic.fecha_actualizacion)}
                          </div>
                        </div>
                        
                        {lic.conceptos_tic && lic.conceptos_tic.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {lic.conceptos_tic.map((concepto) => (
                              <Badge key={concepto} variant="outline" className="hover:bg-accent transition-colors">
                                {concepto}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Paginación */}
            {!loading && !error && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Anterior
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

