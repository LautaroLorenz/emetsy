# Emetsy

El proyecto EMETSY es un software que sirve para realizar pruebas de calibración.

## Puesta en marcha


La primera vez clonar el repositorio y ejecutar `npm install` para descargar las dependencias.
Luego con el comando `npm start` podemos levantar el proyecto para desarrollar.
- Los cambios en el frontend AngularJs generan refresco automático (Hot Reload).
- Si se cambia el backend hay que matar el proceso y volver a ejecutarlo para ver los cambios.

## Simulador virtual

El simulador virtual sirve para usar el proyecto sin contar con un simulador físico.

#### Para usar el simulador virtual

En el archivo `app/index.js` se debe editar la siguiente linea 
- `require('./commands/usb-serial-port');`

Agregando "-mock" al final, resultando 
- `require('./commands/usb-serial-port-mock');`


## Comandos disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Sirve para desarrollar con el Hot Reload de Angular |
| `npm run release` | Generar versión productiva, se debe comentar dev en index.js y luego ejecutarlo |
| `knex migrate:make users --knexfile app/resources/data/knexfile.js` | Crear el migrations de una tabla, es decir la información necesaria para crear la tabla |
| `knex seed:make users --knexfile app/resources/data/knexfile.js` | Crear el seed de una tabla, es decir el juego de datos de prueba de la tabla |
| `npm run migrate` | Crear tablas en la base de datos en base a los migrations creados |
| `npm run seed` | Iniciar las tablas de la BBDD con datos de prueba en base a los seeds creados |
| `npm run migrate:rollback` | Ejecuta la función down de un migrate, vuelve un estado hacia atras |


## Scaffolding

| Ruta | Descripción |
| :--- | :--- |
| `./app/index.js` | Configuración básica usada por `Electron Js` |
| `./app/resources/*` | Contiene los recursos provistos por `Node Js` |
| `./src/app/*` | Aquí se encuenta el proyecto de `Angular Js` |
| `./src/assets/database.db` | Base de datos en `SQLite3` administrada con `knex` |
| `./app/resources/data` | Migrations y seeds usados por `knex` para crear la BBDD y llenarla con información de prueba |


## Arquitectura de la aplicación
![Diagrama de componentes](./diagrams/Componentes%20de%20la%20aplicaci%C3%B3n.drawio.png "Diagrama de arquitectura")

Todo inicia con `ElectronJs` donde levantamos el proceso de backend llamado `Main Process` que a su vez mediante un `new BrowserWindow()` creará un proceso de frontend llamado `Render Process`.

En el `Render Process` se levantará una URL (como localhost:3000) donde se mostrará nuestra Single Page Application hecha en `AngularJs`. Para producción se deberá cargar la URL del proyecto ya compilado.

En el `Main Process` correrá nuestro servidor hecho en `NodeJs` que nos sirve para aprovechar todas las funciones del sistema operativo, a través de por ejemplo los plugins de ElectronJs.

La comunicación entre el `Main Process` y el `Rende Process` se realiza con mensajes que viajan por el Channel. Nosotros usamos dos formas de mensajes:

1. `Mensaje asincrónico con respuesta`: Estos mensajes son `Promise` que `AngularJs` le hace a `NodeJs` para esperar una respuesta, esto lo usamos por ejemplo para editar un elemento de una tabla y esperar la respuesta verificando que se pudo realizar la acción en el servidor.
2. `Mensaje asincrónico sin respuesta y con suscripción`: En este caso una de las partes cliente o servidor se suscribe a un canal para escuchar todas las novedades que llegan a través del mismo. Por ejemplo si el frontend se suscribe al canal "get-table-reply", recibirá información cada vez que el servidor envíe los datos de una tabla por ese canal. Para que el cliente pueda avisarle al servidor que quiere recibir los datos de una tabla, le puede enviar el mensaje "get-table" y el servidor deberá estar subscripto a este canal para escuchar el mensaje del frontend.

Ahora bien _¿De donde obtiene el servidor, los datos de la tabla?_
Para responder esta pregunta primero notemos lo siguiente:
- `AngularJs` se programa en Typescript.
- `NodeJs` se programa en Javascript.
- `SQLite` tiene su propio lenguaje de consultas SQL.

Es aquí donde entra `Knex`, que nos permite gestionar la adminsitración de la base de datos desde `NodeJs`. Independientemente de que esta sea SQL o cualquier otra. Knex nos provee de trees funcionalidades principales:

1. `Query Builder` para hacer consultas a la base de datos y recibir la Data de forma asincrónica.
2. `Migrations` para realizar actualizaciones del esquima de base de datos, crear tablas, editar columnas, etc.
2. `Seeds` para llenar la base de datos con información inicial, facilitando las pruebas y el desarrollo.

## FAQs

<details><summary>¿Para qué sirve el Hot Reload?</summary>
  <p>
    Cuando se hace un cambio en Angular y el Hot Reload esta activo los cambios se reflejarán en el navegador de forma automática.
    <br>
    Si los cambios se hacen en Node Js, será necesario volver a buildear. 
  </p>
</details>
