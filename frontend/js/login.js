// Evenlistener for submitting the form for login
document.querySelector('body').addEventListener('submit', async (event) => {

  let target = event.target;

  if (!target.closest('form[name="login"]')) { return; }

  event.preventDefault();

  let formElements = document.forms.login.elements;
  let requestBody = {};
  for (let element of formElements) {
    if (element.type === 'submit') { continue; }
    requestBody[element.name] = element.value;
  }

  let response;
  let obj;
  try {
    response = await (await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }).then(res => res.json())
      .then(data => obj = data)
      .then(() => console.log(obj)));

  } catch (ignore) {
    console.log("Log In Error");
    document.querySelector('#logInText').innerHTML = '<p>Log In Error!</p><p>Please try again.</p>';
    return;
  }

  if (response && !response._error) {
    console.log('Log In Success');

    localStorage.setItem('cred', requestBody.email);
    localStorage.setItem('token', obj);
    console.log('storing :' + requestBody.email);
    console.log('storing :' + obj);

    window.location.replace('./home.html');

  } else {
    console.log("Log In Error");
    document.querySelector('#logInText').innerHTML = '<p>Log In Error! Please try again.</p>';
    return;
  }
});

async function getData() {
  await fetch('api/data')
    .then(response => response.json())
    .then(data => console.log(data));
};

getData();