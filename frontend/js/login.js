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
  try {
    response = await (await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }));
  } catch (ignore) {
    console.log("Log In Error");
    document.querySelector('#logInText').innerHTML = '<p>Log In Error!</p><p>Please try again.</p>';
    return;
  }

  if (response && !response._error) {
    console.log('Log In Success');

    localStorage.setItem('cred', requestBody.email);
    console.log('storing :' + requestBody.email);

    // store token   

    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib2R5IjoiZW1haWxAZ21haWwuY29tIiwiaWF0IjoxNjU0MDgxNTQwfQ.XWzpVnzKEdXjjl6QurVHcIbMCkAWT3WWLJtzLb4updA');
    console.log('storing :' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib2R5IjoiZW1haWxAZ21haWwuY29tIiwiaWF0IjoxNjU0MDgxNTQwfQ.XWzpVnzKEdXjjl6QurVHcIbMCkAWT3WWLJtzLb4updA');

    console.log(JSON.stringify(response.obj.jwt));

    // window.location.replace('./home.html');

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