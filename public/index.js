window.addEventListener("DOMContentLoaded", () =>
  console.log("dom content loaded")
);

const form = document.getElementById("form");
const formData = new FormData(form);

form.addEventListener("submit", (event) => {
  console.log("form detected");

  event.preventDefault();

  validationInput();
});

function inputValidation(inputsField) {
  this.inputsField = inputsField;
  const small = inputsField.parentElement.querySelector("small");

  this.setError = function () {
    inputsField.parentElement.className = "form-control error";
  };
  this.empty = function () {
    small.innerText = inputsField.name + " cannot be empty";
  };
  this.invalid = function () {
    small.innerText = " Please enter a valid " + inputsField.name;
  };
  this.setSuccess = function () {
    //small.innerText = message;
    inputsField.parentElement.className = "form-control success";
  };
}
let mailData = {};
function validationInput() {
  const inputErrors = [];
  const email = document.getElementById("email"); //.value

  let emailField = new inputValidation(email);

  if (email.value === "") {
    emailField.setError();
    emailField.empty();
    console.log("error empty");
    inputErrors.push(email.name);
  } else if (
    /(?!^[.+&'_-]*@.*$)(^[_\w\d+&'-]+(\.[_\w\d+&'-]*)*@[\w\d-]+(\.[\w\d-]+)*\.(([\d]{1,3})|([\w]{2,}))$)/.test(
      email.value
    ) === false
  ) {
    emailField.setError();
    emailField.invalid();
    console.log("testInvalidError");
    inputErrors.push(email.name);
  } else {
    emailField.setSuccess();
    mailData.email = email.value;
  }

  const fullname = document.getElementById("fullname"); //value;

  let nameField = new inputValidation(fullname);
  if (fullname.value === "") {
    nameField.setError();
    nameField.empty();
    console.log(`${fullname.name} is empty`);
    inputErrors.push(fullname.name);
  } else if (
    fullname.value.length > 35 ||
    /^[a-z ,.'-]+$/i.test(fullname.value) === false
  ) {
    nameField.setError();
    nameField.invalid();
    inputErrors.push(fullname.name);
  } else {
    nameField.setSuccess();
    mailData.name = fullname.value;
  }

  const mobileNumber = document.getElementById("mobileNumber");
  let mobileNumberField = new inputValidation(mobileNumber);
  if (mobileNumberField.value === "") {
    mobileNumberField.setError();
    mobileNumberField.empty();
    console.log("error empty");
    inputErrors.push(mobileNumber.name);
  } else if (mobileNumber.value.length > 13 || mobileNumber.value.length < 10) {
    mobileNumberField.setError();
    mobileNumberField.invalid();
    inputErrors.push(mobileNumber.name);
  } else {
    mobileNumberField.setSuccess();
    mailData.mobileNumber = mobileNumber.value;
  }

  const subject = document.getElementById("subject");
  let subjectField = new inputValidation(subject);
  if (subject.value === "") {
    subjectField.setError();
    subjectField.empty();
    console.log("error empty");
  } else if (subject.value.length > 60) {
    subjectField.setError();
    subjectField.invalid();
    inputErrors.push(subject.name);
  } else {
    subjectField.setSuccess();
    mailData.subject = subject.value;
  }

  const text = document.getElementById("text"); //value;
  let textField = new inputValidation(text);
  if (text.value === "") {
    textField.setError();
    textField.empty();
    inputErrors.push(text.name);
  } else if (text.value.length > 500) {
    textField.setError();
    textField.invalid();
    inputErrors.push(textField.name);
  } else {
    textField.setSuccess();
    mailData.text = text.value;
  }
  if (inputErrors.length == 0) {
    sendMail();
    console.log(mailData);
    console.log(inputErrors);
  }
}

function sendMail() {
  console.log("sendmail working");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(mailData),
  };
  fetch("/send", options)
    .then(() => {
      console.log("server has received our request");
      console.log(formData);
    })
    .then(() => {
      console.log("fetch is working");
    })
    .catch(() => {
      console.error();
    });
}

console.log(formData);
console.log(inputErrors);
