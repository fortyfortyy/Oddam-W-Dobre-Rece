const firstSettingForm = document.getElementById('first-settings-form');
const firstName = firstSettingForm.querySelector('#id_first_name');
const lastName = firstSettingForm.querySelector('#id_last_name');
const emailUser = firstSettingForm.querySelector('#id_email');
const passwordUser = firstSettingForm.querySelector('#id_password');


firstSettingForm.addEventListener('submit', e => {
    e.preventDefault();
    checkInputs();
})

function checkInputs() {
    //get the values from the inputs
    // trim() delete whitespace
    const firstNameValue = firstName.value.trim();
    const lastNameValue = lastName.value.trim();
    const emailValue = emailUser.value.trim();
    const passwordValue = passwordUser.value.trim();

    if (firstNameValue === '') {
        setErrorFor(firstName, 'Imię nie może być puste')
    } else if (firstNameValue.length > 150) {
        setErrorFor(firstName, 'Maksymalnie 150 znaków!')
    } else {
        // add success class
        setSeccessFor(firstName)
    }

    if (lastNameValue === '') {
        setErrorFor(lastName, 'Nazwisko nie może być puste')
    } else if (lastNameValue.length > 150) {
        setErrorFor(lastName, 'Maksymalnie 150 znaków!')
    } else {
        // add success class
        setSeccessFor(lastName)
    }

    if (emailValue === '') {
        setErrorFor(emailUser, 'Email nie może być pusty')
    } else if (emailValue.length > 255) {
        setErrorFor(emailUser, 'Email jest za długi. Maksymalnie 255 znaków!')
    } else if (!isEmail(emailValue)){
        setErrorFor(emailUser, 'Nieprawidłowy email')
    } else {
        // add success class
        setSeccessFor(emailUser)
    }

    if (passwordValue === '') {
        setErrorFor(passwordUser, 'Proszę podać hasło w celu zaaktualizowania danych')
    } else if (passwordValue.length > 128) {
        setErrorFor(passwordUser, 'Hasło może mieć maksymalnie 128 znaków!')
    } else {
        // add success class
        setSeccessFor(passwordUser)
    }

}

const secondSettingForm = document.getElementById('second-settings-form');
const oldPassword = secondSettingForm.querySelector('#id_old_password');
const newPassword1 = secondSettingForm.querySelector('#id_new_password1');
const newPassword2 = secondSettingForm.querySelector('#id_new_password2');


secondSettingForm.addEventListener('submit', e => {
    e.preventDefault();
    checkPasswordInputs();
})

function checkPasswordInputs() {
    //get the values from the inputs
    // trim() delete whitespace
    const oldPasswordValue = oldPassword.value.trim();
    const newPassword1Value = newPassword1.value.trim();
    const newPassword2Value = newPassword2.value.trim();

    // check old password
    if (oldPasswordValue === '') {
        setErrorFor(oldPassword, 'Proszę podać hasło w celu ustawienia nowych haseł')
    } else if (oldPasswordValue.length > 128) {
        setErrorFor(oldPassword, 'Hasło może się składac maksymalnie ze 128 znaków!')
    } else {
        // add success class
        setSeccessFor(oldPassword)
    }

    // check new passwords
    if (newPassword1Value === '' || newPassword2Value === '') {
        setErrorFor(newPassword1, 'Proszę podać nowe hasło')
    } else if (newPassword1Value.length > 128 || newPassword2Value.length > 128) {
        setErrorFor(newPassword1, 'Hasło może się składac maksymalnie ze 128 znaków!')
    } else if (newPassword1Value !== newPassword2Value) {
        setErrorFor(newPassword1, 'Hasła nie są jednakowe!')
    } else {
        // add success class
        setSeccessFor(newPassword1)
        setSeccessFor(newPassword2)
    }
}

function setErrorFor(input, message) {
    //show error
    const formControl = input.parentElement; //.settings-form-control
    const small = formControl.querySelector('small');
    small.innerText = message;

    // add error class
    formControl.className = 'settings-form-control error'
}

function setSeccessFor(input){
    const formControl = input.parentElement;

    // add success class
    formControl.className = 'settings-form-control success'
}

function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}