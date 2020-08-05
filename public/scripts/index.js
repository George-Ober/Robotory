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
let reserve = {white:10, black:10};
let reload = {white:0, black:0};
let toreload = 0;
let area = "bottom";
let gameBoard = [];
let movingBot = false;
let movingBotPath = {};
//First one is the top, second one is the left
const positionInBoardById = [
    [8.5, 50],
    [16.5, 36.4],
    [16.5, 63.4],
    [25.5,22.7],
    [25.5,50],
    [25.5,77],
    [33.5, 36.4],
    [33.5, 63.4],
    [41.5,22.7],
    [41.5,50],
    [41.5,77],
    [49.5, 36.4],
    [49.5, 63.4],
    [58.5,22.7],
    [58.5,50],
    [58.5,77],
    [66.5, 36.4],
    [66.5, 63.4],
    [74.5,22.7],
    [74.5,50],
    [74.5,77],
    [82.8, 36.4],
    [82.8, 63.4],
    [91.8,50]
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
    [12, 14, 15,19,20,22],
    [13, 16, 21],
    [14, 16, 17, 21, 22, 23],
    [15, 17, 22],
    [16, 18, 19,23],
    [17, 19, 20,23],
    [19, 21, 22]
];
function load() {
    if (window.localStorage["colorScheme"] == undefined) {
        window.localStorage["colorScheme"] = "redColorScheme";
    } else {
        applyColorScheme(eval(window.localStorage["colorScheme"]));
    }
    document.getElementsByClassName(window.localStorage["colorScheme"] + "Button")[0].classList.add("activeColorSchemeButton");
    resizeUpdate();
    let allElements = document.getElementsByTagName("*");
    for (let i = 0; i < allElements.length ; i++) {
        if(allElements[i].tagName == "INPUT") break;
        allElements[i].classList.add("disableSelect");
    }
    if(window.location.hash.charAt(0) == "#"){
        socket.emit("joinroom",{GUID:localStorage["GUID"],roomId:window.location.hash.substr(1)});
    }else{
        openMenu("centerMainMenu");
    }
}
function isNeighbour(id1, id2){
    for (let i = 0; i < neighbours[id1].length; i++) {
        if(neighbours[id1][i] === id2) return true;
    }
    return false;
}
function openMenu(id) {
    document.getElementById(id).style.display = "inline-block";
    setTimeout(() => {
        document.getElementById(id).style.opacity = "1";
        document.getElementById(id).style.transform = "translate(-50%,-50%)";
    }, 100);
}
function closeMenu(id) {
    document.getElementById(id).style.opacity = "0";
    document.getElementById(id).style.transform = "translate(-50%,-60%)";
    setTimeout(() => {
        document.getElementById(id).style.display = "none";
    }, 500);
}

function openVsDisplay(id){
    document.getElementById(id).style.display = "block";
    setTimeout(() => {
        document.getElementById(id).style.opacity = "1";
        document.getElementById(id).style.transform = "translate(-50%,0) scale(1)";
        resizeUpdate();
    }, 100);
}
let timeout;
function closeVsDisplay(id){
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
    document.getElementsByClassName("darkerBg")[0].style.display = "none";
    setTimeout(() => openMenu("centerMainMenu"), 500);
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
function onlineGame(){
    if (socket.connected){
        beforeTime = Math.floor( new Date / 1000);
        socket.emit("createroom",localStorage["GUID"]);
        closeMenu("playMenu");
        openMenu("loader");
    }else{
        //Inform the user about disconnection
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
    let padding = document.getElementById("yourTurnInfo").clientHeight + document.getElementById("ennemyDisplay").clientHeight + document.getElementById("placePawnMenu").clientHeight + document.getElementById("moveBotMenu").clientHeight;
    if ((boardHeight * windowWidth / (boardWidth * 384 / 537)) > (windowHeight - padding)){
        let scaleCoef = (windowHeight - padding) / boardHeight;
        document.getElementsByClassName("gameBoardContainer")[0].style.transform = `scale(${scaleCoef})`;
        if(area === "top"){
            document.getElementsByClassName("gameBoardContainer")[0].style.transform = `scale(${scaleCoef}) rotate(180deg) translate(0,-100%)`;
        }
    }else if(boardWidth * 384/537 < windowWidth){
        let scaleCoef = windowWidth / (boardWidth * 384 / 537);
        document.getElementsByClassName("gameBoardContainer")[0].style.transform = `scale(${scaleCoef})`;
        if(area === "top"){
            document.getElementsByClassName("gameBoardContainer")[0].style.transform = `scale(${scaleCoef}) rotate(180deg) translate(0,-100%)`;
        }
    }
}
function openAvailableActionsMenu(){
    document.getElementsByClassName("darkerBg")[0].style.display = "inline-block";
    openMenu("availableActionsMenu");
}
function closeAvailableActionsMenu(){
    document.getElementsByClassName("darkerBg")[0].style.display = "none";
    closeMenu("availableActionsMenu");
}
function openReloadEnergyMenu(){
    openMenu("reloadEnergyMenu");
    closeMenu("availableActionsMenu");
}
function cancelReloadPawnsButton() {
    closeMenu("reloadEnergyMenu");
    openMenu("availableActionsMenu");
    reload = {white:0, black:0};
    document.getElementById("pawnsReloadContainer").innerHTML = "";
    document.getElementById("reloadPawnsShowNew").innerText = "";
    document.getElementById("confirmReloadButton").style.display = "none";
    document.getElementById("reserveWhite").innerText = reserve.white;
    document.getElementById("reserveBlack").innerText = reserve.black;
}
function placingPawnChange(d){
    placingPawn = d;
    let buttons = document.getElementsByClassName("pawnPlaceButton");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("activeColorSchemeButton");
    }
    if(d == "whitePawn"){
        buttons[0].classList.add("activeColorSchemeButton");
    }else{
        buttons[1].classList.add("activeColorSchemeButton");
    }
}
function sendReloadValue(){
    socket.emit("reloadPawns",reload);
    reload = {white:0, black:0};
    document.getElementById("reloadPawnsShowNew").innerText = "";
    document.getElementById("confirmReloadButton").style.display = "none";
    document.getElementById("pawnsReloadContainer").innerHTML = "";
    closeMenu("reloadEnergyMenu");
    openMenu("availableActionsMenu");
    reload = {white:0, black:0};
    document.getElementById("pawnsReloadContainer").innerHTML = "";
    document.getElementById("reloadPawnsShowNew").innerText = "";
    document.getElementById("confirmReloadButton").style.display = "none";
    document.getElementById("reserveWhite").innerText = reserve.white;
    document.getElementById("reserveBlack").innerText = reserve.black;
}
function addToReload(p) {
    if(reload.white + reload.black === toreload) return;
    if (p === "whitePawn"){
        if(parseInt(document.getElementById("reserveWhite").innerText) === 0) return;
        else {
            document.getElementById("reserveWhite").innerText--;
            reload.white++;
        }
    }else if (p === "blackPawn"){
        if(parseInt(document.getElementById("reserveBlack").innerText) === 0) return;
        else{
            document.getElementById("reserveBlack").innerText--;
            reload.black++;
        }
    }
    let dot = document.createElement("div");
    dot.classList.add("pawnDot");
    if(p === "whitePawn") dot.classList.add("whitePawnDot");

    document.getElementById("reloadPawnsShowNew").innerText = "These energy pawns will be added to your inventory";
    document.getElementById("confirmReloadButton").style.display = "block";
    document.getElementById("pawnsReloadContainer").appendChild(dot);
}
function fetchGameState(gameState){
    let you;
    let ennemy;
    clearHighlightedCells();
    if(gameState.p1.you){
        you = gameState.p1;
        ennemy = gameState.p2;
    }else{
        you = gameState.p2;
        ennemy = gameState.p1;
    }
    gameBoard = gameState.gameBoard;
    area = you.area;

    if(you.turn){
        document.getElementById("yourTurnInfo").style.display = "block";
    }else{
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
        if (area === "top"){
            x.classList.add("botTopArea");
        }
        x.classList.add("boardElement");
        if(gameState.gameBoard[i] == "blackBot"){
            x.classList.add("botBoardElement");
            x.setAttribute("src","images/sprites/blackRobot.png");
            x.id = "blackBot";
            x.style.top = positionInBoardById[i][0] + "%";
            x.style.left = positionInBoardById[i][1] + "%";
            tableOverlay.appendChild(x);
        }else if(gameState.gameBoard[i] == "whiteBot"){
            x.classList.add("botBoardElement");
            x.setAttribute("src","images/sprites/whiteRobot.png");
            x.id = "whiteBot";
            x.style.top = positionInBoardById[i][0] + "%";
            x.style.left = positionInBoardById[i][1] + "%";
            tableOverlay.appendChild(x);
        }else if(gameState.gameBoard[i] == "redBot"){
            x.classList.add("botBoardElement");
            x.setAttribute("src","images/sprites/redRobot.png");
            x.id = "redBot";
            x.style.top = positionInBoardById[i][0] + "%";
            x.style.left = positionInBoardById[i][1] + "%";
            tableOverlay.appendChild(x);
        }else if(gameState.gameBoard[i] == "blackPawn"){
            x.classList.add("botBoardElement");
            x.setAttribute("src","images/sprites/blackDot.png");
            x.style.top = positionInBoardById[i][0] + "%";
            x.style.left = positionInBoardById[i][1] + "%";
            x.id = `boardOverlayPawn${i}`;
            tableOverlay.appendChild(x);
        }else if(gameState.gameBoard[i] == "whitePawn"){
            x.classList.add("botBoardElement");
            x.setAttribute("src","images/sprites/whiteDot.png");
            x.style.top = positionInBoardById[i][0] + "%";
            x.style.left = positionInBoardById[i][1] + "%";
            x.id = `boardOverlayPawn${i}`;
            tableOverlay.appendChild(x);
        }else{

        }
    }
    reserve = gameState.pawnReserve;
    document.getElementById("reserveWhite").innerText = gameState.pawnReserve.white;
    document.getElementById("reserveBlack").innerText = gameState.pawnReserve.black;
    document.getElementById("textReloadPawns").innerText = `You have ${you.pawns.white + you.pawns.black} energy pawns, you have to take ${4 - you.pawns.white - you.pawns.black} of any colour to reload to 4.`;
    document.getElementById("pawnsReloadContainer").innerHTML = "";

    document.getElementById("reloadPawnsShowNew").innerText = "";
    document.getElementById("confirmReloadButton").style.display = "none";

    toreload = 4 - you.pawns.white - you.pawns.black;

    if(you.pawns.white + you.pawns.black === 4){
        document.getElementById("reloadEnergyOptionButton").classList.add("disabledOptionButton");
        document.getElementById("placePawnOptionButton").classList.remove("disabledOptionButton");
    }else if (you.pawns.white + you.pawns.black === 0) {
        document.getElementById("placePawnOptionButton").classList.add("disabledOptionButton");
    }else{
        document.getElementById("reloadEnergyOptionButton").classList.remove("disabledOptionButton");
        document.getElementById("placePawnOptionButton").classList.remove("disabledOptionButton");
    }

    let buttons = document.getElementsByClassName("pawnPlaceButton");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("activeColorSchemeButton");
    }
}
function placePawnOption(){
    closeMenu("availableActionsMenu");
    document.getElementsByClassName("darkerBg")[0].style.display = "none";
    openVsDisplay("placePawnMenu");
    document.getElementById("yourTurnInfo").style.display = "none";
}
function cancelPlacePawnOption(){
    placingPawn = false;
    openMenu("availableActionsMenu");
    document.getElementsByClassName("darkerBg")[0].style.display = "inline-block";
    closeVsDisplay("placePawnMenu");
    document.getElementById("yourTurnInfo").style.display = "block";
}

function clearHighlightedCells(){try{document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");document.getElementsByClassName("highlightedCells")[0].classList.remove("highlightedCells");}catch(e){}}
function showIds(){
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
function boardClick(element,n){
    if(placingPawn != false){
        socket.emit("placingPawn",{color: placingPawn, pos: n});
    }else if(movingBot == true){
        if(gameBoard[n] === "blackBot" || gameBoard[n] === "whiteBot" || gameBoard[n] === "redBot"){
            clearHighlightedCells();
            element.firstElementChild.classList.add("highlightedCells");
            movingBotPath.bot = gameBoard[n];
            movingBotPath.path = [n];
            document.getElementById("confirmRobotPath").style.display = "none";
        }else if((gameBoard[n] === "blackPawn" && movingBotPath.bot === "blackBot") ||
            (gameBoard[n] === "whitePawn" && movingBotPath.bot === "whiteBot") ||
            ((gameBoard[n] === "blackPawn" || gameBoard[n] === "whitePawn") && movingBotPath.bot === "redBot")){
            if(isNeighbour(n,movingBotPath.path[movingBotPath.path.length - 1])){
                element.firstElementChild.classList.add("highlightedCells");
                movingBotPath.path.push(n);
                document.getElementById("confirmRobotPath").style.display = "block";
            }
        }
    }
}
function confirmRobotPath(){
    socket.emit("moveRobot", movingBotPath);
}
function cancelMoveBotOption(){
    movingBot = false;
    movingBotPath = {};
    clearHighlightedCells();
    closeVsDisplay("moveBotMenu");
    openMenu("availableActionsMenu");
    document.getElementsByClassName("darkerBg")[0].style.display = "inline-block";
    document.getElementById("yourTurnInfo").style.display = "block";
    document.getElementById("confirmRobotPath").style.display = "none";
}
function moveBot(){
    movingBot = true;
    openVsDisplay("moveBotMenu");
    closeMenu("availableActionsMenu");
    document.getElementsByClassName("darkerBg")[0].style.display = "none";
    document.getElementById("yourTurnInfo").style.display = "none";
}
socket.on("gotoroom", (data) => {
    afterTime = Math.floor( new Date / 1000);
    if (beforeTime + 2 > afterTime){
        setTimeout(() => {
            closeMenu("loader");
            openMenu("centerShareGameMenu");
            document.getElementsByClassName("darkerBg")[0].style.display = "inline-block";
            document.getElementsByClassName("gameUI")[0].style.display = "inline-block";
            resizeUpdate();
        }, (afterTime + 2 - beforeTime) * 1000);
    }else{
        closeMenu("loader");
        openMenu("centerShareGameMenu");
        document.getElementsByClassName("darkerBg")[0].style.display = "inline-block";
        document.getElementsByClassName("gameUI")[0].style.display = "inline-block";
        resizeUpdate();
    }
    document.getElementById("linkTextInput").value = "localhost:8080/#"+data.id;
    window.location.hash = `#${data.id}`;
    localStorage["GUID"] = data.GUID;
});

socket.on("ennemyOffline", () => console.info("Ennemy OFFline"));
socket.on("ennemyOnline", () => console.error("Ennemy ONline"));

socket.on("yourTurn", (data) => {
    clearTimeout(timeout);
    document.getElementById("yourTurnInfo").style.display = "block";
});
socket.on("wrongroom", ()=>{
   window.location.hash = "";
   load();
});
socket.on("startgame", (data) => {
    closeMenu("centerShareGameMenu");
    closeMenu("centerMainMenu");
    document.getElementsByClassName("darkerBg")[0].style.display = "none";
    document.getElementsByClassName("gameUI")[0].style.display = "inline-block";
    fetchGameState(data);
    resizeUpdate();
    console.log(data);
    openVsDisplay("ennemyDisplay");
});
socket.on("placedPawn", (data) => {
    closeVsDisplay("placePawnMenu");

    fetchGameState(data.state);
});
socket.on("reloadedPawn",(data) => {
   fetchGameState(data);
   closeMenu("reloadEnergyMenu");
   closeMenu("availableActionsMenu");
   document.getElementsByClassName("darkerBg")[0].style.display = "none";
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
        },i*500);
    }
    setTimeout(() => fetchGameState(data.state),data.move.path.length * 500);
});

socket.on("winner", (data) =>{
    if(data.you){
        document.getElementById("winnerName").innerText = "You won!";
    }else{
        document.getElementById("winnerName").innerText = "You lost!";
    }
    openMenu("winnerMenu");
    document.getElementsByClassName("darkerBg")[0].style.display = "inline-block";
    document.getElementById("yourTurnInfo").style.display = "none";
});