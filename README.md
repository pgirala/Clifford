# Clifford

Cliente fácil de formularios dinámicos.

Incorpora un CRUD con Angular, Angular Material, sesiones, JSON Web Token (JWT), rutas y paginación teniendo como "back end" el servidor de form.io

## Obtener el código

```
$ git clone https://github.com/pgirala/Clifford.git
$ cd Clifford
$ npm install --force
```

## Configurar el hosts si se ejecuta en local con Docker para hacer homogéneos los nombres de los servidores dentro de Docker y fuera

127.0.0.1 clifford
127.0.0.1 formio
127.0.0.1 keycloak
127.0.0.1 clifford-back

## Ejecutar la aplicación (desarrollo)

```
$ npm start
```

`http://localhost:4200/`

La aplicación se recarga cada vez que se cambia un fichero.
