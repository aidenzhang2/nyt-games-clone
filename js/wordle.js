// ============ WORDLE GAME ============
(function() {
    let wordList = [];
    let validGuesses = new Set();
    let answer = '';
    let currentRow = 0;
    let currentCol = 0;
    let gameOver = false;
    let board = [];
    const NUM_ROWS = 6;
    const NUM_COLS = 5;

    // Load word list
    async function loadWords() {
        try {
            const resp = await fetch('data/wordle_words.txt');
            const text = await resp.text();
            wordList = text.trim().split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length === 5);
            validGuesses = new Set(wordList);
        } catch(e) {
            // Fallback word list
            wordList = ["crane","slate","trace","crate","stare","least","train","arise","about","above","abuse","actor","adapt","admit","adopt","agent","agree","ahead","alarm","album","alert","alien","align","alive","alley","allow","alone","alter","angel","anger","angle","angry","apart","apple","apply","arena","argue","aside","asset","avoid","award","aware","badly","based","basic","beach","began","begin","being","below","bench","birth","black","blade","blame","blank","blast","blaze","bleed","blend","blind","block","blood","bloom","blown","board","bonus","boost","bound","brain","brand","brave","bread","break","breed","brick","brief","bring","broad","broke","brook","brown","brush","build","bunch","burst","buyer","cabin","carry","catch","cause","chain","chair","chaos","charm","chart","chase","cheap","check","cheek","cheer","chess","chest","chief","child","china","chose","chunk","civic","civil","claim","class","clean","clear","climb","cling","clock","close","cloth","cloud","coach","coast","color","comic","coral","could","count","court","cover","crack","craft","crash","crazy","cream","crime","cross","crowd","cruel","crush","curve","cycle","daily","dance","debug","delay","dense","depth","dirty","doubt","dozen","draft","drain","drama","drank","drawn","dream","dress","dried","drift","drill","drink","drive","drone","drops","drove","drunk","dusty","dutch","dwarf","dying","eager","early","earth","eight","elder","elect","elite","empty","enemy","enjoy","enter","equal","error","essay","event","every","exact","exile","exist","extra","faced","faith","false","fancy","fatal","fault","feast","fence","fever","fewer","fiber","field","fifth","fifty","fight","final","first","fixed","flame","flash","flesh","float","flood","floor","flour","flown","fluid","flush","focal","focus","force","forge","forth","forum","found","frame","frank","fraud","fresh","front","frost","fruit","fully","fungi","ghost","giant","given","glass","globe","gloom","glory","glove","going","grace","grade","grain","grand","grant","grape","graph","grasp","grass","grave","great","greek","green","greet","grief","grill","grind","grasp","gross","group","grove","grown","guard","guess","guest","guide","guild","guilt","habit","happy","harsh","heart","heavy","hence","herbs","honey","honor","horse","hotel","house","human","humor","hurry","ideal","image","imply","inbox","index","indie","inner","input","irony","issue","ivory","japan","jewel","joint","judge","juice","juicy","kebab","knife","knock","known","label","labor","large","laser","later","laugh","layer","leads","learn","lease","leave","legal","lemon","level","light","limit","linen","liver","local","lodge","logic","login","login","loose","lover","lower","loyal","lucky","lunch","lying","magic","major","maker","manor","march","match","mayor","medal","media","mercy","merit","metal","might","minor","minus","mixed","model","money","month","moral","motor","mount","mourn","mouse","mouth","moved","movie","muddy","mural","music","myth","naive","named","nerve","never","newly","niche","night","noble","noise","north","noted","novel","nurse","occur","ocean","offer","often","omega","onset","opera","orbit","order","organ","other","outer","owned","owner","oxide","ozone","paint","panel","panic","paper","party","pasta","patch","pause","peace","peach","pearl","penny","perch","phase","phone","photo","piano","piece","pilot","pitch","pixel","pizza","place","plain","plane","plant","plate","plaza","plead","pluck","plumb","plus","point","polar","poles","polka","posed","pound","power","press","price","pride","prime","prince","print","prior","prize","probe","proof","prose","proud","prove","proxy","psalm","pulse","punch","pupil","queen","query","quest","queue","quick","quiet","quite","quota","quote","radar","radio","raise","rally","ranch","range","rapid","ratio","reach","react","ready","realm","rebel","refer","reign","relax","relay","renal","renew","reply","retry","rider","ridge","rifle","right","rigid","risky","rival","river","robot","rocky","roman","roost","rouge","rough","round","route","royal","rugby","ruler","rumor","rural","sadly","saint","salad","salon","sauce","scale","scare","scene","scent","scope","score","scout","scrap","scrub","seek","seize","sense","serve","setup","seven","shade","shaft","shake","shall","shame","shape","share","shark","sharp","sheer","sheet","shelf","shell","shift","shine","shirt","shock","shoot","shore","short","shout","shown","sight","since","sixth","sixty","sized","skill","skull","slash","slate","slave","sleep","slice","slide","slope","small","smart","smell","smile","smoke","snake","solar","solid","solve","sorry","sound","south","space","spare","spark","spawn","speak","speed","spend","spent","spice","spike","spine","spite","split","spoke","spray","squad","stack","staff","stage","stain","stair","stake","stall","stamp","stand","stare","start","state","stays","steady","steal","steam","steel","steep","steer","stern","stick","stiff","still","stock","stone","stood","store","storm","story","stove","strap","straw","stray","strip","stuck","study","stuff","style","sugar","suite","sunny","super","surge","swamp","swarm","swear","sweat","sweep","sweet","swept","swift","swing","swirl","sworn","swung","syrup","table","taken","taste","teach","teeth","tempo","tends","tenor","tense","terms","thank","theme","thick","thief","thing","think","third","thorn","those","three","threw","throw","thumb","tidal","tight","timer","tired","title","today","token","topic","total","touch","tough","towel","tower","toxic","trace","track","trade","trail","train","trait","trans","trash","treat","trend","trial","tribe","trick","tried","troop","truck","truly","trump","trunk","trust","truth","tumor","twice","twist","tying","ultra","uncle","under","unify","union","unite","unity","until","upper","upset","urban","usage","usual","utter","vague","valid","value","valve","vapor","vault","venue","verse","video","vigor","viral","virus","visit","vista","vital","vivid","vocal","vodka","voice","voter","vowel","wages","waste","watch","water","weary","weave","wedge","weigh","weird","whale","wheat","wheel","where","which","while","white","whole","whose","width","witch","woman","world","worry","worse","worst","worth","would","wound","wrath","wreck","write","wrote","yacht","yield","young","yours","youth","zebra"];
            validGuesses = new Set(wordList);
        }
    }

    function pickWord() {
        answer = wordList[Math.floor(Math.random() * wordList.length)];
    }

    function createBoard() {
        const container = document.getElementById('wordle-game');
        container.innerHTML = `
            <h1 class="wordle-title">Wordle</h1>
            <div class="wordle-board" id="wordle-board"></div>
            <div class="keyboard" id="wordle-keyboard"></div>
            <button class="next-puzzle-btn" id="wordle-next">Next Puzzle</button>
        `;

        const boardEl = document.getElementById('wordle-board');
        board = [];
        for (let r = 0; r < NUM_ROWS; r++) {
            const row = document.createElement('div');
            row.className = 'wordle-row';
            row.id = `wordle-row-${r}`;
            const rowTiles = [];
            for (let c = 0; c < NUM_COLS; c++) {
                const tile = document.createElement('div');
                tile.className = 'wordle-tile';
                tile.id = `wordle-tile-${r}-${c}`;
                row.appendChild(tile);
                rowTiles.push(tile);
            }
            boardEl.appendChild(row);
            board.push(rowTiles);
        }

        createKeyboard();
        document.getElementById('wordle-next').addEventListener('click', initGame);
    }

    function createKeyboard() {
        const rows = [
            ['q','w','e','r','t','y','u','i','o','p'],
            ['a','s','d','f','g','h','j','k','l'],
            ['enter','z','x','c','v','b','n','m','backspace']
        ];

        const kb = document.getElementById('wordle-keyboard');
        kb.innerHTML = '';
        rows.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'keyboard-row';
            row.forEach(key => {
                const btn = document.createElement('button');
                btn.className = 'key' + (key.length > 1 ? ' wide' : '');
                btn.dataset.key = key;
                btn.textContent = key === 'backspace' ? '⌫' : key;
                btn.addEventListener('click', () => handleKey(key));
                rowEl.appendChild(btn);
            });
            kb.appendChild(rowEl);
        });
    }

    function handleKey(key) {
        if (gameOver) return;
        if (key === 'backspace') {
            if (currentCol > 0) {
                currentCol--;
                board[currentRow][currentCol].textContent = '';
                board[currentRow][currentCol].classList.remove('filled');
            }
        } else if (key === 'enter') {
            if (currentCol === NUM_COLS) submitGuess();
        } else if (key.length === 1 && /^[a-z]$/.test(key)) {
            if (currentCol < NUM_COLS) {
                board[currentRow][currentCol].textContent = key;
                board[currentRow][currentCol].classList.add('filled');
                currentCol++;
            }
        }
    }

    function submitGuess() {
        const guess = [];
        for (let c = 0; c < NUM_COLS; c++) {
            guess.push(board[currentRow][c].textContent.toLowerCase());
        }
        const word = guess.join('');

        if (!validGuesses.has(word)) {
            const row = document.getElementById(`wordle-row-${currentRow}`);
            row.classList.add('shake');
            setTimeout(() => row.classList.remove('shake'), 500);
            showToast('Not in word list');
            return;
        }

        // Calculate colors
        const result = Array(NUM_COLS).fill('absent');
        const answerArr = answer.split('');
        const used = Array(NUM_COLS).fill(false);

        // First pass: correct
        for (let i = 0; i < NUM_COLS; i++) {
            if (guess[i] === answerArr[i]) {
                result[i] = 'correct';
                used[i] = true;
            }
        }
        // Second pass: present
        for (let i = 0; i < NUM_COLS; i++) {
            if (result[i] !== 'correct') {
                for (let j = 0; j < NUM_COLS; j++) {
                    if (!used[j] && guess[i] === answerArr[j]) {
                        result[i] = 'present';
                        used[j] = true;
                        break;
                    }
                }
            }
        }

        // Animate tiles
        for (let i = 0; i < NUM_COLS; i++) {
            const tile = board[currentRow][i];
            setTimeout(() => {
                tile.classList.add('reveal');
                setTimeout(() => {
                    tile.classList.add(result[i]);
                }, 250);
            }, i * 300);
        }

        // Update keyboard colors
        setTimeout(() => {
            for (let i = 0; i < NUM_COLS; i++) {
                const keyBtn = document.querySelector(`.key[data-key="${guess[i]}"]`);
                if (keyBtn) {
                    const current = keyBtn.classList.contains('correct') ? 'correct' :
                                    keyBtn.classList.contains('present') ? 'present' :
                                    keyBtn.classList.contains('absent') ? 'absent' : '';
                    if (result[i] === 'correct') {
                        keyBtn.className = 'key correct';
                    } else if (result[i] === 'present' && current !== 'correct') {
                        keyBtn.className = 'key present';
                    } else if (result[i] === 'absent' && !current) {
                        keyBtn.className = 'key absent';
                    }
                }
            }
        }, NUM_COLS * 300 + 300);

        // Check win/loss
        if (word === answer) {
            gameOver = true;
            setTimeout(() => {
                for (let i = 0; i < NUM_COLS; i++) {
                    setTimeout(() => board[currentRow][i].classList.add('win'), i * 100);
                }
                showToast('Brilliant!');
            }, NUM_COLS * 300 + 500);
        } else {
            currentRow++;
            currentCol = 0;
            if (currentRow === NUM_ROWS) {
                gameOver = true;
                setTimeout(() => {
                    showToast(answer.toUpperCase(), 3000);
                }, NUM_COLS * 300 + 500);
            }
        }
    }

    function initGame() {
        currentRow = 0;
        currentCol = 0;
        gameOver = false;
        pickWord();
        createBoard();
    }

    // Keyboard listener
    document.addEventListener('keydown', e => {
        const activeGame = document.querySelector('.tab-btn.active')?.dataset.game;
        if (activeGame !== 'wordle') return;
        if (e.key === 'Enter') handleKey('enter');
        else if (e.key === 'Backspace') handleKey('backspace');
        else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toLowerCase());
    });

    // Init
    loadWords().then(() => initGame());
})();
