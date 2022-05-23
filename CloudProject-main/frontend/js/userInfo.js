async function setUserInfo() {
  let div = document.querySelector('.nav-link-contact-link');

  let loggedIn = false;
  try {
    loggedIn = await (await fetch('/api/login')).json();
  }
  catch (ignore) { }

  if (!loggedIn || loggedIn._error) {
    div.innerHTML = `
      Currently not logged in. <a href="/index.html" class="btn">Log In</a>
      `;
  } else {
    div.innerHTML = `
        Logged in as ${loggedIn.firstName} ${loggedIn.lastName}. 
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