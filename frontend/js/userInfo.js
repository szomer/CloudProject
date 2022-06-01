async function setUserInfo() {

  let loggedIn;
  let email = localStorage.getItem('cred');
  let token = localStorage.getItem('token');

  console.log('email:' + email);
  console.log('token:' + token);

  if (email == null || token == null || !email || !token) {
    console.log('err log in')
    document.querySelector(".nav-link-contact-link").innerHTML = 'Currently not logged in. <a href="/index.html" class="btn">Log In</a>';
    window.location.replace('./404noUser.html');
    
  } else {
    console.log('logged in')
    document.querySelector(".nav-link-contact-link").innerHTML = `
        Logged in as ${email}. 
        <a href="/logout" class="btn" onclick:"logOut()">Log Out</a>`;
  }
}

document.querySelector('body').addEventListener('click', async (event) => {

  if (!event.target.closest('a[href="/logout"]')) { return; }

  // do not follow the link
  event.preventDefault();

  localStorage.removeItem('cred');
  localStorage.removeItem('token');

  window.location.replace('./index.html');
});

setUserInfo();