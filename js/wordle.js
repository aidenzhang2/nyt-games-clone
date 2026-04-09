// ============ WORDLE GAME ============
(function() {
    let validGuesses = new Set();
    let answer = '';
    let currentRow = 0;
    let currentCol = 0;
    let gameOver = false;
    let board = [];
    const NUM_ROWS = 6;
    const NUM_COLS = 5;

    // Common answer words (simpler, well-known words)
    const answerList = [
        "aback","abase","abate","abbey","abbot","abhor","abide","about","above","abyss","acorn","acrid","actor","acute","adage","adapt","adept","admin","admit","adobe","adopt","adore","adult","affix","afoot","after","again","agape","agate","agent","agile","aging","aglow","agony","agree","ahead","aisle","alarm","album","alert","alien","alike","alive","allot","allow","aloft","alone","along","aloof","aloud","alpha","altar","alter","amass","amber","amble","amiss","among","ample","amply","amuse","angel","anger","angle","angry","angst","ankle","annex","annoy","anode","antic","anvil","aorta","apart","aphid","apple","apply","apron","aptly","arbor","ardor","argue","arise","aroma","arrow","artsy","ascot","ashen","aside","askew","assay","asset","attic","atlas","atoll","atone","atria","audio","audit","avail","avert","avoid","await","award","awake","aware","awash","awful","awoke","axiom","azure",
        "bacon","badge","badly","bagel","baker","baler","balmy","balsa","banal","banjo","barge","baron","basic","basil","basin","baste","batch","bathe","baton","batty","bawdy","bayou","beach","beady","beard","beast","beaut","beefy","befit","beget","begin","being","belch","belie","belly","below","bench","beret","berth","beset","bevel","bicep","bilge","binge","biome","birch","birth","black","blade","blame","bland","blank","blare","blast","blaze","bleak","bleat","bleed","bleep","blend","blimp","blink","bliss","block","bloke","blond","bloom","blown","bluff","blunt","blurb","blurt","blush","board","boast","bongo","bonus","booby","boost","booty","booze","boozy","borax","borne","bossy","bough","boxer","brace","braid","brain","brake","brand","brash","brass","brave","bravo","brawn","bread","break","breed","briar","bribe","bride","brief","brine","bring","brink","briny","brisk","broad","broke","brood","brook","broom","broth","brown","brush","brute","buddy","buggy","bugle","build","built","bulge","bulky","bully","bunch","bunny","burly","burnt","buyer",
        "cable","cacao","cache","cacti","cadet","camel","cameo","candy","canny","canoe","canon","caper","carat","cargo","carol","carry","carve","catch","cater","catty","caulk","cause","cease","cedar","cello","chafe","chain","chair","chalk","champ","chant","chaos","chard","charm","chart","chase","chasm","cheap","cheat","check","cheek","cheer","chest","chide","chief","child","chill","chime","chirp","chock","choir","choke","chord","chore","chose","chump","chunk","chute","cider","cigar","cinch","circa","civic","civil","clamp","clash","clasp","class","clean","clear","cleft","clerk","click","cliff","climb","cling","clink","cloak","clock","clone","close","cloth","cloud","clove","clown","cluck","clung","coach","coast","cocoa","colic","colon","comet","comfy","comma","conch","condo","conic","coral","corer","corny","could","count","court","coven","cover","covet","cower","coyly","craft","cramp","crane","crank","crass","crate","crave","crawl","craze","crazy","creak","cream","credo","crepe","crept","crest","crime","crimp","crisp","croak","crone","crook","cross","crowd","crown","cruel","crumb","crush","crust","crypt","cubic","cumin","curio","curly","curse","curve","cyber","cynic",
        "daddy","daisy","dally","dance","dandy","datum","daunt","death","debit","debug","debut","decal","decay","decor","decoy","decry","defer","deity","delay","delta","delve","denim","dense","depot","depth","deter","detox","deuce","devil","diary","dicey","digit","diner","dingo","dingy","dirge","disco","ditto","ditty","dizzy","dodge","dodgy","dogma","doing","dolly","donor","donut","dopey","doubt","dough","dowel","dowry","dozen","draft","drain","drama","drape","drawn","dread","dream","drift","drill","drink","drive","droll","drone","drool","droop","drove","dryer","duchy","dummy","dusky","dutch","duvet","dwarf","dwell","dwelt",
        "eager","eagle","early","earth","easel","eaten","ebony","edict","edify","egret","eight","eject","elate","elbow","elder","elite","elope","elude","email","embed","ember","empty","enact","endow","enema","enjoy","ennui","ensue","enter","envoy","epoch","epoxy","equal","equip","erase","erode","error","erupt","essay","ether","ethic","ethos","evade","event","every","evoke","exact","exalt","excel","exert","exile","exist","expel","extol","extra","exult",
        "fable","facet","faint","faith","false","fancy","farce","fault","favor","feast","feign","feral","ferry","fetch","fetid","fever","fewer","fiber","field","fiend","fiery","fifth","fifty","filet","filly","final","finch","finer","first","fishy","fixer","fizzy","fjord","flail","flair","flake","flaky","flame","flank","flare","flash","flask","flesh","flick","fling","flint","flirt","float","flock","flood","floor","flora","floss","flour","flout","flown","fluff","flume","flung","flunk","fluke","flute","flyer","foamy","focal","focus","foggy","foist","folio","folly","foray","force","forge","forgo","forte","forth","forty","forum","found","foyer","frail","frame","frank","freak","fresh","fried","frill","fritz","frock","frond","front","frost","froth","frown","froze","fruit","fugue","fully","fungi","funky","funny","fuzzy",
        "gamer","gamma","gamut","gaudy","gauge","gaunt","gauze","gavel","gawky","gecko","geese","genie","genre","ghost","ghoul","giant","giddy","girth","given","gizmo","glade","gland","glare","glass","glaze","gleam","glean","glide","glint","gloat","globe","gloom","glory","glove","glyph","gnash","gnome","gofer","going","golem","goner","goody","gooey","goofy","goose","gorge","gouge","grace","grade","graft","grail","grain","grand","grant","graph","grasp","grass","grate","grave","gravy","great","greed","green","greet","grief","grift","grime","grimy","grind","gripe","groan","groin","groom","gross","group","grout","grove","growl","grown","gruel","gruff","guano","guard","guava","guess","guest","guide","guild","guile","guise","gully","gumbo","gummy","gunky","guppy","gusty",
        "habit","hairy","halve","handy","happy","hardy","harsh","haste","hasty","hatch","hater","haunt","haven","havoc","hazel","heady","heard","heart","heath","heave","heavy","hefty","heist","helix","hello","hence","heron","hilly","hinge","hippo","hitch","hoard","hobby","hoist","holly","homer","honey","horde","horse","hotel","hound","house","hovel","hover","howdy","human","humid","humor","humph","hunch","hunky","hurry","hutch","hydra","hyena","hyper",
        "icing","ideal","idiom","idler","igloo","image","imbue","impel","inane","inbox","incur","index","indie","inept","inert","infer","inlay","inner","input","inter","intro","ionic","irate","irony","islet","issue","itchy","ivory",
        "jaunt","jazzy","jelly","jerky","jewel","jiffy","joint","joker","jolly","joust","judge","juice","jumbo","jumpy",
        "karma","kayak","kazoo","kebab","kefir","khaki","kiosk","knack","knave","knead","kneel","knell","knelt","knife","knock","knoll","known","koala","krill",
        "label","labor","ladle","lager","lance","lanky","lapel","lapse","large","larva","laser","lasso","later","lathe","latte","laugh","layer","leach","leafy","leaky","leapt","learn","lease","leash","least","leave","ledge","leech","leery","lefty","leggy","lemon","lemur","level","lever","libel","light","lilac","limbo","limit","linen","liner","lingo","lithe","liver","livid","llama","lobby","local","locus","lodge","lofty","logic","loopy","loris","loser","louse","lousy","lover","lower","lowly","loyal","lucid","lucky","lumpy","lunar","lunch","lunge","lurid","lusty","lying",
        "macaw","macho","madam","madly","magic","magma","maize","major","maker","mambo","manga","mango","mania","manic","manly","manor","maple","march","marry","marsh","mason","masse","match","matey","matte","mauve","maxim","maybe","mayor","mealy","meant","medal","media","medic","melon","mercy","merge","merit","merry","metal","meter","metro","micro","midge","midst","might","mimic","mince","miner","minty","minus","mirth","miser","modal","model","modem","mogul","moist","molar","moldy","mommy","money","month","mooch","moose","moral","mossy","motel","motor","motto","moult","mount","mourn","mouse","mouth","movie","mucky","muggy","mulch","mummy","munch","mural","mushy","music","musty","myrrh",
        "nadir","naive","nanny","nasal","nasty","natal","naval","navel","needy","neigh","nerdy","nerve","nervy","never","nicer","niche","night","ninja","ninth","noble","noise","noisy","nomad","north","novel","nudge","nurse","nylon","nymph",
        "oasis","occur","ocean","octet","oddly","offal","offer","often","older","olive","omega","onion","onset","oomph","opera","opine","order","organ","other","otter","ought","ounce","outdo","outer","overt","owner","oxide","ozone",
        "paint","panel","panic","papal","paper","parer","parry","party","pasta","patch","patio","patsy","patty","pause","peace","peach","pearl","pecan","pedal","penne","perch","peril","perky","pesky","petal","petty","phase","phone","phony","photo","piano","picky","piece","piety","pilot","pinch","piney","pinky","pinto","pious","piper","pique","pitch","pithy","pixel","pixie","place","plaid","plain","plait","plane","plank","plant","plate","plaza","plead","pleat","pluck","plumb","plump","plunk","point","poise","poker","polar","polka","polyp","poppy","porch","posse","pound","pouty","power","prank","preen","press","price","prick","pride","prime","primo","primp","print","prior","prism","prize","probe","prone","prong","proof","prose","proud","prove","prowl","proxy","prune","psalm","pulpy","pupil","purge",
        "quail","quake","qualm","quark","quart","quash","queen","query","quest","queue","quick","quiet","quill","quilt","quirk","quite","quota","quote",
        "rabid","racer","radio","rainy","raise","ramen","ranch","range","rapid","ratio","ratty","rayon","reach","react","ready","realm","rebel","rebus","rebut","recap","recur","refer","regal","rehab","relax","relay","relic","remit","renew","repay","repel","rerun","resin","retch","retro","retry","reuse","revel","revue","rhino","rhyme","rider","ridge","right","rigid","riper","risen","rival","rivet","roach","robin","robot","rocky","rodeo","rogue","roomy","roost","rouge","rough","round","rouse","route","rover","rowdy","rower","royal","ruddy","ruder","rugby","rumba","rupee","rusty",
        "saint","salad","sally","salsa","salty","sandy","sassy","saucy","sauna","saute","savor","savvy","scald","scale","scant","scare","scarf","scent","scoff","scold","scone","scope","score","scorn","scour","scout","scowl","scram","scrap","scrub","scrum","sedan","seedy","segue","sense","serif","serum","serve","seven","sever","shade","shaft","shake","shaky","shall","shame","shank","shape","shard","share","sharp","shave","shawl","shear","sheep","sheet","shelf","shell","shift","shine","shire","shirk","shoal","shore","shorn","short","shout","shove","shown","showy","shred","shrub","shrug","shuck","shunt","shush","shyly","siege","sight","silly","since","singe","siren","sissy","sitar","sixth","skate","skier","skiff","skill","skimp","skirt","skull","skunk","slang","slate","sleek","sleep","slice","slick","slime","slope","slosh","sloth","slump","slung","small","smart","smash","smear","smell","smelt","smile","smirk","smite","smith","smock","smoke","snack","snafu","snail","snake","snaky","snare","snarl","sneak","snide","snoop","snort","snout","sober","soggy","solar","solid","solve","sonic","sorry","sound","south","sower","space","spade","spare","spark","spasm","spate","speak","spear","speck","speed","spell","spelt","spend","spent","spice","spicy","spiel","spike","spill","spine","spiny","spire","spite","splat","split","spoil","spoke","spoof","spool","spoon","spore","sport","spout","spray","sprig","spurt","squad","squat","squid","stack","staff","stage","staid","stain","stair","stake","stale","stall","stamp","stand","stank","stare","stark","start","stash","state","stead","steam","steed","steel","steep","stein","stern","stick","stiff","still","stilt","sting","stink","stint","stock","stoic","stole","stomp","stone","stony","stood","stool","store","stork","storm","story","stout","stove","strap","straw","stray","strut","study","stump","stung","stunt","style","suave","suede","sugar","suite","sulky","sully","sumac","sunny","super","surer","surge","surly","sushi","swamp","swath","sweat","sweep","sweet","swell","swill","swine","swing","swirl","swish","swoon","swoop","sword","sworn","swung","syrup",
        "tabby","table","taboo","tacit","tacky","taffy","taken","tally","talon","tangy","taper","tapir","tardy","taste","tasty","taunt","taupe","tawny","teach","teary","tease","teddy","teeth","tempo","tenor","tenth","tepid","terse","thank","theft","their","theme","there","these","thick","thief","thigh","thing","think","third","thorn","those","three","threw","throb","throw","thrum","thumb","thump","thyme","tiara","tibia","tidal","tiger","tilde","timer","tinge","tipsy","titan","tithe","title","tizzy","toast","today","tonic","tooth","topaz","topic","torch","torso","total","totem","touch","tough","towel","tower","toxic","toxin","trace","track","tract","trade","trail","train","trait","trash","trawl","treat","trend","triad","trial","trice","trick","tripe","trite","troll","troop","trope","trout","trove","truck","truly","truss","trust","truth","tryst","tuber","tulip","tunic","turbo","tutor","twang","tweak","tweed","twice","twine","twirl","twist",
        "udder","ulcer","ultra","uncle","under","undid","undue","unfed","unfit","unify","union","unite","unlit","unmet","untie","until","unzip","upper","upset","urban","usage","usher","using","usual","usurp","utter","uvula",
        "vague","valet","valid","value","vapid","vault","vegan","venom","venue","verge","verse","verve","video","vigor","villa","vinyl","viola","viral","visor","vital","vivid","vixen","vodka","vogue","voice","voila","voter","vouch","vowel","vying",
        "wacky","wafer","wagon","waist","waltz","waste","watch","water","waxen","weary","wedge","weedy","weigh","weird","whack","whale","wheat","wheel","whelp","where","which","whiff","while","whine","whiny","whirl","whisk","white","whole","whoop","whose","widen","width","wield","wince","windy","wiser","witch","witty","woken","woman","wooer","wordy","world","worry","worse","worst","would","wound","woven","wrath","wreak","wrist","write","wrong","wrote","wrung",
        "yacht","yearn","yeast","yield","young","youth",
        "zebra","zesty"
    ];

    // Load the full valid guesses list (all typeable words)
    async function loadWords() {
        try {
            const resp = await fetch('data/wordle_words.txt');
            const text = await resp.text();
            const allWords = text.trim().split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length === 5);
            validGuesses = new Set(allWords);
            // Also add all answer words to valid guesses
            answerList.forEach(w => validGuesses.add(w));
        } catch(e) {
            validGuesses = new Set(answerList);
        }
    }

    function pickWord() {
        answer = answerList[Math.floor(Math.random() * answerList.length)];
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
