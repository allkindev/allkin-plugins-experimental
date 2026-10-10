# Editor de imágenes

Recortar, reducir, comprimir y anotar una imagen sin salir de Allkin: una captura de pantalla que
comentar, una foto demasiado pesada, un detalle que ocultar antes de compartir.

## Empezar

- **Una imagen de un agente o de la carpeta compartida**: en el explorador de archivos, clic
  derecho en la imagen › **Editar la imagen**. Se abre en su propia pestaña.
- **Una imagen de este dispositivo**: lista Herramientas del menú de Allkin › **Editor de imágenes**
  abre la página de inicio: suelta una imagen en ella, pulsa **Pegar el portapapeles** (o Ctrl+V —
  ⌘V en Mac — justo después de una captura de pantalla), o **Abrir un archivo…** con el selector de
  archivos de tu dispositivo. El botón **Abrir** del editor, soltar y pegar funcionan también en
  cualquiera de sus pestañas.
## Herramientas

A la izquierda (abajo en el teléfono):

- **Seleccionar**: un clic elige una anotación, arrastrarla la mueve, Supr la borra; doble clic en
  un texto para editarlo. Cambiar el color o el grosor se aplica a la anotación elegida.
- **Recortar**: dibujar el marco que se conserva y pulsar Intro (o «Recortar»).
- **Flecha**, **línea**, **rectángulo**, **elipse**: Mayús para una recta, un cuadrado, un círculo.
  El rectángulo y la elipse pueden ir rellenos.
- **Lápiz** y **marcador** (trazo ancho y translúcido).
- **Texto**: clic donde va; `\n` para una nueva línea; fondo contrastado opcional.
- **Paso numerado**: cada clic pone el número siguiente (1, 2, 3…).
- **Pixelar**: dibujar sobre lo que no debe leerse (un nombre, una clave, una dirección). Es
  definitivo en la imagen guardada.
- **Girar**, **voltear**, **cambiar tamaño** (píxeles, porcentaje, proporciones mantenidas).

Encima de la imagen: colores, grosor, tamaño del texto, zoom (Ctrl + rueda, o el porcentaje para
pasar de «ajustado» a «tamaño real»). Deshacer / rehacer: Ctrl+Z / Ctrl+Mayús+Z, hasta 40 pasos.

Las anotaciones siguen editables hasta guardar. Recortar, girar, voltear o cambiar el tamaño las
funde en la imagen para que sigan a los píxeles.

## Guardar, exportar

- **Guardar** (Ctrl+S) reescribe la imagen en su sitio y en su formato. **La versión anterior va a
  la papelera** de su carpeta (`Trash/`): no se pierde nada. Un GIF o un BMP, que el navegador no
  sabe escribir, se propone como copia PNG.
- **Exportar** elige el formato (PNG, JPEG, WebP), la **calidad** —es la compresión: cuanto más
  baja, más ligero— y el lado más grande (reducción). El peso resultante se muestra antes de
  validar. Después **Descargar** o **Guardar una copia** junto al original. Una imagen de este
  dispositivo se guarda en la carpeta compartida, en `share/image-editor/`.
- **Copiar** pone la imagen anotada en el portapapeles, lista para pegar.

Cerrar una pestaña sin guardar conserva los cambios en memoria hasta recargar la página: volver a
abrir la imagen los recupera.

## Ajustes

Ninguno.

## Permiso solicitado

- **Interfaz**: el editor se añade a la página de Allkin. Lee y escribe las imágenes con tu sesión,
  por las mismas rutas que el explorador de archivos.

## Si algo falla

- *«Editar la imagen» no aparece en el explorador*: el explorador debe estar en 1.0.15 o más, y la
  página recargada tras activar la herramienta.
- *Copiar no funciona*: el navegador rechaza el portapapeles fuera de HTTPS; usa Exportar.
- *Imagen muy grande*: el navegador puede quedarse sin memoria por encima de unos 16 000 píxeles de
  lado; redúcela antes.

Herramienta experimental: primer borrador, pendiente de validación.
