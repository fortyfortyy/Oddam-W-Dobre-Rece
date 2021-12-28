document.addEventListener('DOMContentLoaded', function () {

    let currentLocation = window.location.pathname;  // '/account/login/'
    if (currentLocation === '/account/login/') {

        // code below is for login form

        const loginForm = document.querySelector("#login-form");
        const inputsForm = loginForm.querySelectorAll("div > input");

        // remove required attribute from inputs
        inputsForm.forEach(input => {
            input.required = false;
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            _validateLoginInputs(inputsForm);
            if (_isValid(loginForm)) {
                loginForm.submit();
            }
        });

        function _validateLoginInputs(inputsForm) {
            // validate each input, if there's any error, show below input

            let email = inputsForm[0]
            let password = inputsForm[1]

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

            // password validation
            if (password.value.length > 128) {
                let errorMessage = "Hasło niemoże mieć powyżej 128 znaków"
                setErrorFor(password, errorMessage)
            } else if (password.value.length < 8) {
                let errorMessage = "Hasło musi się składać przynajmniej z 8 znaków"
                setErrorFor(password, errorMessage)
            } else {
                // remove validation error from the input
                if (_divInstance(password)) {
                    password.parentNode.lastChild.remove();
                }
            }

        }
    } else if (currentLocation === '/account/register/') {

        // code below is for registration form

        const registerForm = document.querySelector("#registration-form");
        const inputsForm = registerForm.querySelectorAll("div > input");
        checkResponse(registerForm);

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            _validateRegisterInputs(inputsForm);
            if (_isValid(registerForm)) {
                registerForm.submit();
            }
        });

        function _validateRegisterInputs(inputsForm) {
            // validate each input, if there's any error, show below input

            let firstName = inputsForm[0];
            let lastName = inputsForm[1];
            let email = inputsForm[2];
            let password1 = inputsForm[3];
            let password2 = inputsForm[4];

            // validate first name
            if (firstName.name === 'first_name') {
                if (firstName.value === '') {
                    setErrorFor(firstName, 'Imię nie może być puste')
                } else if (firstName.value.length > 150) {
                    setErrorFor(firstName, 'Maksymalnie 150 znaków!')
                } else if (firstName.value.length < 4) {
                    setErrorFor(firstName, 'Imię musi się składać przynajmniej z 4 liter')
                } else {
                    // remove validation error from the input
                    if (_divInstance(firstName)) {
                        firstName.parentNode.lastChild.remove();
                    }
                }
            }

            // validate surname
            if (lastName.name === 'last_name') {
                if (lastName.value === '') {
                    setErrorFor(lastName, 'Nazwisko nie może być puste')
                } else if (lastName.value.length > 150) {
                    setErrorFor(lastName, 'Maksymalnie 150 znaków!')
                } else if (lastName.value.length < 4) {
                    setErrorFor(lastName, 'Nazwisko musi się składać przynajmniej z 4 liter')
                } else {
                    // remove validation error from the input
                    if (_divInstance(lastName)) {
                        lastName.parentNode.lastChild.remove();
                    }
                }
            }

            // validate email
            if (email.name === 'email') {
                if (email.value === '') {
                    setErrorFor(email, 'Email nie może być pusty')
                } else if (email.value.length > 255) {
                    setErrorFor(email, 'Email jest za długi. Maksymalnie 255 znaków')
                } else if (!isEmail(email.value)) {
                    setErrorFor(email, 'Nieprawidłowy email')
                } else {
                    // remove validation error from the input
                    if (_divInstance(email)) {
                        email.parentNode.lastChild.remove();
                    }
                }
            }

            // validate first password
            if (password1.name === 'password1') {
                if (password1.value === '') {
                    setErrorFor(password1, 'Proszę podać hasło')
                } else if (password1.value.length > 128) {
                    setErrorFor(password1, 'Hasło może mieć maksymalnie 128 znaków!')
                } else if (password1.value.length < 8) {
                    setErrorFor(password1, 'Hasło musi się składać przynajmniej z 8 znaków')
                } else if (!isvalidPassword(password1.value)) {
                    setErrorFor(password1, 'Hasło musi posiadać prznajmiej znak z dużej litery, 2 z małej oraz znak specjalny @!<.?$')
                } else {
                    // remove validation error from the input
                    if (_divInstance(password1)) {
                        password1.parentNode.lastChild.remove();
                    }
                }
            }

            // validate second password
            if (password2.name === 'password2') {
                if (password2.value === '') {
                    setErrorFor(password2, 'Proszę powtórzyć nowe hasło')
                } else if (password2.value.length < 8) {
                    setErrorFor(password2, 'Hasło musi się składać przynajmniej z 8 znaków')
                } else if (password2.value.length > 128) {
                    setErrorFor(password2, 'Hasło może mieć maksymalnie 128 znaków!')
                } else if (registerForm.querySelector('input[name="password1"]').value !== password2.value) {
                    setErrorFor(password2, 'Hasła nie są takie same')
                } else {
                    // remove validation error from the input
                    if (_divInstance(password2)) {
                        password2.parentNode.lastChild.remove();
                    }
                }
            }

        }

    }

    // set an error for specific input
    function setErrorFor(input, errorMessage) {
        let newDiv = document.createElement('div');
        newDiv.className = "requirements message-error";

        newDiv.innerText = errorMessage;
        let serverMessage = input.parentNode.querySelector('div');
        if (!serverMessage) {
            input.parentNode.append(newDiv);
        }
    }

    function checkResponse(form) {
        let divErrors = form.querySelectorAll('.registration-form-errors');
        divErrors.forEach(div => {
            let inputName = div.querySelector("[data-field-name]").innerText;
            let messageError = div.querySelector("[data-field-error]").innerText;
            setErrorFor(form.querySelector(`input[name=${inputName}]`), messageError);
            div.remove();
        })
    }

// check if inputs have errors if not, then send form
    function _isValid(form) {
        let errors = form.querySelectorAll(".requirements");
        console.log(errors);
        return errors.length === 0;
    }

// check if password is valid and has at least 1 upper letter and min 8 letters and special sign
    function isvalidPassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    }

    function _divInstance(input) {
        // checks if the last sibling is div or input
        // if its div, then return true
        return input.parentNode.lastChild instanceof HTMLDivElement;
    }

// check if the email is valid
    function isEmail(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }
});
