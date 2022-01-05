document.addEventListener('DOMContentLoaded', function () {

    const donationTakenForm = document.querySelectorAll('#jsTaken');
    donationTakenForm.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            let newInput = document.createElement('input');
            newInput.type = 'hidden';
            newInput.name = 'donation_taken';
            newInput.value = 'Zabrane';
            form.appendChild(newInput);
            form.submit();
        });
    });

    const donationNotTakenForm = document.querySelectorAll('#jsNotTaken');
    donationNotTakenForm.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            let newInput = document.createElement('input');
            newInput.type = 'hidden';
            newInput.name = 'donation_not_taken';
            newInput.value = 'Niezabrane';
            form.appendChild(newInput);
            form.submit();
        });
    });


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

