/**
 * TrackFlow - Tipos y Interfaces del Sistema
 * Hito 2: Fundamentos de Programación
 * 
 * Define todas las entidades de negocio para gestión de almacenes,
 * envíos y transportistas de TrackFlow.
 */

// ============================================================================
// TIPOS ENUMERADOS Y UNIONES
// ============================================================================

/**
 * Categorías de productos disponibles en TrackFlow
 */
export type ProductCategory =
  | "Fashion"
  | "Electronics"
  | "Cosmetics"
  | "Home"
  | "Other";

/**
 * Ubicaciones de almacenes operacionales
 */
export type WarehouseLocation = "Los Angeles" | "Zaragoza";

/**
 * Estados posibles de un producto
 */
export type ProductStatus =
  | "Active"
  | "Low stock"
  | "Out of stock"
  | "Discontinued";

/**
 * Países donde opera TrackFlow
 */
export type Country = "United States" | "Spain";

/**
 * Niveles de prioridad para envíos
 */
export type ShipmentPriority = "Standard" | "Express" | "Same-day";

/**
 * Estados posibles de un envío
 */
export type ShipmentStatus =
  | "Pending"
  | "Assigned"
  | "In transit"
  | "Delivered"
  | "Failed";

/**
 * Tipos de movimiento de inventario
 */
export type MovementType = "Inbound" | "Outbound" | "Transfer" | "Adjustment";

// ============================================================================
// INTERFACES DE ENTIDADES DE NEGOCIO
// ============================================================================

/**
 * Dimensiones de un producto en centímetros
 */
export interface Dimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

/**
 * Producto almacenado en los almacenes de TrackFlow
 * 
 * Representa un SKU específico con información de ubicación, stock
 * y características de manejo (fragilidad, categoría, etc.)
 */
export interface Product {
  /** Stock Keeping Unit - Identificador único del producto (ej: "SHOE-BLK-42") */
  sku: string;
  
  /** Nombre descriptivo del producto */
  name: string;
  
  /** Categoría del producto para clasificación */
  category: ProductCategory;
  
  /** Peso del producto en kilogramos */
  weightKg: number;
  
  /** Dimensiones físicas del producto */
  dimensions: Dimensions;
  
  /** Almacén donde está ubicado el producto */
  warehouse: WarehouseLocation;
  
  /** Cantidad de unidades disponibles en stock */
  stockQuantity: number;
  
  /** Cantidad mínima de stock antes de generar alerta */
  minStockThreshold: number;
  
  /** Costo unitario en USD */
  unitCostUSD: number;
  
  /** Indica si el producto requiere manejo especial (frágil) */
  isFragile: boolean;
  
  /** Estado actual del producto (Activo, Bajo stock, Agotado, Descontinuado) */
  status: ProductStatus;
}

/**
 * Destino de un envío
 * 
 * Información de ubicación y distancia entre el almacén de origen
 * y el punto de entrega del cliente
 */
export interface Destination {
  /** Ciudad de destino */
  city: string;
  
  /** País de destino */
  country: Country;
  
  /** Código postal del destino */
  postalCode: string;
  
  /** Distancia en kilómetros desde el almacén de origen */
  distanceKm: number;
}

/**
 * Envío o pedido de un cliente
 * 
 * Representa una orden que debe ser entregada desde un almacén
 * a una dirección de cliente, rastreando su estado y selección de transportista
 */
export interface Shipment {
  /** ID único del envío (ej: "SH-2024-8821") */
  id: string;
  
  /** SKU del producto siendo enviado */
  sku: string;
  
  /** Cantidad de unidades a enviar */
  quantity: number;
  
  /** Almacén de origen del envío */
  origin: WarehouseLocation;
  
  /** Información de destino de entrega */
  destination: Destination;
  
  /** Nivel de urgencia del envío */
  priority: ShipmentPriority;
  
  /** Valor declarado del envío para propósitos de seguro en USD */
  declaredValueUSD: number;
  
  /** Nombre del transportista asignado (null si aún no asignado) */
  carrier: string | null;
  
  /** Estado actual del envío */
  status: ShipmentStatus;
  
  /** Fecha de creación del pedido */
  createdAt: Date;
}

/**
 * Transportista de entregas
 * 
 * Socio logístico que realiza las entregas finales a clientes.
 * Define capacidades, costos y confiabilidad del transportista.
 */
export interface Carrier {
  /** ID único del transportista (ej: "CAR-UPS") */
  id: string;
  
  /** Nombre comercial del transportista (ej: "UPS", "DHL") */
  name: string;
  
  /** Países donde el transportista opera */
  operatesIn: Country[];
  
  /** Tarifa base por envío en USD */
  baseRateUSD: number;
  
  /** Costo adicional por kilogramo en USD */
  ratePerKgUSD: number;
  
  /** Costo adicional por kilómetro de distancia en USD */
  ratePerKmUSD: number;
  
  /** Tiempo promedio de entrega en días */
  avgDeliveryDays: number;
  
  /** Porcentaje de entregas a tiempo (0-100) */
  onTimeRate: number;
  
  /** Peso máximo de paquete que el transportista acepta en kg */
  maxWeightKg: number;
  
  /** Indica si el transportista puede manejar productos frágiles */
  handlesFragile: boolean;
  
  /** Niveles de prioridad de envío que el transportista soporta */
  acceptsPriority: ShipmentPriority[];
}

/**
 * Movimiento de inventario
 * 
 * Registra cambios en el inventario (entradas, salidas, transferencias, ajustes)
 * para auditoría y seguimiento de stock en tiempo real.
 */
export interface InventoryMovement {
  /** ID único del movimiento */
  id: string;
  
  /** SKU del producto siendo movido */
  sku: string;
  
  /** Almacén donde ocurre el movimiento */
  warehouse: WarehouseLocation;
  
  /** Tipo de movimiento (Entrada, Salida, Transferencia, Ajuste) */
  type: MovementType;
  
  /** Cantidad de unidades movidas */
  quantity: number;
  
  /** Razón o descripción del movimiento */
  reason: string;
  
  /** Marca de tiempo del movimiento */
  timestamp: Date;
}

// ============================================================================
// TIPOS UTILITARIOS PARA VALIDACIÓN Y RESPUESTAS
// ============================================================================

/**
 * Resultado de validación de una entidad
 */
export interface ValidationResult {
  /** Indica si la validación fue exitosa */
  valid: boolean;
  
  /** Array de mensajes de error (vacío si es válido) */
  errors: string[];
}

/**
 * Resultado de selección de transportista
 */
export interface CarrierSelection {
  /** Transportista seleccionado */
  carrier: Carrier;
  
  /** Puntaje de idoneidad (0-100) */
  score: number;
  
  /** Costo total del envío en USD */
  cost: number;
}

/**
 * Información de un transportista con contador de uso
 */
export interface CarrierUsage {
  /** Nombre del transportista */
  carrier: string;
  
  /** Número de envíos asignados */
  count: number;
}
