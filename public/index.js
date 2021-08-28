document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
});
  var form;
  function assign() {
    console.log("testing");
    form = document.getElementById("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      console.log("event registered");
      validationResult();
    });
  }

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
  function validationResult() {
    const email = document.getElementById("email"); //.value
    const inputErrors = [];
    let emailField = new inputValidation(email);

    if (
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
      console.log("testSuccess");
    }

    const fullname = document.getElementById("fullname"); //value;

    let nameField = new inputValidation(fullname);
    if (
      fullname.value.length > 35 ||
      /^[a-z ,.'-]+$/i.test(fullname.value) === false
    ) {
      nameField.setError();
      nameField.invalid();
      inputErrors.push(fullname.name);
    } else {
      nameField.setSuccess();
    }

    const mobileNumber = document.getElementById("mobileNumber");
    let mobileNumberField = new inputValidation(mobileNumber);
    if (mobileNumber.value.length > 13 || mobileNumber.value.length < 10) {
      mobileNumberField.setError();
      mobileNumberField.invalid();
      inputErrors.push(mobileNumber.name);
    } else {
      mobileNumberField.setSuccess();
    }

    const subject = document.getElementById("subject");
    let subjectField = new inputValidation(subject);
    if (subject.value.length > 60) {
      subjectField.setError();
      subjectField.invalid();
      inputErrors.push(subject.name);
    } else {
      subjectField.setSuccess();
    }

    const text = document.getElementById("text"); //value;
    let textField = new inputValidation(text);
    if (text.value.length > 500) {
      textField.setError();
      textField.invalid();
      inputErrors.push(textField.name);
    }

    form = document.getElementById("form");
    const inputs = form.querySelectorAll("input");

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];

      let inputField = new inputValidation(input);
      if (input.value === "") {
        inputField.setError();
        inputField.empty();
        console.log("error empty");
        inputErrors.push(input.name);
      } else {
        console.log("no Empty filed");
      }
    }
    console.log(inputErrors);
    if (inputErrors.length === 0) {
      postMail();
    }
    /* if (email.value === "") {
    emailField.setError();
    emailField.empty();
    console.log("Email is empty");
  } else if (
    /(?!^[.+&'_-]*@.*$)(^[_\w\d+&'-]+(\.[_\w\d+&'-]*)*@[\w\d-]+(\.[\w\d-]+)*\.(([\d]{1,3})|([\w]{2,}))$)/.test(
      email.value
    ) === false
  ) {
    emailField.setError();
    emailField.invalid();
    console.log("Some errors were found");
  } else {
    emailField.setSuccess();
    console.log("the input passed the validation");
    postMail();
  } */
  }
  function postMail() {
    console.log("send");
    form = document.getElementById("form");

    //const formObject = Object.form;
    const maildata = new FormData(form);

    sendMail(maildata); //send the FormData we have created
    function sendMail(maildata) {
      console.log("sendmail Working");
      fetch("http://localhost:3000/send", {
        method: "POST",
        body: maildata,
      }).then((response) => {
        console.log("server has received our request");
      });
    }

    //validationResult();
    /* sendMail(maildata); */
    console.log(maildata);
  }

