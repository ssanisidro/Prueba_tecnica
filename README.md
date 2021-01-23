# Prueba_tecnica
Prueba técnica para el proceso de selección Backend Junior

En este texto explicaré un poco cómo he desarrollado los ejercicios y las limitaciones que tienen los mismos.

Antes me gustaría agradeceros la oportunidad que me dáis de tener la posibilidad de trabajar con vosotras. Espero que mi prueba os guste y podamos conocernos mejor.
También quiero daros las gracias por tenerme entretenido unos días con estos ejercicios que el paro es muy aburrido jajaja

En primer lugar, lo que hice fue crear el directorio y crear el boilerplate. Instalé dependencias como express para crear la API o cheerios para realizar el scrapping.

Prueba 1-

En esta prueba lo que he hecho ha sido crear los dos endpoints: '/find' y '/find/:category'.
Por otro lado, creo la funcion scrapear para conseguir la info. Se pide información que esta distribuida en más de una página. Es por eso que hacemos 2 funciones más para 
recoger esta información: descripción y descargas.

Una vez que tenemos la info la pasamos al endpoint y utilizamos el método slice(0,5) para obtener los primeros 5 resultados.

Prueba 2- 

Para este apartado la info de la api la recogemos utilizando fetch por lo que instalamos la dependencia. Para los usuarios creamos una función a la que pasamos 2 parámetros:
pagina y límite, tal y como se indica en el enunciado.

En este caso hemos hecho una serie de condicionales por si se introducen o no estos parámetros. Al estar la api de origen limitada a 20 resultados para obtener más he optado
por crear bucles y crear una variable auxiliar que me diga el número de veces en los que hay que hacer dichos bucles para obtener los resultados. 

Soy consciente de que mi código está limitado en cuando al parámetro página. Creo que se solucionaría implementando la serie fibonnaci.
Para el ejercicio me he limitado a hacer manualmente los casos en los que la página es 1 o 2. Lo indico en el código.

En el endpoint users, recogemos con un req.query tanto si hay página como límite y los pasamos como parámetro de la función creada anteriormente(usuarios(x,x)).

Prueba 3-

En esta prueba creamos el endpoint /users/:id y utilizaremos 2 funciones para construir los datos a las que le pasaremos el id como parámetro: users(id) y getPost(id);
Para esta prueba he optado por crear bucles para recoger en alguna variable toda la información, tanto usuarios como posts y después filtrarla por el id.

Entonces estas funciones devuelven en el endpoint el usuario que corresponde al id por un lado y ,por otro, sus posts. Después lo juntamos en la variable resultados y lo mostramos.

En esta prueba he de comentar una cosa: En la función users tengo el siguiente comentario: // let paginas=usersData.meta.pagination.pages;
La variable páginas recoge las páginas que nos indica gorest.co.in que tiene de usuarios. Entonces el bucle debería repetirse el número de paginas
que existen para así recoger todos los usuarios. El caso es que si lo dejo así, el localhost a mi se me peta y no me carga.

He puesto esta variable como 10 y entonces funciona para los usuarios cuyo id está entre esas páginas.


Pues con esto ya estaría la prueba lista. Espero que os guste y podamos comentar la prueba en otra entrevista y conocernos mejor. Me hace mucha ilusión poder trabajar 
y desarrollarme profesionalmente con vosotras.

Muchas gracias de antemano y hablamos pronto.


