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

function load() {
    if (window.localStorage["colorScheme"] == undefined) {
        window.localStorage["colorScheme"] = "redColorScheme";
    } else {
        applyColorScheme(eval(window.localStorage["colorScheme"]));
    }
    document.getElementsByClassName(window.localStorage["colorScheme"] + "Button")[0].classList.add("activeColorSchemeButton");
    openMenu("centerMainMenu");
}
window.addEventListener("resize", update);
function update() {
    if (window.innerWidth < 424) {
    }
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

    }
}

socket.on("gotoroom", (data) => {
    afterTime = Math.floor( new Date / 1000);
    if (beforeTime + 2 > afterTime){
        setTimeout(() => {
            closeMenu("loader");
            openMenu("centerShareGameMenu");
            document.getElementsByClassName("darkerBg")[0].style.display = "inline-block";
            document.getElementsByClassName("gameUI")[0].style.display = "inline-block";
        }, (afterTime + 2 - beforeTime) * 1000);
    }else{
        closeMenu("loader");
        openMenu("centerShareGameMenu");
        document.getElementsByClassName("darkerBg")[0].style.display = "inline-block";
        document.getElementsByClassName("gameUI")[0].style.display = "inline-block";
    }
    console.log(data);
    document.getElementById("linkTextInput").value = "robotori.com#"+data.id;
    localStorage["GUID"] = data.GUID;
});
