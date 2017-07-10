const FULL_TIME = 150;
const TELE_TIME = 120;
const MODE_AUTO = "Autonomous";
const MODE_TELE = "Teleoperated";
const MODE_END = "Endgame";

const START_SOUND = '../resources/charge.wav';
const ENDGAME_SOUND = '../resources/factwhistle.wav';
const ENDAUTO_SOUND = '../resources/endauto.wav';
const CONTINUE_SOUND = '../resources/firebell.wav';
const ENDMATCH_SOUND = '../resources/endmatch.wav';
const ABORT_SOUND = '../resources/fogblast.wav';
    //Start - charge
    //2:20 -  factwhistle
    //2:00 - endauto
    //2:00 continue - firebell
    //0:30 - factwhistle
    //0:00 - endmatch
    //Abort - fogblast

var timerObj = {
    flag:false,
    timer:null,
    secs:FULL_TIME,
    mode:"NODATA",
    dispWindow:"keystone",
    teams:new Array(),
    time: "02:30",
    title:document.getElementById("title").innerHTML.toString(),
}

window.onload = function () {
//    var un = prompt("Username?");
//    var pw = prompt("Password?");
//    if (un != "fred" || pw != "fred") {
//        alert("Authentication failed; this window will not control anything.");
//        return;
//    }
//    $.ajax("writeJSON.php?json="+"Hello world!");
    updateTeams();
    resetTimer();
    setInterval(function() {
        timerObj.time = secsToTime(timerObj.secs);
        // Using localStorage
        localStorage.setItem("timer", JSON.stringify(timerObj));
        // Not using localStorage

//        localStorage.timer = timerObj;
    }, 50);
}

function openDisplay() {
    window.open("display.html");
}

function startTimer() {
    if (timerObj.timer != null && timerObj.secs != TELE_TIME || (timerObj.secs == TELE_TIME && timerObj.mode == MODE_TELE))
        return;
    document.getElementById("resetBtn").className = "btn-lg disabled";
    document.getElementById("resetBtn").setAttribute('disabled','disabled');
    if (timerObj.secs == 0) resetTimer();
    timerObj.mode = (timerObj.secs == TELE_TIME) ? MODE_TELE : MODE_AUTO;
    if (timerObj.mode == MODE_TELE) {
        playSound(CONTINUE_SOUND);
        document.getElementById("startBtn").innerHTML = "Start";
    } else {
        playSound(START_SOUND);
    }
    timerObj.timer = setInterval(timerInterval, 1000);
}

function playSound(file) {
    //Start - charge
    //2:20 -  factwhistle
    //2:00 - endauto
    //2:00 continue - firebell
    //0:30 - factwhistle
    //0:00 - endmatch
    //Abort - fogblast
    var audio = new Audio(file);
    audio.play();
}

function timerInterval() {
    document.getElementById("timer").innerHTML = secsToTime(--timerObj.secs);
    if (timerObj.secs == TELE_TIME) {
        playSound(ENDAUTO_SOUND);
        autoOver();
    } else if (timerObj.secs == 30) {
        playSound(ENDGAME_SOUND);
        timerObj.mode = MODE_END;
    } else if (timerObj.secs == 140) {
        playSound(ENDGAME_SOUND);
    } else if (timerObj.secs <= 0) {
        playSound(ENDMATCH_SOUND);
        stopTimer(false);
    }    
}

function autoOver() {
    window.clearInterval(timerObj.timer);
    document.getElementById("startBtn").innerHTML = "Continue";
}

function stopTimer(aborted) {
    if (aborted) playSound(ABORT_SOUND);
    window.clearInterval(timerObj.timer);
    timerObj.timer = null;
    document.getElementById("timer").innerHTML = secsToTime(0);
    timerObj.secs = 0;
    document.getElementById("startBtn").innerHTML = "Start";
    
    document.getElementById("resetBtn").className = "control btn-lg btn-warning";
    document.getElementById("resetBtn").removeAttribute('disabled');
}

function resetTimer() {
    if (timerObj.timer != null) return;
    timerObj.secs = FULL_TIME;
    document.getElementById("timer").innerHTML = secsToTime(timerObj.secs);
    document.getElementById("startBtn").innerHTML = "Start";
    timerObj.mode = MODE_AUTO;
}

function updateTeams() {
//    if (!checkDisplay()) return;
    timerObj.teams = new Array(4);
    timerObj.teams[0] = document.getElementById('red1').value;
    timerObj.teams[1] = document.getElementById('red2').value;
    timerObj.teams[2] = document.getElementById('blue1').value;
    timerObj.teams[3] = document.getElementById('blue2').value;
//    display.document.getElementById('r1').innerHTML = document.getElementById('red1').value;
//    display.document.getElementById('b1').innerHTML = document.getElementById('blue1').value;
//    display.document.getElementById('r2').innerHTML = document.getElementById('red2').value;
//    display.document.getElementById('b2').innerHTML = document.getElementById('blue2').value;
}

function secsToTime(s) {
    var mins = Math.floor(s/60);
    var secs = s%60;
    var minString = (mins<10) ? "0"+mins : mins;
    var secString = (secs<10) ? "0"+secs : secs;
    return minString+":"+secString;
}

function setKeystone() {
    timerObj.dispWindow = "keystone";
//    display.document.getElementsById('body').className = "keystone";
}
function changeKeystone() {
}

function setLogo() {
    timerObj.dispWindow = "defImage";
//    display.document.getElementsById('body').className = "defImage";
}
function changeLogo() {
}

function setTeams() {
}

function changeTitle() {
    var safe = timerObj.title;
    timerObj.title = prompt("Enter title here", timerObj.title);
    if (timerObj.title == null) timerObj.title = safe;
    document.getElementById("title").innerHTML = timerObj.title;
}