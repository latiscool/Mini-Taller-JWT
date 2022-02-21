const formId = document.getElementById('js_form');

//e incluyes async/await también para esperar que se resuelva la promesa del Método ​postData​,
formId.addEventListener('submit', async (e) => {
  e.preventDefault();
  // console.log('click form');
  const emailId = document.getElementById('js_email').value;
  const pwdId = document.getElementById('js_pwd').value;

  const jwt = await postData(emailId, pwdId); // llamando al metodo postData(fetch)desde el Eveneto
  console.log('jwt de postData', jwt);

  //jwt se esta almacenando el token la cadena alfanumerica
  getPosts(jwt);
  // const posts = await getPosts(jwt);
  // fillTable(posts);
  // validacion(jwt);
  // console.log(posts);
  // console.log('clg JWT', jwt);
});

// // Funcion postData con Metodo fetch
// -------------------------------------
const postData = async (email, pwd) => {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({ email: email, password: pwd }),
    });
    const { token } = await response.json();
    localStorage.setItem('jwt-token', token);
    return token;
  } catch (error) {
    // console.error(`Error:${error}`);
  }
};

const getPosts = async (jwt) => {
  try {
    const response = await fetch('http://localhost:3000/api/posts', {
      method: 'GET',
      headers: { Authorization: `Bearer ${jwt}` },
    });

    const { data } = await response.json();
    if (data) {
      fillTable(data);
      validacion(data);

      // console.log('data getPosts', data);
      // return data;
    }
    return data;
  } catch (error) {
    localStorage.clear();
    console.error(`No hay conexion ${error}`);
  }
};

const fillTable = (posts) => {
  let row = '';
  console.log('forEach', posts);
  try {
    posts.forEach((ele) => {
      row += `
      <tr>
        <td> ${ele.title}</td>
        <td> ${ele.body}</td>
      </tr>`;

      document.getElementById('js_table_posts').innerHTML = row;
    });
  } catch (error) {
    console.error(`Datos Invalidos ${error}`);
  }
};
//Primero el parametro en validacion(), habia pasado si existe jwt
//en pdf lo valida si devuelve el array con el contenido de los posts
const validacion = (post) => {
  if (post) {
    document.getElementById('js_form').style.display = 'none';
    document.getElementById('js_table_posts').style.display = 'block';
  } else {
    console.log('No datos validos!!');
  }
};

const init = () => {
  const token = localStorage.getItem('jwt-token');
  console.log('leer token getItem', token);
  if (token) {
    getPosts(token);
  }
};
init();
