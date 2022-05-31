let userObj = localStorage.getItem('credentials');
console.log('login email: ' + userObj.email);


if (userObj == null) {
  window.location.replace('./index.html');
} else {
  document.querySelector('#userinfo').innerHTML = 'Logged in as ' + userObj.email + ' | <a href="index.html" class="btn"> Log Out </a>';
};