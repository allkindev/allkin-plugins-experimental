# Creator

El taller de herramientas de Allkin. Describes lo que quieres; el agente **Creator** escribe la
herramienta o el servicio; el **banco de trabajo** lo comprueba, lo instala en tu Allkin y te ayuda a depurarlo.

## Para qué sirve

- **Crear una herramienta**: un programa que funciona en continuo, una página, un trozo de la interfaz
  de Allkin, un agente dedicado — o varios a la vez.
- **Crear un servicio**: enseñar a Allkin cómo llegar a una API externa, para que tus agentes la
  llamen con tu clave.

Todo lo que Creator escribe cumple el **estándar de Allkin**, incluido con la herramienta
(`standard/PLUGIN-STANDARD.md`, `standard/SERVICE-STANDARD.md` y `standard/SKILL-STANDARD.md`) y verificado por el botón
**Comprobar**.

## Primeros pasos

1. Instala Creator y concede sus cuatro permisos en su página. El agente Creator y tu
   repositorio local se crean en ese momento.
2. Recarga la página y abre **Creator** desde el menú de Allkin (lista Herramientas).
3. Pulsa **Nuevo**, elige *Herramienta* o *Servicio*, pon un nombre y describe la necesidad.
4. La conversación con el agente se abre a la derecha. Responde a sus preguntas; él escribe los
   archivos.

## El banco de trabajo

**Arriba**: el proyecto mostrado (lista desplegable), **Nuevo** y **Conversación** para reabrir
la discusión con el agente.

**El estado del proyecto**: su versión, si está instalado en tu Allkin, el estado de su servicio
y el veredicto de la comprobación (conforme, errores, advertencias).

**Las acciones**:

| Botón | Efecto |
|-------|--------|
| Comprobar | Comprueba el proyecto contra el estándar |
| Instalar / Reinstalar | Copia la herramienta de tu repositorio a Allkin. Bloqueado mientras quede un error |
| Página de la herramienta | Abre su página de Allkin: permisos por conceder, ajustes, registro |
| Iniciar / Reiniciar / Detener | Controla el servicio de la herramienta |
| Recargar la página | Carga la interfaz de una herramienta de interfaz recién instalada |
| Abrir Servicios | Para un servicio: ya está en el catálogo, solo falta conectarlo |

**Pedir al agente**: botones que envían una instrucción sobre el proyecto mostrado — corregir
los problemas de la comprobación, completar las traducciones, escribir la documentación, revisar
el código, explicar el proyecto.

**Los tres paneles**:

- **Comprobación** — la lista de desviaciones del estándar. Rojo: Allkin rechazaría la herramienta, o
  fallaría al usarla. Naranja: lo pide el estándar.
- **Archivos** — los archivos del proyecto; un clic abre el archivo en el editor. Los que el
  agente acaba de escribir se destacan.
- **Depuración** — el registro del servicio y los errores detectados en la página desde que se
  cargó. **Enviar al agente** se lo entrega todo para que encuentre la causa.

## Dónde están tus archivos

En la carpeta de trabajo del agente: `~/.allkin/plugin-data/creator/workspace/`, con una carpeta
`plugins/` y una carpeta `services/`. Esta carpeta es un **repositorio local**: aparece en la
ventana *Repositorios* de las páginas Herramientas y Servicios, y tus creaciones figuran allí con la
etiqueta «Creator».

Esta carpeta **no se borra** al desinstalar Creator. Para publicar una creación, copia su carpeta
a tu repositorio de herramientas.

## Los permisos pedidos

| Permiso | Por qué |
|---------|---------|
| Interfaz | Añadir el banco de trabajo a la página de Allkin; con tu sesión, crear proyectos, instalar tus herramientas y controlar su servicio |
| Agente dedicado | El agente Creator, que escribe los archivos. No tiene acceso a la máquina fuera de su carpeta de trabajo |
| Repositorio | Hacer de la carpeta de trabajo una fuente de herramientas y servicios para este Allkin |
| Red | Permitir que el agente lea la documentación en línea de las API |

## Si no funciona

- **«Su agente aún no existe»**: falta conceder un permiso. Abre la página de la herramienta.
- **Instalar está desactivado**: la comprobación encontró un error. Pulsa *Corregir los problemas*.
- **Reinstalar no aporta nada**: la versión no ha cambiado. La comprobación lo indica; pide al
  agente que la aumente.
- **La interfaz de la herramienta no aparece**: concede sus permisos en su página y recarga.
- **El agente no responde**: revisa tu proveedor de IA en los Ajustes de Allkin.
