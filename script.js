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
    let min = 1;
    let max = 40;
    let min2 = 1;
    let max2 = 40;

    if (clcehck1.checked && ntcehck1.checked && elcehck1.checked) {
        min = 1;
        max = 40;
    } else if (elcehck1.checked && clcehck1.checked) {
        min = 1;
        max = 30;
    } else if (ntcehck1.checked && elcehck1.checked) {
        min = 16;
        max = 40;
    } else if (clcehck1.checked && ntcehck1.checked) {
        let r = Math.random() * 2;
        if (r < 1) {
            min = 1;
            max = 15;
        } else {
            min = 31;
            max = 40;
        }
    } else if (clcehck1.checked) {
        min = 1;
        max = 15;
    } else if (elcehck1.checked) {
        min = 16;
        max = 30;
    } else if (ntcehck1.checked) {
        min = 31;
        max = 40;
    } 


    if (clcehck2.checked && ntcehck2.checked && elcehck2.checked) {
        min2 = 1;
        max2 = 40;
    } else if (elcehck2.checked && clcehck2.checked) {
        min2 = 1;
        max2 = 30;
    } else if (ntcehck2.checked && elcehck2.checked) {
        min2 = 16;
        max2 = 40;
    } else if (clcehck2.checked && ntcehck2.checked) {
        let r = Math.random() * 2;
        if (r < 1) {
            min2 = 1;
            max2 = 15;
        } else {
            min2 = 31;
            max2 = 40;
        }
    }
    else if (clcehck2.checked) {
        min2 = 1;
        max2 = 15;
    } else if (elcehck2.checked) {
        min2 = 16;
        max2 = 30;
    } else if (ntcehck2.checked) {
        min2 = 31;
        max2 = 40;
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