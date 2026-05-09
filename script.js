const generate = document.querySelector('#generate');
const secondclub = document.querySelector('#second');
const firstclub = document.querySelector('#first');

const clcehck1 = document.querySelector('#cl1');
const elcehck1 = document.querySelector('#el1');
const ntcehck1 = document.querySelector('#nt1');

const clcehck2 = document.querySelector('#cl2');
const elcehck2 = document.querySelector('#el2');
const ntcehck2 = document.querySelector('#nt2');

let clubsCache = null;

let lastFirstClub = null;
let lastSecondClub = null;

generate.addEventListener('click', getData);

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRange(cl, el, nt) {
    if (!(cl || el || nt)) return { min: 0, max: 39 };

    if (cl && el && nt) return { min: 0, max: 39 };
    if (cl && el) return { min: 0, max: 29 };
    if (el && nt) return { min: 15, max: 39 };

    if (cl && nt) {
        return Math.random() < 0.5
            ? { min: 0, max: 14 }
            : { min: 30, max: 39 };
    }

    if (cl) return { min: 0, max: 14 };
    if (el) return { min: 15, max: 29 };
    if (nt) return { min: 30, max: 39 };

    return { min: 0, max: 39 };
}

async function loadClubs() {
    if (clubsCache) return clubsCache;

    const resp = await fetch('/pes21.json');

    if (!resp.ok) {
        throw new Error('Failed to load pes21.json');
    }

    clubsCache = await resp.json();
    return clubsCache;
}

function clampIndex(i, dataLength) {
    return Math.max(0, Math.min(i, dataLength - 1));
}

function pickNotSameAsLast(range, lastClubIndex) {
    let index = randomInt(range.min, range.max);
    let attempts = 0;

    while (index === lastClubIndex && attempts < 100) {
        index = randomInt(range.min, range.max);
        attempts++;
    }

    return index;
}

async function getData() {
    firstclub.style.opacity = 0;
    secondclub.style.opacity = 0;
    generate.disabled = true;

    try {
        const range1 = getRange(
            clcehck1.checked,
            elcehck1.checked,
            ntcehck1.checked
        );

        const range2 = getRange(
            clcehck2.checked,
            elcehck2.checked,
            ntcehck2.checked
        );

        const data = await loadClubs();

        let firstIndex = pickNotSameAsLast(range1, lastFirstClub);
        let secondIndex = pickNotSameAsLast(range2, lastSecondClub);

        firstIndex = clampIndex(firstIndex, data.length);
        secondIndex = clampIndex(secondIndex, data.length);

        lastFirstClub = firstIndex;
        lastSecondClub = secondIndex;

        firstclub.innerHTML = `
            <img src="${data[firstIndex].logo}" alt="${data[firstIndex].club}">
            <p>${data[firstIndex].club}</p>
        `;

        secondclub.innerHTML = `
            <img src="${data[secondIndex].logo}" alt="${data[secondIndex].club}">
            <p>${data[secondIndex].club}</p>
        `;
    } catch (err) {
        console.error(err);
    } finally {
        setTimeout(() => {
            firstclub.style.opacity = 1;
        }, 1000);

        setTimeout(() => {
            secondclub.style.opacity = 1;
            generate.disabled = false;
        }, 2000);
    }
}