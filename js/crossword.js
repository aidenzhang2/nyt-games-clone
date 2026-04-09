// ============ MINI CROSSWORD GAME ============
(function() {
    const GRID_SIZE = 5;
    let puzzle = null;
    let grid = [];
    let selectedCell = null;
    let direction = 'across';
    let timerInterval = null;
    let seconds = 0;
    let gameOver = false;
    let timerActive = false;
    let autocheck = false;

    const puzzles = [
        {
            grid: [
                ['G','A','I','N','S'],
                ['A','S','S','E','T'],
                ['I','S','#','W','E'],
                ['N','E','W','E','R'],
                ['S','T','E','R','N'],
            ],
            acrossClues: { 1: "Profits", 6: "Valuable item", 7: "Exists", 8: "Together pronoun", 9: "More recent", 11: "Strict" },
            downClues: { 1: "Profits", 2: "Valuable item", 3: "Exists", 4: "More recent", 5: "Strict", 10: "Together pronoun" }
        },
        {
            grid: [
                ['R','A','N','K','S'],
                ['A','L','O','N','E'],
                ['N','O','#','O','N'],
                ['K','N','O','T','S'],
                ['S','E','N','S','E'],
            ],
            acrossClues: { 1: "Positions", 6: "By oneself", 7: "Negative", 8: "Atop", 9: "Tied loops", 11: "Feeling" },
            downClues: { 1: "Positions", 2: "By oneself", 3: "Negative", 4: "Tied loops", 5: "Feeling", 10: "Atop" }
        },
        {
            grid: [
                ['L','E','A','D','S'],
                ['E','X','T','R','A'],
                ['A','T','#','I','N'],
                ['D','R','I','E','D'],
                ['S','A','N','D','S'],
            ],
            acrossClues: { 1: "Guides", 6: "Additional", 7: "Location word", 8: "Inside", 9: "Not wet", 11: "Beach grains" },
            downClues: { 1: "Guides", 2: "Additional", 3: "Location word", 4: "Not wet", 5: "Beach grains", 10: "Inside" }
        },
        {
            grid: [
                ['R','A','I','D','S'],
                ['A','S','S','E','T'],
                ['I','S','#','T','O'],
                ['D','E','T','E','R'],
                ['S','T','O','R','E'],
            ],
            acrossClues: { 1: "Sudden attacks", 6: "Valuable item", 7: "Exists", 8: "Toward", 9: "Discourage", 11: "Shop" },
            downClues: { 1: "Sudden attacks", 2: "Valuable item", 3: "Exists", 4: "Discourage", 5: "Shop", 10: "Toward" }
        },
        {
            grid: [
                ['G','H','O','S','T'],
                ['H','E','N','C','E'],
                ['O','N','#','A','N'],
                ['S','C','A','L','D'],
                ['T','E','N','D','S'],
            ],
            acrossClues: { 1: "Spirit", 6: "Therefore", 7: "Atop", 8: "Article", 9: "Burn with liquid", 11: "Is inclined" },
            downClues: { 1: "Spirit", 2: "Therefore", 3: "Atop", 4: "Burn with liquid", 5: "Is inclined", 10: "Article" }
        },
        {
            grid: [
                ['J','O','I','N','S'],
                ['O','N','S','E','T'],
                ['I','S','#','W','E'],
                ['N','E','W','E','R'],
                ['S','T','E','R','N'],
            ],
            acrossClues: { 1: "Connects", 6: "Beginning", 7: "Exists", 8: "Together pronoun", 9: "More recent", 11: "Strict" },
            downClues: { 1: "Connects", 2: "Beginning", 3: "Exists", 4: "More recent", 5: "Strict", 10: "Together pronoun" }
        },
        {
            grid: [
                ['S','C','A','L','D'],
                ['C','A','M','E','O'],
                ['A','M','#','A','S'],
                ['L','E','A','S','E'],
                ['D','O','S','E','S'],
            ],
            acrossClues: { 1: "Burn with liquid", 6: "Brief appearance", 7: "Morning time", 8: "Similar to", 9: "Rental agreement", 11: "Medicine amounts" },
            downClues: { 1: "Burn with liquid", 2: "Brief appearance", 3: "Morning time", 4: "Rental agreement", 5: "Medicine amounts", 10: "Similar to" }
        },
        {
            grid: [
                ['D','O','I','N','G'],
                ['O','U','T','E','R'],
                ['I','T','#','S','O'],
                ['N','E','S','T','S'],
                ['G','R','O','S','S'],
            ],
            acrossClues: { 1: "Performing", 6: "External", 7: "Thing pronoun", 8: "Therefore", 9: "Bird homes", 11: "Disgusting" },
            downClues: { 1: "Performing", 2: "External", 3: "Thing pronoun", 4: "Bird homes", 5: "Disgusting", 10: "Therefore" }
        },
        {
            grid: [
                ['W','R','I','S','T'],
                ['R','A','N','C','H'],
                ['I','N','#','O','R'],
                ['S','C','O','P','E'],
                ['T','H','R','E','E'],
            ],
            acrossClues: { 1: "Hand joint", 6: "Large farm", 7: "Inside", 8: "Alternative", 9: "Range", 11: "Number after two" },
            downClues: { 1: "Hand joint", 2: "Large farm", 3: "Inside", 4: "Range", 5: "Number after two", 10: "Alternative" }
        },
        {
            grid: [
                ['T','E','A','C','H'],
                ['E','X','T','R','A'],
                ['A','T','#','A','S'],
                ['C','R','A','F','T'],
                ['H','A','S','T','E'],
            ],
            acrossClues: { 1: "Instruct", 6: "Additional", 7: "Location word", 8: "Similar to", 9: "Skill or trade", 11: "Speed" },
            downClues: { 1: "Instruct", 2: "Additional", 3: "Location word", 4: "Skill or trade", 5: "Speed", 10: "Similar to" }
        },
        {
            grid: [
                ['C','R','O','P','S'],
                ['R','I','F','L','E'],
                ['O','F','#','O','N'],
                ['P','L','O','T','S'],
                ['S','E','N','S','E'],
            ],
            acrossClues: { 1: "Farm harvest", 6: "Long gun", 7: "Belonging to", 8: "Atop", 9: "Story plans", 11: "Feeling" },
            downClues: { 1: "Farm harvest", 2: "Long gun", 3: "Belonging to", 4: "Story plans", 5: "Feeling", 10: "Atop" }
        },
        {
            grid: [
                ['C','R','O','S','S'],
                ['R','I','F','L','E'],
                ['O','F','#','A','N'],
                ['S','L','A','B','S'],
                ['S','E','N','S','E'],
            ],
            acrossClues: { 1: "Angry or X-shape", 6: "Long gun", 7: "Belonging to", 8: "Article", 9: "Thick slices", 11: "Feeling" },
            downClues: { 1: "Angry or X-shape", 2: "Long gun", 3: "Belonging to", 4: "Thick slices", 5: "Feeling", 10: "Article" }
        },
        {
            grid: [
                ['A','W','A','R','E'],
                ['W','O','M','A','N'],
                ['A','M','#','I','T'],
                ['R','A','I','S','E'],
                ['E','N','T','E','R'],
            ],
            acrossClues: { 1: "Conscious of", 6: "Adult female", 7: "Morning time", 8: "Thing pronoun", 9: "Lift up", 11: "Go in" },
            downClues: { 1: "Conscious of", 2: "Adult female", 3: "Morning time", 4: "Lift up", 5: "Go in", 10: "Thing pronoun" }
        },
        {
            grid: [
                ['S','T','I','N','G'],
                ['T','U','T','O','R'],
                ['I','T','#','T','O'],
                ['N','O','T','E','S'],
                ['G','R','O','S','S'],
            ],
            acrossClues: { 1: "Bee attack", 6: "Private teacher", 7: "Thing pronoun", 8: "Toward", 9: "Written marks", 11: "Disgusting" },
            downClues: { 1: "Bee attack", 2: "Private teacher", 3: "Thing pronoun", 4: "Written marks", 5: "Disgusting", 10: "Toward" }
        },
        {
            grid: [
                ['C','O','I','N','S'],
                ['O','N','S','E','T'],
                ['I','S','#','W','E'],
                ['N','E','W','E','R'],
                ['S','T','E','R','N'],
            ],
            acrossClues: { 1: "Metal money", 6: "Beginning", 7: "Exists", 8: "Together pronoun", 9: "More recent", 11: "Strict" },
            downClues: { 1: "Metal money", 2: "Beginning", 3: "Exists", 4: "More recent", 5: "Strict", 10: "Together pronoun" }
        },
        {
            grid: [
                ['G','A','M','E','S'],
                ['A','G','E','N','T'],
                ['M','E','#','T','O'],
                ['E','N','T','E','R'],
                ['S','T','O','R','E'],
            ],
            acrossClues: { 1: "Fun activities", 6: "Representative", 7: "Self pronoun", 8: "Toward", 9: "Go in", 11: "Shop" },
            downClues: { 1: "Fun activities", 2: "Representative", 3: "Self pronoun", 4: "Go in", 5: "Shop", 10: "Toward" }
        },
        {
            grid: [
                ['S','T','O','L','E'],
                ['T','O','K','E','N'],
                ['O','K','#','A','T'],
                ['L','E','A','S','E'],
                ['E','N','T','E','R'],
            ],
            acrossClues: { 1: "Took illegally", 6: "Symbol", 7: "All right", 8: "Location word", 9: "Rental agreement", 11: "Go in" },
            downClues: { 1: "Took illegally", 2: "Symbol", 3: "All right", 4: "Rental agreement", 5: "Go in", 10: "Location word" }
        },
        {
            grid: [
                ['D','O','I','N','G'],
                ['O','F','F','E','R'],
                ['I','F','#','S','O'],
                ['N','E','S','T','S'],
                ['G','R','O','S','S'],
            ],
            acrossClues: { 1: "Performing", 6: "Propose", 7: "Supposing that", 8: "Therefore", 9: "Bird homes", 11: "Disgusting" },
            downClues: { 1: "Performing", 2: "Propose", 3: "Supposing that", 4: "Bird homes", 5: "Disgusting", 10: "Therefore" }
        },
        {
            grid: [
                ['C','L','I','M','B'],
                ['L','A','T','E','R'],
                ['I','T','#','D','O'],
                ['M','E','D','I','A'],
                ['B','R','O','A','D'],
            ],
            acrossClues: { 1: "Go up", 6: "Afterward", 7: "Thing pronoun", 8: "Perform", 9: "News outlets", 11: "Wide" },
            downClues: { 1: "Go up", 2: "Afterward", 3: "Thing pronoun", 4: "News outlets", 5: "Wide", 10: "Perform" }
        },
        {
            grid: [
                ['S','L','A','V','E'],
                ['L','E','M','O','N'],
                ['A','M','#','I','T'],
                ['V','O','I','C','E'],
                ['E','N','T','E','R'],
            ],
            acrossClues: { 1: "Forced worker", 6: "Sour fruit", 7: "Morning time", 8: "Thing pronoun", 9: "Speaking sound", 11: "Go in" },
            downClues: { 1: "Forced worker", 2: "Sour fruit", 3: "Morning time", 4: "Speaking sound", 5: "Go in", 10: "Thing pronoun" }
        },
        {
            grid: [
                ['Q','U','I','T','E'],
                ['U','L','T','R','A'],
                ['I','T','#','O','R'],
                ['T','R','O','U','T'],
                ['E','A','R','T','H'],
            ],
            acrossClues: { 1: "Rather", 6: "Extreme", 7: "Thing pronoun", 8: "Alternative", 9: "Freshwater fish", 11: "Our planet" },
            downClues: { 1: "Rather", 2: "Extreme", 3: "Thing pronoun", 4: "Freshwater fish", 5: "Our planet", 10: "Alternative" }
        },
        {
            grid: [
                ['B','E','I','N','G'],
                ['E','N','T','E','R'],
                ['I','T','#','S','O'],
                ['N','E','S','T','S'],
                ['G','R','O','S','S'],
            ],
            acrossClues: { 1: "Existing", 6: "Go in", 7: "Thing pronoun", 8: "Therefore", 9: "Bird homes", 11: "Disgusting" },
            downClues: { 1: "Existing", 2: "Go in", 3: "Thing pronoun", 4: "Bird homes", 5: "Disgusting", 10: "Therefore" }
        },
        {
            grid: [
                ['R','U','I','N','S'],
                ['U','N','T','I','L'],
                ['I','T','#','G','O'],
                ['N','I','G','H','T'],
                ['S','L','O','T','S'],
            ],
            acrossClues: { 1: "Remains", 6: "Up to", 7: "Thing pronoun", 8: "Depart", 9: "After dark", 11: "Narrow openings" },
            downClues: { 1: "Remains", 2: "Up to", 3: "Thing pronoun", 4: "After dark", 5: "Narrow openings", 10: "Depart" }
        },
        {
            grid: [
                ['C','L','I','M','B'],
                ['L','A','T','E','R'],
                ['I','S','#','D','O'],
                ['M','E','D','I','A'],
                ['B','R','O','A','D'],
            ],
            acrossClues: { 1: "Go up", 6: "Afterward", 7: "Exists", 8: "Perform", 9: "News outlets", 11: "Wide" },
            downClues: { 1: "Go up", 2: "Light beam", 3: "Thing pronoun", 4: "News outlets", 5: "Wide", 10: "Perform" }
        }
    ];

    let puzzleIndex = -1;

    function pickPuzzle() {
        puzzleIndex = Math.floor(Math.random() * puzzles.length);
        puzzle = puzzles[puzzleIndex];
    }

    function buildGrid() {
        grid = [];
        let num = 1;
        for (let r = 0; r < GRID_SIZE; r++) {
            const row = [];
            for (let c = 0; c < GRID_SIZE; c++) {
                const ch = puzzle.grid[r][c];
                const isBlack = ch === '#';
                let cellNum = null;
                if (!isBlack) {
                    const needsAcross = (c === 0 || puzzle.grid[r][c-1] === '#') && c < GRID_SIZE - 1 && puzzle.grid[r][c+1] !== '#';
                    const needsDown = (r === 0 || puzzle.grid[r-1][c] === '#') && r < GRID_SIZE - 1 && puzzle.grid[r+1][c] !== '#';
                    if (needsAcross || needsDown) cellNum = num++;
                }
                row.push({ letter: isBlack ? '' : ch.toUpperCase(), number: cellNum, isBlack, userLetter: '', checked: false, revealed: false, incorrect: false });
            }
            grid.push(row);
        }
    }

    // ---- Get word cells for current selection ----
    function getWordCells() {
        if (!selectedCell) return [];
        const { r, c } = selectedCell;
        const cells = [];
        if (direction === 'across') {
            let startC = c;
            while (startC > 0 && !grid[r][startC - 1].isBlack) startC--;
            for (let cc = startC; cc < GRID_SIZE && !grid[r][cc].isBlack; cc++) {
                cells.push({ r, c: cc });
            }
        } else {
            let startR = r;
            while (startR > 0 && !grid[startR - 1][c].isBlack) startR--;
            for (let rr = startR; rr < GRID_SIZE && !grid[rr][c].isBlack; rr++) {
                cells.push({ r: rr, c });
            }
        }
        return cells;
    }

    // ---- Check functions ----
    function checkSquare() {
        if (!selectedCell || gameOver) return;
        const cell = grid[selectedCell.r][selectedCell.c];
        if (cell.isBlack || cell.revealed) return;
        cell.checked = true;
        if (cell.userLetter && cell.userLetter !== cell.letter) {
            cell.incorrect = true;
        } else {
            cell.incorrect = false;
        }
        renderGrid();
    }

    function checkWord() {
        if (!selectedCell || gameOver) return;
        const cells = getWordCells();
        cells.forEach(({r, c}) => {
            const cell = grid[r][c];
            if (cell.revealed) return;
            cell.checked = true;
            if (cell.userLetter && cell.userLetter !== cell.letter) {
                cell.incorrect = true;
            } else {
                cell.incorrect = false;
            }
        });
        renderGrid();
    }

    function checkPuzzle() {
        if (gameOver) return;
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const cell = grid[r][c];
                if (cell.isBlack || cell.revealed) continue;
                cell.checked = true;
                if (cell.userLetter && cell.userLetter !== cell.letter) {
                    cell.incorrect = true;
                } else {
                    cell.incorrect = false;
                }
            }
        }
        renderGrid();
    }

    function toggleAutocheck() {
        autocheck = !autocheck;
        const el = document.getElementById('cw-autocheck-item');
        if (el) el.textContent = autocheck ? '✓ Autocheck' : 'Autocheck';
        if (autocheck) checkPuzzle();
    }

    // ---- Reveal functions ----
    function revealSquare() {
        if (!selectedCell || gameOver) return;
        const cell = grid[selectedCell.r][selectedCell.c];
        if (cell.isBlack) return;
        cell.userLetter = cell.letter;
        cell.revealed = true;
        cell.incorrect = false;
        cell.checked = false;
        renderGrid();
        checkWin();
    }

    function revealWord() {
        if (!selectedCell || gameOver) return;
        const cells = getWordCells();
        cells.forEach(({r, c}) => {
            const cell = grid[r][c];
            cell.userLetter = cell.letter;
            cell.revealed = true;
            cell.incorrect = false;
            cell.checked = false;
        });
        renderGrid();
        checkWin();
    }

    function revealPuzzle() {
        if (gameOver) return;
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const cell = grid[r][c];
                if (cell.isBlack) continue;
                cell.userLetter = cell.letter;
                cell.revealed = true;
                cell.incorrect = false;
                cell.checked = false;
            }
        }
        renderGrid();
        checkWin();
    }

    function createBoard() {
        const container = document.getElementById('crossword-game');
        container.innerHTML = `
            <h1 class="cw-title">Mini Crossword</h1>
            <div class="cw-toolbar">
                <div class="cw-timer" id="cw-timer">0:00</div>
                <div class="cw-dropdown-group">
                    <div class="cw-dropdown">
                        <button class="cw-dropdown-btn" id="cw-check-btn">Check ▾</button>
                        <div class="cw-dropdown-menu" id="cw-check-menu">
                            <div class="cw-dropdown-item" id="cw-check-square">Check Square</div>
                            <div class="cw-dropdown-item" id="cw-check-word">Check Word</div>
                            <div class="cw-dropdown-item" id="cw-check-puzzle">Check Puzzle</div>
                            <div class="cw-dropdown-divider"></div>
                            <div class="cw-dropdown-item" id="cw-autocheck-item">Autocheck</div>
                        </div>
                    </div>
                    <div class="cw-dropdown">
                        <button class="cw-dropdown-btn" id="cw-reveal-btn">Reveal ▾</button>
                        <div class="cw-dropdown-menu" id="cw-reveal-menu">
                            <div class="cw-dropdown-item" id="cw-reveal-square">Reveal Square</div>
                            <div class="cw-dropdown-item" id="cw-reveal-word">Reveal Word</div>
                            <div class="cw-dropdown-item" id="cw-reveal-puzzle">Reveal Puzzle</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cw-board" id="cw-board" style="grid-template-columns: repeat(${GRID_SIZE}, 1fr);"></div>
            <div class="cw-clues" id="cw-clues"></div>
            <button class="next-puzzle-btn" id="cw-next">Next Puzzle</button>
        `;

        // Dropdown toggle logic
        setupDropdown('cw-check-btn', 'cw-check-menu');
        setupDropdown('cw-reveal-btn', 'cw-reveal-menu');

        // Check menu items
        document.getElementById('cw-check-square').addEventListener('click', () => { checkSquare(); closeDropdowns(); });
        document.getElementById('cw-check-word').addEventListener('click', () => { checkWord(); closeDropdowns(); });
        document.getElementById('cw-check-puzzle').addEventListener('click', () => { checkPuzzle(); closeDropdowns(); });
        document.getElementById('cw-autocheck-item').addEventListener('click', () => { toggleAutocheck(); closeDropdowns(); });

        // Reveal menu items
        document.getElementById('cw-reveal-square').addEventListener('click', () => { revealSquare(); closeDropdowns(); });
        document.getElementById('cw-reveal-word').addEventListener('click', () => { revealWord(); closeDropdowns(); });
        document.getElementById('cw-reveal-puzzle').addEventListener('click', () => { revealPuzzle(); closeDropdowns(); });

        renderGrid();
        renderClues();
        startTimer();

        document.getElementById('cw-next').addEventListener('click', initGame);

        // Close dropdowns when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cw-dropdown')) closeDropdowns();
        });
    }

    function setupDropdown(btnId, menuId) {
        document.getElementById(btnId).addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = document.getElementById(menuId);
            const wasOpen = menu.classList.contains('open');
            closeDropdowns();
            if (!wasOpen) menu.classList.add('open');
        });
    }

    function closeDropdowns() {
        document.querySelectorAll('.cw-dropdown-menu').forEach(m => m.classList.remove('open'));
    }

    function renderGrid() {
        const boardEl = document.getElementById('cw-board');
        boardEl.innerHTML = '';
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const cell = grid[r][c];
                const div = document.createElement('div');
                let cls = 'cw-cell';
                if (cell.isBlack) cls += ' black';
                if (cell.revealed) cls += ' revealed-cell';
                if (cell.incorrect) cls += ' incorrect-cell';
                div.className = cls;
                div.dataset.row = r;
                div.dataset.col = c;

                if (!cell.isBlack) {
                    if (cell.number) {
                        const numSpan = document.createElement('span');
                        numSpan.className = 'cw-cell-number';
                        numSpan.textContent = cell.number;
                        div.appendChild(numSpan);
                    }
                    const letterSpan = document.createElement('span');
                    letterSpan.className = 'cw-cell-letter';
                    letterSpan.textContent = cell.userLetter;
                    div.appendChild(letterSpan);
                    div.addEventListener('click', () => selectCell(r, c));
                }
                boardEl.appendChild(div);
            }
        }
        highlightCells();
    }

    function renderClues() {
        const cluesEl = document.getElementById('cw-clues');
        cluesEl.innerHTML = `
            <div class="cw-clue-section"><h3>Across</h3><div id="cw-across-clues"></div></div>
            <div class="cw-clue-section"><h3>Down</h3><div id="cw-down-clues"></div></div>
        `;
        const acrossDiv = document.getElementById('cw-across-clues');
        for (const [num, clue] of Object.entries(puzzle.acrossClues)) {
            const div = document.createElement('div');
            div.className = 'cw-clue';
            div.dataset.num = num;
            div.dataset.dir = 'across';
            div.innerHTML = `<span class="cw-clue-num">${num}.</span> ${clue}`;
            div.addEventListener('click', () => {
                direction = 'across';
                for (let r = 0; r < GRID_SIZE; r++) for (let c = 0; c < GRID_SIZE; c++) if (grid[r][c].number == num) { selectCell(r, c); return; }
            });
            acrossDiv.appendChild(div);
        }
        const downDiv = document.getElementById('cw-down-clues');
        for (const [num, clue] of Object.entries(puzzle.downClues)) {
            const div = document.createElement('div');
            div.className = 'cw-clue';
            div.dataset.num = num;
            div.dataset.dir = 'down';
            div.innerHTML = `<span class="cw-clue-num">${num}.</span> ${clue}`;
            div.addEventListener('click', () => {
                direction = 'down';
                for (let r = 0; r < GRID_SIZE; r++) for (let c = 0; c < GRID_SIZE; c++) if (grid[r][c].number == num) { selectCell(r, c); return; }
            });
            downDiv.appendChild(div);
        }
    }

    function selectCell(r, c) {
        if (grid[r][c].isBlack || gameOver) return;
        if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
            direction = direction === 'across' ? 'down' : 'across';
        }
        selectedCell = { r, c };
        highlightCells();
    }

    function highlightCells() {
        document.querySelectorAll('.cw-cell').forEach(el => el.classList.remove('selected', 'highlighted'));
        document.querySelectorAll('.cw-clue').forEach(el => el.classList.remove('active-clue'));
        if (!selectedCell) return;
        const { r, c } = selectedCell;
        const selEl = document.querySelector(`.cw-cell[data-row="${r}"][data-col="${c}"]`);
        if (selEl) selEl.classList.add('selected');

        const wordCells = getWordCells();
        wordCells.forEach(({r: wr, c: wc}) => {
            if (wr === r && wc === c) return;
            const el = document.querySelector(`.cw-cell[data-row="${wr}"][data-col="${wc}"]`);
            if (el) el.classList.add('highlighted');
        });

        // Highlight clue
        if (direction === 'across') {
            let startC = c;
            while (startC > 0 && !grid[r][startC - 1].isBlack) startC--;
            const startCell = grid[r][startC];
            if (startCell.number) {
                const clueEl = document.querySelector(`.cw-clue[data-num="${startCell.number}"][data-dir="across"]`);
                if (clueEl) clueEl.classList.add('active-clue');
            }
        } else {
            let startR = r;
            while (startR > 0 && !grid[startR - 1][c].isBlack) startR--;
            const startCell = grid[startR][c];
            if (startCell.number) {
                const clueEl = document.querySelector(`.cw-clue[data-num="${startCell.number}"][data-dir="down"]`);
                if (clueEl) clueEl.classList.add('active-clue');
            }
        }
    }

    function handleKeyInput(key) {
        if (!selectedCell || gameOver) return;
        const { r, c } = selectedCell;
        if (key === 'Backspace') {
            if (grid[r][c].userLetter) {
                grid[r][c].userLetter = '';
                grid[r][c].incorrect = false;
                grid[r][c].checked = false;
                renderGrid();
            } else {
                if (direction === 'across' && c > 0 && !grid[r][c-1].isBlack) {
                    selectedCell = { r, c: c - 1 };
                    grid[r][c-1].userLetter = '';
                    grid[r][c-1].incorrect = false;
                    renderGrid();
                } else if (direction === 'down' && r > 0 && !grid[r-1][c].isBlack) {
                    selectedCell = { r: r - 1, c };
                    grid[r-1][c].userLetter = '';
                    grid[r-1][c].incorrect = false;
                    renderGrid();
                }
            }
        } else if (/^[a-zA-Z]$/.test(key)) {
            const cell = grid[r][c];
            if (cell.revealed) {
                // Skip to next cell
                if (direction === 'across') {
                    let nc = c + 1;
                    while (nc < GRID_SIZE && grid[r][nc].isBlack) nc++;
                    if (nc < GRID_SIZE) selectedCell = { r, c: nc };
                } else {
                    let nr = r + 1;
                    while (nr < GRID_SIZE && grid[nr][c].isBlack) nr++;
                    if (nr < GRID_SIZE) selectedCell = { r: nr, c };
                }
                renderGrid();
                return;
            }
            cell.userLetter = key.toUpperCase();
            cell.incorrect = false;
            cell.checked = false;

            // Autocheck
            if (autocheck) {
                cell.checked = true;
                if (cell.userLetter !== cell.letter) {
                    cell.incorrect = true;
                }
            }

            // Advance
            if (direction === 'across') {
                let nc = c + 1;
                while (nc < GRID_SIZE && grid[r][nc].isBlack) nc++;
                if (nc < GRID_SIZE) selectedCell = { r, c: nc };
            } else {
                let nr = r + 1;
                while (nr < GRID_SIZE && grid[nr][c].isBlack) nr++;
                if (nr < GRID_SIZE) selectedCell = { r: nr, c };
            }
            renderGrid();
            checkWin();
        } else if (key === 'Tab') {
            direction = direction === 'across' ? 'down' : 'across';
            highlightCells();
        }
    }

    function checkWin() {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (!grid[r][c].isBlack && grid[r][c].userLetter !== grid[r][c].letter) return;
            }
        }
        gameOver = true;
        pauseTimer();
        document.querySelectorAll('.cw-cell:not(.black)').forEach(el => {
            el.style.background = '#a0c35a';
            el.classList.remove('selected', 'highlighted');
        });
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        showToast(`Solved in ${mins}:${secs.toString().padStart(2, '0')}!`);
    }

    // ---- Timer: only runs when crossword tab is active ----
    function tickTimer() {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const el = document.getElementById('cw-timer');
        if (el) el.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        pauseTimer();
        seconds = 0;
        const activeGame = document.querySelector('.tab-btn.active')?.dataset.game;
        if (activeGame === 'crossword') {
            timerActive = true;
            timerInterval = setInterval(tickTimer, 1000);
        }
    }

    function pauseTimer() {
        timerActive = false;
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }

    function resumeTimer() {
        if (gameOver || timerActive) return;
        timerActive = true;
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(tickTimer, 1000);
    }

    // Listen for tab switches to pause/resume timer — use capture to ensure we see it
    document.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.tab-btn');
        if (tabBtn) {
            if (tabBtn.dataset.game === 'crossword') {
                if (!gameOver) resumeTimer();
            } else {
                pauseTimer();
            }
        }
    }, true);

    function initGame() {
        gameOver = false;
        selectedCell = null;
        direction = 'across';
        autocheck = false;
        pickPuzzle();
        buildGrid();
        createBoard();
        // Only start timer if crossword tab is active
        const activeGame = document.querySelector('.tab-btn.active')?.dataset.game;
        if (activeGame !== 'crossword') {
            timerActive = false;
            clearInterval(timerInterval);
        }
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (!grid[r][c].isBlack) { selectCell(r, c); return; }
            }
        }
    }

    // Keyboard listener
    document.addEventListener('keydown', e => {
        const activeGame = document.querySelector('.tab-btn.active')?.dataset.game;
        if (activeGame !== 'crossword') return;
        if (e.key === 'Tab') { e.preventDefault(); handleKeyInput('Tab'); }
        else if (e.key === 'Backspace') { e.preventDefault(); handleKeyInput('Backspace'); }
        else if (e.key === 'ArrowRight') {
            if (selectedCell) { direction = 'across'; let nc = selectedCell.c + 1; while (nc < GRID_SIZE && grid[selectedCell.r][nc].isBlack) nc++; if (nc < GRID_SIZE) { selectedCell.c = nc; highlightCells(); renderGrid(); } }
        } else if (e.key === 'ArrowLeft') {
            if (selectedCell) { direction = 'across'; let nc = selectedCell.c - 1; while (nc >= 0 && grid[selectedCell.r][nc].isBlack) nc--; if (nc >= 0) { selectedCell.c = nc; highlightCells(); renderGrid(); } }
        } else if (e.key === 'ArrowDown') {
            if (selectedCell) { direction = 'down'; let nr = selectedCell.r + 1; while (nr < GRID_SIZE && grid[nr][selectedCell.c].isBlack) nr++; if (nr < GRID_SIZE) { selectedCell.r = nr; highlightCells(); renderGrid(); } }
        } else if (e.key === 'ArrowUp') {
            if (selectedCell) { direction = 'down'; let nr = selectedCell.r - 1; while (nr >= 0 && grid[nr][selectedCell.c].isBlack) nr--; if (nr >= 0) { selectedCell.r = nr; highlightCells(); renderGrid(); } }
        } else if (/^[a-zA-Z]$/.test(e.key)) { handleKeyInput(e.key); }
    });

    initGame();
})();
