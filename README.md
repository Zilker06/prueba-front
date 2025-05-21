# 🛒 Ecommerce App

Aplicación web de comercio electrónico desarrollada con **Next.js** y **Firebase**, donde los usuarios pueden navegar por un catálogo de productos, agregarlos a un carrito de compras y realizar pedidos simulando una pasarela de pagos. Incluye autenticación con Google, persistencia en Firestore y recomendaciones de productos.

## 🚀 Características principales

- 📦 Catálogo de productos con paginación dinámica (SPA)
- 🛍️ Carrito de compras funcional
- 🔐 Autenticación con Google (OAuth2) mediante Firebase
- 💾 Persistencia de datos con Firestore
- 🌐 Renderizado del lado del servidor (SSR) con Next.js
- 🧠 Recomendaciones de productos por rating en la página principal
- 🛡️ Seguridad implementada mediante las reglas de Firebase
- 📱 Interfaz moderna y responsiva con Material UI y Tailwind CSS

## 🛠️ Tecnologías usadas

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Firebase (Auth & Firestore)](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material UI (MUI)](https://mui.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 📁 Estructura del proyecto

/ecommerce-app
├── components # Componentes reutilizables
├── pages # Rutas del frontend (Next.js)
├── services # Conexión con Firebase
├── styles # Estilos globales
├── public # Recursos estáticos
├── firebase-config # Configuración y conexión con Firestore

## 📦 Instalación y uso local

1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/ecommerce-app.git
cd ecommerce-app
``` 

2. Instala dependencias
```bash
npm install
npm install firebase
```

3. Ejecuta en modo de desarrollo

```bash
npm run dev
```

Tambien dentro del repositorio se puede encontrar mi prueba Tecnica en formado .docx
