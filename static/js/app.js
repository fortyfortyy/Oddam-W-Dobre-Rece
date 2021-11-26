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
                }
            });
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

    //     let testForm = document.querySelector(".form-group--dropdown")
    // new FormSelect(testForm);
    // console.log(testForm)
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
                    this._getFormInputs(this.currentStep);
                    // const nextStep = this._getFormInputs(this.currentStep);
                    // if (nextStep){
                    //     this.currentStep++;
                    //     this._updateForm();
                    // } else {
                    //     // validation error rise to choose at least 1 element
                    // }
                    this.currentStep++;
                    this._updateForm();
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
                    // return true;
                } else {
                    delete this.result.firstStepResult;
                    // return false;
                }
            }

            if (step === 2) {
                let numberOfQuantity = document.querySelector("input[name='quantity']");
                if (numberOfQuantity.value > '0') {
                    this.result['secondStepResult'] = {
                        'name': numberOfQuantity.name,
                        'value': numberOfQuantity.value,
                    };
                } else {
                    delete this.result.secondStepResult;
                }
            }

            if (step === 3) {
                let institution = document.querySelector("input[name='institution']:checked");
                let institutionName = institution.parentElement.querySelector(".title").innerHTML;
                this.result['thirdStepResult'] = {
                    'name': institution.name,
                    'value': institution.value,
                    'institutionName': institutionName,
                };
            }

            if (step === 4) {
                let divHelper = document.querySelector("#jsStepForth").querySelectorAll("input, textarea");
                let forthStepResult = []
                divHelper.forEach(el => {
                    forthStepResult.push({
                        'name': el.name,
                        'value': el.value,
                    });
                });
                if (forthStepResult.length > 0) {
                    this.result['forthStepResult'] = forthStepResult;
                } else {
                    delete this.result.forthStepResult;
                }
                console.log(this.result);
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
         *
         * TODO: validation, send data to server
         */
        _submit(e) {
            e.preventDefault();
            this.currentStep++;
            this._updateForm();
            e.currentTarget.submit()
        }
    }

    const form = document.querySelector(".form--steps");
    if (form !== null) {
        new FormSteps(form);
    }

    class FooterForm {
        constructor($el) {
            this.$el = $el;
            this.init();
        }

        init() {
            this.events();
        }

        events(){
            let footer_form = this.$el;
            let a = footer_form.querySelector('.message-error');
            if (a){
                document.getElementById("contact").scrollIntoView({behavior: 'smooth'});
            }
        }

    }

    const footer = document.querySelector("#footer_form");
    if (footer !== null) {
        new FooterForm(footer);
    }

    //
    // class SectionButtons {
    //     constructor($el) {
    //         this.$el = $el;
    //         this.init();
    //     }
    //
    //     init() {
    //         this.events();
    //     }
    //
    //     sleep(ms) {
    //         return new Promise(resolve => setTimeout(resolve, ms));
    //     }
    //
    //      async events(){
    //
    //         let buttonsUlHelp = this.$el;
    //         buttonsUlHelp.querySelectorAll("a").forEach(button => {
    //             button.addEventListener('click', el => {
    //                 let buttonHash = el.currentTarget.hash;
    //                 let currentBaseURI = el.currentTarget.baseURI;
    //                 el.currentTarget.removeAttribute("href");
    //                 if (buttonHash){
    //                     if (buttonHash !== '#section-1'){
    //                         let a = document.querySelector(`${buttonHash}`);
    //                         a.scrollIntoView({behavior: 'smooth'});
    //                         console.log('czekanie 2s');
    //
    //                         // await this.sleep(2000).then(() =>{
    //                         //     el.currentTarget.setAttribute('href', `${currentBaseURI}`);
    //                         // });
    //
    //                         // this.sleep(2000).then(r => el.currentTarget.setAttribute('href', `${currentBaseURI}`));
    //                         console.log('wykonanie tego krokusssss')
    //                     } else {
    //                         console.log('tu zrobic do section-1');
    //                     }
    //                 }
    //             })
    //
    //
    //             // let stepHash = button.hash;
    //             // if (stepHash){
    //             //     if (stepHash !== '#section-1'){
    //             //         let a = document.querySelector(`${stepHash}`);
    //             //         a.scrollIntoView({behavior: 'smooth'});
    //             //     }
    //             // }
    //             // document.querySelector(`${target}`).scrollIntoView({behavior: 'smooth'});
    //         });
    //     }
    //
    // }
    //
    // const buttonsHelp = document.querySelector("#js_help_buttons");
    // if (buttonsHelp !== null) {
    //     new SectionButtons(buttonsHelp);
    // }


    // After password changed is done, moved to the main site after 3sec
    let currentLocation = window.location.href;
    if (currentLocation === 'http://127.0.0.1:8000/password/change/done/'){
        let tID = setTimeout(function () {
            window.location.href = "http://127.0.0.1:8000";
            window.clearTimeout(tID);		// clear time out.
        }, 3000);
    }

});

