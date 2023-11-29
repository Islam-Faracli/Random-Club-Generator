const generate = document.querySelector('#generate');
const secondclub = document.querySelector('#second');
const firstclub = document.querySelector('#first');
const clcehck1 = document.querySelector('#cl1');
const elcehck1 = document.querySelector('#el1');
const ntcehck1 = document.querySelector('#nt1');
const clcehck2 = document.querySelector('#cl2');
const elcehck2 = document.querySelector('#el2');
const ntcehck2 = document.querySelector('#nt2');

generate.addEventListener('click', getData);

function getData() {
    let min = 0;
    let max = 39;
    let min2 = 0;
    let max2 = 30;

    if (clcehck1.checked && ntcehck1.checked && elcehck1.checked) {
        min = 0;
        max = 39;
    } else if (elcehck1.checked && clcehck1.checked) {
        min = 0;
        max = 29;
    } else if (ntcehck1.checked && elcehck1.checked) {
        min = 15;
        max = 39;
    } else if (clcehck1.checked && ntcehck1.checked) {
        let r = Math.random() * 2;
        if (r < 1) {
            min = 0;
            max = 14;
        } else {
            min = 30;
            max = 39;
        }
    } else if (clcehck1.checked) {
        min = 0;
        max = 14;
    } else if (elcehck1.checked) {
        min = 15;
        max = 29;
    } else if (ntcehck1.checked) {
        min = 30;
        max = 39;
    } 


    if (clcehck2.checked && ntcehck2.checked && elcehck2.checked) {
        min2 = 0;
        max2 = 39;
    } else if (elcehck2.checked && clcehck2.checked) {
        min2 = 0;
        max2 = 29;
    } else if (ntcehck2.checked && elcehck2.checked) {
        min2 = 15;
        max2 = 39;
    } else if (clcehck2.checked && ntcehck2.checked) {
        let r = Math.random() * 2;
        if (r < 1) {
            min2 = 0;
            max2 = 14;
        } else {
            min2 = 30;
            max2 = 39;
        }
    }
    else if (clcehck2.checked) {
        min2 = 0;
        max2 = 14;
    } else if (elcehck2.checked) {
        min2 = 15;
        max2 = 29;
    } else if (ntcehck2.checked) {
        min2 = 30;
        max2 = 39;
    } 

    let rando = Math.floor(Math.random() * (max - min + 1)) + min;
    let random = Math.floor(Math.random() * (max2 - min2+ 1)) + min2;

    if (rando != random) {
    fetch("/clubs.json")
    .then(response => response.json())
    .then(data => {
        firstclub.innerHTML =
        `
        <img src="${data[rando].logo}" alt="">
        <p>${data[rando].club}</p>
        `;
    });

    fetch("/clubs.json")
    .then(response => response.json())
    .then(data => {
        secondclub.innerHTML =
        `
        <img src="${data[random].logo}" alt="">
        <p>${data[random].club}</p>
        `;
    });
}
}