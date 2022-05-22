// Event listener for submitting form
document.querySelector('body').addEventListener('submit', async (event) => {

  let target = event.target;

  // Check for matching the correct form
  if (!target.closest('form[name="registration"]')) { return; }

  // Prevent default actions
  event.preventDefault();
  // Collect all the data from the form

  // Get the all the form elements
  let formElements = document.forms.registration.elements;
  // Loop through the elements and read their names and values
  let requestBody = {};
  for (let element of formElements) {
    if (element.type === 'submit') { continue; }
    console.log(element.name + ', ' + element.value);
    requestBody[element.name] = element.value;
  }

  // Passwords dont match
  if (requestBody.password !== requestBody.passwordRepeated) {
    alert('The passwords doesn\'t match!\nPlease fill in the same password twice!');
    return;
  }

  // Delete the passwordRepeated property
  // (this making the properties in
  //  requestBody match the columns in the DB)
  delete requestBody.passwordRepeated;

  // Register the user through the REST-api
  let result = {};
  try {
    result = await (await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })).json();
  }
  catch (ignore) { }

  console.log(result);
  console.log(result.body);
  console.log(result.json);
  console.log(result.text);

  if (!result.changes) {
    document.querySelector('.register').innerHTML = `
      <h3>Something went wrong</h3>
      <p>We could not register you right now because of a technical problem.</p>
      <p>Please try again later!</p>
    `;
    return;
  }

  document.querySelector('.register').innerHTML = `
    <h3>Welcome as a member</h3>
    <p>You are now successfully registrered as a member!</p>
  `;
});