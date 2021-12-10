document.addEventListener('DOMContentLoaded', function () {

    try {
        const donationTakenForm = document.querySelector('#jsTaken');
        donationTakenForm.addEventListener('submit', e => {
            e.preventDefault();
            let newInput = document.createElement('input');
            newInput.type = 'hidden';
            newInput.name = 'donation_taken';
            newInput.value = 'Zabrane';
            donationTakenForm.appendChild(newInput);
            donationTakenForm.submit();
        });
    } catch (err) {
    }

    try {
        const donationNotTakenForm = document.querySelector('#jsNotTaken');
        donationNotTakenForm.addEventListener('submit', e => {
            e.preventDefault();
            let newInput = document.createElement('input');
            newInput.type = 'hidden';
            newInput.name = 'donation_not_taken';
            newInput.value = 'Niezabrane';
            donationNotTakenForm.appendChild(newInput);
            donationNotTakenForm.submit();
        });
    } catch (err) {
    }


    const donations = document.querySelectorAll(".donation");
    let delays = ["delay-1", "delay-2", "delay-3"];
    let lastDelay = 0;
    let currentDelay = 0;
    donations.forEach(el => {
        let delayClass = el.parentElement.classList[2]; // delay-1
        if (delayClass) {
            lastDelay = delays.indexOf(delayClass);
        }
        if (!delayClass) {
            if (delays[lastDelay] === delays.at(-1)) {
                currentDelay = delays[0];
                lastDelay = 0;
            } else {
                currentDelay = delays[lastDelay + 1];
                lastDelay += 1;
            }
            _addDelay(el, currentDelay);
        }
    })


    function _addDelay(el, delay) {
        // Function which adds on each donation delay when are displayed
        el.parentElement.classList.add(delay);
    }
})

