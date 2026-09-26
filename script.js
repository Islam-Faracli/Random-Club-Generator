const generate = document.querySelector('#generate');
const firstclub = document.querySelector('#first');
const secondclub = document.querySelector('#second');
const gameSelect = document.querySelector('#game-select');
const errorMessage = document.querySelector('#error-message');

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

const GAMES = {
    pes21: {
        file: './pes21.json',
        classSizes: { a: 13, b: 14, c: 14, n: 10 },
    },
    efootball: {
        file: './efootball.json',
        classSizes: { a: 8, b: 12, c: 12, n: 10 },
    },
    fc27: {
        file: './fc27.json',
        classSizes: { a: 11, b: 12, c: 10, n: 10 },
    },
};

const clubsCache = new Map();
let lastFirstClub = null;
let lastSecondClub = null;

generate.addEventListener('click', getData);
gameSelect.addEventListener('change', () => {
    lastFirstClub = null;
    lastSecondClub = null;
    errorMessage.textContent = '';
});

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getClassRanges(game) {
    let min = 0;
    return Object.fromEntries(
        Object.entries(game.classSizes).map(([key, size]) => {
            const range = { min, max: min + size - 1 };
            min += size;
            return [key, range];
        }),
    );
}

function getSelectedRanges(options, classRanges, clubCount) {
    const ranges = Object.entries(options)
        .filter(([, input]) => input && input.checked)
        .map(([key]) => classRanges[key]);

    return ranges.length ? ranges : [{ min: 0, max: clubCount - 1 }];
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

async function loadClubs(game) {
    if (clubsCache.has(game.file)) return clubsCache.get(game.file);

    const resp = await fetch(game.file);

    if (!resp.ok) {
        throw new Error(`Failed to load ${game.file}: ${resp.status}`);
    }

    const clubs = await resp.json();
    const expectedClubCount = Object.values(game.classSizes).reduce(
        (total, size) => total + size,
        0,
    );

    const actualClubCount = Array.isArray(clubs) ? clubs.length : 'invalid data';
    if (!Array.isArray(clubs) || clubs.length !== expectedClubCount) {
        throw new Error(
            `${game.file} contains ${actualClubCount} clubs; expected ${expectedClubCount} based on its class groups.`,
        );
    }

    clubsCache.set(game.file, clubs);
    return clubs;
}

async function getData() {
    firstclub.style.opacity = 0;
    secondclub.style.opacity = 0;
    generate.disabled = true;
    gameSelect.disabled = true;
    errorMessage.textContent = '';

    try {
        const game = GAMES[gameSelect.value];
        if (!game) throw new Error(`Unknown game selected: ${gameSelect.value}`);

        const clubs = await loadClubs(game);
        const classRanges = getClassRanges(game);
        const ranges1 = getSelectedRanges(firstOptions, classRanges, clubs.length);
        const ranges2 = getSelectedRanges(secondOptions, classRanges, clubs.length);

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
        errorMessage.textContent =
            error instanceof Error ? error.message : 'Failed to generate clubs.';
    } finally {
        setTimeout(() => {
            firstclub.style.opacity = 1;
        }, 1000);

        setTimeout(() => {
            secondclub.style.opacity = 1;
            generate.disabled = false;
            gameSelect.disabled = false;
        }, 2000);
    }
}