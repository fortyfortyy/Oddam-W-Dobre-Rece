document.addEventListener('DOMContentLoaded', function () {
    let footerForm = document.querySelector("#footer_form");

    // remove required attribute from inputs
    footerForm.querySelectorAll(".form-group").forEach(el => {
        el.firstElementChild.required = false;
    })

    footerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        _getInputs(footerForm);
        if (_isValid()) {
            footerForm.submit();
        }
    });

    function _getInputs(form) {
        let inputs = form.querySelectorAll(".form-group");
        let firstName = inputs[0].childNodes[1];    // input#id_name;
        let email = inputs[1].childNodes[1];        // input#id_email;
        let message = inputs[2].childNodes[0];
        _validateInputs(firstName, email, message);
    }

    function _validateInputs(firstName, email, message) {
         // validate each input, if there's any error, show below input

        // first name validation
        if (firstName.value.length > 150) {
            let errorMessage = "Imię nie może zwierać powyżej 150 znaków"
            setErrorFor(firstName, errorMessage)
        } else if (firstName.value.length < 3) {
            let errorMessage = "Imię musi miec przynajmniej 3 znaki"
            setErrorFor(firstName, errorMessage)
        } else {
            // remove validation error from the input
            if (_divInstance(firstName)) {
                firstName.parentNode.lastChild.remove();
            }
        }

        // email validation
        if (email.value.length > 255) {
            let errorMessage = "Adres email nie może mieć powyżej 255 znaków"
            setErrorFor(email, errorMessage)
        } else if (!isEmail(email.value.trim())) {
            let errorMessage = "Niepoprawny adres email"
            setErrorFor(email, errorMessage)
        } else if (email.value.length < 3) {
            let errorMessage = "Email musi miec przynajmniej 3 znaki"
            setErrorFor(email, errorMessage)
        } else {
            // remove validation error from the input
            if (_divInstance(email)) {
                email.parentNode.lastChild.remove();
            }
        }

        // message validation
        if (message.value.length > 1000) {
            let errorMessage = "Wiadomość może zawierać max. 1000 znaków"
            setErrorFor(message, errorMessage)
        } else if (message.value.length < 4) {
            let errorMessage = "Wiadomość musi mieć przynajmniej 4 znaki"
            setErrorFor(message, errorMessage)
        } else {
            // remove validation error from the input
            if (_divInstance(message)) {
                message.parentNode.lastChild.remove();
            }
        }

    }

    // set an error for specific input and show it
    function setErrorFor(input, errorMessage) {

        let newDiv = document.createElement('div');
        newDiv.className = "requirements message-error";
        newDiv.innerText = errorMessage;

        let serverMessage = input.parentNode.querySelector('div');
        if (!serverMessage) {
            input.parentNode.append(newDiv);
        }
    }

    // check if inputs have errors if not, then send form
    function _isValid() {
        let errors = footerForm.querySelectorAll(".requirements");
        return errors.length === 0;
    }

    function _divInstance(input) {
        // checks if the last sibling is div or input
        // if its div, then return true
        return input.parentNode.lastChild instanceof HTMLDivElement;
    }

    // check if email is valid
    function isEmail(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }
});