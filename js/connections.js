// ============ CONNECTIONS GAME ============
(function() {
    let allPuzzles = [];
    let puzzle = null;
    let selected = [];
    let solved = [];
    let mistakes = 4;
    let gameOver = false;
    let remainingWords = [];

    async function loadData() {
        try {
            const resp = await fetch('data/connections.json');
            allPuzzles = await resp.json();
        } catch(e) {
            allPuzzles = generateFallbackPuzzles();
        }
    }

    function generateFallbackPuzzles() {
        return [
            { id: 1, answers: [
                { level: 0, group: "FRUITS", members: ["APPLE","BANANA","CHERRY","GRAPE"] },
                { level: 1, group: "COLORS", members: ["RED","BLUE","GREEN","YELLOW"] },
                { level: 2, group: "PLANETS", members: ["MARS","VENUS","SATURN","JUPITER"] },
                { level: 3, group: "CARD GAMES", members: ["POKER","BRIDGE","HEARTS","SPADES"] }
            ]},
            { id: 2, answers: [
                { level: 0, group: "DOG BREEDS", members: ["POODLE","BEAGLE","BOXER","COLLIE"] },
                { level: 1, group: "DANCES", members: ["WALTZ","TANGO","SALSA","FOXTROT"] },
                { level: 2, group: "METALS", members: ["GOLD","SILVER","COPPER","IRON"] },
                { level: 3, group: "GREEK GODS", members: ["ZEUS","APOLLO","HERMES","ARES"] }
            ]}
        ];
    }

    function pickPuzzle() {
        const idx = Math.floor(Math.random() * allPuzzles.length);
        puzzle = allPuzzles[idx];
    }

    function createBoard() {
        const container = document.getElementById('connections-game');

        container.innerHTML = `
            <h1 class="connections-title">Connections</h1>
            <p class="connections-subtitle">Group four items that share something in common.</p>
            <div class="connections-solved" id="conn-solved"></div>
            <div class="connections-board" id="conn-board"></div>
            <div class="mistakes-remaining" id="conn-mistakes">
                Mistakes remaining: <span id="conn-dots"></span>
            </div>
            <div class="connections-controls">
                <button class="conn-btn" id="conn-shuffle">Shuffle</button>
                <button class="conn-btn" id="conn-deselect" disabled>Deselect All</button>
                <button class="conn-btn submit-btn" id="conn-submit" disabled>Submit</button>
            </div>
            <button class="next-puzzle-btn" id="conn-next">Next Puzzle</button>
        `;

        renderDots();
        renderBoard();

        document.getElementById('conn-shuffle').addEventListener('click', () => {
            remainingWords = shuffleArray(remainingWords);
            renderBoard();
        });
        document.getElementById('conn-deselect').addEventListener('click', () => {
            selected = [];
            renderBoard();
            updateButtons();
        });
        document.getElementById('conn-submit').addEventListener('click', submitGuess);
        document.getElementById('conn-next').addEventListener('click', initGame);
    }

    function renderDots() {
        const dotsEl = document.getElementById('conn-dots');
        if (!dotsEl) return;
        dotsEl.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('span');
            dot.className = 'mistake-dot' + (i >= mistakes ? ' used' : '');
            dotsEl.appendChild(dot);
        }
    }

    function renderBoard() {
        const boardEl = document.getElementById('conn-board');
        if (!boardEl) return;
        boardEl.innerHTML = '';
        remainingWords.forEach(word => {
            const tile = document.createElement('button');
            tile.className = 'conn-tile' + (selected.includes(word) ? ' selected' : '');
            tile.textContent = word;
            tile.addEventListener('click', () => toggleWord(word));
            boardEl.appendChild(tile);
        });
    }

    function toggleWord(word) {
        if (gameOver) return;
        if (selected.includes(word)) {
            selected = selected.filter(w => w !== word);
        } else if (selected.length < 4) {
            selected.push(word);
        }
        renderBoard();
        updateButtons();
    }

    function updateButtons() {
        document.getElementById('conn-deselect').disabled = selected.length === 0;
        document.getElementById('conn-submit').disabled = selected.length !== 4;
    }

    function submitGuess() {
        if (selected.length !== 4 || gameOver) return;

        // Check if selected words form a valid group
        let matchedGroup = null;
        for (const group of puzzle.answers) {
            if (solved.some(s => s.group === group.group)) continue;
            const members = group.members.map(m => m.toUpperCase());
            const sel = selected.map(s => s.toUpperCase());
            if (sel.every(s => members.includes(s)) && members.every(m => sel.includes(m))) {
                matchedGroup = group;
                break;
            }
        }

        if (matchedGroup) {
            solved.push(matchedGroup);
            remainingWords = remainingWords.filter(w => !selected.map(s => s.toUpperCase()).includes(w.toUpperCase()));
            selected = [];

            // Render solved group
            const solvedEl = document.getElementById('conn-solved');
            const groupDiv = document.createElement('div');
            groupDiv.className = `solved-group level-${matchedGroup.level}`;
            groupDiv.innerHTML = `
                <div class="solved-group-name">${matchedGroup.group}</div>
                <div class="solved-group-words">${matchedGroup.members.join(', ')}</div>
            `;
            solvedEl.appendChild(groupDiv);

            renderBoard();
            updateButtons();

            if (solved.length === 4) {
                gameOver = true;
                showToast('Perfect!');
            }
        } else {
            // Check if 3 out of 4 are correct (one away)
            let oneAway = false;
            for (const group of puzzle.answers) {
                if (solved.some(s => s.group === group.group)) continue;
                const members = group.members.map(m => m.toUpperCase());
                const sel = selected.map(s => s.toUpperCase());
                const overlap = sel.filter(s => members.includes(s)).length;
                if (overlap === 3) { oneAway = true; break; }
            }

            if (oneAway) showToast('One away!');

            mistakes--;
            renderDots();
            selected = [];
            renderBoard();
            updateButtons();

            if (mistakes === 0) {
                gameOver = true;
                // Reveal all remaining groups
                setTimeout(() => {
                    const solvedEl = document.getElementById('conn-solved');
                    for (const group of puzzle.answers) {
                        if (solved.some(s => s.group === group.group)) continue;
                        const groupDiv = document.createElement('div');
                        groupDiv.className = `solved-group level-${group.level}`;
                        groupDiv.innerHTML = `
                            <div class="solved-group-name">${group.group}</div>
                            <div class="solved-group-words">${group.members.join(', ')}</div>
                        `;
                        solvedEl.appendChild(groupDiv);
                    }
                    remainingWords = [];
                    renderBoard();
                    showToast('Better luck next time!');
                }, 500);
            }
        }
    }

    function initGame() {
        selected = [];
        solved = [];
        mistakes = 4;
        gameOver = false;
        pickPuzzle();

        // Collect all words and shuffle
        remainingWords = [];
        puzzle.answers.forEach(group => {
            group.members.forEach(word => remainingWords.push(word));
        });
        remainingWords = shuffleArray(remainingWords);

        createBoard();
    }

    loadData().then(() => initGame());
})();
