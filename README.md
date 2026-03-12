# Accenture ToDo - Prueba Técnica

## Descripción

Esta aplicación fue desarrollada como parte de una **prueba técnica para Accenture**, utilizando **Ionic** y **Angular**.

La aplicación consiste en una **ToDo List** que permite gestionar tareas, marcarlas como completadas y eliminarlas. Además, incluye la funcionalidad de **categorías**, las cuales pueden mostrarse o ocultarse dinámicamente dependiendo del **feature flag** configurado en **Firebase Remote Config**.

La aplicación puede ejecutarse en:

- **Navegador**
- **Android**
- **iOS**

---

## Funcionalidades principales

- Crear tareas
- Marcar tareas como completadas
- Eliminar tareas
- Crear categorías
- Editar categorías
- Eliminar categorías
- Asignar categorías a una tarea
- Filtrar tareas por categoría
- Mostrar u ocultar la funcionalidad de categorías mediante **feature flags** en Firebase

---

## Ejecución en navegador

Para ejecutar la aplicación en el navegador, ubícate en la raíz del proyecto y ejecuta:

```bash
ionic serve
```

Esto levantará un servidor local para visualizar la aplicación en el navegador.

---

## Ejecución en Android

Para ejecutar la aplicación en Android, ubícate en la raíz del proyecto y ejecuta:

```bash
ionic cordova run android
```

También puedes instalar directamente la **APK** incluida junto con la prueba técnica.

---

## Ejecución en iOS

Para ejecutar la aplicación en iOS, debes:

1. Abrir el proyecto en **Xcode**
2. Seleccionar el objetivo del emulador o dispositivo
3. Ejecutar la aplicación desde Xcode

También puedes instalar directamente la **IPA** incluida junto con la prueba técnica.

---

## Nota importante

Para poder ejecutar la aplicación en **Android** o **iOS**, es necesario tener previamente configurados los entornos de desarrollo correspondientes:

- **Android Studio**
- **Xcode**

Se recomienda validar la configuración del entorno con los siguientes comandos:

```bash
ionic cordova requirements android
ionic cordova requirements ios
```

Esto permite verificar que todas las dependencias necesarias estén correctamente instaladas y configuradas antes de compilar o ejecutar la aplicación.

---

## Tecnologías utilizadas

- **Ionic**
- **Angular**
- **Cordova**
- **Firebase Remote Config**

---

## Observaciones

La funcionalidad de categorías depende del valor configurado en Firebase Remote Config. Si el feature flag correspondiente está desactivado, la aplicación seguirá funcionando como una ToDo List básica sin mostrar las opciones relacionadas con categorías.