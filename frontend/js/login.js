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

  console.log("reqbody: " + requestBody);

  let response;
  try {
    response = await (await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }));

    console.log(response.json());
  }
  catch (ignore) { }

  if (!response || response._error) {
    console.log("log in error")
    return;
  }

  console.log("succesfully logged in");
});


async function getData() {
  await fetch('api/data')
    .then(response => response.json())
    .then(data => console.log(data));
};

getData();