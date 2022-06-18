# Emetsy

Proyecto EMeTSy

## Puesta en marcha

Clonar el repositorio y ejecutar `npm install` para descargar las dependencias.

## Comandos disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Sirve para desarrollar con el Hot Reload de Angular |
| `npm run release` | Con este comando se puede publicar un release en Git |

## Scaffolding

| Ruta | Descripción |
| :--- | :--- |
| `./app/index.js` | Configuración básica usada por `Electron Js` |
| `./app/resources/*` | Contiene los recursos provistos por `Node Js` |
| `./src/app/*` | Aquí se encuenta el proyecto de `Angular Js` |

## FAQs

<details><summary>¿Para qué sirve el Hot Reload?</summary>
  <p>
    Cuando se hace un cambio en Angular y el Hot Reload esta activo los cambios se reflejarán en el navegador de forma automática.
    <br>
    Si los cambios se hacen en Node Js, será necesario volver a buildear. 
  </p>
</details>
