import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ExternalLink, Calendar, MapPin, Euro, Building2, FileText, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { api, type Licitacion } from "@/lib/api";

export default function LicitacionDetail() {
  const [, params] = useRoute("/licitaciones/:id");
  const id = params?.id;
  const [licitacion, setLicitacion] = useState<Licitacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLicitacion = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await api.getLicitacion(parseInt(id));
        setLicitacion(data);
      } catch (err) {
        console.error('Error fetching licitacion:', err);
        setError('Error al cargar la licitación. Verifica que el backend esté funcionando.');
      } finally {
        setLoading(false);
      }
    };

    fetchLicitacion();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-8 flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando licitación...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !licitacion) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error || 'Licitación no encontrada'}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/licitaciones">
                <Button className="w-full">
                  Volver a licitaciones
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'No especificado';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getEstadoLabel = (estado: string | null) => {
    const estados: Record<string, string> = {
      'PUB': 'Publicada',
      'EV': 'En evaluación',
      'ADJ': 'Adjudicada',
      'RES': 'Resuelta'
    };
    return estados[estado || ''] || estado || 'Desconocido';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
              <h1 className="text-3xl font-bold mb-2">
                {licitacion.titulo_adaptado || licitacion.titulo}
              </h1>
              {licitacion.titulo_adaptado && (
                <p className="text-sm text-muted-foreground italic mb-2">
                  Título original: {licitacion.titulo}
                </p>
              )}
              <p className="text-muted-foreground">
                Expediente: {licitacion.numero_expediente || 'No especificado'}
              </p>
            </div>
            <Badge variant={licitacion.estado === "PUB" ? "default" : "secondary"} className="text-lg px-4 py-2">
              {getEstadoLabel(licitacion.estado)}
            </Badge>
          </div>

          {/* Información clave */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Presupuesto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(licitacion.presupuesto_base)}</div>
                <p className="text-xs text-muted-foreground mt-1">{licitacion.tipo_contrato || 'No especificado'}</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{licitacion.lugar_ejecucion || 'No especificado'}</div>
                <p className="text-xs text-muted-foreground mt-1">Lugar de ejecución</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha límite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDate(licitacion.fecha_fin_presentacion)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Presentación de ofertas
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Complejidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {licitacion.resumen_tecnico?.complejidad || 'No analizada'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {licitacion.resumen_tecnico?.duracion_estimada || 'Duración no estimada'}
                </p>
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
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {licitacion.descripcion || 'No hay descripción disponible'}
                </p>
              </CardContent>
            </Card>

            {licitacion.conceptos_tic && licitacion.conceptos_tic.length > 0 && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Conceptos TIC</CardTitle>
                  <CardDescription>Identificados automáticamente por IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {licitacion.conceptos_tic.map((concepto) => (
                      <Badge key={concepto} variant="outline" className="text-sm">
                        {concepto}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {licitacion.enlace && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Enlace a PLACSP</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={licitacion.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Ver licitación completa en la Plataforma de Contratación
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            )}

            {licitacion.documentos && licitacion.documentos.length > 0 && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Documentos Adjuntos</CardTitle>
                  <CardDescription>
                    Pliegos y documentación técnica de la licitación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {licitacion.documentos.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.nombre}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.tipo === 'pliego_administrativo' && 'Pliego de Cláusulas Administrativas'}
                              {doc.tipo === 'pliego_tecnico' && 'Pliego de Prescripciones Técnicas'}
                              {doc.tipo === 'anexo' && 'Documento Anexo'}
                              {!doc.tipo && 'Documento'}
                            </p>
                          </div>
                        </div>
                        <a
                          href={doc.url_descarga}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tecnico" className="space-y-4">
            {licitacion.resumen_tecnico ? (
              <>
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Objetivo del Proyecto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {licitacion.resumen_tecnico.objetivo || 'No disponible'}
                    </p>
                  </CardContent>
                </Card>

                {licitacion.resumen_tecnico.requisitos_clave && licitacion.resumen_tecnico.requisitos_clave.length > 0 && (
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Requisitos Clave</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {licitacion.resumen_tecnico.requisitos_clave.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {licitacion.stack_tecnologico && (
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Stack Tecnológico Identificado</CardTitle>
                      <CardDescription>Detectado automáticamente por IA</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(licitacion.stack_tecnologico).map(([categoria, tecnologias]) => {
                          if (!Array.isArray(tecnologias) || tecnologias.length === 0) return null;
                          return (
                            <div key={categoria}>
                              <h4 className="text-sm font-semibold mb-2 capitalize">
                                {categoria.replace(/_/g, ' ')}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {tecnologias.map((tech, idx) => (
                                  <Badge key={`${tech}-${idx}`} variant="secondary">
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
                )}

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Información Adicional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Complejidad</p>
                        <p className="text-muted-foreground">
                          {licitacion.resumen_tecnico.complejidad || 'No especificada'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Duración Estimada</p>
                        <p className="text-muted-foreground">
                          {licitacion.resumen_tecnico.duracion_estimada || 'No especificada'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Tipo de Presupuesto</p>
                        <p className="text-muted-foreground">
                          {licitacion.resumen_tecnico.presupuesto_tipo || 'No especificado'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Análisis Técnico No Disponible</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Esta licitación aún no ha sido analizada por IA.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="organo" className="space-y-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {licitacion.organo_contratacion || 'Órgano no especificado'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Ubicación</p>
                  <p className="text-muted-foreground">
                    {licitacion.lugar_ejecucion || 'No especificada'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Fecha de Publicación</p>
                  <p className="text-muted-foreground">
                    {formatDate(licitacion.fecha_publicacion)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Fecha de Actualización</p>
                  <p className="text-muted-foreground">
                    {formatDate(licitacion.fecha_actualizacion)}
                  </p>
                </div>
                {licitacion.enlace && (
                  <div>
                    <p className="text-sm font-medium mb-1">Enlace Oficial</p>
                    <a
                      href={licitacion.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      Ver en PLACSP
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

