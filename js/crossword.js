// ============ CROSSWORD GAME ============
(function() {
    let GRID_SIZE = 15;
    let puzzle = null;
    let grid = [];
    let selectedCell = null;
    let direction = 'across';
    let timerInterval = null;
    let seconds = 0;
    let gameOver = false;
    let timerActive = false;
    let autocheck = false;

    let allPuzzles = [];
    let puzzlesLoaded = false;
    let puzzleIndex = -1;

    // Load puzzles from data/crosswords.json
    function loadPuzzles() {
        return fetch('data/crosswords.json')
            .then(resp => {
                if (!resp.ok) throw new Error('Failed to load crosswords.json');
                return resp.json();
            })
            .then(data => {
                allPuzzles = data;
                puzzlesLoaded = true;
                console.log(`Loaded ${allPuzzles.length} crossword puzzles.`);
            })
            .catch(err => {
                console.error('Error loading crossword puzzles:', err);
                // Fallback: use inline mini puzzle
                allPuzzles = [getFallbackPuzzle()];
                puzzlesLoaded = true;
            });
    }

    function getFallbackPuzzle() {
        return {
            size: 5,
            grid: [
                ['G','A','I','N','S'],
                ['A','S','S','E','T'],
                ['I','S','#','W','E'],
                ['N','E','W','E','R'],
                ['S','T','E','R','N'],
            ],
            acrossClues: { 1: "Profits", 6: "Valuable item", 7: "Exists", 8: "Together pronoun", 9: "More recent", 11: "Strict" },
            downClues: { 1: "Profits", 2: "Valuable item", 3: "Exists", 4: "More recent", 5: "Strict", 10: "Together pronoun" }
        };
    }

    function pickPuzzle() {
        if (allPuzzles.length === 0) {
            puzzle = getFallbackPuzzle();
        } else {
            puzzleIndex = Math.floor(Math.random() * allPuzzles.length);
            puzzle = allPuzzles[puzzleIndex];
        }
        GRID_SIZE = puzzle.size || puzzle.grid.length;
    }

    function buildGrid() {
        grid = [];
        let num = 1;
        for (let r = 0; r < GRID_SIZE; r++) {
            const row = [];
            for (let c = 0; c < GRID_SIZE; c++) {
                const ch = puzzle.grid[r][c];
                const isBlack = ch === '#' || ch === null;
                let cellNum = null;
                if (!isBlack) {
                    const needsAcross = (c === 0 || puzzle.grid[r][c-1] === '#' || puzzle.grid[r][c-1] === null) &&
                                        c < GRID_SIZE - 1 && puzzle.grid[r][c+1] !== '#' && puzzle.grid[r][c+1] !== null;
                    const needsDown = (r === 0 || puzzle.grid[r-1][c] === '#' || puzzle.grid[r-1][c] === null) &&
                                      r < GRID_SIZE - 1 && puzzle.grid[r+1][c] !== '#' && puzzle.grid[r+1][c] !== null;
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
        if (el) el.textContent = autocheck ? '\u2713 Autocheck' : 'Autocheck';
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
        const titleText = GRID_SIZE <= 7 ? 'Mini Crossword' : 'Crossword';
        const puzzleInfo = puzzle.title ? `<div class="cw-puzzle-info">${puzzle.title}${puzzle.author ? ' by ' + puzzle.author : ''}</div>` : '';

        container.innerHTML = `
            <h1 class="cw-title">${titleText}</h1>
            ${puzzleInfo}
            <div class="cw-toolbar">
                <div class="cw-timer" id="cw-timer">0:00</div>
                <div class="cw-dropdown-group">
                    <div class="cw-dropdown">
                        <button class="cw-dropdown-btn" id="cw-check-btn">Check \u25be</button>
                        <div class="cw-dropdown-menu" id="cw-check-menu">
                            <div class="cw-dropdown-item" id="cw-check-square">Check Square</div>
                            <div class="cw-dropdown-item" id="cw-check-word">Check Word</div>
                            <div class="cw-dropdown-item" id="cw-check-puzzle">Check Puzzle</div>
                            <div class="cw-dropdown-divider"></div>
                            <div class="cw-dropdown-item" id="cw-autocheck-item">Autocheck</div>
                        </div>
                    </div>
                    <div class="cw-dropdown">
                        <button class="cw-dropdown-btn" id="cw-reveal-btn">Reveal \u25be</button>
                        <div class="cw-dropdown-menu" id="cw-reveal-menu">
                            <div class="cw-dropdown-item" id="cw-reveal-square">Reveal Square</div>
                            <div class="cw-dropdown-item" id="cw-reveal-word">Reveal Word</div>
                            <div class="cw-dropdown-item" id="cw-reveal-puzzle">Reveal Puzzle</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cw-board-wrapper">
                <div class="cw-board cw-board-${GRID_SIZE}" id="cw-board" style="grid-template-columns: repeat(${GRID_SIZE}, 1fr);"></div>
            </div>
            <div class="cw-active-clue" id="cw-active-clue"></div>
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

    function getActiveClueNumber() {
        if (!selectedCell) return null;
        const { r, c } = selectedCell;
        if (direction === 'across') {
            let startC = c;
            while (startC > 0 && !grid[r][startC - 1].isBlack) startC--;
            return grid[r][startC].number;
        } else {
            let startR = r;
            while (startR > 0 && !grid[startR - 1][c].isBlack) startR--;
            return grid[startR][c].number;
        }
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

        // Highlight clue in list
        const clueNum = getActiveClueNumber();
        if (clueNum) {
            const clueEl = document.querySelector(`.cw-clue[data-num="${clueNum}"][data-dir="${direction}"]`);
            if (clueEl) {
                clueEl.classList.add('active-clue');
                // Scroll clue into view
                clueEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }

            // Update active clue bar
            const activeClueEl = document.getElementById('cw-active-clue');
            if (activeClueEl) {
                const clueSource = direction === 'across' ? puzzle.acrossClues : puzzle.downClues;
                const clueText = clueSource[clueNum] || '';
                activeClueEl.textContent = `${clueNum} ${direction.charAt(0).toUpperCase() + direction.slice(1)}: ${clueText}`;
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

    // Listen for tab switches to pause/resume timer -- use capture to ensure we see it
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

    // Load puzzles then init
    loadPuzzles().then(() => {
        initGame();
    });
})();
