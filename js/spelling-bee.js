// ============ SPELLING BEE GAME ============
(function() {
    let allWords = [];
    let centerLetter = '';
    let outerLetters = [];
    let validWords = new Set();
    let foundWords = [];
    let score = 0;
    let maxScore = 0;
    let currentInput = '';
    let puzzleLetters = [];

    async function loadWords() {
        try {
            const resp = await fetch('data/wordle_words.txt');
            const text = await resp.text();
            allWords = text.trim().split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length >= 4);
        } catch(e) {
            allWords = ["able","acid","also","area","army","away","baby","back","ball","band","bank","base","bath","bear","beat","been","beer","bell","best","bill","bird","bite","blow","blue","boat","body","bomb","bond","bone","book","born","boss","both","burn","bush","busy","call","calm","came","camp","card","care","case","cash","cast","cell","chat","chip","city","club","coal","coat","code","cold","come","cook","cool","cope","copy","core","cost","crew","crop","dark","data","date","dawn","dead","deal","dear","debt","deep","deny","desk","diet","dirt","dish","disk","does","done","door","dose","down","draw","drew","drop","drug","drum","dual","duke","dust","duty","each","earn","ease","east","easy","edge","else","even","ever","evil","exam","face","fact","fail","fair","fall","fame","farm","fast","fate","fear","feed","feel","feet","fell","file","fill","film","find","fine","fire","firm","fish","five","flag","flat","flow","folk","food","fool","foot","ford","form","fort","found","four","free","from","fuel","full","fund","gain","game","gang","gate","gave","gene","gift","girl","give","glad","goal","goes","gold","golf","gone","good","grab","gray","grew","grow","gulf","guru","hair","half","hall","hand","hang","hard","harm","hate","have","head","hear","heat","held","hell","help","here","hero","hide","high","hill","hint","hire","hold","hole","holy","home","hope","host","hour","huge","hung","hunt","hurt","idea","inch","into","iron","item","jack","jane","jean","join","joke","jump","june","jury","just","keen","keep","kent","kept","kick","kill","kind","king","knee","knew","know","lack","lady","laid","lake","land","lane","last","late","lead","left","less","lied","life","lift","like","line","link","list","live","loan","lock","long","look","lord","lose","loss","lost","love","luck","made","mail","main","make","male","many","mark","mass","match","mate","meal","mean","meat","meet","mile","mill","mind","mine","miss","mode","mood","moon","more","most","move","much","must","myth","name","navy","near","neat","neck","need","news","next","nice","nine","none","nose","note","null","odds","okay","once","only","onto","open","oral","over","pace","pack","page","paid","pain","pair","pale","palm","panel","park","part","pass","past","path","peak","peer","pick","pile","pine","pink","pipe","plan","play","plot","plus","poem","poet","pole","poll","pool","poor","pope","port","pose","post","pour","pray","pull","pure","push","quite","race","rage","rain","rank","rare","rate","read","real","rear","rely","rent","rest","rich","ride","ring","rise","risk","road","rock","rode","role","roll","roof","room","root","rope","rose","rule","rush","ruth","safe","said","sake","sale","salt","same","sand","sang","save","seal","seat","seed","seek","seem","seen","self","sell","send","sent","sept","ship","shop","shot","show","shut","sick","side","sign","silk","site","size","skin","slip","slow","snap","snow","soft","soil","sold","sole","some","song","soon","sort","soul","spot","star","stay","stem","step","stop","such","suit","sure","swim","tail","take","tale","talk","tall","tank","tape","task","team","tech","tell","tend","tent","term","test","text","than","that","them","then","they","thin","tied","till","time","tiny","tips","tire","told","toll","tone","took","tool","tops","tore","torn","tour","town","tree","trim","trip","true","tube","tune","turn","twin","type","ugly","unit","upon","used","user","vale","vast","very","vice","view","vote","wage","wait","wake","walk","wall","want","ward","warm","warn","wash","wave","weak","wear","week","well","went","were","west","what","when","whom","wide","wife","wild","will","wind","wine","wing","wire","wise","wish","with","wood","word","wore","work","worm","worn","wrap","yard","yeah","year","your","zero","zone"];
        }
    }

    function generatePuzzle() {
        // Pick 7 unique letters that form many valid words
        let bestLetters = null;
        let bestCenter = null;
        let bestValidWords = [];
        let bestScore = 0;

        for (let attempt = 0; attempt < 100; attempt++) {
            // Pick a random word and extract unique letters
            const seedWord = allWords[Math.floor(Math.random() * allWords.length)];
            const uniqueLetters = [...new Set(seedWord.split(''))];
            if (uniqueLetters.length < 4) continue;

            // If word has exactly 7 unique letters, use those
            let letters;
            if (uniqueLetters.length === 7) {
                letters = uniqueLetters;
            } else if (uniqueLetters.length > 7) {
                letters = uniqueLetters.slice(0, 7);
            } else {
                // Add random letters to get to 7
                const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
                const remaining = alphabet.filter(l => !uniqueLetters.includes(l));
                letters = [...uniqueLetters];
                while (letters.length < 7) {
                    letters.push(remaining.splice(Math.floor(Math.random() * remaining.length), 1)[0]);
                }
            }

            const center = letters[Math.floor(Math.random() * letters.length)];
            const letterSet = new Set(letters);

            // Find all valid words
            const valid = allWords.filter(w => {
                if (w.length < 4) return false;
                if (!w.includes(center)) return false;
                return w.split('').every(ch => letterSet.has(ch));
            });

            const totalScore = valid.reduce((s, w) => s + scoreWord(w, letters), 0);
            if (valid.length >= 10 && totalScore > bestScore) {
                bestLetters = letters;
                bestCenter = center;
                bestValidWords = valid;
                bestScore = totalScore;
            }
        }

        if (!bestLetters) {
            // Emergency fallback
            bestLetters = ['p','a','n','g','r','i','m'];
            bestCenter = 'r';
            bestValidWords = allWords.filter(w => {
                if (w.length < 4) return false;
                if (!w.includes('r')) return false;
                return w.split('').every(ch => new Set(bestLetters).has(ch));
            });
            bestScore = bestValidWords.reduce((s, w) => s + scoreWord(w, bestLetters), 0);
        }

        centerLetter = bestCenter;
        outerLetters = bestLetters.filter(l => l !== bestCenter);
        puzzleLetters = [centerLetter, ...outerLetters];
        validWords = new Set(bestValidWords);
        maxScore = bestScore;
        foundWords = [];
        score = 0;
        currentInput = '';
    }

    function scoreWord(word, letters) {
        if (word.length === 4) return 1;
        let s = word.length;
        // Pangram bonus: uses all 7 letters
        const letterSet = new Set(letters);
        if (new Set(word.split('')).size >= 7 && word.split('').every(ch => letterSet.has(ch)) && letterSet.size <= new Set(word.split('')).size) {
            const wordLetters = new Set(word.split(''));
            if ([...letterSet].every(l => wordLetters.has(l))) {
                s += 7;
            }
        }
        return s;
    }

    function getRank() {
        const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
        if (pct >= 100) return 'Queen Bee';
        if (pct >= 70) return 'Genius';
        if (pct >= 50) return 'Amazing';
        if (pct >= 40) return 'Great';
        if (pct >= 25) return 'Nice';
        if (pct >= 15) return 'Solid';
        if (pct >= 8) return 'Good';
        if (pct >= 2) return 'Moving Up';
        return 'Beginner';
    }

    function createBoard() {
        const container = document.getElementById('spelling-bee-game');
        container.innerHTML = `
            <h1 class="sb-title">Spelling Bee</h1>
            <div class="sb-score" id="sb-score">Score: 0</div>
            <div class="sb-rank" id="sb-rank">Beginner</div>
            <div class="sb-progress-bar"><div class="sb-progress-fill" id="sb-progress" style="width: 0%"></div></div>
            <div class="sb-found-words" id="sb-found"></div>
            <div class="sb-input-area">
                <div class="sb-input" id="sb-input"></div>
            </div>
            <div class="honeycomb" id="sb-honeycomb"></div>
            <div class="sb-controls">
                <button class="sb-btn" id="sb-delete">Delete</button>
                <button class="sb-btn" id="sb-shuffle-btn">⟳</button>
                <button class="sb-btn enter-btn" id="sb-enter">Enter</button>
            </div>
            <button class="next-puzzle-btn" id="sb-next">Next Puzzle</button>
        `;

        renderHoneycomb();
        updateDisplay();

        document.getElementById('sb-delete').addEventListener('click', () => {
            currentInput = currentInput.slice(0, -1);
            renderInput();
        });
        document.getElementById('sb-shuffle-btn').addEventListener('click', () => {
            outerLetters = shuffleArray(outerLetters);
            renderHoneycomb();
        });
        document.getElementById('sb-enter').addEventListener('click', submitWord);
        document.getElementById('sb-next').addEventListener('click', initGame);
    }

    function renderHoneycomb() {
        const hc = document.getElementById('sb-honeycomb');
        if (!hc) return;
        hc.innerHTML = `
            <div class="hex-row">
                <button class="hex-btn" data-letter="${outerLetters[0]}">${outerLetters[0]}</button>
                <button class="hex-btn" data-letter="${outerLetters[1]}">${outerLetters[1]}</button>
            </div>
            <div class="hex-row">
                <button class="hex-btn" data-letter="${outerLetters[2]}">${outerLetters[2]}</button>
                <button class="hex-btn center" data-letter="${centerLetter}">${centerLetter}</button>
                <button class="hex-btn" data-letter="${outerLetters[3]}">${outerLetters[3]}</button>
            </div>
            <div class="hex-row">
                <button class="hex-btn" data-letter="${outerLetters[4]}">${outerLetters[4]}</button>
                <button class="hex-btn" data-letter="${outerLetters[5]}">${outerLetters[5]}</button>
            </div>
        `;

        hc.querySelectorAll('.hex-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentInput += btn.dataset.letter;
                renderInput();
            });
        });
    }

    function renderInput() {
        const inputEl = document.getElementById('sb-input');
        if (!inputEl) return;
        inputEl.innerHTML = currentInput.split('').map(ch =>
            `<span class="${ch === centerLetter ? 'center-letter' : ''}">${ch.toUpperCase()}</span>`
        ).join('');
    }

    function submitWord() {
        const word = currentInput.toLowerCase();
        currentInput = '';
        renderInput();

        if (word.length < 4) {
            showToast('Too short');
            return;
        }
        if (!word.includes(centerLetter)) {
            showToast('Missing center letter');
            return;
        }
        const letterSet = new Set(puzzleLetters);
        if (!word.split('').every(ch => letterSet.has(ch))) {
            showToast('Bad letters');
            return;
        }
        if (foundWords.includes(word)) {
            showToast('Already found');
            return;
        }
        if (!validWords.has(word)) {
            showToast('Not in word list');
            return;
        }

        foundWords.push(word);
        const pts = scoreWord(word, puzzleLetters);
        score += pts;

        // Check pangram
        const wordLetters = new Set(word.split(''));
        const allUsed = puzzleLetters.every(l => wordLetters.has(l));
        if (allUsed) {
            showToast('Pangram! +' + pts);
        } else if (pts === 1) {
            showToast('Nice! +1');
        } else {
            showToast('+' + pts);
        }

        updateDisplay();
    }

    function updateDisplay() {
        const scoreEl = document.getElementById('sb-score');
        const rankEl = document.getElementById('sb-rank');
        const progressEl = document.getElementById('sb-progress');
        const foundEl = document.getElementById('sb-found');
        if (!scoreEl) return;

        scoreEl.textContent = `Score: ${score}`;
        rankEl.textContent = getRank();
        const pct = maxScore > 0 ? Math.min(100, (score / maxScore) * 100) : 0;
        progressEl.style.width = pct + '%';

        foundEl.innerHTML = foundWords.sort().map(w => `<span>${w}</span>`).join('');
    }

    function initGame() {
        generatePuzzle();
        createBoard();
    }

    // Keyboard listener
    document.addEventListener('keydown', e => {
        const activeGame = document.querySelector('.tab-btn.active')?.dataset.game;
        if (activeGame !== 'spelling-bee') return;
        if (e.key === 'Enter') submitWord();
        else if (e.key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
            renderInput();
        }
        else if (/^[a-zA-Z]$/.test(e.key)) {
            const letter = e.key.toLowerCase();
            if (puzzleLetters.includes(letter)) {
                currentInput += letter;
                renderInput();
            }
        }
    });

    loadWords().then(() => initGame());
})();
