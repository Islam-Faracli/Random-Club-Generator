const generate = document.querySelector('#generate');
const firstclub = document.querySelector('#first');
const secondclub = document.querySelector('#second');

const firstOptions = {
    a: document.querySelector('#cl1'),
    b: document.querySelector('#el1'),
    c: document.querySelector('#cc1'),
    n: document.querySelector('#nt1'),
};

const secondOptions = {
    a: document.querySelector('#cl2'),
    b: document.querySelector('#el2'),
    c: document.querySelector('#cc2'),
    n: document.querySelector('#nt2'),
};

const CLASS_RANGES = {
    a: { min: 0, max: 9 },
    b: { min: 10, max: 19 },
    c: { min: 20, max: 29 },
    n: { min: 30, max: 39 },
};

const ALL_RANGES = [{ min: 0, max: 39 }];

let clubsCache = null;
let lastFirstClub = null;
let lastSecondClub = null;

generate.addEventListener('click', getData);

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSelectedRanges(options) {
    const ranges = Object.entries(options)
        .filter(([, input]) => input && input.checked)
        .map(([key]) => CLASS_RANGES[key]);

    return ranges.length ? ranges : ALL_RANGES;
}

function buildCandidates(ranges, excludedIndexes = []) {
    const excluded = new Set(excludedIndexes.filter(Number.isInteger));
    const candidates = [];

    ranges.forEach(({ min, max }) => {
        for (let i = min; i <= max; i += 1) {
            if (!excluded.has(i)) candidates.push(i);
        }
    });

    return candidates;
}

function pickRandomIndex(ranges, excludedIndexes = []) {
    const candidates = buildCandidates(ranges, excludedIndexes);
    if (candidates.length) {
        return candidates[randomInt(0, candidates.length - 1)];
    }

    const fallback = buildCandidates(ranges);
    return fallback.length ? fallback[randomInt(0, fallback.length - 1)] : 0;
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

async function getData() {
    firstclub.style.opacity = 0;
    secondclub.style.opacity = 0;
    generate.disabled = true;

    try {
        const ranges1 = getSelectedRanges(firstOptions);
        const ranges2 = getSelectedRanges(secondOptions);
        const clubs = await loadClubs();

        const firstIndex = pickRandomIndex(ranges1, [lastFirstClub]);
        const secondIndex = pickRandomIndex(ranges2, [lastSecondClub, firstIndex]);

        lastFirstClub = firstIndex;
        lastSecondClub = secondIndex;

        firstclub.innerHTML = `
            <img src="${clubs[firstIndex].logo}" alt="${clubs[firstIndex].club}">
            <p>${clubs[firstIndex].club}</p>
        `;

        secondclub.innerHTML = `
            <img src="${clubs[secondIndex].logo}" alt="${clubs[secondIndex].club}">
            <p>${clubs[secondIndex].club}</p>
        `;
    } catch (error) {
        console.error(error);
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