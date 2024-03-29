document.addEventListener("DOMContentLoaded", function () {
    /**
     * HomePage - Help section
     */
    class Help {
        constructor($el) {
            this.$el = $el;
            this.$buttonsContainer = $el.querySelector(".help--buttons");
            this.$slidesContainers = $el.querySelectorAll(".help--slides");
            this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
            this.init();
        }

        init() {
            this.events();
        }

        events() {
            /**
             * Slide buttons
             */
            this.$buttonsContainer.addEventListener("click", e => {
                if (e.target.classList.contains("btn")) {
                    this.changeSlide(e);
                }
            });

            /**
             * Pagination buttons
             */
            this.$el.addEventListener("click", e => {
                if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
                    this.changePage(e);
                }
            });
        }

        changeSlide(e) {
            e.preventDefault();
            const $btn = e.target;

            // Buttons Active class change
            [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
            $btn.classList.add("active");

            // Current slide
            this.currentSlide = $btn.parentElement.dataset.id;

            // Slides active class change
            this.$slidesContainers.forEach(el => {
                el.classList.remove("active");

                if (el.dataset.id === this.currentSlide) {
                    el.classList.add("active");
                    this._formatText(el);
                }
            });

        }

        // delete last comma from categories
        _formatText(el) {
            el.querySelectorAll("li > div .text").forEach(el => {
                el.innerText = el.innerText.replace(/,\s*$/, "");
            })
        }


        /**
         * TODO: callback to page change event
         */
        changePage(e) {
            e.preventDefault();
            const page = e.target.dataset.page;

            console.log(page);
        }
    }

    const helpSection = document.querySelector(".help");
    if (helpSection !== null) {
        new Help(helpSection);
    }

    /**
     * Form Select
     */
    class FormSelect {
        constructor($el) {
            this.$el = $el;
            this.options = [...$el.children];
            this.init();
            this.orderValues = {};
        }

        init() {
            console.log(this);
            this.createElements();
            this.addEvents();
            this.$el.parentElement.removeChild(this.$el);
        }

        createElements() {
            // Input for value
            this.valueInput = document.createElement("input");
            this.valueInput.type = "text";
            this.valueInput.name = this.$el.name;

            // Dropdown container
            this.dropdown = document.createElement("div");
            this.dropdown.classList.add("dropdown");

            // List container
            this.ul = document.createElement("ul");

            // All list options
            this.options.forEach((el, i) => {
                const li = document.createElement("li");
                li.dataset.value = el.value;
                li.innerText = el.innerText;

                if (i === 0) {
                    // First clickable option
                    this.current = document.createElement("div");
                    this.current.innerText = el.innerText;
                    this.dropdown.appendChild(this.current);
                    this.valueInput.value = el.value;
                    li.classList.add("selected");
                }

                this.ul.appendChild(li);
            });

            this.dropdown.appendChild(this.ul);
            this.dropdown.appendChild(this.valueInput);
            this.$el.parentElement.appendChild(this.dropdown);
        }

        addEvents() {
            this.dropdown.addEventListener("click", e => {
                const target = e.target;
                this.dropdown.classList.toggle("selecting");

                // Save new value only when clicked on li
                if (target.tagName === "LI") {
                    this.valueInput.value = target.dataset.value;
                    this.current.innerText = target.innerText;
                }
            });
        }
    }

    document.querySelectorAll(".form-group--dropdown select").forEach(el => {
        new FormSelect(el);
    });
    /**
     * Hide elements when clicked on document
     */
    document.addEventListener("click", function (e) {
        const target = e.target;
        const tagName = target.tagName;

        if (target.classList.contains("dropdown")) return false;

        if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
            return false;
        }

        if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
            return false;
        }

        document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
            el.classList.remove("selecting");
        });
    });

    /**
     * Switching between form steps
     */
    class FormSteps {
        constructor(form) {
            this.$form = form;
            this.$next = form.querySelectorAll(".next-step");
            this.$prev = form.querySelectorAll(".prev-step");
            this.$step = form.querySelector(".form--steps-counter span");
            this.currentStep = 1;
            this.result = {}

            this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p"); // [p.active, p, p, p]
            const $stepForms = form.querySelectorAll("form > div"); // [div.active, div, div, div, div]
            this.slides = [...this.$stepInstructions, ...$stepForms]; // [p.active, p, p, p, div.active, div, div, div, div]
            this.init();
        }

        /**
         * Init all methods
         */
        init() {
            this._events();
            this._updateForm();
        }

        /**
         * All events that are happening in form
         */
        _events() {
            // Next step
            this.$next.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    let result = this._getFormInputs(this.currentStep);

                    // if data-step inputs are valid return true and go to the next step
                    if (result) {
                        this.currentStep++;
                        this._updateForm();
                    }
                });
            });

            // Previous step
            this.$prev.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentStep--;
                    this._updateForm();
                });
            });

            // Form submit
            this.$form.querySelector("form").addEventListener("submit", e => this._submit(e));
        }

        /**
         * Update form front-end
         * Show next or previous section etc.
         */

        _getFormInputs(step) {
            if (step === 1) {
                let checkboxes = document.querySelectorAll("input[name='categories']");
                let firstStepResult = [];
                checkboxes.forEach(el => {
                    if (el.checked === true) {
                        firstStepResult.push({
                            'name': el.name,
                            'value': el.value,
                        });
                    }
                });
                if (firstStepResult.length > 0) {
                    this.result['firstStepResult'] = firstStepResult;
                    return true;
                } else {
                    delete this.result.firstStepResult;
                    this._setErrorFor(step, "Proszę wybrać przynajmniej jedną kategorię")
                    return false
                }
            }

            if (step === 2) {
                let numberOfQuantity = document.querySelector("input[name='quantity']");
                if (numberOfQuantity.value > '0') {
                    this.result['secondStepResult'] = {
                        'name': numberOfQuantity.name,
                        'value': numberOfQuantity.value,
                    };
                    return true
                } else {
                    delete this.result.secondStepResult;
                    this._setErrorFor(step, "Proszę wybrać przynajmniej jeden worek")
                    return false;
                }
            }

            if (step === 3) {
                let institution = document.querySelector("input[name='institution']:checked");
                if (!institution) {
                    this._setErrorFor(step, "Proszę wybrać przynajmniej jedną instytucje")
                    return false;
                }
                let institutionName = institution.parentElement.querySelector(".title").innerHTML;
                this.result['thirdStepResult'] = {
                    'name': institution.name,
                    'value': institution.value,
                    'institutionName': institutionName,
                };
                return true
            }

            if (step === 4) {
                let divHelper = document.querySelector("#jsStepForth").querySelectorAll("input, textarea");
                let forthStepResult = []
                let goToTheNextStep = true;
                divHelper.forEach(el => {
                    if (el.value || el.name === 'pick_up_comment') {
                        forthStepResult.push({
                            'name': el.name,
                            'value': el.value,
                        });
                    } else {
                        this._setErrorFor(step, "Proszę uzupełnić wszystkie pola");
                        goToTheNextStep = false
                        return false;
                    }
                });
                if (goToTheNextStep) {
                    this.result['forthStepResult'] = forthStepResult;
                    return true;
                } else {
                    delete this.result.forthStepResult;
                }
            }
        }

        _updateForm() {
            this.$step.innerText = this.currentStep;

            // TODO: Validation

            this.slides.forEach(slide => {
                slide.classList.remove("active");

                if (slide.dataset.step == this.currentStep) {
                    slide.classList.add("active");
                }
            });

            this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
            this.$step.parentElement.hidden = this.currentStep >= 6;


            // Get data from inputs and show them in summary

            if (this.currentStep === 5) {
                document.querySelector("#jsQuantity").innerHTML = this.result.secondStepResult['value'] +
                    ` worki  w dobrym stanie dla dzieci`;
                document.querySelector("#jsInstitutionName").innerHTML = `Dla fundacji "${this.result.thirdStepResult['institutionName']}"`;

                let pickUpUl = document.querySelector("#jsPickUp");
                pickUpUl.innerHTML = '';
                let addressUl = document.querySelector("#jsAddress");
                addressUl.innerHTML = '';
                this.result['forthStepResult'].forEach(el => {
                    if (el.name === 'pick_up_date' || el.name === 'pick_up_time' || el.name === 'pick_up_comment') {
                        let li = document.createElement('li')
                        if (el.name === 'pick_up_comment' && el.value === '') {
                            li.innerHTML = 'Brak uwag';
                        } else {
                            li.innerHTML = el.value;
                        }
                        document.querySelector("#jsPickUpComment").innerHTML = li.innerHTML;
                        pickUpUl.appendChild(li);
                    } else {
                        let li = document.createElement('li');
                        li.innerHTML = el.value;
                        addressUl.appendChild(li);
                    }
                });
            }
        }

        /**
         * Submit form
         */
        _submit(e) {
            e.preventDefault();
            this.currentStep++;
            this._updateForm();
            e.currentTarget.submit()
        }

        _setErrorFor(step, errorMessage) {
            let inputError = document.querySelector('.form-group--dropdown').querySelector(`[data-step="${step}"] .inputError`)
            inputError.classList.add('error');
            inputError.querySelector('p').innerText = errorMessage;
        }
    }

    const form = document.querySelector(".form--steps");
    if (form !== null) {
        new FormSteps(form);
    }

    class FooterForm {
        /**
         Handles contact form and scroll smoothly to it
         */
        constructor($el) {
            this.$el = $el;
            this.init();
        }

        init() {
            this.events();
        }

        events() {
            let footer_form = this.$el;
            let messageError = footer_form.querySelector('.message-error');
            if (messageError) {
                document.getElementById("contact").scrollIntoView({behavior: 'smooth'});
            }
        }

    }

    const footer = document.querySelector("#footer_form");
    if (footer !== null) {
        new FooterForm(footer);
    }

    // After password is changed, wait 3sec and move to the main site
    let currentLocation = window.location.pathname;  // '/password/change/done/' 'password/reset/complete/'
    if (currentLocation === '/password/change/done/' || currentLocation === '/password/reset/complete/') {
        let tID = setTimeout(function () {
            window.location.origin;     // "http://localhost:8000"
            window.clearTimeout(tID);		// clear time out.
        }, 3000);
    }

});

