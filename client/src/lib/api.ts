/**
 * Cliente API para conectar con el backend de Liticia
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://liticia-backend-api.onrender.com/api/v1';

export interface Documento {
  id: number;
  nombre: string;
  tipo: string | null;
  url_descarga: string | null;
  tamano_bytes: number | null;
}

export interface Licitacion {
  id: number;
  titulo: string;
  titulo_adaptado: string | null;
  expediente: string | null;
  estado: string | null;
  organo_contratacion: string | null;
  tipo_contrato: string | null;
  presupuesto_base: number | null;
  lugar_ejecucion: string | null;
  fecha_limite_presentacion: string | null;
  fecha_actualizacion: string | null;
  conceptos_tic: string[] | null;
  analizado_ia: boolean;
}

export interface LicitacionDetail extends Licitacion {
  id_licitacion: string;
  link: string | null;
  resumen: string | null;
  documentos: Documento[] | null;
  codigos_cpv: string[] | null;
  stack_tecnologico: Record<string, string[]> | null;
  resumen_tecnico: {
    objetivo?: string;
    requisitos_clave?: string[];
    complejidad?: string;
    duracion_estimada?: string;
    presupuesto_tipo?: string;
  } | null;
  nif_organo: string | null;
  web_organo: string | null;
  email_organo: string | null;
  telefono_organo: string | null;
  ciudad_organo: string | null;
  created_at: string;
  updated_at: string;
}

export interface LicitacionesResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: Licitacion[];
}

export interface Estadisticas {
  total_licitaciones: number;
  total_presupuesto: number;
  presupuesto_promedio: number;
  licitaciones_por_estado: Record<string, number>;
  licitaciones_por_tipo: Record<string, number>;
  licitaciones_por_concepto: Record<string, number>;
  top_tecnologias: Array<{ nombre: string; count: number }>;
  evolucion_mensual: Array<{ mes: string; count: number }>;
}

export interface LicitacionesFilters {
  page?: number;
  page_size?: number;
  search?: string;
  estado?: string;
  tipo_contrato?: string;
  presupuesto_min?: number;
  presupuesto_max?: number;
  lugar_ejecucion?: string;
  concepto_tic?: string;
  tecnologia?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  solo_analizadas_ia?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Obtiene lista de licitaciones con filtros
   */
  async getLicitaciones(filters?: LicitacionesFilters): Promise<LicitacionesResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const query = params.toString();
    const endpoint = `/licitaciones${query ? `?${query}` : ''}`;
    
    return this.request<LicitacionesResponse>(endpoint);
  }

  /**
   * Obtiene el detalle de una licitación
   */
  async getLicitacion(id: number): Promise<LicitacionDetail> {
    return this.request<LicitacionDetail>(`/licitaciones/${id}`);
  }

  /**
   * Obtiene estadísticas generales
   */
  async getEstadisticas(fecha_desde?: string, fecha_hasta?: string): Promise<Estadisticas> {
    const params = new URLSearchParams();
    
    if (fecha_desde) params.append('fecha_desde', fecha_desde);
    if (fecha_hasta) params.append('fecha_hasta', fecha_hasta);
    
    const query = params.toString();
    const endpoint = `/licitaciones/stats/general${query ? `?${query}` : ''}`;
    
    return this.request<Estadisticas>(endpoint);
  }
}

// Exportar instancia del cliente
export const api = new ApiClient(API_BASE_URL);

