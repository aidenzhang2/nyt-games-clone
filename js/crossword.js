// ============ MINI CROSSWORD GAME ============
(function() {
    const GRID_SIZE = 5;
    let puzzle = null;
    let grid = []; // 2D array of {letter, number, isBlack, userLetter}
    let selectedCell = null; // {r, c}
    let direction = 'across'; // 'across' or 'down'
    let timerInterval = null;
    let seconds = 0;
    let gameOver = false;

    // Pre-built mini crossword puzzles
    const puzzles = [
        {
            grid: [
                ['S','T','A','R','S'],
                ['H','A','I','L','S'],
                ['A','L','I','V','E'],
                ['R','E','S','E','T'],
                ['P','D','#','E','S']
            ],
            acrossClues: {
                1: "Twinkle in the sky",
                6: "Greets with pelting ice",
                7: "Not dead",
                8: "Start over button",
                9: "Police department (abbr.)"
            },
            downClues: {
                1: "Keen, like a blade",
                2: "Stories, anecdotes",
                3: "Wing of a building",
                4: "Peeled fruit's remains",
                5: "Plural of 'is' (archaic)"
            }
        },
        {
            grid: [
                ['C','R','A','N','E'],
                ['L','I','V','E','D'],
                ['A','N','#','A','R'],
                ['S','G','R','I','P'],
                ['P','S','A','N','E']
            ],
            acrossClues: {
                1: "Construction site machine",
                6: "Existed in the past",
                7: "Sound system (abbr.)",
                8: "Hold on tight",
                9: "Mentally sound"
            },
            downClues: {
                1: "Fastener, buckle",
                2: "Jewelry hoops",
                3: "Normal",
                4: "Small bite",
                5: "Dry, parched"
            }
        },
        {
            grid: [
                ['B','R','A','V','E'],
                ['L','I','D','E','A'],
                ['O','N','#','G','R'],
                ['C','E','A','S','E'],
                ['K','D','T','E','D']
            ],
            acrossClues: {
                1: "Courageous",
                6: "Concept, thought",
                7: "Switch position",
                8: "Stop, desist",
                9: "Bored, tired"
            },
            downClues: {
                1: "City section",
                2: "Horseback riders",
                3: "Past tense of eat",
                4: "Big bird of Australia",
                5: "Feared, was afraid"
            }
        },
        {
            grid: [
                ['F','L','A','R','E'],
                ['L','I','N','E','S'],
                ['A','D','#','A','T'],
                ['S','G','R','I','T'],
                ['H','E','A','R','S']
            ],
            acrossClues: {
                1: "Signal light, burst",
                6: "Rows, queues",
                7: "Promotion (abbr.)",
                8: "Determination, sand",
                9: "Perceives sound"
            },
            downClues: {
                1: "Camera burst",
                2: "Loitered",
                3: "Part of the ear",
                4: "Brings up children",
                5: "Eastern, oriental"
            }
        },
        {
            grid: [
                ['G','R','A','S','P'],
                ['R','A','D','A','R'],
                ['A','C','#','L','I'],
                ['N','E','M','E','N'],
                ['D','S','A','D','S']
            ],
            acrossClues: {
                1: "Understand, seize",
                6: "Detection system",
                7: "Air conditioning (abbr.)",
                8: "Foes, adversaries",
                9: "Fathers, papas"
            },
            downClues: {
                1: "Big, impressive",
                2: "Running contests",
                3: "Canine friends",
                4: "Bargain events",
                5: "Skin irritation"
            }
        },
        {
            grid: [
                ['P','L','A','N','T'],
                ['R','O','N','E','S'],
                ['I','C','#','W','H'],
                ['Z','K','I','N','G'],
                ['E','S','T','S','S']
            ],
            acrossClues: {
                1: "Vegetation, factory",
                6: "Solitary figures",
                7: "In the area of",
                8: "Chess piece, monarch",
                9: "Tests, exams"
            },
            downClues: {
                1: "Award, trophy",
                2: "Securing devices",
                3: "Opposite of out",
                4: "Reports, bulletins",
                5: "Marks with a pen"
            }
        },
        {
            grid: [
                ['S','P','I','C','E'],
                ['T','O','N','E','D'],
                ['O','R','#','A','R'],
                ['R','E','F','R','I'],
                ['E','S','T','S','P']
            ],
            acrossClues: {
                1: "Cinnamon or pepper",
                6: "Muscular, fit",
                7: "Either ___",
                8: "Cooling appliance part",
                9: "Water dripping sound"
            },
            downClues: {
                1: "Retail outlets",
                2: "Preface, intro",
                3: "Breathe in deeply",
                4: "Vehicle types",
                5: "Drenched",
            }
        },
        {
            grid: [
                ['W','H','A','L','E'],
                ['H','A','N','D','S'],
                ['I','T','#','G','O'],
                ['T','E','A','R','S'],
                ['E','S','K','I','P']
            ],
            acrossClues: {
                1: "Ocean mammal",
                6: "Appendages for gripping",
                7: "Give ___ (concede)",
                8: "Drops from crying",
                9: "Jump over, omit"
            },
            downClues: {
                1: "Pale, blanched",
                2: "Despises, loathes",
                3: "Inquired, requested",
                4: "Ledges, borders",
                5: "Trachea, windpipe"
            }
        },
        {
            grid: [
                ['T','R','A','I','L'],
                ['H','A','N','G','S'],
                ['A','N','#','N','O'],
                ['W','K','I','N','D'],
                ['S','S','T','E','W']
            ],
            acrossClues: {
                1: "Path in the woods",
                6: "Suspends, dangles",
                7: "Year (abbr.)",
                8: "Sort, variety",
                9: "Slow-cooked dish"
            },
            downClues: {
                1: "Unfreezing",
                2: "Higher position",
                3: "Within, inside",
                4: "Signals, notices",
                5: "Relaxed pace"
            }
        },
        {
            grid: [
                ['S','C','O','R','E'],
                ['H','O','P','E','D'],
                ['A','R','#','A','R'],
                ['L','N','I','C','E'],
                ['E','S','T','E','S']
            ],
            acrossClues: {
                1: "Points in a game",
                6: "Wished, desired",
                7: "Doctor's title",
                8: "Pleasant, friendly",
                9: "Appraisals, guesses"
            },
            downClues: {
                1: "Beach footwear",
                2: "Maize, grain",
                3: "Opinion, view",
                4: "Compete in a contest",
                5: "Protector, guard"
            }
        },
        {
            grid: [
                ['D','R','I','V','E'],
                ['R','I','N','S','E'],
                ['A','N','#','T','A'],
                ['I','K','O','A','R'],
                ['N','S','N','L','S']
            ],
            acrossClues: {
                1: "Operate a car",
                6: "Wash lightly",
                7: "Peppercorn (abbr.)",
                8: "Swedish furniture store",
                9: "Barns, sheds"
            },
            downClues: {
                1: "Emptying, depleting",
                2: "Coloring agents",
                3: "Not off",
                4: "Salt water bodies",
                5: "Appendages for hearing"
            }
        },
        {
            grid: [
                ['B','L','A','Z','E'],
                ['R','E','N','E','W'],
                ['I','A','#','R','A'],
                ['D','R','U','L','E'],
                ['E','N','T','S','S']
            ],
            acrossClues: {
                1: "Roaring fire",
                6: "Extend a subscription",
                7: "Study, field",
                8: "Govern, regulation",
                9: "Beginnings, starts"
            },
            downClues: {
                1: "Wedding attendant",
                2: "Knowledge gained",
                3: "Specialized group",
                4: "Animal lairs",
                5: "Canvas shelters"
            }
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
                    if (needsAcross || needsDown) {
                        cellNum = num++;
                    }
                }

                row.push({
                    letter: isBlack ? '' : ch.toUpperCase(),
                    number: cellNum,
                    isBlack,
                    userLetter: ''
                });
            }
            grid.push(row);
        }
    }

    function createBoard() {
        const container = document.getElementById('crossword-game');
        container.innerHTML = `
            <h1 class="cw-title">Mini Crossword</h1>
            <div class="cw-timer" id="cw-timer">0:00</div>
            <div class="cw-board" id="cw-board" style="grid-template-columns: repeat(${GRID_SIZE}, 1fr);"></div>
            <div class="cw-clues" id="cw-clues"></div>
            <button class="next-puzzle-btn" id="cw-next">Next Puzzle</button>
        `;

        renderGrid();
        renderClues();
        startTimer();

        document.getElementById('cw-next').addEventListener('click', initGame);
    }

    function renderGrid() {
        const boardEl = document.getElementById('cw-board');
        boardEl.innerHTML = '';

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const cell = grid[r][c];
                const div = document.createElement('div');
                div.className = 'cw-cell' + (cell.isBlack ? ' black' : '');
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
            <div class="cw-clue-section">
                <h3>Across</h3>
                <div id="cw-across-clues"></div>
            </div>
            <div class="cw-clue-section">
                <h3>Down</h3>
                <div id="cw-down-clues"></div>
            </div>
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
                // Find cell with this number
                for (let r = 0; r < GRID_SIZE; r++) {
                    for (let c = 0; c < GRID_SIZE; c++) {
                        if (grid[r][c].number == num) {
                            selectCell(r, c);
                            return;
                        }
                    }
                }
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
                for (let r = 0; r < GRID_SIZE; r++) {
                    for (let c = 0; c < GRID_SIZE; c++) {
                        if (grid[r][c].number == num) {
                            selectCell(r, c);
                            return;
                        }
                    }
                }
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
        // Clear all highlights
        document.querySelectorAll('.cw-cell').forEach(el => {
            el.classList.remove('selected', 'highlighted');
        });
        document.querySelectorAll('.cw-clue').forEach(el => {
            el.classList.remove('active-clue');
        });

        if (!selectedCell) return;
        const { r, c } = selectedCell;

        // Highlight the selected cell
        const selEl = document.querySelector(`.cw-cell[data-row="${r}"][data-col="${c}"]`);
        if (selEl) selEl.classList.add('selected');

        // Highlight the word
        if (direction === 'across') {
            // Find start of across word
            let startC = c;
            while (startC > 0 && !grid[r][startC - 1].isBlack) startC--;
            for (let cc = startC; cc < GRID_SIZE && !grid[r][cc].isBlack; cc++) {
                const el = document.querySelector(`.cw-cell[data-row="${r}"][data-col="${cc}"]`);
                if (el && !(r === selectedCell.r && cc === selectedCell.c)) el.classList.add('highlighted');
            }
            // Highlight clue
            const startCell = grid[r][startC];
            if (startCell.number) {
                const clueEl = document.querySelector(`.cw-clue[data-num="${startCell.number}"][data-dir="across"]`);
                if (clueEl) clueEl.classList.add('active-clue');
            }
        } else {
            let startR = r;
            while (startR > 0 && !grid[startR - 1][c].isBlack) startR--;
            for (let rr = startR; rr < GRID_SIZE && !grid[rr][c].isBlack; rr++) {
                const el = document.querySelector(`.cw-cell[data-row="${rr}"][data-col="${c}"]`);
                if (el && !(rr === selectedCell.r && c === selectedCell.c)) el.classList.add('highlighted');
            }
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
                renderGrid();
            } else {
                // Move back
                if (direction === 'across' && c > 0 && !grid[r][c-1].isBlack) {
                    selectedCell = { r, c: c - 1 };
                    grid[r][c-1].userLetter = '';
                    renderGrid();
                } else if (direction === 'down' && r > 0 && !grid[r-1][c].isBlack) {
                    selectedCell = { r: r - 1, c };
                    grid[r-1][c].userLetter = '';
                    renderGrid();
                }
            }
        } else if (/^[a-zA-Z]$/.test(key)) {
            grid[r][c].userLetter = key.toUpperCase();
            // Advance to next cell
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
                if (!grid[r][c].isBlack && grid[r][c].userLetter !== grid[r][c].letter) {
                    return;
                }
            }
        }
        gameOver = true;
        clearInterval(timerInterval);

        // Highlight all cells green
        document.querySelectorAll('.cw-cell:not(.black)').forEach(el => {
            el.style.background = '#a0c35a';
            el.classList.remove('selected', 'highlighted');
        });

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        showToast(`Solved in ${mins}:${secs.toString().padStart(2, '0')}!`);
    }

    function startTimer() {
        clearInterval(timerInterval);
        seconds = 0;
        timerInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const el = document.getElementById('cw-timer');
            if (el) el.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function initGame() {
        gameOver = false;
        selectedCell = null;
        direction = 'across';
        pickPuzzle();
        buildGrid();
        createBoard();
        // Auto-select first cell
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (!grid[r][c].isBlack) {
                    selectCell(r, c);
                    return;
                }
            }
        }
    }

    // Keyboard listener
    document.addEventListener('keydown', e => {
        const activeGame = document.querySelector('.tab-btn.active')?.dataset.game;
        if (activeGame !== 'crossword') return;
        if (e.key === 'Tab') {
            e.preventDefault();
            handleKeyInput('Tab');
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            handleKeyInput('Backspace');
        } else if (e.key === 'ArrowRight') {
            if (selectedCell) {
                direction = 'across';
                let nc = selectedCell.c + 1;
                while (nc < GRID_SIZE && grid[selectedCell.r][nc].isBlack) nc++;
                if (nc < GRID_SIZE) { selectedCell.c = nc; highlightCells(); renderGrid(); }
            }
        } else if (e.key === 'ArrowLeft') {
            if (selectedCell) {
                direction = 'across';
                let nc = selectedCell.c - 1;
                while (nc >= 0 && grid[selectedCell.r][nc].isBlack) nc--;
                if (nc >= 0) { selectedCell.c = nc; highlightCells(); renderGrid(); }
            }
        } else if (e.key === 'ArrowDown') {
            if (selectedCell) {
                direction = 'down';
                let nr = selectedCell.r + 1;
                while (nr < GRID_SIZE && grid[nr][selectedCell.c].isBlack) nr++;
                if (nr < GRID_SIZE) { selectedCell.r = nr; highlightCells(); renderGrid(); }
            }
        } else if (e.key === 'ArrowUp') {
            if (selectedCell) {
                direction = 'down';
                let nr = selectedCell.r - 1;
                while (nr >= 0 && grid[nr][selectedCell.c].isBlack) nr--;
                if (nr >= 0) { selectedCell.r = nr; highlightCells(); renderGrid(); }
            }
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            handleKeyInput(e.key);
        }
    });

    initGame();
})();
