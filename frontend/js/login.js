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

  let result;
  try {
    result = await (await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })).json();
  }
  catch (ignore) { }

  if (!result || result._error) {
    console.log("log in error")
    return;
  }

  console.log("succesfully logged in");
});



async function getData() {
  let data = await fetch('api/data');

  console.log(data);
  console.log(data.body);
  console.log(data.json);
  console.log(data.text);

}

getData();