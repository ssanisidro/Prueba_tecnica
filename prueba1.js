// Prueba 1 - Web scraping. 

const express = require('express');
const app = express();
const morgan= require('morgan');

app.use(morgan('dev'));
app.use(express.json());

// Puntos de entrada
app.get('/find', async (req, res) => {
  const app= await scrapear();
  const show=5;
  const resultado= app.slice(0,show);
  res.json(resultado);
});

app.get('/find/:category', async (req, res) => {
    const categoria= (req.params.category).toUpperCase();
    const app= await scrapearCategoria(categoria);
    const show=5;
    const resultado= app.slice(0,show);
    res.json(resultado);
  });
 
  app.get('/users', async (req, res) => {
    const pagina= parseInt(req.query.page);
    const limite= parseInt(req.query.limit);
    const users= await usuarios(pagina,limite);
    const results={};
    if(pagina && limite != null){
      results.code= 200;
      results.meta={
        pagination:{
          page: pagina,
          limit: limite
        }
      }
    }
    results.data= users;
    res.json(results);
    
  });

  app.get('/users/:id', async (req, res) => {   
    const results={};
    let id= parseInt(req.params.id);
    console.log(id);
    results.code= 200;
    let usuario= await users(id);
    results.data=usuario;
    let posts= await getPosts(id);
    results.data.posts=posts;
    console.log(results);
    res.json(results);
  });
  
const puerto= process.env.PORT || 3000;
app.listen(puerto, () =>{
  console.log('Servidor iniciado en el puerto 3000')
});

const cheerio = require("cheerio");
const axios= require('axios');
const { text } = require('express');

async function scrapear(){
    const pageContent= await axios.get('https://play.google.com/store/apps');
    const $ = cheerio.load(pageContent.data);
    let resultado= await Promise.all($('div.b8cIId.ReQCgd.Q9MA7b').map(async(i,element) =>{
      const contenido1= $(element).find('div.WsMG1c.nnK0zc').attr('title');
      const contenido2= await scrapearDescripcion($(element).find('a').attr('href'));
      const contenido3= await scrapearDescargas($(element).find('a').attr('href'));
      return {'titulo':contenido1,'descripción':contenido2,'descargas':contenido3}
    }).get());
    // console.log(resultado);
    return resultado;
}

async function scrapearCategoria(atributo){
  const pageContent= await axios.get('https://play.google.com/store/apps/category/'+atributo);
    const $ = cheerio.load(pageContent.data);
    let resultado= await Promise.all($('div.b8cIId.ReQCgd.Q9MA7b').map(async(i,element) =>{
      const contenido1= $(element).find('div.WsMG1c.nnK0zc').attr('title');
      const contenido2= await scrapearDescripcion($(element).find('a').attr('href'));
      const contenido3= await scrapearDescargas($(element).find('a').attr('href'));
      return {'titulo':contenido1,'descripción':contenido2,'descargas':contenido3}
    }).get());
    // console.log(resultado);
    return resultado;
}


async function scrapearDescripcion(atributo){
  const pageContent= await axios.get('https://play.google.com'+atributo);
  const $ = cheerio.load(pageContent.data);
  let descripcion=$('div.DWPxHb').map((_, el) => {
      el = $(el);
      const contenido = el.find('div[jsname="sngebd"]').text();
      return contenido;
      }).get().toString();
  return descripcion;
}

async function scrapearDescargas(atributo){
  const pageContent= await axios.get('https://play.google.com'+atributo);
  const $ = cheerio.load(pageContent.data);
  let descargas=$('div.IxB2fe').map((_, el) => {
      el = $(el);
      const contenido = el.find('span.htlgb').find('span:eq(2)').text();
      return contenido;
      }).get().toString();
  return descargas;
}

const fetch = require("node-fetch"); 
const { post } = require('request');

async function usuarios(pageX,limitX){
  if(!pageX && !limitX){
    pageX='1';
    const usuarios= await fetch('https://gorest.co.in/public-api/users?page='+pageX);
    const usuariosData=await usuarios.json();
    return usuariosData;
  }else if(pageX && !limitX){
    if(pageX == 1){
      console.log(pageX);
      const usuarios= await fetch('https://gorest.co.in/public-api/users?page='+pageX);
      const usuariosData=await usuarios.json();
      return usuariosData.data;
    }else if(pageX>1){
      let pagina= pageX.toString();
      const usuarios= await fetch('https://gorest.co.in/public-api/users?page='+pagina);
      const usuariosData=await usuarios.json();
    return usuariosData.data;
    }
  }else if(pageX && limitX){
    if(limitX % 20 != 0){
      return console.log('El límite tiene que ser múltiplo de 20');
    }else{
      let auxiliar= limitX/20;
      let data=[];
      let datos=[];
      if(pageX==1){   //Aquí entiendo que tendría que meter la serie de fibonacci para ajustar las páginas y los límites para el resto de páginas. Lo haré manualmente para las páginas 1 y 2
        for(let i=0; i<auxiliar;i++){
          let usuarios= await fetch('https://gorest.co.in/public-api/users?page='+pageX);
          let usuariosData=await usuarios.json();
          data.push(usuariosData.data);
          datos=datos.concat(data[i]);
          pageX++
        }
        return datos;
      }else if(pageX == 2){
        let pagina= (pageX-1) + auxiliar;
        for(let i=0; i<auxiliar;i++){
          let usuarios= await fetch('https://gorest.co.in/public-api/users?page='+pagina);
          let usuariosData=await usuarios.json();
          data.push(usuariosData.data);
          datos=datos.concat(data[i]);
          pagina++
        }
        return datos;
      }
    }
  }
}

async function getPosts(id){
  let posts= await fetch('https://gorest.co.in/public-api/posts');
  let postsData= await posts.json();
  let paginas=postsData.meta.pagination.pages;
  let data=[];
  let datos=[];
  let pagina=1;
  for(let i=0; i<paginas;i++){
    let postPagina= await fetch('https://gorest.co.in/public-api/posts?page='+pagina)
    let postPaginaData= await postPagina.json();
    data.push(postPaginaData.data);
    datos=datos.concat(data[i]);
    pagina++;
  }
  function filtroId(datos){
    return datos.user_id == id;
  }
  let postsUsuario= datos.filter(filtroId);
  return postsUsuario;
}

async function users(id){
  let users= await fetch('https://gorest.co.in/public-api/users');
  let usersData= await users.json();
  // let paginas=usersData.meta.pagination.pages;
  let paginas= 10;     //Ponemos 10 páginas porque al poner todas el servidor local tarda mucho en ejecutar los bucles y en mostrar los resultados
  let data=[];
  let datos=[];
  let pagina=1;
  for(let i=0; i<paginas;i++){
    let userPagina= await fetch('https://gorest.co.in/public-api/users?page='+pagina)
    let userPaginaData= await userPagina.json();
    data.push(userPaginaData.data);
    datos=datos.concat(data[i]);
    pagina++;
  }
  function filtroId(datos){
    return datos.id == id;
  }
  let userUsuario= datos.filter(filtroId)[0];
  return userUsuario;
}