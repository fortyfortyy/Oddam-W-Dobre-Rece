document.addEventListener('DOMContentLoaded', function () {

// Below code for changing name & lastname & email in user's profile
    const firstSettingForm = document.getElementById('first-settings-form');

    // check all fields in inputs and eventually set the success or error class
    for (let step = 0; step < 1; step++){
        firstSettingForm.querySelectorAll("div > input").forEach(input => {
            checkInputFirstForm(input);
        })
    }

    firstSettingForm.addEventListener('input', checkInputFirstForm);
    firstSettingForm.addEventListener('submit', e => {
        e.preventDefault();

        if (checkSuccessClasses) {
            firstSettingForm.submit()
        }
    });


    function checkInputFirstForm(input) {
        // get the values from the inputs
        // trim() delete whitespace
        let inputForm = checkKindOfInput(input, firstSettingForm)

        let inputNameValue = inputForm.value.trim();
        let inputName = inputForm.name;
        if (inputName === 'first_name') {
            if (inputNameValue === '') {
                setErrorFor(inputForm, 'Imię nie może być puste')
            } else if (inputNameValue.length > 150) {
                setErrorFor(inputForm, 'Maksymalnie 150 znaków!')
            } else if (inputNameValue.length < 4) {
                setErrorFor(inputForm, 'Imię musi się składać przynajmniej z 4 liter')
            } else {
                // add success class
                setSeccessFor(inputForm)
            }
        }

        if (inputName === 'last_name') {
            if (inputNameValue === '') {
                setErrorFor(inputForm, 'Nazwisko nie może być puste')
            } else if (inputNameValue.length > 150) {
                setErrorFor(inputForm, 'Maksymalnie 150 znaków!')
            } else if (inputNameValue.length < 4) {
                setErrorFor(inputForm, 'Nazwisko musi się składać przynajmniej z 4 liter')
            } else {
                // add success class
                setSeccessFor(inputForm)
            }
        }

        if (inputName === 'email') {
            if (inputNameValue === '') {
                setErrorFor(inputForm, 'Email nie może być pusty')
            } else if (inputNameValue.length > 255) {
                setErrorFor(inputForm, 'Email jest za długi. Maksymalnie 255 znaków!')
            } else if (!isEmail(inputNameValue)) {
                setErrorFor(inputForm, 'Nieprawidłowy email')
            } else {
                // add success class
                setSeccessFor(inputForm)
            }
        }

        if (inputName === 'password') {
            if (inputNameValue === '') {
                setErrorFor(inputForm, 'Proszę podać hasło w celu zaaktualizowania danych')
            } else if (inputNameValue.length > 128) {
                setErrorFor(inputForm, 'Hasło może mieć maksymalnie 128 znaków!')
            } else if (inputNameValue.length < 8) {
                setErrorFor(inputForm, 'Hasło musi się składać przynajmniej z 8 znaków')
            } else if (!isvalidPassword(inputNameValue)) {
                setErrorFor(inputForm, 'Hasło musi posiadać prznajmiej znak z dużej litery, 2 z małej oraz znak specjalny @!<.?$')
            } else {
                // add success class
                setSeccessFor(inputForm)
            }
        }
    }


// Below code for changing password in user's profile
    const secondSettingForm = document.getElementById('second-settings-form');

    // check all fields in inputs and eventually set the success or error class
    for (let step = 0; step < 1; step++){
        secondSettingForm.querySelectorAll("div > input").forEach(input => {
            checkInputFirstForm(input);
        })
    }

    secondSettingForm.addEventListener('input', checkInputSecondForm);
    secondSettingForm.addEventListener('submit', e => {
        e.preventDefault();
        if (checkSuccessClasses) {
            secondSettingForm.submit()
        }
    })

    function checkInputSecondForm(input) {
        // get the values from the inputs
        // trim() delete whitespace
        let inputForm = checkKindOfInput(input, secondSettingForm)
        let inputNameValue = inputForm.value.trim();
        let inputName = inputForm.name;
        if (inputName === 'old_password') {
            if (inputNameValue === '') {
                setErrorFor(inputForm, 'Proszę wprowadzić stare hasło')
            } else if (inputNameValue.length > 128) {
                setErrorFor(inputForm, 'Hasło może mieć maksymalnie 128 znaków!')
            } else if (inputNameValue.length < 8) {
                setErrorFor(inputForm, 'Hasło musi się składać przynajmniej z 8 znaków')
            } else if (!isvalidPassword(inputNameValue)) {
                setErrorFor(inputForm, 'Hasło musi posiadać prznajmiej znak z dużej litery, 2 z małej oraz znak specjalny @!<.?$')
            } else {
                // add success class
                setSeccessFor(inputForm)
            }
        }

        if (inputName === 'new_password1') {
            if (inputNameValue === '') {
                setErrorFor(inputForm, 'Proszę wprowadzić nowe hasło')
            } else if (inputNameValue.length > 128) {
                setErrorFor(inputForm, 'Hasło może mieć maksymalnie 128 znaków!')
            } else if (inputNameValue.length < 8) {
                setErrorFor(inputForm, 'Hasło musi się składać przynajmniej z 8 znaków')
            } else if (!isvalidPassword(inputNameValue)) {
                setErrorFor(inputForm, 'Hasło musi posiadać prznajmiej znak z dużej litery, 2 z małej oraz znak specjalny @!<.?$')
            } else {
                // add success class
                setSeccessFor(inputForm)
            }
        }

        if (inputName === 'new_password2') {
            if (inputNameValue === '') {
                setErrorFor(inputForm, 'Proszę powtórzyć nowe hasło')
            } else if (inputNameValue.length < 8) {
                setErrorFor(inputForm, 'Hasło musi się składać przynajmniej z 8 znaków')
            } else if (inputNameValue.length > 128) {
                setErrorFor(inputForm, 'Hasło może mieć maksymalnie 128 znaków!')
            } else if (secondSettingForm.querySelector('input[name="new_password1"]').value !== inputNameValue) {
                setErrorFor(inputForm, 'Hasła nie są takie same')
            } else {
                // add success class
                setSeccessFor(inputForm)
            }
        }
    }

// check if the input is NodeList or EventInput
    function checkKindOfInput(input, form) {
        // EventInput has isTrusted atr
        console.log(input);
        if (input.isTrusted) return form.querySelector(`input[name=${input.target.name}]`)
        return input
    }

// set error in class for parent of input
    function setErrorFor(input, message) {
        //show error
        const formControl = input.parentElement; //.settings-form-control
        const small = formControl.querySelector('small');
        // small.innerText = ''
        small.innerText = message;

        // add error class
        formControl.className = 'settings-form-control error'
    }

// set success in class for parent of input
    function setSeccessFor(input) {
        const formControl = input.parentElement;

        // add success class
        formControl.className = 'settings-form-control success'
    }

// check if email is valid
    function isEmail(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    function isvalidPassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    }

// check whether div element of input has class success
    function isSuccess(input) {
        return input.parentElement.classList.contains('success');
    }


    function checkSuccessClasses(form) {
        // Checks if all form has success class in parents of inputs then send the data to server
        let allDivs = form.querySelectorAll('.settings-form-control')
        let countDiv = allDivs.length
        allDivs.forEach(div => {
            if (div.className === 'settings-form-control success') countDiv -= 1
        })
        return countDiv === 0;

    }


// check the response from the server
    checkResponse(firstSettingForm);
    checkResponse(secondSettingForm);

// handle the data from the server and if there's any error, shows it in specific input
    function checkResponse(form) {
        let divErrors = form.querySelectorAll('.form-settings-data-errors > div');
        divErrors.forEach(div => {
            if (!div.attributes['data-error-password']) {
                let inputName = div.querySelector("[data-input-error]").innerText;
                let messageError = div.querySelector("[data-message-error]").innerText;
                setErrorFor(form.querySelector(`input[name=${inputName}]`), messageError);
            } else {
                try {
                    let inputPassword = form.querySelector('input[name="password"]');
                    let messageError = div.querySelector("li").innerText;
                    setErrorFor(inputPassword, messageError);
                } catch (error) {
                }
            }
            div.remove();
        })
    }
})



