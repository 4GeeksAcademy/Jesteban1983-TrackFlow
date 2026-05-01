# TrackFlow - Hito 2: Fundamentos de Programación

## 📋 Descripción

Motor lógico de TypeScript para el sistema de gestión de almacenes y transportistas de TrackFlow. Implementa toda la lógica de negocio para procesar envíos, gestionar inventario y seleccionar transportistas.

**Construido para Ana Whitfield:** Código sólido, testeable y mantenible, diseñado para procesar +2,000 envíos por semana sin fallos.

## 🏗️ Estructura de Carpetas

```
src/
├── types.ts                 # Interfaces y tipos (Product, Shipment, Carrier, etc.)
├── index.ts                 # Punto de entrada principal
├── example.ts               # Ejemplos de uso de todas las funciones
└── utils/
    ├── index.ts             # Exporta todas las funciones
    ├── collections.ts       # Filtrado y ordenamiento inmutable
    ├── search.ts            # Búsqueda lineal y búsqueda binaria
    ├── transformations.ts   # Cálculos, scoring y reportes
    └── validations.ts       # Validaciones de reglas de negocio
```

## 📦 Módulos Principales

### 1️⃣ **src/types.ts** — Tipos y Interfaces
Define todas las entidades de negocio con tipado estricto:

- **`Product`** — Productos en almacén con SKU, peso, dimensiones, stock
- **`Shipment`** — Envíos/pedidos con origen, destino, prioridad
- **`Carrier`** — Transportistas con tarifas, capacidades, confiabilidad
- **`InventoryMovement`** — Registro de cambios de inventario

### 2️⃣ **src/utils/collections.ts** — Operaciones de Colecciones
Filtrado y ordenamiento **inmutable** (sin mutar arrays originales):

```typescript
// Filtrado
filterProductsByWarehouse(products, "Los Angeles")
filterProductsByCategory(products, "Electronics")
filterLowStockProducts(products)

// Ordenamiento
sortProductsByStock(products, "desc")        // Mayor stock primero
sortCarriersByReliability(carriers, "desc") // Más confiables primero
```

### 3️⃣ **src/utils/search.ts** — Búsqueda
Búsqueda lineal y binaria:

```typescript
// O(n) — Búsqueda lineal
findProductBySKU(products, "LAPTOP-DELL-15")        // Case-insensitive
findShipmentById(shipments, "SH-2024-8821")

// O(log n) — Búsqueda binaria (requiere array ordenado)
binarySearchProductByWeight(sortedProducts, 2.3)    // Retorna índice
```

### 4️⃣ **src/utils/transformations.ts** — Cálculos y Reportes

#### 💰 Cálculo de Costos
```typescript
calculateShippingCost(shipment, product, carrier)
```

Fórmula exacta:
$$\text{Costo} = \text{Base} + (\text{Peso} \times \text{Tasa/kg} \times \text{Qty}) + (\text{Distancia} \times \text{Tasa/km})$$

Con recargos por prioridad:
- **Standard:** 0% adicional
- **Express:** +30%
- **Same-day:** +60%

#### ⭐ Scoring de Transportista (0-100)
```typescript
scoreCarrierForShipment(carrier, shipment, product)
```

Sistema de puntos:
| Criterio | Puntos | Descripción |
|----------|--------|-------------|
| Opera en destino | 20 | ¿Transportista opera en el país? |
| Maneja peso | 20 | ¿Puede transportar el peso total? |
| Soporta prioridad | 15 | ¿Acepta el nivel de urgencia? |
| Maneja frágiles | 15 | ¿Puede con productos frágiles? |
| Confiabilidad | 30 | onTimeRate × 0.3 |
| **TOTAL MÁXIMO** | **100** | - |

#### 🎯 Selección del Mejor Transportista
```typescript
selectBestCarrier(carriers, shipment, product)
```

Proceso:
1. Puntúa todos los transportistas
2. Filtra score ≥ 50 (no adecuados excluidos)
3. **Selecciona el de menor costo** entre los adecuados

#### 📊 Reportes
```typescript
// Conteo por categoría
countProductsByCategory(products)
// { Fashion: 1, Electronics: 1, Cosmetics: 1, Home: 0, Other: 0 }

// Valor total de inventario
calculateTotalInventoryValue(products)
// 16975.00

// Distancia promedio de envíos
calculateAverageShipmentDistance(shipments)
// 200.00

// Agrupar envíos por estado
groupShipmentsByStatus(shipments)
// { Pending: [...], Assigned: [...], ... }

// Top N transportistas más usados
findTopCarriers(shipments, 3)
// [{ carrier: "UPS", count: 5 }, { carrier: "SEUR", count: 3 }, ...]
```

### 5️⃣ **src/utils/validations.ts** — Validaciones de Reglas de Negocio

```typescript
// Valida producto según reglas
validateProduct(product)
// { valid: true, errors: [] }

// Valida envío
validateShipment(shipment)
// { valid: false, errors: ["Quantity must be greater than 0"] }

// Valida transportista
validateCarrier(carrier)
```

**Reglas de Validación:**

**Producto:**
- ✅ SKU no vacío
- ✅ Peso: 0 < kg ≤ 100
- ✅ Dimensiones: 0 < cm ≤ 200
- ✅ Stock ≥ 0
- ✅ Costo > 0

**Envío:**
- ✅ Cantidad > 0
- ✅ Valor declarado > 0
- ✅ Distancia ≥ 0

**Transportista:**
- ✅ Tarifas ≥ 0
- ✅ Días de entrega > 0
- ✅ Tasa a tiempo: 0-100
- ✅ Peso máximo > 0
- ✅ Opera en ≥ 1 país

## 🚀 Cómo Usar

### Importar Funciones

```typescript
// Importa una función específica
import { calculateShippingCost, validateProduct } from "./src";

// Importa todo
import * as TrackFlow from "./src";
```

### Ejemplo Completo

```typescript
import {
  filterLowStockProducts,
  validateProduct,
  selectBestCarrier,
  calculateTotalInventoryValue,
} from "./src";

// Validar productos
const allValid = products.every((p) => validateProduct(p).valid);

// Encontrar bajo stock
const lowStock = filterLowStockProducts(products);
console.log(`⚠️ ${lowStock.length} productos requieren reorden`);

// Seleccionar transportista
const best = selectBestCarrier(carriers, shipment, product);
if (best) {
  console.log(`Envío: $${best.cost} con ${best.carrier.name}`);
}

// Reportes
const totalValue = calculateTotalInventoryValue(products);
console.log(`💰 Inventario total: $${totalValue}`);
```

## ✅ Criterios de Calidad

Cumple con todos los criterios de aceptación:

- ✅ **Type Safety:** Tipado estricto en toda la codebase
- ✅ **Corrección:** Cada función produce el output esperado
- ✅ **Casos Límite:** Maneja arrays vacíos, valores nulos, datos inválidos
- ✅ **Lógica de Validación:** Reglas de negocio implementadas con precisión
- ✅ **Organización:** Funciones en archivos correctos por responsabilidad
- ✅ **Convenciones:** Nombres en camelCase, tipos en PascalCase
- ✅ **Inmutabilidad:** `.filter()`, `.map()`, `.reduce()`, spread operator
- ✅ **Funciones Puras:** Sin efectos secundarios, solo parámetros

## 📊 Ejemplos de Datos

Todos los ejemplos usan datos reales de TrackFlow:

**Productos:**
- SHOE-BLK-42: Zapatillas (Los Angeles, 45 unidades, $35)
- LAPTOP-DELL-15: Laptop (Zaragoza, 8 unidades, $650)
- PERFUME-COCO-50: Perfume (Los Angeles, 120 unidades, $85)

**Transportistas:**
- UPS: Opera en USA, 88% a tiempo
- SEUR: Opera en España, 92% a tiempo
- DHL: Ambos países, 95% a tiempo

**Envío de Ejemplo:**
- SH-2024-8821: Laptop desde Zaragoza a Madrid (320 km), envío Express

## 🔧 Sin Dependencias Externas

Este módulo fue construido con:
- ✅ TypeScript nativo
- ✅ Algoritmos estándar (búsqueda lineal, binaria)
- ✅ Métodos array funcionales

**Zero configuración, zero dependencias.**

---

**Construido por:** Equipo TrackFlow Tech  
**Para:** Ana Whitfield, Directora de Operaciones de Almacén  
**Objetivo:** Procesar +2,000 envíos por semana sin fallos
