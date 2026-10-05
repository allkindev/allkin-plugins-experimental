# Navegador web

Abre los sitios web en pestañas de Allkin. Un enlace pulsado en una conversación, un documento o una
página ya no te saca de la aplicación: el sitio se abre en una pestaña, junto al resto.

## Empezar

- **Un enlace**: un clic en un enlace a otro sitio lo abre en una pestaña de Allkin. **Ctrl + clic**
  (⌘ + clic en Mac), Mayús + clic o el clic central mantienen el comportamiento del navegador: una
  pestaña nueva del navegador, como antes.
- **Una dirección**: lista Herramientas de la barra lateral › **Navegador web**, y la dirección. Lo
  que no es una dirección lanza una búsqueda.
- En la pestaña: la barra de direcciones (Intro para ir), **Recargar**, **Copiar el enlace**,
  **Abrir en el navegador**. El candado indica si la conexión está cifrada (HTTPS).

Cada sitio conserva su página mientras su pestaña esté abierta: cambiar a otra ventana y volver la
encuentra tal cual (ocho sitios como máximo; a partir de ahí, el más antiguo se recarga al volver).

## Los sitios que se niegan

Muchos sitios prohíben mostrarse dentro de otro (Google, GitHub, los bancos, la mayoría de cuentas
en línea): es una protección contra el secuestro de clics. El navegador no lo diría y el marco
quedaría en blanco. El servicio del plugin lee las cabeceras del sitio antes de mostrarlo; si se
niega, la pestaña lo indica y ofrece **Abrir en el navegador**. «Intentarlo de todos modos» muestra
el marco igualmente.

La dirección mostrada es la que se abrió: al seguir enlaces dentro del sitio, el navegador no deja
que Allkin la conozca.

## Ajustes

- **Puerto local** (9345): el puerto del servicio, solo en esta máquina. Cámbialo si está ocupado.

## Permisos solicitados

- **Interfaz**: las pestañas del navegador y la apertura de enlaces externos en ellas.
- **Red**: el servicio lee las cabeceras de un sitio (nada más, no guarda nada). Solo escucha en
  127.0.0.1, detrás de la sesión de Allkin.

Para que la comprobación funcione, permite también que el plugin **se inicie como servicio** en su
página. Sin servicio, los sitios se abren igual; solo falta el aviso.

## Si algo falla

- *Una pestaña queda en blanco*: el sitio probablemente no acepta el marco y el servicio no está en
  marcha (página del plugin › servicio). Usa «Abrir en el navegador».
- *Allkin está en HTTPS y un sitio HTTP no se muestra*: el navegador bloquea contenido sin cifrar en
  una página cifrada. Ábrelo en el navegador.
- *Los enlaces siguen abriéndose fuera de Allkin*: recarga la página tras activar el plugin.

Plugin experimental: primer borrador, pendiente de validación.
