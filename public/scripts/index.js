socket = io();

const redColorScheme = [
    ["menuBg", "#FFEBEE"],
    ["menuBottom", "#FFCDD2"],
    ["buttonBg", "#EF9A9A"],
    ["buttonBottom", "#E57373"],
];
const purpleColorScheme = [
    ["menuBg", "#f3e5f5"],
    ["menuBottom", "#e1bee7"],
    ["buttonBg", "#CE93D8"],
    ["buttonBottom", "#BA68C8"],
];
const blueColorScheme = [
    ["menuBg", "#e8eaf6"],
    ["menuBottom", "#c5cae9"],
    ["buttonBg", "#9FA8DA"],
    ["buttonBottom", "#7986CB"],
];
const cyanColorScheme = [
    ["menuBg", "#e0f7fa"],
    ["menuBottom", "#b2ebf2"],
    ["buttonBg", "#80DEEA"],
    ["buttonBottom", "#4DD0E1"],
];
const greenColorScheme = [
    ["menuBg", "#e8f5e9"],
    ["menuBottom", "#c8e6c9"],
    ["buttonBg", "#A5D6A7"],
    ["buttonBottom", "#81C784"],
];
const yellowColorScheme = [
    ["menuBg", "#fff3e0"],
    ["menuBottom", "#ffe0b2"],
    ["buttonBg", "#ffcc80"],
    ["buttonBottom", "#ffb74d"],
];

let placingPawn = false;
let reserve = { white: 10, black: 10 };
let reload = { white: 0, black: 0 };
let toreload = 0;
let area = "bottom";
let gameBoard = [];
let movingBot = false;
let movingBotPath = {};
let offlineGameType = false;

const allLanguages = {
    en_GB: {
        genericBack: "Back",
        mainMenuResumeBtn: "Resume",
        mainMenuRecentGamesBtn: "Recent Games",
        mainMenuTutorialBtn: "Tutorial",
        playOnlineBtn: "Play online",
        playOfflineBtn: "Play offline",
        copyBtn: "Copy",
        shareBtn: "Share",
        randomBtn: "Find player",
        availableOptionsBtn: "Available options",
        gameSettingsBtn: "Game settings",
        confirmPathBtn: "Confirm Robot path",
        placePawnOptionBtn: "Place energy pawn",
        moveRbotBtn: "Move a robot",
        reloadEnergyBtn: "Reload energy",
        rematchBtn: "Rematch",
        mainMenuBtn: "Main Menu",
        playMenuDesc: "How would you like to play?",
        energyPawnsReloadDescritpion: "These energy pawns will be added to your inventory",
        recentGamesMenuDesc: "These are the names of the people you've played with recently",
        unsupportedDesc: "Your browser is outdated. Things might not be aligned, you may encounter bugs.",
        colorSchemeDesc: "Color scheme",
        loaderDesc: "Connecting to server",
        yourTurnDesc: "It is your turn. Click on the button below to see what you can do.",
        yourTurnDescOffline: "It is %name's turn. Click on the button below to see what you can do.",
        placePawnDesc: "These are the pawns you have, click on one of the buttons below to choose a colour and click the cell you want to place it in.",
        moveBotDesc: "Click on the robot you want to move, then click on pawns one by one to create a path.",
        winnerMenuDesc: "The game stops when the last energy pawn of any colour is taken at a reload.",
        shareGameMenuDesc: "Share this link with your friend:",
        serverError: "Couldn't connect to server",
        recentGamesMenuAgainst: "Against %player",
        energyPawnsReloadAction: "You have %actual energy pawns, you have to take %future of any colour to reload to 4.",
        shareTextTitle: "Robotory game!",
        shareTextText: "Come play Robotory with me!",
        playRisk: "Play at your own risk!",
        nameInput: "Enter a name here...",
        ennemyDisplayVS: "Against",
        ennemyDisplayThinking: "Thinking",
        genericConfirm: "Confirm",
        youWon: "You won!",
        youLost: "You lost!",
    },
    fr_FR: {
        genericBack: "Retour",
        mainMenuResumeBtn: "Résumer",
        mainMenuRecentGamesBtn: "Parties Récentes",
        mainMenuTutorialBtn: "Tutoriel",
        playOnlineBtn: "Jouer en ligne",
        playOfflineBtn: "Jouer hors-ligne",
        copyBtn: "Copier",
        shareBtn: "Partager",
        randomBtn: "Trouver un joueur",
        availableOptionsBtn: "Options disponibles",
        gameSettingsBtn: "Réglages de partie",
        confirmPathBtn: "Confirmer le chemin du robot",
        placePawnOptionBtn: "Placer un pion d'énergie",
        moveRbotBtn: "Déplacer un robot",
        reloadEnergyBtn: "Recharger l'énergie",
        rematchBtn: "Rejouer",
        mainMenuBtn: "Menu principal",
        playMenuDesc: "Comment voulez vous jouer?",
        energyPawnsReloadDescritpion: "Ces pions d'énergie seront ajoutés à votre inventaire",
        recentGamesMenuDesc: "Voici les noms des gens avec qui vous avez joué récemment",
        unsupportedDesc: "Votre navigateur est ancien. Les objets pourraient ne pas être alignés et vous rencontrez plus de bogues.",
        colorSchemeDesc: "Thème",
        loaderDesc: "Connection au serveur",
        yourTurnDesc: "C'est votre tour. Cliquez sur le bouton ci-dessous pour voir ce que vous pouvez faire.",
        yourTurnDescOffline: "C'est au tour de %name. Cliquez sur le bouton ci-dessous pour voir ce que vous pouvez faire.",
        placePawnDesc: "Voici les pions que vous avez, cliquez sur un des boutons ce dessous pour séléctionner une couleur et cliquez sur le carreau sur lequel vous voulez le placer.",
        moveBotDesc: "Cliquez sur le robot que vous voulez déplacer, puis cliquez sur les pions un par un pour créer un 'trajet'",
        winnerMenuDesc: "La partie s'arrête quand un joueur prend le dernier pion d'énergie d'une couleur lors d'un rechargement.",
        shareGameMenuDesc: "Partagez ce lien avec un ami:",
        serverError: "Impossible de se connecter au serveur",
        recentGamesMenuAgainst: "Contre %player",
        energyPawnsReloadAction: "Vous avez %actual pions d'énergie, vous devez en prendre %future de n'importe quelle couleur pour en avoir 4 de nouveau.",
        shareTextTitle: "Partie Robotory!",
        shareTextText: "Viens jouer une partie de Robotory avec moi!",
        playRisk: "Je prends des risques!",
        nameInput: "Entrez un nom...",
        ennemyDisplayVS: "Contre",
        ennemyDisplayThinking: "Je pense",
        genericConfirm: "Confirmer",
        youWon: "Vous avez gagné!",
        youLost: "Vous avez perdu!",
    },
    es_ES: {
        genericBack: "Atrás",
        mainMenuResumeBtn: "Continuar",
        mainMenuRecentGamesBtn: "Juegos Recentes",
        mainMenuTutorialBtn: "Tutorial",
        playOnlineBtn: "Jugar en línea",
        playOfflineBtn: "Jouer desconectado",
        copyBtn: "Copiar",
        shareBtn: "Compartir",
        randomBtn: "Buscar un jugador",
        availableOptionsBtn: "Opciones disponibles",
        gameSettingsBtn: "Configuraciones de este juego",
        confirmPathBtn: "Confirmar el camino del robot",
        placePawnOptionBtn: "Poner una pieza de energia",
        moveRbotBtn: "Mover un robot",
        reloadEnergyBtn: "Recargar la energía",
        rematchBtn: "Jugar de nuevo",
        mainMenuBtn: "Menú principal",
        playMenuDesc: "Cómo quieres júgar",
        energyPawnsReloadDescritpion: "Estas piezas de energia se añadirán al inventario",
        recentGamesMenuDesc: "Estos son los nombres de la gente con la que ha jugado recientemente",
        unsupportedDesc: "Su navegador es antiguo. Es posible que los objetos no estén alineados y que haya más errores.",
        colorSchemeDesc: "Tema",
        loaderDesc: "Conexión al servidor",
        yourTurnDesc: "Es su turno. Haz clic en el botón de abajo para ver qué puede hacer.",
        yourTurnDescOffline: "Es el turno de %name. Haz clic en el botón de abajo para ver qué puede hacer.",
        placePawnDesc: "Aquí están las piezas que tiene, haga clic en uno de los botones de abajo para seleccionar un color y haga clic en el azulejo en el que desea colocarlo.",
        moveBotDesc: "Haga clic en el robot que desea mover y haga clic en las piezas una por una para crear un 'trayecto'",
        winnerMenuDesc: "El juego se acaba cuando un jugador toma la última pieza de energía de un color durante una recarga.",
        shareGameMenuDesc: "Comparte este enlace con un amigo:",
        serverError: "No se puede conectar al servidor",
        recentGamesMenuAgainst: "aontra %player",
        energyPawnsReloadAction: "Tiene %actual fichas de energía, tiene que tomar %future de cualquier color para tener 4 de nuevo.",
        shareTextTitle: "Juego Robotory!",
        shareTextText: "¡Ven a jugar a Robotory conmigo!",
        playRisk: "Quiero correr riesgos.",
        nameInput: "Introduzca un nombre...",
        ennemyDisplayVS: "Contra",
        ennemyDisplayThinking: "Estoy piensando",
        genericConfirm: "Confirmar",
        youWon: "Usted ha ganado!",
        youLost: "Usted ha perdido!",
    },
};
let lang = "en_GB";
//First one is the top, second one is the left
const positionInBoardById = [
    [8.5, 50],
    [16.5, 36.4],
    [16.5, 63.4],
    [25.5, 22.7],
    [25.5, 50],
    [25.5, 77],
    [33.5, 36.4],
    [33.5, 63.4],
    [41.5, 22.7],
    [41.5, 50],
    [41.5, 77],
    [49.5, 36.4],
    [49.5, 63.4],
    [58.5, 22.7],
    [58.5, 50],
    [58.5, 77],
    [66.5, 36.4],
    [66.5, 63.4],
    [74.5, 22.7],
    [74.5, 50],
    [74.5, 77],
    [82.8, 36.4],
    [82.8, 63.4],
    [91.8, 50],
];
let neighbours = [
    [1, 2, 4],
    [3, 6, 4, 0],
    [0, 4, 7, 5],
    [1, 6, 8],
    [0, 1, 2, 6, 7, 9],
    [2, 7, 10],
    [1, 3, 4, 8, 9, 11],
    [2, 4, 5, 9, 10, 12],
    [3, 6, 11, 13],
    [4, 6, 7, 11, 12, 14],
    [5, 7, 12, 15],
    [6, 8, 9, 13, 14, 16],
    [7, 9, 10, 14, 15, 17],
    [8, 11, 16, 18],
    [9, 11, 12, 16, 17, 19],
    [10, 12, 17, 20],
    [11, 13, 14, 18, 19, 21],
    [12, 14, 15, 19, 20, 22],
    [13, 16, 21],
    [14, 16, 17, 21, 22, 23],
    [15, 17, 22],
    [16, 18, 19, 23],
    [17, 19, 20, 23],
    [19, 21, 22],
];

Array.prototype.remove = function () {
    var what,
        a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
let menusStack = [];
class BrowserDetector {
    constructor() {
        (this.browser = {}), (this.unsupportedBrowsers = { Chrome: 70, Firefox: 60, IE: 10, Edge: 15, Opera: 50, Safari: 12 }), this._detectBrowser();
    }
    _detectBrowser() {
        var e, r, s;
        this.browser =
            ((r = navigator.userAgent),
                (s = r.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []),
                /trident/i.test(s[1])
                    ? { name: "IE", version: (e = /\brv[ :]+(\d+)/g.exec(r) || [])[1] || "" }
                    : "Chrome" === s[1] && null != (e = r.match(/\b(OPR|Edge)\/(\d+)/))
                    ? { name: e[1].replace("OPR", "Opera"), version: e[2] }
                    : ((s = s[2] ? [s[1], s[2]] : [navigator.appName, navigator.appVersion, "-?"]), null != (e = r.match(/version\/(\d+)/i)) && s.splice(1, 1, e[1]), { name: s[0], version: s[1] }));
    }
    get isIE() {
        return "IE" === this.browser.name;
    }
    get isEdge() {
        return "Edge" === this.browser.name;
    }
    get isMicrosoft() {
        return this.isIE || this.isEdge;
    }
    get isFirefox() {
        return "Firefox" === this.browser.name;
    }
    get isChrome() {
        return "Chrome" === this.browser.name;
    }
    get isSafari() {
        return "Safari" === this.browser.name;
    }
    get isAndroid() {
        return /Android/i.test(navigator.userAgent);
    }
    get isBlackBerry() {
        return /BlackBerry/i.test(navigator.userAgent);
    }
    get isWindowsMobile() {
        return /IEMobile/i.test(navigator.userAgent);
    }
    get isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    get isMobile() {
        return this.isAndroid || this.isBlackBerry || this.isWindowsMobile || this.isIOS;
    }
    isSupported() {
        return !!(this.unsupportedBrowsers.hasOwnProperty(this.browser.name) && +this.browser.version > this.unsupportedBrowsers[this.browser.name]);
    }
}
function load() {
    if (window.localStorage["colorScheme"] === undefined || window.localStorage["colorScheme"] === null) {
        window.localStorage["colorScheme"] = "greenColorScheme";
    } else {
        applyColorScheme(eval(window.localStorage["colorScheme"]));
    }
    if (!(window.localStorage["recentGames"] === undefined || window.localStorage["recentGames"] === null)) {
        if (JSON.parse(window.localStorage["recentGames"]).length !== 0) {
            updateRecentGames();
        }
    } else {
        window.localStorage["recentGames"] = JSON.stringify([]);
    }
    document.getElementsByClassName(window.localStorage["colorScheme"] + "Button")[0].classList.add("activeColorSchemeButton");
    resizeUpdate();
    let allElements = document.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].tagName == "INPUT") break;
        allElements[i].classList.add("disableSelect");
    }
    if (testIfTouch()) {
        let allElements = document.getElementsByTagName("*");
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add("touchDevice");
        }
    }
    if (!navigator.share) {
        document.getElementById("shareButton").classList.add("disabledOptionButton");
    }
    if (localStorage["name"] === undefined || localStorage["name"] == null) {
        localStorage["name"] = "";
    }
    if (localStorage["lang"] === undefined || localStorage["lang"] == null) {
        localStorage["lang"] = "en_GB";
    }
    lang = localStorage["lang"];

    applyTranslation();
    document.getElementById("nameTextInput").value = localStorage["name"];
    if (window.location.hash.charAt(0) == "#") {
        socket.emit("joinroom", { GUID: localStorage["GUID"], roomId: window.location.hash.substr(1), name: localStorage["name"] });
        openMenu("loader");
    } else if (!new BrowserDetector().isSupported()) {
        openMenu("unsupported");
        openDarkerBg();
    } else {
        openMenu("centerMainMenu");
        openDarkerBg();
        //openVsDisplay("ennemyDisplay");
    }
    setInterval(generateBackgroundParticles, 100);
}

function applyTranslation() {
    for (let i = 0; i < document.getElementsByTagName("*").length; i++) {
        if (document.getElementsByTagName("*")[i].getAttribute("data-i18n") != null) {
            if (allLanguages[lang][document.getElementsByTagName("*")[i].getAttribute("data-i18n")] !== undefined) {
                document.getElementsByTagName("*")[i].innerHTML = allLanguages[lang][document.getElementsByTagName("*")[i].getAttribute("data-i18n")];
            }
        } else if (document.getElementsByTagName("*")[i].getAttribute("data-i18n-custom") != null) {
            let elmntCustomTag = document.getElementsByTagName("*")[i].getAttribute("data-i18n-custom");
            let splitElement = elmntCustomTag.split(":");
            if (allLanguages[lang][splitElement[1]] !== undefined) {
                document.getElementsByTagName("*")[i].setAttribute(splitElement[0], allLanguages[lang][splitElement[1]]);
            }
        }
    }
}

function notification(text) {
    let n = document.createElement("DIV");
    let z = document.createTextNode(text);
    n.classList.add("topNotification", "rightNotif");
    n.appendChild(z);

    document.getElementById("newNotifs").prepend(n);
    /*setTimeout(function(){
        let x = document.getElementById("newNotifs");
        x.removeChild(x.lastChild);
    },5000);*/
}
function updateRecentGames() {
    document.getElementById("recentGamesMenuBtn").style.display = "block";
    document.getElementById("recentGamesList").innerHTML = "";
    let j = JSON.parse(window.localStorage["recentGames"]);
    for (let i = 0; i < j.length; i++) {
        let x = document.createElement("a");
        x.classList.add("mainMenuButtons");
        x.innerText = allLanguages[lang]["recentGamesMenuAgainst"].replace("%player", j[i].name);
        x.setAttribute("onclick", `recentGame(${j[i].id})`);
        document.getElementById("recentGamesList").appendChild(x);
    }
}
function testIfTouch() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function isNeighbour(id1, id2) {
    for (let i = 0; i < neighbours[id1].length; i++) {
        if (neighbours[id1][i] === id2) return true;
    }
    return false;
}
function openMenu(id) {
    document.getElementById(id).style.display = "inline-block";
    menusStack.push(id);
    setTimeout(() => {
        document.getElementById(id).style.opacity = "1";
        document.getElementById(id).style.transform = "translate(-50%,-50%)";
    }, 100);
    for (let i = 0; i < menusStack.length; i++) {
        document.getElementById(menusStack[i]).style.zIndex = i + 100;
    }
}
function closeMenu(id) {
    document.getElementById(id).style.opacity = "0";
    document.getElementById(id).style.transform = "translate(-50%,-60%)";
    menusStack.remove(id);
    setTimeout(() => {
        document.getElementById(id).style.display = "none";
    }, 500);
    for (let i = 0; i < menusStack.length; i++) {
        document.getElementById(menusStack[i]).style.zIndex = i + 100;
    }
}
function generateName(){let e=["abandoned","able","absolute","adorable","adventurous","academic","acceptable","acclaimed","accomplished","accurate","aching","acidic","acrobatic","active","actual","adept","admirable","admired","adolescent","adorable","adored","advanced","afraid","affectionate","aged","aggravating","aggressive","agile","agitated","agonizing","agreeable","ajar","alarmed","alarming","alert","alienated","alive","all","altruistic","amazing","ambitious","ample","amused","amusing","anchored","ancient","angelic","angry","anguished","animated","annual","another","antique","anxious","any","apprehensive","appropriate","apt","arctic","arid","aromatic","artistic","ashamed","assured","astonishing","athletic","attached","attentive","attractive","austere","authentic","authorized","automatic","avaricious","average","aware","awesome","awful","awkward","babyish","bad","back","baggy","bare","barren","basic","beautiful","belated","beloved","beneficial","better","best","bewitched","big","big-hearted","biodegradable","bite-sized","bitter","black","black-and-white","bland","blank","blaring","bleak","blind","blissful","blond","blue","blushing","bogus","boiling","bold","bony","boring","bossy","both","bouncy","bountiful","bowed","brave","breakable","brief","bright","brilliant","brisk","broken","bronze","brown","bruised","bubbly","bulky","bumpy","buoyant","burdensome","burly","bustling","busy","buttery","buzzing","calculating","calm","candid","canine","capital","carefree","careful","careless","caring","cautious","cavernous","celebrated","charming","cheap","cheerful","cheery","chief","chilly","chubby","circular","classic","clean","clear","clear-cut","clever","close","closed","cloudy","clueless","clumsy","cluttered","coarse","cold","colorful","colorless","colossal","comfortable","common","compassionate","competent","complete","complex","complicated","composed","concerned","concrete","confused","conscious","considerate","constant","content","conventional","cooked","cool","cooperative","coordinated","corny","corrupt","costly","courageous","courteous","crafty","crazy","creamy","creative","creepy","criminal","crisp","critical","crooked","crowded","cruel","crushing","cuddly","cultivated","cultured","cumbersome","curly","curvy","cute","cylindrical","damaged","damp","dangerous","dapper","daring","darling","dark","dazzling","deadly","deafening","dear","dearest","decent","decimal","decisive","deep","defenseless","defensive","defiant","deficient","definite","definitive","delayed","delectable","delicious","delightful","delirious","demanding","dense","dental","dependable","dependent","descriptive","deserted","detailed","determined","devoted","different","difficult","digital","diligent","dim","dimpled","dimwitted","direct","disastrous","discrete","disfigured","disgusting","disloyal","dismal","distant","downright","dreary","dirty","disguised","dishonest","dismal","distant","distinct","distorted","dizzy","dopey","doting","double","downright","drab","drafty","dramatic","dreary","droopy","dry","dual","dull","dutiful","each","eager","earnest","early","easy","easy-going","ecstatic","edible","educated","elaborate","elastic","elated","elderly","electric","elegant","elementary","elliptical","embarrassed","embellished","eminent","emotional","empty","enchanted","enchanting","energetic","enlightened","enormous","enraged","entire","envious","equal","equatorial","essential","esteemed","ethical","euphoric","even","evergreen","everlasting","every","evil","exalted","excellent","exemplary","exhausted","excitable","excited","exciting","exotic","expensive","experienced","expert","extraneous","extroverted","extra-large","extra-small","fabulous","failing","faint","fair","faithful","fake","false","familiar","famous","fancy","fantastic","far","faraway","far-flung","far-off","fast","fat","fatal","fatherly","favorable","favorite","fearful","fearless","feisty","feline","female","feminine","few","fickle","filthy","fine","finished","firm","first","firsthand","fitting","fixed","flaky","flamboyant","flashy","flat","flawed","flawless","flickering","flimsy","flippant","flowery","fluffy","fluid","flustered","focused","fond","foolhardy","foolish","forceful","forked","formal","forsaken","forthright","fortunate","fragrant","frail","frank","frayed","free","French","fresh","frequent","friendly","frightened","frightening","frigid","frilly","frizzy","frivolous","front","frosty","frozen","frugal","fruitful","full","fumbling","functional","funny","fussy","fuzzy","gargantuan","gaseous","general","generous","gentle","genuine","giant","giddy","gigantic","gifted","giving","glamorous","glaring","glass","gleaming","gleeful","glistening","glittering","gloomy","glorious","glossy","glum","golden","good","good-natured","gorgeous","graceful","gracious","grand","grandiose","granular","grateful","grave","gray","great","greedy","green","gregarious","grim","grimy","gripping","grizzled","gross","grotesque","grouchy","grounded","growing","growling","grown","grubby","gruesome","grumpy","guilty","gullible","gummy","hairy","half","handmade","handsome","handy","happy","happy-go-lucky","hard","hard-to-find","harmful","harmless","harmonious","harsh","hasty","hateful","haunting","healthy","heartfelt","hearty","heavenly","heavy","hefty","helpful","helpless","hidden","hideous","high","high-level","hilarious","hoarse","hollow","homely","honest","honorable","honored","hopeful","horrible","hospitable","hot","huge","humble","humiliating","humming","humongous","hungry","hurtful","husky","icky","icy","ideal","idealistic","identical","idle","idiotic","idolized","ignorant","ill","illegal","ill-fated","ill-informed","illiterate","illustrious","imaginary","imaginative","immaculate","immaterial","immediate","immense","impassioned","impeccable","impartial","imperfect","imperturbable","impish","impolite","important","impossible","impractical","impressionable","impressive","improbable","impure","inborn","incomparable","incompatible","incomplete","inconsequential","incredible","indelible","inexperienced","indolent","infamous","infantile","infatuated","inferior","infinite","informal","innocent","insecure","insidious","insignificant","insistent","instructive","insubstantial","intelligent","intent","intentional","interesting","internal","international","intrepid","ironclad","irresponsible","irritating","itchy","jaded","jagged","jam-packed","jaunty","jealous","jittery","joint","jolly","jovial","joyful","joyous","jubilant","judicious","juicy","jumbo","junior","jumpy","juvenile","kaleidoscopic","keen","key","kind","kindhearted","kindly","klutzy","knobby","knotty","knowledgeable","knowing","known","kooky","kosher","lame","lanky","large","last","lasting","late","lavish","lawful","lazy","leading","lean","leafy","left","legal","legitimate","light","lighthearted","likable","likely","limited","limp","limping","linear","lined","liquid","little","live","lively","livid","loathsome","lone","lonely","long","long-term","loose","lopsided","lost","loud","lovable","lovely","loving","low","loyal","lucky","lumbering","luminous","lumpy","lustrous","luxurious","mad","made-up","magnificent","majestic","major","male","mammoth","married","marvelous","masculine","massive","mature","meager","mealy","mean","measly","meaty","medical","mediocre","medium","meek","mellow","melodic","memorable","menacing","merry","messy","metallic","mild","milky","mindless","miniature","minor","minty","miserable","miserly","misguided","misty","mixed","modern","modest","moist","monstrous","monthly","monumental","moral","mortified","motherly","motionless","mountainous","muddy","muffled","multicolored","mundane","murky","mushy","musty","muted","mysterious","naive","narrow","nasty","natural","naughty","nautical","near","neat","necessary","needy","negative","neglected","negligible","neighboring","nervous","new","next","nice","nifty","nimble","nippy","nocturnal","noisy","nonstop","normal","notable","noted","noteworthy","novel","noxious","numb","nutritious","nutty","obedient","obese","oblong","oily","oblong","obvious","occasional","odd","oddball","offbeat","offensive","official","old","old-fashioned","only","open","optimal","optimistic","opulent","orange","orderly","organic","ornate","ornery","ordinary","original","other","our","outlying","outgoing","outlandish","outrageous","outstanding","oval","overcooked","overdue","overjoyed","overlooked","palatable","pale","paltry","parallel","parched","partial","passionate","past","pastel","peaceful","peppery","perfect","perfumed","periodic","perky","personal","pertinent","pesky","pessimistic","petty","phony","physical","piercing","pink","pitiful","plain","plaintive","plastic","playful","pleasant","pleased","pleasing","plump","plush","polished","polite","political","pointed","pointless","poised","poor","popular","portly","posh","positive","possible","potable","powerful","powerless","practical","precious","present","prestigious","pretty","precious","previous","pricey","prickly","primary","prime","pristine","private","prize","probable","productive","profitable","profuse","proper","proud","prudent","punctual","pungent","puny","pure","purple","pushy","putrid","puzzled","puzzling","quaint","qualified","quarrelsome","quarterly","queasy","querulous","questionable","quick","quick-witted","quiet","quintessential","quirky","quixotic","quizzical","radiant","ragged","rapid","rare","rash","raw","recent","reckless","rectangular","ready","real","realistic","reasonable","red","reflecting","regal","regular","reliable","relieved","remarkable","remorseful","remote","repentant","required","respectful","responsible","repulsive","revolving","rewarding","rich","rigid","right","ringed","ripe","roasted","robust","rosy","rotating","rotten","rough","round","rowdy","royal","rubbery","rundown","ruddy","rude","runny","rural","rusty","sad","safe","salty","same","sandy","sane","sarcastic","sardonic","satisfied","scaly","scarce","scared","scary","scented","scholarly","scientific","scornful","scratchy","scrawny","second","secondary","second-hand","secret","self-assured","self-reliant","selfish","sentimental","separate","serene","serious","serpentine","several","severe","shabby","shadowy","shady","shallow","shameful","shameless","sharp","shimmering","shiny","shocked","shocking","shoddy","short","short-term","showy","shrill","shy","sick","silent","silky","silly","silver","similar","simple","simplistic","sinful","single","sizzling","skeletal","skinny","sleepy","slight","slim","slimy","slippery","slow","slushy","small","smart","smoggy","smooth","smug","snappy","snarling","sneaky","sniveling","snoopy","sociable","soft","soggy","solid","somber","some","spherical","sophisticated","sore","sorrowful","soulful","soupy","sour","Spanish","sparkling","sparse","specific","spectacular","speedy","spicy","spiffy","spirited","spiteful","splendid","spotless","spotted","spry","square","squeaky","squiggly","stable","staid","stained","stale","standard","starchy","stark","starry","steep","sticky","stiff","stimulating","stingy","stormy","straight","strange","steel","strict","strident","striking","striped","strong","studious","stunning","stupendous","stupid","sturdy","stylish","subdued","submissive","substantial","subtle","suburban","sudden","sugary","sunny","super","superb","superficial","superior","supportive","sure-footed","surprised","suspicious","svelte","sweaty","sweet","sweltering","swift","sympathetic","tall","talkative","tame","tan","tangible","tart","tasty","tattered","taut","tedious","teeming","tempting","tender","tense","tepid","terrible","terrific","testy","thankful","that","these","thick","thin","third","thirsty","this","thorough","thorny","those","thoughtful","threadbare","thrifty","thunderous","tidy","tight","timely","tinted","tiny","tired","torn","total","tough","traumatic","treasured","tremendous","tragic","trained","tremendous","triangular","tricky","trifling","trim","trivial","troubled","true","trusting","trustworthy","trusty","truthful","tubby","turbulent","twin","ugly","ultimate","unacceptable","unaware","uncomfortable","uncommon","unconscious","understated","unequaled","uneven","unfinished","unfit","unfolded","unfortunate","unhappy","unhealthy","uniform","unimportant","unique","united","unkempt","unknown","unlawful","unlined","unlucky","unnatural","unpleasant","unrealistic","unripe","unruly","unselfish","unsightly","unsteady","unsung","untidy","untimely","untried","untrue","unused","unusual","unwelcome","unwieldy","unwilling","unwitting","unwritten","upbeat","upright","upset","urban","usable","used","useful","useless","utilized","utter","vacant","vague","vain","valid","valuable","vapid","variable","vast","velvety","venerated","vengeful","verifiable","vibrant","vicious","victorious","vigilant","vigorous","villainous","violet","violent","virtual","virtuous","visible","vital","vivacious","vivid","voluminous","wan","warlike","warm","warmhearted","warped","wary","wasteful","watchful","waterlogged","watery","wavy","wealthy","weak","weary","webbed","wee","weekly","weepy","weighty","weird","welcome","well-documented","well-groomed","well-informed","well-lit","well-made","well-off","well-to-do","well-worn","wet","which","whimsical","whirlwind","whispered","white","whole","whopping","wicked","wide","wide-eyed","wiggly","wild","willing","wilted","winding","windy","winged","wiry","wise","witty","wobbly","woeful","wonderful","wooden","woozy","wordy","worldly","worn","worried","worrisome","worse","worst","worthless","worthwhile","worthy","wrathful","wretched","writhing","wrong","wry","yawning","yearly","yellow","yellowish","young","youthful","yummy","zany","zealous","zesty","zigzag","rocky"],i=["people","history","way","art","world","information","map","family","government","health","system","computer","meat","year","thanks","music","person","reading","method","data","food","understanding","theory","law","bird","literature","problem","software","control","knowledge","power","ability","economics","love","internet","television","science","library","nature","fact","product","idea","temperature","investment","area","society","activity","story","industry","media","thing","oven","community","definition","safety","quality","development","language","management","player","variety","video","week","security","country","exam","movie","organization","equipment","physics","analysis","policy","series","thought","basis","boyfriend","direction","strategy","technology","army","camera","freedom","paper","environment","child","instance","month","truth","marketing","university","writing","article","department","difference","goal","news","audience","fishing","growth","income","marriage","user","combination","failure","meaning","medicine","philosophy","teacher","communication","night","chemistry","disease","disk","energy","nation","road","role","soup","advertising","location","success","addition","apartment","education","math","moment","painting","politics","attention","decision","event","property","shopping","student","wood","competition","distribution","entertainment","office","population","president","unit","category","cigarette","context","introduction","opportunity","performance","driver","flight","length","magazine","newspaper","relationship","teaching","cell","dealer","debate","finding","lake","member","message","phone","scene","appearance","association","concept","customer","death","discussion","housing","inflation","insurance","mood","woman","advice","blood","effort","expression","importance","opinion","payment","reality","responsibility","situation","skill","statement","wealth","application","city","county","depth","estate","foundation","grandmother","heart","perspective","photo","recipe","studio","topic","collection","depression","imagination","passion","percentage","resource","setting","ad","agency","college","connection","criticism","debt","description","memory","patience","secretary","solution","administration","aspect","attitude","director","personality","psychology","recommendation","response","selection","storage","version","alcohol","argument","complaint","contract","emphasis","highway","loss","membership","possession","preparation","steak","union","agreement","cancer","currency","employment","engineering","entry","interaction","limit","mixture","preference","region","republic","seat","tradition","virus","actor","classroom","delivery","device","difficulty","drama","election","engine","football","guidance","hotel","match","owner","priority","protection","suggestion","tension","variation","anxiety","atmosphere","awareness","bread","climate","comparison","confusion","construction","elevator","emotion","employee","employer","guest","height","leadership","mall","manager","operation","recording","respect","sample","transportation","boring","charity","cousin","disaster","editor","efficiency","excitement","extent","feedback","guitar","homework","leader","mom","outcome","permission","presentation","promotion","reflection","refrigerator","resolution","revenue","session","singer","tennis","basket","bonus","cabinet","childhood","church","clothes","coffee","dinner","drawing","hair","hearing","initiative","judgment","lab","measurement","mode","mud","orange","poetry","police","possibility","procedure","queen","ratio","relation","restaurant","satisfaction","sector","signature","significance","song","tooth","town","vehicle","volume","wife","accident","airport","appointment","arrival","assumption","baseball","chapter","committee","conversation","database","enthusiasm","error","explanation","farmer","gate","girl","hall","historian","hospital","injury","instruction","maintenance","manufacturer","meal","perception","pie","poem","presence","proposal","reception","replacement","revolution","river","son","speech","tea","village","warning","winner","worker","writer","assistance","breath","buyer","chest","chocolate","conclusion","contribution","cookie","courage","desk","drawer","establishment","examination","garbage","grocery","honey","impression","improvement","independence","insect","inspection","inspector","king","ladder","menu","penalty","piano","potato","profession","professor","quantity","reaction","requirement","salad","sister","supermarket","tongue","weakness","wedding","affair","ambition","analyst","apple","assignment","assistant","bathroom","bedroom","beer","birthday","celebration","championship","cheek","client","consequence","departure","diamond","dirt","ear","fortune","friendship","funeral","gene","girlfriend","hat","indication","intention","lady","midnight","negotiation","obligation","passenger","pizza","platform","poet","pollution","recognition","reputation","shirt","speaker","stranger","surgery","sympathy","tale","throat","trainer","uncle","youth","time","work","film","water","money","example","while","business","study","game","life","form","air","day","place","number","part","field","fish","back","process","heat","hand","experience","job","book","end","point","type","home","economy","value","body","market","guide","interest","state","radio","course","company","price","size","card","list","mind","trade","line","care","group","risk","word","fat","force","key","light","training","name","school","top","amount","level","order","practice","research","sense","service","piece","web","boss","sport","fun","house","page","term","test","answer","sound","focus","matter","kind","soil","board","oil","picture","access","garden","range","rate","reason","future","site","demand","exercise","image","case","cause","coast","action","age","bad","boat","record","result","section","building","mouse","cash","class","period","plan","store","tax","side","subject","space","rule","stock","weather","chance","figure","man","model","source","beginning","earth","program","chicken","design","feature","head","material","purpose","question","rock","salt","act","birth","car","dog","object","scale","sun","note","profit","rent","speed","style","war","bank","craft","half","inside","outside","standard","bus","exchange","eye","fire","position","pressure","stress","advantage","benefit","box","frame","issue","step","cycle","face","item","metal","paint","review","room","screen","structure","view","account","ball","discipline","medium","share","balance","bit","black","bottom","choice","gift","impact","machine","shape","tool","wind","address","average","career","culture","morning","pot","sign","table","task","condition","contact","credit","egg","hope","ice","network","north","square","attempt","date","effect","link","post","star","voice","capital","challenge","friend","self","shot","brush","couple","exit","front","function","lack","living","plant","plastic","spot","summer","taste","theme","track","wing","brain","button","click","desire","foot","gas","influence","notice","rain","wall","base","damage","distance","feeling","pair","savings","staff","sugar","target","text","animal","author","budget","discount","file","ground","lesson","minute","officer","phase","reference","register","sky","stage","stick","title","trouble","bowl","bridge","campaign","character","club","edge","evidence","fan","letter","lock","maximum","novel","option","pack","park","quarter","skin","sort","weight","baby","background","carry","dish","factor","fruit","glass","joint","master","muscle","red","strength","traffic","trip","vegetable","appeal","chart","gear","ideal","kitchen","land","log","mother","net","party","principle","relative","sale","season","signal","spirit","street","tree","wave","belt","bench","commission","copy","drop","minimum","path","progress","project","sea","south","status","stuff","ticket","tour","angle","blue","breakfast","confidence","daughter","degree","doctor","dot","dream","duty","essay","father","fee","finance","hour","juice","luck","milk","mouth","peace","pipe","stable","storm","substance","team","trick","afternoon","bat","beach","blank","catch","chain","consideration","cream","crew","detail","gold","interview","kid","mark","mission","pain","pleasure","score","screw","sex","shop","shower","suit","tone","window","agent","band","bath","block","bone","calendar","candidate","cap","coat","contest","corner","court","cup","district","door","east","finger","garage","guarantee","hole","hook","implement","layer","lecture","lie","manner","meeting","nose","parking","partner","profile","rice","routine","schedule","swimming","telephone","tip","winter","airline","bag","battle","bed","bill","bother","cake","code","curve","designer","dimension","dress","ease","emergency","evening","extension","farm","fight","gap","grade","holiday","horror","horse","host","husband","loan","mistake","mountain","nail","noise","occasion","package","patient","pause","phrase","proof","race","relief","sand","sentence","shoulder","smoke","stomach","string","tourist","towel","vacation","west","wheel","wine","arm","aside","associate","bet","blow","border","branch","breast","brother","buddy","bunch","chip","coach","cross","document","draft","dust","expert","floor","golf","habit","iron","judge","knife","landscape","league","mail","mess","native","opening","parent","pattern","pin","pool","pound","request","salary","shame","shelter","shoe","silver","tackle","tank","trust","assist","bake","bar","bell","bike","blame","boy","brick","chair","closet","clue","collar","comment","conference","devil","diet","fear","fuel","glove","jacket","lunch","monitor","mortgage","nurse","pace","panic","peak","plane","reward","row","sandwich","shock","spite","spray","surprise","till","transition","weekend","welcome","yard","alarm","bend","bicycle","bite","blind","bottle","cable","candle","clerk","cloud","concert","counter","flower","grandfather","harm","knee","lawyer","leather","load","mirror","neck","pension","plate","purple","ruin","ship","skirt","slice","snow","specialist","stroke","switch","trash","tune","zone","anger","award","bid","bitter","boot","bug","camp","candy","carpet","cat","champion","channel","clock","comfort","cow","crack","engineer","entrance","fault","grass","guy","hell","highlight","incident","island","joke","jury","leg","lip","mate","motor","nerve","passage","pen","pride","priest","prize","promise","resident","resort","ring","roof","rope","sail","scheme","script","sock","station","toe","tower","truck","witness","can","will","other","use","make","good","look","help","go","great","being","still","public","read","keep","start","give","human","local","general","specific","long","play","feel","high","put","common","set","change","simple","past","big","possible","particular","major","personal","current","national","cut","natural","physical","show","try","check","second","call","move","pay","let","increase","single","individual","turn","ask","buy","guard","hold","main","offer","potential","professional","international","travel","cook","alternative","special","working","whole","dance","excuse","cold","commercial","low","purchase","deal","primary","worth","fall","necessary","positive","produce","search","present","spend","talk","creative","tell","cost","drive","green","support","glad","remove","return","run","complex","due","effective","middle","regular","reserve","independent","leave","original","reach","rest","serve","watch","beautiful","charge","active","break","negative","safe","stay","visit","visual","affect","cover","report","rise","walk","white","junior","pick","unique","classic","final","lift","mix","private","stop","teach","western","concern","familiar","fly","official","broad","comfortable","gain","rich","save","stand","young","heavy","lead","listen","valuable","worry","handle","leading","meet","release","sell","finish","normal","press","ride","secret","spread","spring","tough","wait","brown","deep","display","flow","hit","objective","shoot","touch","cancel","chemical","cry","dump","extreme","push","conflict","eat","fill","formal","jump","kick","opposite","pass","pitch","remote","total","treat","vast","abuse","beat","burn","deposit","print","raise","sleep","somewhere","advance","consist","dark","double","draw","equal","fix","hire","internal","join","kill","sensitive","tap","win","attack","claim","constant","drag","drink","guess","minor","pull","raw","soft","solid","wear","weird","wonder","annual","count","dead","doubt","feed","forever","impress","repeat","round","sing","slide","strip","wish","combine","command","dig","divide","equivalent","hang","hunt","initial","march","mention","spiritual","survey","tie","adult","brief","crazy","escape","gather","hate","prior","repair","rough","sad","scratch","sick","strike","employ","external","hurt","illegal","laugh","lay","mobile","nasty","ordinary","respond","royal","senior","split","strain","struggle","swim","train","upper","wash","yellow","convert","crash","dependent","fold","funny","grab","hide","miss","permit","quote","recover","resolve","roll","sink","slip","spare","suspect","sweet","swing","twist","upstairs","usual","abroad","brave","calm","concentrate","estimate","grand","male","mine","prompt","quiet","refuse","regret","reveal","rush","shake","shift","shine","steal","suck","surround","bear","brilliant","dare","dear","delay","drunk","female","hurry","inevitable","invite","kiss","neat","pop","punch","quit","reply","representative","resist","rip","rub","silly","smile","spell","stretch","stupid","tear","temporary","tomorrow","wake","wrap","yesterday","Thomas","Tom","Lieuwe"];return capFirst(e[getRandomInt(0,e.length+1)])+capFirst(i[getRandomInt(0,i.length+1)])}
function openVsDisplay(id) {
    document.getElementById(id).style.display = "block";
    setTimeout(() => {
        document.getElementById(id).style.opacity = "1";
        document.getElementById(id).style.transform = "translate(-50%,0) scale(1)";
        resizeUpdate();
    }, 100);
}
let timeout;
function closeVsDisplay(id) {
    document.getElementById(id).style.opacity = "0";
    document.getElementById(id).style.transform = "translate(-50%,0) scale(0)";
    setTimeout(() => {
        document.getElementById(id).style.display = "none";
        resizeUpdate();
    }, 500);
}
function openSettingsMenu() {
    openMenu("centerSettingsMenu");
    document.getElementById("centerMainMenu").style.filter = "brightness(0.7)";
}
function closeSettingsMenu() {
    closeMenu("centerSettingsMenu");
    document.getElementById("centerMainMenu").style.filter = "brightness(1)";
}
function openPlayMenu() {
    closeMenu("centerMainMenu");
    setTimeout(() => openMenu("playMenu"), 500);
}
function closePlayMenu() {
    closeMenu("playMenu");
    setTimeout(() => openMenu("centerMainMenu"), 500);
}
function closeCenterShareGameMenu() {
    closeMenu("centerShareGameMenu");
    window.location.hash = "#";
    document.getElementsByClassName("gameUI")[0].style.display = "none";
    document.getElementById("background").style.display = "block";
    setTimeout(() => openMenu("centerMainMenu"), 500);
}
function openRecentGamesMenu() {
    closeMenu("centerMainMenu");
    openMenu("recentGamesMenu");
}
function changeColorScheme(scheme, button) {
    var buttons = document.getElementsByClassName("colorSchemeButton");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("activeColorSchemeButton");
    }
    button.classList.add("activeColorSchemeButton");

    window.localStorage["colorScheme"] = scheme;

    applyColorScheme(eval(window.localStorage["colorScheme"]));
}
function applyColorScheme(scheme) {
    for (var i = 0; i < scheme.length; i++) {
        document.documentElement.style.setProperty("--" + scheme[i][0], scheme[i][1]);
        if (scheme[i][0] === "buttonBottom") {
            document.getElementById("themeColorMeta").setAttribute("content", scheme[i][1]);
        }
    }
}

function copyClip(id) {
    var copyText = document.getElementById(id);

    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    //Deselection
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}
function rematchBtn() {
    if(offlineGameType){
        window.localStorage.removeItem("offlineGame");
        offlineGame();
        closeMenu("winnerMenu");
    }
}
function offlineGame() {
    offlineGameType = true;
    if(localStorage["offlineGame"] == undefined || localStorage["offlineGame"] == null){
        localStorage["offlineGame"] = JSON.stringify({
            p1: {pawns: {white:2,black:2}, name: "Light", turn: true, Oarea: "bottom"},
            p2: {pawns: {white:2,black:2}, name: "Dark", turn: false, Oarea: "top"},
            pawnReserve: {white:10,black:10},
            gameBoard: [null,null,null,null,null,null,null,null,null,"blackBot",null,"whiteBot","redBot",null,null,null,null,null,null,null,null,null,null,null],
            ended: false
        });
    }
    fetchGameState(JSON.parse(localStorage["offlineGame"]));
    document.getElementById("background").style.display = "none";
    document.getElementsByClassName("gameUI")[0].style.display = "inline-block";
    closeMenu("playMenu");
    if (!JSON.parse(localStorage["offlineGame"]).ended) closeDarkerBg();

    openVsDisplay("ennemyDisplay");
    openVsDisplay("reserveInfo");
    resizeUpdate();
}
function onlineGame() {
    if (socket.connected) {
        beforeTime = Math.floor(new Date() / 1000);
        socket.emit("createroom", { GUID: localStorage["GUID"], name: localStorage["name"] });
        closeMenu("playMenu");
        openMenu("loader");
    } else {
        notification(allLanguages[lang]["serverError"]);
    }
}
/*window.onbeforeunload = function(){
    socket.disconnect();
};*/
window.onresize = resizeUpdate;

function resizeUpdate(event) {
    let boardHeight = document.getElementsByClassName("gameBoard")[0].clientHeight;
    let windowHeight = window.innerHeight;
    let boardWidth = document.getElementsByClassName("gameBoard")[0].clientWidth;
    let windowWidth = window.innerWidth;
    /*let padding = document.getElementById("yourTurnInfo").clientHeight + document.getElementById("ennemyDisplay").clientHeight + document.getElementById("placePawnMenu").clientHeight + document.getElementById("moveBotMenu").clientHeight;*/
    let padding = 100;
    if (windowWidth < windowHeight) {
        document.getElementsByClassName("gameBoardContainer")[0].style.transform = `scale(1)`;
        let halfUINodes = document.getElementsByClassName("halfUI");
        for (let i = 0; i < halfUINodes.length; i++) {
            halfUINodes[i].style.display = "block";
            halfUINodes[i].style.width = "100%";
            halfUINodes[i].style.float = "none";
        }
        document.getElementsByClassName("gameBoardContainer")[0].style.width = "100%";

        if ((boardHeight * windowWidth) / ((boardWidth * 384) / 537) > windowHeight - padding) {
            let scaleCoef = (windowHeight - padding) / boardHeight;
            document.getElementsByClassName("gameBoardContainer")[0].style.transform = `scale(${scaleCoef})`;
            if (area === "top") {
                document.getElementsByClassName("gameBoardContainer")[0].style.transform = `scale(${scaleCoef}) rotate(180deg) translate(0,-100%)`;
            }
        } else if ((boardWidth * 384) / 537 < windowWidth) {
            let scaleCoef = windowWidth / ((boardWidth * 384) / 537);
            document.getElementsByClassName("gameBoardContainer")[0].style.transform = `scale(${scaleCoef})`;
            if (area === "top") {
                document.getElementsByClassName("gameBoardContainer")[0].style.transform = `scale(${scaleCoef}) rotate(180deg) translate(0,-100%)`;
            }
        }
    } else {
        document.getElementsByClassName("gameBoardContainer")[0].style.transform = `scale(1)`;
        if (area === "top") {
            document.getElementsByClassName("gameBoardContainer")[0].style.transform = `scale(1) rotate(180deg) translate(0,-100%)`;
        }
        let halfUINodes = document.getElementsByClassName("halfUI");
        for (let i = 0; i < halfUINodes.length; i++) {
            halfUINodes[i].style.display = "inline-block";
            halfUINodes[i].style.width = "50%";
            halfUINodes[i].style.float = "left";
        }
        document.getElementsByClassName("gameBoardContainer")[0].style.width = "50%";
    }
}
function openAvailableActionsMenu() {
    openDarkerBg();
    openMenu("availableActionsMenu");
    document.getElementsByClassName("darkerBg")[0].addEventListener("click", closeAvailableActionsMenu);
}
function closeAvailableActionsMenu() {
    closeDarkerBg();
    closeMenu("availableActionsMenu");
    document.getElementsByClassName("darkerBg")[0].removeEventListener("click", closeAvailableActionsMenu);
}
function openReloadEnergyMenu() {
    openMenu("reloadEnergyMenu");
    closeMenu("availableActionsMenu");
    document.getElementsByClassName("darkerBg")[0].removeEventListener("click", closeAvailableActionsMenu);
    document.getElementsByClassName("darkerBg")[0].addEventListener("click", cancelReloadPawnsButton);
}
function cancelReloadPawnsButton() {
    closeMenu("reloadEnergyMenu");
    openMenu("availableActionsMenu");
    document.getElementsByClassName("darkerBg")[0].addEventListener("click", closeAvailableActionsMenu);
    document.getElementsByClassName("darkerBg")[0].removeEventListener("click", cancelReloadPawnsButton);
    reload = { white: 0, black: 0 };
    document.getElementById("pawnsReloadContainer").innerHTML = "";
    document.getElementById("reloadPawnsShowNew").innerText = "";
    document.getElementById("confirmReloadButton").style.display = "none";
    document.getElementById("reserveWhite").innerText = reserve.white;
    document.getElementById("reserveBlack").innerText = reserve.black;
}
function placingPawnChange(d) {
    placingPawn = d;
    let buttons = document.getElementsByClassName("pawnPlaceButton");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("activeColorSchemeButton");
    }
    if (d == "whitePawn") {
        buttons[0].classList.add("activeColorSchemeButton");
    } else {
        buttons[1].classList.add("activeColorSchemeButton");
    }
}
function sendReloadValue() {
    if (!offlineGameType){
        socket.emit("reloadPawns", reload);
        reload = { white: 0, black: 0 };
        document.getElementById("reloadPawnsShowNew").innerText = "";
        document.getElementById("confirmReloadButton").style.display = "none";
        document.getElementById("pawnsReloadContainer").innerHTML = "";
        document.getElementById("reserveWhite").innerText = reserve.white;
        document.getElementById("reserveBlack").innerText = reserve.black;
        closeMenu("reloadEnergyMenu");
        openMenu("availableActionsMenu");
    }else{
        let game = JSON.parse(localStorage["offlineGame"]);
        if(game.p1.turn){
            if (game.p1.pawns.white + game.p1.pawns.black < 4) {
                if (reload.white + reload.black == 4 - game.p1.pawns.white - game.p1.pawns.black || game.pawnReserve.white - reload.white === 0 || game.pawnReserve.black - reload.black === 0) {
                    if (reload.white <= game.pawnReserve.white && reload.black <= game.pawnReserve.black) {
                        game.pawnReserve.white -= reload.white;
                        game.pawnReserve.black -= reload.black;

                        game.p1.pawns.white += reload.white;
                        game.p1.pawns.black += reload.black;

                        game.p1.turn = false;

                        closeMenu("reloadEnergyMenu");
                        closeMenu("availableActionsMenu");

                        if (game.pawnReserve.white === 0 || game.pawnReserve.black === 0) {
                            if (findWinner(game.gameBoard)) {
                                document.getElementById("winnerName").innerText = game.p1.name + " won!";

                                openMenu("winnerMenu");
                                document.getElementsByClassName("darkerBg")[0].removeEventListener("click", cancelReloadPawnsButton);
                                openDarkerBg();
                                document.getElementById("yourTurnInfo").style.display = "none";
                            } else {
                                document.getElementById("winnerName").innerText = game.p2.name + " won!";

                                openMenu("winnerMenu");
                                document.getElementsByClassName("darkerBg")[0].removeEventListener("click", cancelReloadPawnsButton);
                                openDarkerBg();
                                document.getElementById("yourTurnInfo").style.display = "none";
                            }
                            game.ended = true;
                        } else {
                            closeDarkerBg();
                            game.p2.turn = true;
                        }
                    }
                }
            }
        }else if (game.p2.turn) {
            if (game.p2.pawns.white + game.p2.pawns.black < 4) {
                if (reload.white + reload.black == 4 - game.p2.pawns.white - game.p2.pawns.black || game.pawnReserve.white - reload.white === 0 || game.pawnReserve.black - reload.black === 0) {
                    if (reload.white <= game.pawnReserve.white && reload.black <= game.pawnReserve.black) {
                        game.pawnReserve.white -= reload.white;
                        game.pawnReserve.black -= reload.black;

                        game.p2.pawns.white += reload.white;
                        game.p2.pawns.black += reload.black;

                        game.p2.turn = false;

                        closeMenu("reloadEnergyMenu");
                        closeMenu("availableActionsMenu");

                        if (game.pawnReserve.white === 0 || game.pawnReserve.black === 0) {
                            if (findWinner(game.gameBoard)) {
                                document.getElementById("winnerName").innerText = game.p1.name + " won!";

                                openMenu("winnerMenu");
                                document.getElementsByClassName("darkerBg")[0].removeEventListener("click", cancelReloadPawnsButton);
                                openDarkerBg();
                                document.getElementById("yourTurnInfo").style.display = "none";
                            } else {
                                document.getElementById("winnerName").innerText = game.p2.name + " won!";

                                openMenu("winnerMenu");
                                document.getElementsByClassName("darkerBg")[0].removeEventListener("click", cancelReloadPawnsButton);
                                openDarkerBg();
                                document.getElementById("yourTurnInfo").style.display = "none";
                            }
                            game.ended = true;
                        } else {
                            closeDarkerBg();
                            game.p1.turn = true;
                        }
                    }
                }
            }
        }

        fetchGameState(game);
        localStorage["offlineGame"] = JSON.stringify(game);
        reload = { white: 0, black: 0 };
    }
}
function findWinner(gameBoard){
    let p1Count = 0, p2Count = 0;
    for (let i = 0; i < gameBoard.length; i++) {
        if(gameBoard[i] === "blackBot" || gameBoard[i] === "whiteBot" || gameBoard[i] === "redBot"){
            if(i <= 9 || i === 13 || i === 11){
                p2Count++;
            }else{
                p1Count++;
            }
        }
    }
    //True is p1, false is p2
    return p1Count > p2Count;
}
function addToReload(p) {
    if (reload.white + reload.black === toreload) return;
    if (isNaN(reload.white)|| isNaN(reload.black)) cancelReloadPawnsButton();
    if (p === "whitePawn") {
        if (parseInt(document.getElementById("reserveWhite").innerText) === 0) return;
        else {
            document.getElementById("reserveWhite").innerText--;
            reload.white++;
        }
    } else if (p === "blackPawn") {
        if (parseInt(document.getElementById("reserveBlack").innerText) === 0) return;
        else {
            document.getElementById("reserveBlack").innerText--;
            reload.black++;
        }
    }
    let dot = document.createElement("div");
    dot.classList.add("pawnDot");
    if (p === "whitePawn") dot.classList.add("whitePawnDot");

    document.getElementById("reloadPawnsShowNew").innerText = allLanguages[lang]["energyPawnsReloadDescritpion"];
    document.getElementById("confirmReloadButton").style.display = "block";
    document.getElementById("pawnsReloadContainer").appendChild(dot);
}
function closeRecentGamesMenu() {
    closeMenu("recentGamesMenu");
    openMenu("centerMainMenu");
}
function fetchGameState(gameState){
    let you, ennemy;
    if (offlineGameType){
        document.getElementById("yourName").innerText = gameState.p1.name;
        document.getElementById("ennemyName").innerText = gameState.p2.name;

        clearHighlightedCells();
        movingBot = false;
        placingPawn = false;
        gameBoard = gameState.gameBoard;


        if (gameState.p1.turn){
            you = gameState.p1;
            ennemy = gameState.p2;
        }else{
            you = gameState.p2;
            ennemy = gameState.p1;
        }
        document.getElementById("thinking").style.display = "none";
        if (you.turn) {
            document.getElementById("yourTurnInfo").style.display = "block";
        }else{
            document.getElementById("yourTurnInfo").style.display = "none";
        }
        document.getElementById("myPawns").innerHTML = "";
        document.getElementById("ennemyPawns").innerHTML = "";
        for (let i = 0; i < gameState.p1.pawns.black; i++) {
            let dot = document.createElement("div");
            dot.classList.add("pawnDot");
            document.getElementById("myPawns").appendChild(dot);
        }
        for (let i = 0; i < gameState.p1.pawns.white; i++) {
            let dot = document.createElement("div");
            dot.classList.add("pawnDot");
            dot.classList.add("whitePawnDot");
            document.getElementById("myPawns").appendChild(dot);
        }
        for (let i = 0; i < gameState.p2.pawns.black; i++) {
            let dot = document.createElement("div");
            dot.classList.add("pawnDot");
            document.getElementById("ennemyPawns").appendChild(dot);
        }
        for (let i = 0; i < gameState.p2.pawns.white; i++) {
            let dot = document.createElement("div");
            dot.classList.add("pawnDot");
            dot.classList.add("whitePawnDot");
            document.getElementById("ennemyPawns").appendChild(dot);
        }
        document.getElementById("placePawnWhite").innerText = you.pawns.white;
        document.getElementById("placePawnBlack").innerText = you.pawns.black;

        let tableOverlay = document.getElementsByClassName("tableOverlay")[0];
        tableOverlay.innerHTML = "";
        for (let i = 0; i < gameState.gameBoard.length; i++) {
            let x = document.createElement("img");
            x.classList.add("boardElement");
            x.classList.add("botBoardElement");
            if (gameState.gameBoard[i] == "blackBot") {
                x.setAttribute("src", "images/sprites/blackRobot.svg");
                x.id = "blackBot";
                x.style.top = positionInBoardById[i][0] + "%";
                x.style.left = positionInBoardById[i][1] + "%";
                tableOverlay.appendChild(x);
            } else if (gameState.gameBoard[i] == "whiteBot") {
                x.setAttribute("src", "images/sprites/whiteRobot.svg");
                x.id = "whiteBot";
                x.style.top = positionInBoardById[i][0] + "%";
                x.style.left = positionInBoardById[i][1] + "%";
                tableOverlay.appendChild(x);
            } else if (gameState.gameBoard[i] == "redBot") {
                x.setAttribute("src", "images/sprites/redRobot.svg");
                x.id = "redBot";
                x.style.top = positionInBoardById[i][0] + "%";
                x.style.left = positionInBoardById[i][1] + "%";
                tableOverlay.appendChild(x);
            } else if (gameState.gameBoard[i] == "blackPawn") {
                x.setAttribute("src", "images/sprites/blackDot.png");
                x.style.top = positionInBoardById[i][0] + "%";
                x.style.left = positionInBoardById[i][1] + "%";
                x.id = `boardOverlayPawn${i}`;
                tableOverlay.appendChild(x);
            } else if (gameState.gameBoard[i] == "whitePawn") {
                x.setAttribute("src", "images/sprites/whiteDot.png");
                x.style.top = positionInBoardById[i][0] + "%";
                x.style.left = positionInBoardById[i][1] + "%";
                x.id = `boardOverlayPawn${i}`;
                tableOverlay.appendChild(x);
            }
        }
        reserve = gameState.pawnReserve;

        document.getElementById("reserveWhite").innerText = gameState.pawnReserve.white;
        document.getElementById("reserveBlack").innerText = gameState.pawnReserve.black;
        document.getElementById("topReserveWhite").innerText = gameState.pawnReserve.white;
        document.getElementById("topReserveBlack").innerText = gameState.pawnReserve.black;
        document.getElementById("textReloadPawns").innerText = allLanguages[lang]["energyPawnsReloadAction"].replace("%actual", you.pawns.white + you.pawns.black).replace("%future", 4 - you.pawns.white - you.pawns.black);
        document.getElementById("yourTurnDesc").innerText = allLanguages[lang]["yourTurnDescOffline"].replace("%name", you.name);
        document.getElementById("pawnsReloadContainer").innerHTML = "";

        document.getElementById("reloadPawnsShowNew").innerText = "";
        document.getElementById("confirmReloadButton").style.display = "none";

        toreload = 4 - you.pawns.white - you.pawns.black;

        if (you.pawns.white + you.pawns.black === 4) {
            document.getElementById("reloadEnergyOptionButton").classList.add("disabledOptionButton");
            document.getElementById("placePawnOptionButton").classList.remove("disabledOptionButton");
        } else if (you.pawns.white + you.pawns.black === 0) {
            document.getElementById("placePawnOptionButton").classList.add("disabledOptionButton");
        } else {
            document.getElementById("reloadEnergyOptionButton").classList.remove("disabledOptionButton");
            document.getElementById("placePawnOptionButton").classList.remove("disabledOptionButton");
        }

        let buttons = document.getElementsByClassName("pawnPlaceButton");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("activeColorSchemeButton");
        }
        if (gameState.ended) {
            openMenu("winnerMenu");
            openDarkerBg();
        }
    }else{
        movingBot = false;
        clearHighlightedCells();
        if (gameState.p1.you) {
            you = gameState.p1;
            ennemy = gameState.p2;
        } else {
            you = gameState.p2;
            ennemy = gameState.p1;
        }

        let recentGames = JSON.parse(localStorage["recentGames"]);
        for (let i = 0; i < recentGames.length; i++) {
            if (recentGames[i].id === gameState.id) {
                recentGames.splice(i, 1);
            }
        }
        recentGames.push({id: gameState.id, name: ennemy.name});

        localStorage["recentGames"] = JSON.stringify(recentGames);

        if (ennemy.turn) document.getElementById("thinking").style.display = "inline-block";
        else document.getElementById("thinking").style.display = "none";

        gameBoard = gameState.gameBoard;
        area = you.area;

        if (you.turn) {
            document.getElementById("yourTurnInfo").style.display = "block";
        } else {
            document.getElementById("yourTurnInfo").style.display = "none";
        }
        placingPawn = false;
        document.getElementById("yourName").innerText = you.name;
        document.getElementById("ennemyName").innerText = ennemy.name;

        document.getElementById("myPawns").innerHTML = "";
        document.getElementById("ennemyPawns").innerHTML = "";
        for (let i = 0; i < you.pawns.black; i++) {
            let dot = document.createElement("div");
            dot.classList.add("pawnDot");
            document.getElementById("myPawns").appendChild(dot);
        }
        for (let i = 0; i < you.pawns.white; i++) {
            let dot = document.createElement("div");
            dot.classList.add("pawnDot");
            dot.classList.add("whitePawnDot");
            document.getElementById("myPawns").appendChild(dot);
        }
        for (let i = 0; i < ennemy.pawns.black; i++) {
            let dot = document.createElement("div");
            dot.classList.add("pawnDot");
            document.getElementById("ennemyPawns").appendChild(dot);
        }
        for (let i = 0; i < ennemy.pawns.white; i++) {
            let dot = document.createElement("div");
            dot.classList.add("pawnDot");
            dot.classList.add("whitePawnDot");
            document.getElementById("ennemyPawns").appendChild(dot);
        }
        document.getElementById("placePawnWhite").innerText = you.pawns.white;
        document.getElementById("placePawnBlack").innerText = you.pawns.black;
        //Clear displayed game board
        let tableOverlay = document.getElementsByClassName("tableOverlay")[0];
        tableOverlay.innerHTML = "";
        for (let i = 0; i < gameState.gameBoard.length; i++) {
            let x = document.createElement("img");
            if (area === "top") {
                x.classList.add("botTopArea");
            }
            x.classList.add("boardElement");
            x.classList.add("botBoardElement");
            if (gameState.gameBoard[i] == "blackBot") {
                x.setAttribute("src", "images/sprites/blackRobot.svg");
                x.id = "blackBot";
                x.style.top = positionInBoardById[i][0] + "%";
                x.style.left = positionInBoardById[i][1] + "%";
                tableOverlay.appendChild(x);
            } else if (gameState.gameBoard[i] == "whiteBot") {
                x.setAttribute("src", "images/sprites/whiteRobot.svg");
                x.id = "whiteBot";
                x.style.top = positionInBoardById[i][0] + "%";
                x.style.left = positionInBoardById[i][1] + "%";
                tableOverlay.appendChild(x);
            } else if (gameState.gameBoard[i] == "redBot") {
                x.setAttribute("src", "images/sprites/redRobot.svg");
                x.id = "redBot";
                x.style.top = positionInBoardById[i][0] + "%";
                x.style.left = positionInBoardById[i][1] + "%";
                tableOverlay.appendChild(x);
            } else if (gameState.gameBoard[i] == "blackPawn") {
                x.setAttribute("src", "images/sprites/blackDot.png");
                x.style.top = positionInBoardById[i][0] + "%";
                x.style.left = positionInBoardById[i][1] + "%";
                x.id = `boardOverlayPawn${i}`;
                tableOverlay.appendChild(x);
            } else if (gameState.gameBoard[i] == "whitePawn") {
                x.setAttribute("src", "images/sprites/whiteDot.png");
                x.style.top = positionInBoardById[i][0] + "%";
                x.style.left = positionInBoardById[i][1] + "%";
                x.id = `boardOverlayPawn${i}`;
                tableOverlay.appendChild(x);
            } else {

            }
        }
        reserve = gameState.pawnReserve;
        document.getElementById("reserveWhite").innerText = gameState.pawnReserve.white;
        document.getElementById("reserveBlack").innerText = gameState.pawnReserve.black;
        document.getElementById("topReserveWhite").innerText = gameState.pawnReserve.white;
        document.getElementById("topReserveBlack").innerText = gameState.pawnReserve.black;
        document.getElementById("textReloadPawns").innerText = allLanguages[lang]["energyPawnsReloadAction"].replace("%actual", you.pawns.white + you.pawns.black).replace("%future", 4 - you.pawns.white - you.pawns.black);
        document.getElementById("yourTurnDesc").innerText = allLanguages[lang]["yourTurnDesc"];
        document.getElementById("pawnsReloadContainer").innerHTML = "";

        document.getElementById("reloadPawnsShowNew").innerText = "";
        document.getElementById("confirmReloadButton").style.display = "none";

        toreload = 4 - you.pawns.white - you.pawns.black;

        if (you.pawns.white + you.pawns.black === 4) {
            document.getElementById("reloadEnergyOptionButton").classList.add("disabledOptionButton");
            document.getElementById("placePawnOptionButton").classList.remove("disabledOptionButton");
        } else if (you.pawns.white + you.pawns.black === 0) {
            document.getElementById("placePawnOptionButton").classList.add("disabledOptionButton");
        } else {
            document.getElementById("reloadEnergyOptionButton").classList.remove("disabledOptionButton");
            document.getElementById("placePawnOptionButton").classList.remove("disabledOptionButton");
        }

        let buttons = document.getElementsByClassName("pawnPlaceButton");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("activeColorSchemeButton");
        }
        if (gameState.ended) {
            openMenu("winnerMenu");
            openDarkerBg();
        }
    }
}
function placePawnOption() {
    closeMenu("availableActionsMenu");
    closeDarkerBg();
    openVsDisplay("placePawnMenu");
    document.getElementById("yourTurnInfo").style.display = "none";
}
function cancelPlacePawnOption() {
    placingPawn = false;
    openMenu("availableActionsMenu");
    openDarkerBg();
    closeVsDisplay("placePawnMenu");
    document.getElementById("yourTurnInfo").style.display = "block";
}

function clearHighlightedCells() {
    try {
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
        document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");
    } catch (e) {}
}
function showIds() {
    let tableOverlay = document.getElementsByClassName("tableOverlay")[0];
    tableOverlay.innerHTML = "";
    for (let i = 0; i < 24; i++) {
        x = document.createElement("span");
        x.classList.add("boardElement");
        x.style.fontSize = "40px";
        x.innerText = i;
        x.style.top = positionInBoardById[i][0] + "%";
        x.style.left = positionInBoardById[i][1] + "%";
        tableOverlay.appendChild(x);
    }
}
function boardClick(element, n) {
    if (placingPawn) {
        if (!offlineGameType) socket.emit("placingPawn", { color: placingPawn, pos: n });
        else{
            let gameState = JSON.parse(localStorage["offlineGame"]);
            if(gameState.p1.turn){
                if(placingPawn == "whitePawn" && gameState.p1.pawns.white >= 1){
                    if (gameState.gameBoard[n] == null){
                        gameState.gameBoard[n] = "whitePawn";
                        gameState.p1.pawns.white--;
                    }else return;
                }else if(placingPawn == "blackPawn" && gameState.p1.pawns.black >= 1){
                    if (gameState.gameBoard[n] == null){
                        gameState.gameBoard[n] = "blackPawn";
                        gameState.p1.pawns.black--;
                    }else return;
                }else return;
                gameState.p1.turn = false;
                gameState.p2.turn = true;
            }else if (gameState.p2.turn){
                if(placingPawn == "whitePawn" && gameState.p2.pawns.white >= 1){
                    if (gameState.gameBoard[n] == null){
                        gameState.gameBoard[n] = "whitePawn";
                        gameState.p2.pawns.white--;
                    }else return;
                }else if(placingPawn == "blackPawn" && gameState.p2.pawns.black >= 1){
                    if (gameState.gameBoard[n] == null){
                        gameState.gameBoard[n] = "blackPawn";
                        gameState.p2.pawns.black--;
                    }else return;
                }else return;
                gameState.p1.turn = true;
                gameState.p2.turn = false;
            }
            closeVsDisplay("placePawnMenu");
            fetchGameState(gameState);
            localStorage["offlineGame"] = JSON.stringify(gameState);
        }
    } else if (movingBot) {
        if (gameBoard[n] === "blackBot" || gameBoard[n] === "whiteBot" || gameBoard[n] === "redBot") {
            clearHighlightedCells();
            element.firstElementChild.classList.add("highlightedCells");
            movingBotPath.bot = gameBoard[n];
            movingBotPath.path = [n];
            document.getElementById("confirmRobotPath").style.display = "none";
        } else if (
            (gameBoard[n] === "blackPawn" && movingBotPath.bot === "blackBot") ||
            (gameBoard[n] === "whitePawn" && movingBotPath.bot === "whiteBot") ||
            ((gameBoard[n] === "blackPawn" || gameBoard[n] === "whitePawn") && movingBotPath.bot === "redBot")
        ) {
            if (isNeighbour(n, movingBotPath.path[movingBotPath.path.length - 1])) {
                element.firstElementChild.classList.add("highlightedCells");
                movingBotPath.path.push(n);
                document.getElementById("confirmRobotPath").style.display = "block";
            }
        }
    }
}
function updateName() {
    socket.emit("updateName", document.getElementById("nameTextInput").value);
    localStorage["name"] = document.getElementById("nameTextInput").value;
}
function confirmRobotPath() {
    if(!offlineGameType) socket.emit("moveRobot", movingBotPath);
    else{
        let game = JSON.parse(localStorage["offlineGame"]);
        if(game.p1.turn){
            for (let i = 0; i < game.gameBoard.length; i++) {
                if(game.gameBoard[i] === movingBotPath.bot && movingBotPath.path[0] === i){
                    for (let j = 0; j < movingBotPath.path.length - 1; j++) {
                        if(!((game.gameBoard[movingBotPath.path[j+1]]   === "blackPawn" && movingBotPath.bot === "blackBot") ||
                            (game.gameBoard[movingBotPath.path[j+1]]  === "whitePawn" && movingBotPath.bot === "whiteBot") ||
                            ((game.gameBoard[movingBotPath.path[j+1]] === "blackPawn" || game.gameBoard[movingBotPath.path[j+1]] === "whitePawn") && movingBotPath.bot === "redBot"))) {
                            return;
                        }
                    }
                    for (let j = 0; j < movingBotPath.path.length; j++) {
                        game.gameBoard[movingBotPath.path[j]] = null;
                    }

                    game.gameBoard[movingBotPath.path[movingBotPath.path.length - 1]] = movingBotPath.bot;

                    game.p1.turn = false;
                    game.p2.turn = true;

                    closeVsDisplay("moveBotMenu");
                    document.getElementById("confirmRobotPath").style.display = "none";

                    for (let i = 0; i < movingBotPath.path.length; i++) {
                        setTimeout(() => {
                            let x = document.getElementById(movingBotPath.bot);
                            x.style.top = positionInBoardById[movingBotPath.path[i]][0] + "%";
                            x.style.left = positionInBoardById[movingBotPath.path[i]][1] + "%";
                            document.getElementById(`boardOverlayPawn${movingBotPath.path[i]}`).style.display = "none";
                        }, i * 500);
                    }
                    setTimeout(() => {
                        fetchGameState(game);
                        localStorage["offlineGame"] = JSON.stringify(game);
                        movingBotPath = {};
                    }, movingBotPath.path.length * 500);
                }
            }
        }else if(game.p2.turn){
            for (let i = 0; i < game.gameBoard.length; i++) {
                if(game.gameBoard[i] === movingBotPath.bot && movingBotPath.path[0] === i){
                    for (let j = 0; j < movingBotPath.path.length - 1; j++) {
                        if(!((game.gameBoard[movingBotPath.path[j+1]]   === "blackPawn" && movingBotPath.bot === "blackBot") ||
                            (game.gameBoard[movingBotPath.path[j+1]]  === "whitePawn" && movingBotPath.bot === "whiteBot") ||
                            ((game.gameBoard[movingBotPath.path[j+1]] === "blackPawn" || game.gameBoard[movingBotPath.path[j+1]] === "whitePawn") && movingBotPath.bot === "redBot"))) {
                            return;
                        }
                    }
                    for (let j = 0; j < movingBotPath.path.length; j++) {
                        game.gameBoard[movingBotPath.path[j]] = null;
                    }

                    game.gameBoard[movingBotPath.path[movingBotPath.path.length - 1]] = movingBotPath.bot;

                    game.p1.turn = true;
                    game.p2.turn = false;

                    closeVsDisplay("moveBotMenu");
                    document.getElementById("confirmRobotPath").style.display = "none";

                    for (let i = 0; i < movingBotPath.path.length; i++) {
                        setTimeout(() => {
                            let x = document.getElementById(movingBotPath.bot);
                            x.style.top = positionInBoardById[movingBotPath.path[i]][0] + "%";
                            x.style.left = positionInBoardById[movingBotPath.path[i]][1] + "%";
                            document.getElementById(`boardOverlayPawn${movingBotPath.path[i]}`).style.display = "none";
                        }, i * 500);
                    }
                    setTimeout(() => {
                        fetchGameState(game);
                        localStorage["offlineGame"] = JSON.stringify(game);
                        movingBotPath = {};
                    }, movingBotPath.path.length * 500);
                }
            }
        }
        
    }
}
function cancelMoveBotOption() {
    movingBot = false;
    movingBotPath = {};
    clearHighlightedCells();
    closeVsDisplay("moveBotMenu");
    openMenu("availableActionsMenu");
    openDarkerBg();
    document.getElementById("yourTurnInfo").style.display = "block";
    document.getElementById("confirmRobotPath").style.display = "none";
}
function openMainMenu() {
    openMenu("centerMainMenu");
    openDarkerBg();
    document.getElementById("mainMenuResumeBtn").style.display = "block";
    document.getElementsByClassName("darkerBg")[0].addEventListener("click", closeMainMenu);
}
function closeMainMenu() {
    if (menusStack[menusStack.length - 1] === "centerSettingsMenu") {
        closeSettingsMenu();
        return;
    } else if (menusStack[menusStack.length - 1] === "recentGamesMenu") {
        closeRecentGamesMenu();
        return;
    } else if (menusStack[menusStack.length - 1] === "playMenu") {
        closePlayMenu();
        return;
    }
    closeDarkerBg();
    setTimeout(() => (document.getElementById("mainMenuResumeBtn").style.display = "none"), 300);
    document.getElementsByClassName("darkerBg")[0].removeEventListener("click", closeMainMenu);
    closeMenu("centerMainMenu");
}
function recentGame(id) {
    socket.emit("joinroom", { GUID: localStorage["GUID"], roomId: id, name: localStorage["name"] });
    closeMenu("recentGamesMenu");
}
function openDarkerBg() {
    document.getElementsByClassName("darkerBg")[0].style.display = "inline-block";
    setTimeout(() => {
        document.getElementsByClassName("darkerBg")[0].style.opacity = "1";
    }, 100);
}
function closeDarkerBg() {
    document.getElementsByClassName("darkerBg")[0].style.opacity = "0";
    setTimeout(() => {
        document.getElementsByClassName("darkerBg")[0].style.display = "none";
    }, 500);
}
function moveBot() {
    movingBot = true;
    openVsDisplay("moveBotMenu");
    closeMenu("availableActionsMenu");
    closeDarkerBg();
    document.getElementById("yourTurnInfo").style.display = "none";
}
socket.on("gotoroom", (data) => {
    afterTime = Math.floor(new Date() / 1000);
    offlineGameType = false;
    console.log(data);
    try {
        if (beforeTime + 2 > afterTime) {
            setTimeout(() => {
                closeMenu("loader");
                openMenu("centerShareGameMenu");
                openDarkerBg();
                document.getElementsByClassName("gameUI")[0].style.display = "inline-block";
                resizeUpdate();
                window.location.hash = `#${data.id}`;
                document.getElementById("background").style.display = "none";
            }, (afterTime + 2 - beforeTime) * 1000);
        } else throw "err";
    } catch (e) {
        closeMenu("loader");
        openMenu("centerShareGameMenu");
        openDarkerBg();
        document.getElementsByClassName("gameUI")[0].style.display = "inline-block";
        resizeUpdate();
        window.location.hash = `#${data.id}`;
        document.getElementById("background").style.display = "none";
    }
    document.getElementById("linkTextInput").value = "localhost:8080/#" + data.id;
    localStorage["GUID"] = data.GUID;
});
socket.on("GUID", (data) => {
    localStorage["GUID"] = data;
});
socket.on("nameChanged", (data) => {
    if (data.you) {
        document.getElementById("yourName").innerText = data.name;
    } else {
        document.getElementById("ennemyName").innerText = data.name;

        let recentGames = JSON.parse(localStorage["recentGames"]);
        for (let i = 0; i < recentGames.length; i++) {
            if (recentGames[i].id === data.id) {
                recentGames.splice(i, 1);
            }
        }
        recentGames.push({ id: data.id, name: data.name });

        localStorage["recentGames"] = JSON.stringify(recentGames);
        updateRecentGames();
    }
});
socket.on("ennemyOffline", () => console.info("Ennemy OFFline"));
socket.on("ennemyOnline", () => console.error("Ennemy ONline"));

socket.on("yourTurn", (data) => {
    clearTimeout(timeout);
    document.getElementById("yourTurnInfo").style.display = "block";
    document.getElementById("thinking").style.display = "none";
});
socket.on("ennemmyTurn", () => {
    document.getElementById("thinking").style.display = "inline-block";
});
socket.on("wrongroom", () => {
    window.location.hash = "";
    load();
    closeMenu("loader");
});
socket.on("startgame", (data) => {
    if (!data.ended) closeDarkerBg();
    offlineGameType = false;
    closeMenu("centerShareGameMenu");
    closeMenu("centerMainMenu");
    document.getElementById("background").style.display = "none";
    window.location.hash = `#${data.id}`;
    closeMenu("loader");
    fetchGameState(data);
    document.getElementsByClassName("gameUI")[0].style.display = "inline-block";
    resizeUpdate();
    console.log(data);
    openVsDisplay("ennemyDisplay");
    openVsDisplay("reserveInfo");
});
socket.on("placedPawn", (data) => {
    closeVsDisplay("placePawnMenu");

    fetchGameState(data.state);
});
function mainMenuAfterGame() {
    window.location.hash = "";
    window.location.reload();
}
socket.on("reloadedPawn", (data) => {
    fetchGameState(data);
    closeMenu("reloadEnergyMenu");
    closeMenu("availableActionsMenu");
    closeDarkerBg();
});
socket.on("movedBot", (data) => {
    console.log(data);
    console.log(JSON.stringify(data));

    closeVsDisplay("moveBotMenu");
    document.getElementById("confirmRobotPath").style.display = "none";

    for (let i = 0; i < data.move.path.length; i++) {
        setTimeout(() => {
            let x = document.getElementById(data.move.bot);
            x.style.top = positionInBoardById[data.move.path[i]][0] + "%";
            x.style.left = positionInBoardById[data.move.path[i]][1] + "%";
            document.getElementById(`boardOverlayPawn${data.move.path[i]}`).style.display = "none";
        }, i * 500);
    }
    setTimeout(() => fetchGameState(data.state), data.move.path.length * 500);
});

socket.on("winner", (data) => {
    if (data.you) {
        document.getElementById("winnerName").innerText = allLanguages[lang]["youWon"];
    } else {
        document.getElementById("winnerName").innerText = allLanguages[lang]["youLost"];
    }
    openMenu("winnerMenu");
    openDarkerBg();
    document.getElementById("yourTurnInfo").style.display = "none";
});

const shareBtn = document.getElementById("shareButton");

shareBtn.addEventListener("click", () => {
    if (navigator.share) {
        navigator
            .share({
                title: allLanguages[lang]["shareTextTitle"],
                text: allLanguages[lang]["shareTextText"],
                url: window.location.href,
            })
            .then(() => {
                console.log("Thanks for sharing!");
            })
            .catch((err) => {
                console.log(`Couldn't share because of`, err.message);
            });
    } else {
        console.log("web share not supported");
    }
});

function generateBackgroundParticles(q = 1) {
    setTimeout(() => {
        for (let i = 0; i < q; i++) {
            let x = document.createElement("img");
            x.classList.add("bckElement");
            x.style.top = `${Math.floor(Math.random() * 20)}%`;
            x.style.left = `${Math.floor(Math.random() * 101)}%`;
            x.style.width = `${Math.floor(Math.random() * 32) + 20}px`;
            switch (Math.floor(Math.random() * 6)) {
                case 0:
                    x.setAttribute("src", "images/sprites/blackRobot.svg");
                    break;
                case 1:
                    x.setAttribute("src", "images/sprites/whiteRobot.svg");
                    break;
                case 2:
                    x.setAttribute("src", "images/sprites/redRobot.svg");
                    break;
                case 3:
                    x.setAttribute("src", "images/sprites/robotoriLogo.svg");
                    break;
                case 4:
                    x.setAttribute("src", "images/sprites/blackDot.png");
                    break;
                case 5:
                    x.setAttribute("src", "images/sprites/whiteDot.png");
                    break;
            }
            document.getElementById("background").appendChild(x);
            setTimeout(() => {
                x.style.opacity = "1";
                //x.style.left = `${Math.floor(Math.random() * 101)}%`;
                x.style.top = `${100 - Math.floor(Math.random() * 20)}%`;
            }, 10);
            setTimeout(() => {
                x.style.opacity = "0";
            }, 1000);
            setTimeout(() => {
                document.getElementById("background").removeChild(x);
            }, 1500);
        }
    }, Math.floor(Math.random() * 101));
}

