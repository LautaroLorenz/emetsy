# Emetsy

Proyecto EMeTSy

## Puesta en marcha

Clonar el repositorio y ejecutar `npm install` para descargar las dependencias.

## Comandos disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Sirve para desarrollar con el Hot Reload de Angular |
| `npm run release` | Con este comando se puede publicar un release en Git |
| `knex migrations:make users --knexfile app/resources/data/knexfile.js` | Crear el migrations de una tabla, es decir la información necesaria para crear la tabla |
| `knex seed:make users --knexfile app/resources/data/knexfile.js` | Crear el seed de una tabla, es decir el juego de datos de prueba de la tabla |
| `npm run migrate` | Crear tablas en la base de datos en base a los migrations creados |
| `npm run seed` | Iniciar las tablas de la BBDD con datos de prueba en base a los seeds creados |

## Scaffolding

| Ruta | Descripción |
| :--- | :--- |
| `./app/index.js` | Configuración básica usada por `Electron Js` |
| `./app/resources/*` | Contiene los recursos provistos por `Node Js` |
| `./src/app/*` | Aquí se encuenta el proyecto de `Angular Js` |
| `./src/assets/database.db` | Base de datos en `SQLite3` administrada con `knex` |
| `./app/resources/data` | Migrations y seeds usados por `knex` para crear la BBDD y llenarla con información de prueba |

## FAQs

<details><summary>¿Para qué sirve el Hot Reload?</summary>
  <p>
    Cuando se hace un cambio en Angular y el Hot Reload esta activo los cambios se reflejarán en el navegador de forma automática.
    <br>
    Si los cambios se hacen en Node Js, será necesario volver a buildear. 
  </p>
</details>
