# 🏀 Control vMix — Marcador Baloncesto

Aplicación **Vue 3** que recibe en tiempo real los datos de una **mesa de anotación de baloncesto** a través de un servidor intermedio, y los envía a **vMix** para su visualización en gráficos o plantillas GT.

## 📦 Descripción general

El flujo de datos es el siguiente:

Mesa de anotación → Servidor Node.js → WebSocket → Aplicación Vue → TCP/HTTP → vMix

La aplicación actúa como **cliente WebSocket**, suscribiéndose a las actualizaciones del servidor y enviando los valores relevantes (marcador, posesión, reloj de juego, etc.) a vMix mediante su API de control.


## 🚀 Requisitos

- **Node.js 18+**
- **Yarn** o **npm**
- **vMix** (con API TCP y/o HTTP activada)
- **Servidor Node.js** puente que proporcione el WebSocket

## 🧩 Instalación

```bash

# Instalar dependencias
yarn install
# o
npm install

yarn dev
# o
npm run dev
```



## 📡 Conexión con vMix

El envío de datos a vMix se realiza mediante comandos TCP o funciones HTTP, según el tipo de control:

SetText → actualiza textos en plantillas GT.

SetImageVisibleOn/Off → alterna visibilidad de elementos.

Function → ejecuta comandos nativos de vMix.

Ejemplo de llamada HTTP:

http://127.0.0.1:8088/api/?Function=SetText&Input=MARCADOR&SelectedName=HomeScore.Text&Value=75

📋 Estado actual

✔️ Recepción en tiempo real desde WebSocket
✔️ Envío de datos a vMix
⬜ Sincronización avanzada de campos
⬜ Paneles personalizados por deporte
⬜ Integración con reloj de posesión (Shot Clock)

🧱 Próximas ampliaciones

Control manual de valores (edición desde UI)

Conexión directa con protocolos RS232 (BTA S-1005B)

Registro de eventos y logs en tiempo real

Soporte para layouts de distintos deportes
