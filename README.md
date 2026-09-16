# Sistema de Punto de Venta Naturista
Proyecto basado en un esqueleto de aplicación React + TanStack Router/Query, con integración de server functions para gestión de productos e imágenes. Este proyecto **ya no depende de Lovable**, sino que se construyó sobre un esqueleto propio.

---
## 🚀 Propósito
El objetivo principal de este proyecto es implementar un **sistema de Punto de Venta (POS)** diseñado específicamente para **compañías de centros naturistas con múltiples sucursales**.  
Este sistema busca cubrir las necesidades operativas y comerciales de este tipo de negocios, ofreciendo una plataforma moderna, escalable y fácil de usar que permita:
- **Gestión centralizada de sucursales**  
  Control de inventarios, ventas y reportes en tiempo real, con soporte para múltiples locales.
- **Optimización de procesos de venta**  
  Flujo de caja eficiente, registro rápido de transacciones y control de stock inmediato.
- **Experiencia de usuario mejorada**  
  Interfaz intuitiva con galería de productos, imágenes dinámicas y búsqueda avanzada por beneficios.
- **Integración con inteligencia artificial (Gemini)**  
  Consulta de información extendida de productos, recomendaciones y soporte inteligente para vendedores.
- **Seguridad y control de accesos**  
  Módulo de usuarios, roles y auditoría para garantizar la trazabilidad de las operaciones.
- **Escalabilidad y flexibilidad**  
  Arquitectura modular que permite añadir nuevas funcionalidades como facturación electrónica, reportes personalizados o integración con sistemas externos.
En resumen, este proyecto no solo busca ser un sistema de ventas, sino una **plataforma integral de gestión comercial y administrativa** para cadenas de centros naturistas, adaptada a sus necesidades específicas y con capacidad de crecer junto al negocio.

---
## 🛠️ Stack Tecnológico
### UI / Componentes
- **Radix UI** (`@radix-ui/react-*`) → librería de componentes accesibles y altamente configurables.  
- **lucide-react** → íconos SVG.  
- **cmdk**, **vaul**, **embla-carousel-react**, **react-resizable-panels** → componentes avanzados (command palette, drawer, carrusel, paneles).  
### Estilos
- **tailwindcss**, **@tailwindcss/vite**, **tailwind-merge**, **tw-animate-css** → stack completo de Tailwind para estilos y animaciones.  
### Estado y Routing
- **@tanstack/react-query** → manejo de datos remotos (fetch/cache).  
- **@tanstack/react-router**, **@tanstack/react-start**, **@tanstack/router-plugin** → routing moderno con TanStack.  
### Formularios y Validación
- **react-hook-form**, **@hookform/resolvers**, **zod** → validación declarativa y tipada.  
### Backend / Base de Datos
- **mysql2** (integrado vía `@mysql/supabase-js`) → conexión directa a MySQL.  
- ⚠️ **No se utiliza Drizzle ORM** en este proyecto.  
### Utilidades
- **clsx**, **class-variance-authority (CVA)** → manejo de clases condicionales y variantes.  
- **date-fns** → utilidades de fechas.  
- **sonner** → notificaciones.  
- **recharts** → gráficos y visualizaciones.  
## 🔌 Server Functions
El proyecto utiliza **server functions** para interactuar con la base de datos MySQL y obtener información

---
## 📂 Estructura relevante
src/
 ├─ components/
 │   └─ AppShell.tsx
 ├─ routes/
 │   └─ _authenticated/
 │       └─ Paginas que se pueden ver una vez iniciado sesion
 ├─ server-functions/
 │   ├─ Funciones que invocan a las integrations
 └─ types/
     └─ mysqltypes.ts

---
## ⚙️ Configuración
1. Clonar el repositorio.
    git clone https://github.com/cadrei/lovable-pos-system-mysql.git
2. Instalar dependencias:
   npm install
3. Configurar variables de entorno para conexión a base de datos MySQL.
4. Ejecutar en desarrollo:
   npm run dev

---
## ✨ Funcionalidades actuales
El sistema integra múltiples módulos y funcionalidades que conforman un **Punto de Venta (POS)** completo:
- **Página principal**  
  - Dashboard inicial con acceso rápido a módulos y reportes.
- **Login / Autenticación**  
  - Inicio de sesión seguro para usuarios registrados.  
  - Manejo de sesiones y roles.
- **Módulo de Caja**  
  - Registro de ventas en tiempo real.  
  - Control de apertura y cierre de caja.  
  - Gestión de pagos y comprobantes.
- **Módulo de Clientes**  
  - Registro y administración de clientes.  
  - Consulta de historial de compras.  
  - Segmentación por categorías.
- **Módulo de Configuración**  
  - Ajustes generales del sistema.  
  - Personalización de parámetros de negocio.  
  - Gestión de usuarios y permisos.
- **Módulo de Inventario**  
  - Control de stock por sucursal.  
  - Registro de entradas y salidas de productos.  
  - **Consulta a la IA (Gemini)** para obtener información avanzada de productos.  
- **Panel Principal**  
  - Vista consolidada de métricas clave.  
  - Acceso rápido a reportes y módulos.  
- **Galería de Productos**  
  - Visualización estilo ecommerce con tarjetas de producto.  
  - Paginación (9 productos por página).  
  - Imágenes dinámicas con selección de miniaturas.  
  - Transiciones visuales (fade-in, zoom al hover).  
  - Modal/lightbox para ver imágenes en detalle.  
  - Lazy loading en miniaturas.  
- **Consulta de Productos por Beneficios**  
  - Búsqueda avanzada de productos según beneficios o síntomas asociados.  
- **Módulo de Reportes**  
  - Generación de reportes de ventas, inventario y clientes.  
  - Exportación y visualización gráfica con **Recharts**.  
- **Módulo de Seguridad**  
  - Control de accesos y roles.  
  - Auditoría de acciones de usuarios.  
- **Módulo de Ventas**  
  - Registro de transacciones.  
  - Integración con caja e inventario.  
  - Reportes de ventas por período.  

---
## 📌 Próximos pasos
- Incluir scripts de despliegue (Docker/CI/CD).
- Optimizar carga de imágenes (CDN, compresión).

---
## 👤 Autor
Proyecto adaptado y modificado por **David Cordero**, basado en un esqueleto definido con Lovable.

