// Evenlistener for submitting the form for login
document.querySelector('body').addEventListener('submit', async (event) => {

  // the target is the actual thing clicked/submitted
  let target = event.target;

  // uses closest to th see if the target or any of its parents
  // matches the form we want to work with (otherwise do nohting)
  if (!target.closest('form[name="login"]')) { return; }

  event.preventDefault();

  // For comments on this logic see register.js
  let formElements = document.forms.login.elements;
  let requestBody = {};
  for (let element of formElements) {
    if (element.type === 'submit') { continue; }
    requestBody[element.name] = element.value;
  }

  // Try to login
  let result;
  try {
    result = await (await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })).json();
  }
  catch (ignore) { }

  // React on incorrect login or any other error
  if (!result || result._error) {
    document.querySelector('.login').innerHTML = renderLoginForm(true);
    return;
  }

  // Succesfully logged in, reload the page
  location.reload();

});