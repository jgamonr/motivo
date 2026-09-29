# Publicar Motivo en GitHub Pages

## Contenido del paquete

- `index.html`: página principal.
- `styles.css`: diseño adaptable a computadora y celular.
- `app.js`: conexión del formulario con Google Apps Script.
- `assets/`: fotografía de la página.
- `apps-script/Codigo.gs`: guarda cotizaciones en Google Sheets y envía los correos.

Esta versión incluye el apartado **Barras para eventos** y agrega esa opción al formulario de cotización. No requiere cambiar la URL de Apps Script ni volver a implementar el código de Google.

## 1. Configurar Google Sheets y los correos

La hoja ya fue creada:

https://docs.google.com/spreadsheets/d/18Oyf9kb5I23Xf5-C8089iZE1muXYD9vecCUn6Vg3f6Y/edit

1. Abre la hoja con la cuenta `gamonjr90@gmail.com`.
2. Entra a **Extensiones → Apps Script**.
3. Borra el código existente y pega todo el contenido de `apps-script/Codigo.gs`.
4. Guarda el proyecto.
5. Ejecuta una vez la función `doGet` y acepta los permisos de Google Sheets y Gmail.
6. Entra a **Implementar → Nueva implementación**.
7. Tipo: **Aplicación web**.
8. En **Ejecutar como**, elige **Yo**.
9. En **Quién tiene acceso**, elige **Cualquier persona**.
10. La implementación ya está conectada en `app.js` con la URL proporcionada.
11. Si después generas una implementación nueva, reemplaza el valor de
    `APPS_SCRIPT_URL` dentro de `app.js` por la nueva dirección terminada en `/exec`.

Cuando cambies el archivo `apps-script/Codigo.gs`, actualiza la aplicación web desde
**Implementar → Administrar implementaciones → Editar → Nueva versión**. La URL `/exec`
puede conservarse.

La cuenta que implemente Apps Script será la remitente. Para enviar desde
`gamonjr90@gmail.com`, realiza la implementación conectado con esa misma cuenta.

## 2. Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `motivo-eventos`.
2. Sube **el contenido** de esta carpeta a la raíz del repositorio. `index.html` debe verse en la primera pantalla del repositorio.
3. En el repositorio abre **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**.
5. Selecciona la rama `main`, carpeta `/(root)` y presiona **Save**.
6. GitHub mostrará la dirección pública después de unos minutos.

## Funcionamiento del formulario

Cada solicitud:

1. se agrega en la pestaña `Cotizaciones`;
2. envía un aviso a `gamonjr90@gmail.com` con los detalles del evento;
3. envía al cliente un correo de confirmación indicando que a la brevedad será contactado.

La hoja y los correos también registran el tipo de comida y los platillos que busca el cliente.

Puedes cambiar el correo, el nombre del negocio y el texto de confirmación en la pestaña `Configuración` de la hoja.
