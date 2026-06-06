# ¿Apagué? 🔌📱

App mobile-first desarrollada en React para verificar tareas importantes antes de salir de casa.
Permite a la usuaria completar un checklist personalizado, recibir recomendaciones personalizadas generadas por IA y, al confirmar, enviar un mensaje de confirmación por WhatsApp como recordatorio.

## 🚀 Demo

🔗 https://apague-app.vercel.app/

## 🧠 Descripción del proyecto

¿Apagué? surge como una solución simple a un problema cotidiano: la duda de si dejamos todo apagado antes de salir.

La aplicación está pensada para uso rápido desde el celular, con una interfaz clara, visual y minimalista, priorizando la experiencia mobile-first.

A partir de la versión con IA, la app incorpora un agente inteligente que analiza el contexto de la usuaria (a dónde va, qué condiciones hay) y genera recomendaciones personalizadas en tiempo real antes de salir.

## ✨ Funcionalidades

* Checklist de tareas antes de salir de casa
* Campos personalizados (nombre y teléfono)
* Barra de progreso del checklist
* Recomendaciones personalizadas generadas por IA según el contexto
* Confirmación final con envío de mensaje por WhatsApp (incluye recomendaciones de la IA)
* Diseño responsive (mobile-first)
* Interfaz con glassmorphism y fondo degradado
* Feedback visual al completar acciones

## 🤖 Integración con IA y automatización

La app se conecta con un flujo de automatización construido en **n8n** que orquesta un agente de IA:

1. La app envía el contexto de la usuaria, los ítems apagados y los pendientes al webhook de n8n
2. Un **Code node** arma un prompt personalizado con esos datos
3. El prompt se envía a **Groq** (modelo `llama-3.1-8b-instant`) que genera las recomendaciones
4. La respuesta vuelve a la app y se muestra en pantalla en tiempo real

```
App React → Webhook n8n → Code node → Groq (Llama 3.1) → Respuesta en pantalla
```

Ejemplo de recomendación generada:
> "Hola Ana, como va a llover te recomiendo cerrar bien las ventanas y llevar paraguas. También revisá que la plancha esté fría antes de irte."

## 🛠️ Tecnologías utilizadas

* React
* JavaScript (ES6+)
* HTML5
* CSS3
* Responsive Design
* Mobile-first UI
* WhatsApp API (link directo)
* n8n (automatización y orquestación del agente)
* Groq API — modelo Llama 3.1 8b Instant (IA generativa)

## 🎨 Diseño

El diseño prioriza:

* claridad visual
* contraste suave
* estética moderna
* enfoque mobile

Se utilizó un fondo en degradé rosa/violeta y una card central con efecto glassmorphism para resaltar el checklist.

## 📌 Motivación

Este proyecto fue desarrollado como práctica personal para:

* afianzar conocimientos en React
* trabajar flujos de usuario reales
* mejorar criterios de UX/UI
* integrar agentes de IA en aplicaciones frontend
* construir un proyecto completo listo para portfolio

## 🔮 Posibles mejoras futuras

* Edición dinámica del checklist
* Guardado de datos en localStorage
* Modo oscuro
* Notificaciones automáticas
* Internacionalización (i18n)
* Historial de salidas con recomendaciones anteriores
* Agente con memoria para personalización progresiva

## 👩‍💻 Autora

María Zárate — Front-End Developer

🔗 https://linkedin.com/in/belenzar

💻 https://mariazar-portfolio.vercel.app
