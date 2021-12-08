document.addEventListener('DOMContentLoaded', function () {

    try{
        const donationTakenForm = document.querySelector('#jsTaken');
        donationTakenForm.addEventListener('submit', e =>{
        e.preventDefault();
        let newInput = document.createElement('input');
        newInput.type = 'hidden';
        newInput.name = 'donation_taken';
        newInput.value = 'Zabrane';
        donationTakenForm.appendChild(newInput);
        donationTakenForm.submit();
        });
    } catch (err){}

    try{
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
    } catch (err){}

})

