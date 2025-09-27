# 🧇 La Waffleria - Sistema POS Avanzado

Sistema de Punto de Venta (POS) moderno y completo para restaurantes, desarrollado con React + Vite y Node.js/Express.

## ✨ Características Principales

### 🛒 Carrito Avanzado
- **Gestión completa de pedidos** con cantidades dinámicas
- **Personalización de productos** con toppings y notas especiales
- **Descuentos individuales y globales** con soporte para porcentajes y montos fijos
- **Métodos de pago múltiples** (Efectivo, Tarjeta, Nequi, DaviPlata, PSE)
- **Cálculo automático de IVA** (19% Colombia)

### 🧾 Sistema de Recibos Profesional
- **Recibos detallados con QR codes** para encuestas de satisfacción
- **Generación automática de PDFs** para descarga
- **Compartir por WhatsApp** con formato optimizado
- **Información automática de cuentas** para pagos digitales (Nequi, transferencias)
- **Impresión térmica** con formato optimizado 80mm

### 👥 Gestión de Clientes
- **Información de clientes** con teléfono y email
- **Historial de pedidos** y preferencias
- **Tipos de servicio** (Comer aquí, Para llevar, Domicilio)

### ⚙️ Configuración Completa
- **Información del restaurante** editable
- **Configuración de impresión** y recibos
- **Métodos de pago** configurables
- **Mensajes personalizados** para recibos
- **Respaldos automáticos** del sistema

### 🎨 Interfaz Moderna
- **Diseño oscuro profesional** con Tailwind CSS
- **Responsive design** para dispositivos móviles y tablets
- **Iconografía consistente** con React Icons
- **Animaciones suaves** y feedback visual
- **Navegación intuitiva** por categorías

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de componentes
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Icons** - Iconografía
- **html2canvas** - Generación de imágenes
- **jsPDF** - Generación de PDFs
- **QRCode.js** - Códigos QR

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **CORS** - Cross-origin resource sharing
- **Multer** - Manejo de archivos
- **dotenv** - Variables de entorno

## 📁 Estructura del Proyecto

```
waffleria/
├── waffleria-vite/          # Frontend React + Vite
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── AdvancedCart.js
│   │   │   ├── EnhancedReceipt.js
│   │   │   ├── EnhancedReceiptModal.js
│   │   │   └── ...
│   │   ├── contexts/        # Context providers
│   │   │   └── CartContext.js
│   │   ├── pages/          # Páginas principales
│   │   │   ├── Menu.js
│   │   │   ├── Settings.js
│   │   │   └── ...
│   │   └── utils/          # Utilidades
│   ├── public/             # Archivos estáticos
│   └── package.json        # Dependencias frontend
│
├── server/                 # Backend Node.js + Express
│   ├── routes/            # Rutas de API
│   ├── models/            # Modelos de datos
│   ├── middleware/        # Middleware custom
│   ├── config/            # Configuraciones
│   ├── uploads/           # Archivos subidos
│   └── package.json       # Dependencias backend
│
├── .gitignore             # Archivos ignorados por Git
└── README.md              # Este archivo
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 16+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/waffleria.git
cd waffleria
```

### 2. Instalar dependencias del Frontend
```bash
cd waffleria-vite
npm install
```

### 3. Instalar dependencias del Backend
```bash
cd ../server
npm install
```

### 4. Configurar variables de entorno

**Frontend (.env en waffleria-vite/):**
```env
VITE_API_URL=http://localhost:3000
```

**Backend (.env en server/):**
```env
PORT=3000
NODE_ENV=development
```

### 5. Ejecutar en desarrollo

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd waffleria-vite
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🚀 Despliegue en Producción

### Frontend (Render Static Site)
1. Construir para producción:
```bash
cd waffleria-vite
npm run build
```

2. Desplegar la carpeta `dist/` en Render

### Backend (Render Web Service)
1. Configurar variables de entorno en Render:
   - `NODE_ENV=production`
   - `PORT` (automático)

2. Script de inicio: `npm start`

## 📱 Características Destacadas

### Recibos Inteligentes
- **QR codes automáticos** para encuestas
- **Compartir por WhatsApp** con formato profesional
- **Información de cuentas** automática según método de pago
- **PDFs descargables** con formato térmico

### Métodos de Pago Avanzados
- **Efectivo** con cálculo de cambio
- **Tarjetas** de crédito/débito
- **Nequi/DaviPlata** con números de cuenta automáticos
- **Transferencias bancarias** con datos completos
- **PSE** con información bancaria

### Sistema de Descuentos
- **Descuentos por producto** individual
- **Descuentos globales** con razón/motivo
- **Soporte para porcentajes y montos fijos**
- **Cálculo automático** en totales

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- 📧 Email: soporte@waffleria.com
- 📱 WhatsApp: +57 300 123 4567
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/waffleria/issues)

## 🎯 Roadmap

- [ ] Sistema de inventario automático
- [ ] Reportes y análiticas avanzadas
- [ ] Integración con pasarelas de pago
- [ ] App móvil nativa
- [ ] Sistema de empleados y roles
- [ ] Integración con cocina (órdenes digitales)

---

**Desarrollado con ❤️ para La Waffleria**

*Sistema POS by Claude Code*