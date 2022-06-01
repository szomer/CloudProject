async function setUserInfo() {

  let loggedIn;
  let email = localStorage.getItem('cred');
  //retrieve token
  let jwt = localStorage.getItem('token');

  console.log('email:' + email);

  try {
    loggedIn = await (await fetch('/api/login', {
      headers: {
        'Authorization': 'Bearer ' + jwt,
      }
    })).json();
    console.log(loggedIn);

  }
  catch (ignore) { }


  if (!loggedIn || loggedIn._error) {
    console.log('err log in')
    document.querySelector(".nav-link-contact-link").innerHTML = 'Currently not logged in. <a href="/index.html" class="btn">Log In</a>';
    // window.location.replace('./404noUser.html');

  } else {
    console.log('logged in')
    document.querySelector(".nav-link-contact-link").innerHTML = `
        Logged in as ${email}. 
        <a href="/logout" class="btn">Log Out</a>`;
  }
}

document.querySelector('body').addEventListener('click', async (event) => {

  if (!event.target.closest('a[href="/logout"]')) { return; }

  // do not follow the link
  event.preventDefault();

  // log out using our REST-api
  let result;
  try {
    result = await (await fetch('/api/login', { method: 'DELETE' })).json();
  }
  catch (ignore) { }

  window.location.replace('./index.html');
});

setUserInfo();