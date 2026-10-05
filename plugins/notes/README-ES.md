# Bloc de notas

Notas ordenadas en carpetas, en una pestaña de Allkin. Escribes en el documento con formato
—títulos, listas, casillas, tablas, imágenes— sin ver nunca una etiqueta: quien escribe es el editor
Markdown de Allkin.

Cada nota es un archivo `.md` y cada carpeta una carpeta real, en la carpeta compartida
(`~/.allkin/share/notes/`). Tus agentes leen y escriben, por tanto, las mismas notas: «guarda el
acta en mis notas, carpeta Reuniones» funciona tal cual.

## Este plugin necesita el editor Markdown

El bloc de notas no edita el texto por sí mismo: se apoya en el plugin **Editor Markdown**
(`markdown-editor`). Si aún no está, **Allkin lo instala automáticamente al mismo tiempo**; la
ventana de instalación te lo indica antes de empezar. Como cualquier plugin, llega sin ningún
permiso: concédele su permiso «Interfaz» en su página; de lo contrario, el bloc de notas muestra
una pantalla que te lleva allí. (El editor Markdown viene con Allkin: en la mayoría de los casos ya
está instalado y autorizado.)

## Primeros pasos

1. Instala el plugin, concédele su permiso en su página y recarga Allkin.
2. Abre **Bloc de notas** en la lista de plugins del menú Allkin.
3. **Nota** crea una nota en la carpeta mostrada: escribe su título y pulsa Intro para escribir.

La pantalla tiene tres paneles: las carpetas, las notas de la carpeta y la nota. En un teléfono, un
solo panel a la vez; la flecha de la barra vuelve atrás.

## Lo que puedes hacer

- **Carpetas y subcarpetas** — crear (botón **Carpeta**, o clic derecho sobre una carpeta),
  renombrar, mover, eliminar. Un clic en su flecha pliega una carpeta.
- **Ordenar** — arrastra una nota o una carpeta sobre una carpeta, o usa **Mover a…**. Soltar sobre
  «Todas las notas» saca el elemento de cualquier carpeta.
- **Título** — el título situado sobre la nota es el nombre de su archivo: cambiarlo renombra la nota.
- **Guardado automático** — la nota se guarda mientras escribes; el estado aparece en la barra.
  Ctrl/⌘ + S guarda al instante.
- **Fijar** — una nota fijada permanece al principio de su lista y aparece en «Fijadas».
- **Buscar** — el campo de la barra busca en los títulos y en el texto de todas las notas.
- **Ordenar la lista** — por última modificación, fecha de creación o título.
- **Duplicar, copiar el texto, descargar** el archivo `.md` — clic derecho sobre una nota (pulsación
  larga en una pantalla táctil), o el botón ⋯ de la barra para la nota abierta.
- **Imágenes y archivos** — arrástralos al texto o pégalos: se guardan en `notes/_files/` y la nota
  los conserva cuando cambia de carpeta.
- **Papelera** — eliminar envía a la papelera del bloc de notas, desde donde se **restaura** al
  lugar de origen. Lo que borras de esa papelera va a la de la carpeta compartida (página Archivos),
  donde permanece hasta que esta se vacíe: nada desaparece por accidente.
- **Contador** — palabras, caracteres y fecha de modificación, bajo la nota.

## Dónde están las notas

| Lugar | Contenido |
|-------|-----------|
| `share/notes/…/*.md` | las notas, en sus carpetas |
| `share/notes/Trash/` | la papelera del bloc de notas |
| `share/notes/_files/` | imágenes y archivos soltados en las notas |
| `share/notes/.notes.json` | las notas fijadas y el origen de los elementos de la papelera |

Una nota modificada por un agente mientras está abierta se vuelve a leer cuando regresas a la
pestaña, siempre que no estés escribiendo en ella.

## Ajustes

Ninguno.

## Permiso solicitado

- **Interfaz de Allkin** — el plugin se ejecuta en la página de Allkin, con tu sesión: añade su
  pestaña y su entrada en la lista de plugins. No tiene servicio ni agente, y solo escribe en su
  carpeta de la carpeta compartida.

## Para otros plugins

```js
Allkin.capability("notes").open();
const path = await Allkin.capability("notes").create({ title: "Idea", content: "# Idea\n", folder: "Proyectos" });
```

## Si no funciona

- **«Falta el editor Markdown»** — el plugin Editor Markdown no está instalado o su permiso no está
  concedido. El botón de la pantalla abre su página; concede el permiso y recarga.
- **La pestaña no aparece** — el permiso «Interfaz» del bloc de notas no está concedido, o la
  página no se ha recargado desde entonces.
- **«No guardada»** — la escritura ha fallado (disco lleno, sesión caducada). El texto sigue en
  pantalla: vuelve a iniciar sesión en otra pestaña y pulsa Ctrl/⌘ + S.
- **Una nota no aparece** — solo los archivos `.md` son notas; los nombres que empiezan por un
  punto o un guion bajo se ignoran.
