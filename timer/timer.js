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
    flash:false,
    secs:FULL_TIME,
    mode:"NODATA",
    dispWindow:"keystone",
    teams:new Array(),
    time: "02:30",
    redScore: 0,
    blueScore: 0,
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

function registerPress(key) {
//    alert(String.fromCharCode(key));
    ch = String.fromCharCode(key);
    if (ch == "f") {
	// Red particles in corner
	if (timerObj.mode == MODE_AUTO) $("#redAutoCorner").val(function(i,oldVal) {return ++oldVal;});
	else  $("#redTeleCornerParticles").val(function(i,oldVal) {return ++oldVal;});
    } else if (ch == "d") {
	// Red particles in center
	if (timerObj.mode == MODE_AUTO) $("#redAutoCenter").val(function(i,oldVal) {return ++oldVal;});
	else  $("#redTeleCenterParticles").val(function(i,oldVal) {return ++oldVal;});
    } else if (ch == "s") {
	// Red minor penalty
	$("#redPenMinor").val(function(i,oldVal) {return ++oldVal;});
    } else if (ch == "a") {
	// Red major penalty
	$("#redPenMajor").val(function(i,oldVal) {return ++oldVal;});
    } else if (ch == "j") {
	// Blue particles in corner
	if (timerObj.mode == MODE_AUTO) $("#blueAutoCorner").val(function(i,oldVal) {return ++oldVal;});
	else  $("#blueTeleCornerParticles").val(function(i,oldVal) {return ++oldVal;});
    } else if (ch == "k") {
	// Blue particles in center
	if (timerObj.mode == MODE_AUTO) $("#blueAutoCenter").val(function(i,oldVal) {return ++oldVal;});
	else  $("#blueTeleCenterParticles").val(function(i,oldVal) {return ++oldVal;});
    } else if (ch == "l") {
	// Blue minor penalty
	$("#bluePenMinor").val(function(i,oldVal) {return ++oldVal;});
    } else if (ch == ";") {
	// Blue major penalty
	$("#bluePenMajor").val(function(i,oldVal) {return ++oldVal;});
    }
    updateScoresheet();
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
    if (timerObj.secs < 30 && timerObj.secs % 2 == 1) {
	timerObj.flash = true;
    } else if (timerObj.secs < 140 && timerObj.mode == MODE_AUTO && timerObj.secs % 2 == 1) {
	timerObj.flash = true;
    } else {
	timerObj.flash = false;
    }
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

function updateScoresheet() {
    //Calculate red and blue score
    //Store red and blue score in the timer obj
    var red = 0;
    var blue = 0;
    // $("#redAutoBeacons").val() // Number input
    // $("#redAutoLarge").is(":checked") // Checkbox input
    // $("input[name=redAutoParked1]:checked").val() // Radio input
    // -- RED Score -- //
    red += ($("#redAutoBeacons").val())*30;
    if ($("#redAutoLarge").is(":checked")) red += 5;
    red += ($("#redAutoCenter").val())*15;
    red += ($("#redAutoCorner").val())*5;
    var parked = $("input[name=redAutoParked1]:checked").val();
    if (parked == "center") red += 5;
    else if (parked == "compcenter") red += 10;
    else if (parked == "corner") red += 5;
    else if (parked == "compcorner") red += 10;
    parked = $("input[name=redAutoParked2]:checked").val();
    if (parked == "center") red += 5;
    else if (parked == "compcenter") red += 10;
    else if (parked == "corner") red += 5;
    else if (parked == "compcorner") red += 10;
    red += ($("#redTeleBeacons").val())*10;
    red += ($("#redTeleCenterParticles").val())*5;
    red += ($("#redTeleCornerParticles").val())*1;
    var cap = $("input[name=redEnd]:checked").val();
    if (cap == "low") red += 10;
    else if (cap == "high") red += 20;
    else if (cap == "cap") red += 40; 
    red += ($("#bluePenMajor").val())*40;
    red += ($("#bluePenMinor").val())*10;

    // -- BLUE Score -- //
    blue += ($("#blueAutoBeacons").val())*30;
    if ($("#blueAutoLarge").is(":checked")) blue += 5;
    blue += ($("#blueAutoCenter").val())*15;
    blue += ($("#blueAutoCorner").val())*5;
    var parked = $("input[name=blueAutoParked1]:checked").val();
    if (parked == "center") blue += 5;
    else if (parked == "compcenter") blue += 10;
    else if (parked == "corner") blue += 5;
    else if (parked == "compcorner") blue += 10;
    parked = $("input[name=blueAutoParked2]:checked").val();
    if (parked == "center") blue += 5;
    else if (parked == "compcenter") blue += 10;
    else if (parked == "corner") blue += 5;
    else if (parked == "compcorner") blue += 10;
    blue += ($("#blueTeleBeacons").val())*10;
    blue += ($("#blueTeleCenterParticles").val())*5;
    blue += ($("#blueTeleCornerParticles").val())*1;
    var cap = $("input[name=blueEnd]:checked").val();
    if (cap == "low") blue += 10;
    else if (cap == "high") blue += 20;
    else if (cap == "cap") blue += 40; 
    blue += ($("#redPenMajor").val())*40;
    blue += ($("#redPenMinor").val())*10;    

    timerObj.redScore = red;
    timerObj.blueScore = blue;
    document.getElementById('rscore').value = red;
    document.getElementById('bscore').value = blue;
}

function resetScoresheet() {
    $("#redAutoBeacons").val(0);
    $("#redAutoCenter").val(0);
    $("#redAutoCorner").val(0);
    $("#redTeleBeacons").val(0);
    $("#redTeleCenterParticles").val(0);
    $("#redTeleCornerParticles").val(0);
    $("#redPenMajor").val(0);
    $("#redPenMinor").val(0);

    $("#blueAutoBeacons").val(0);
    $("#blueAutoCenter").val(0);
    $("#blueAutoCorner").val(0);
    $("#blueTeleBeacons").val(0);
    $("#blueTeleCenterParticles").val(0);
    $("#blueTeleCornerParticles").val(0);
    $("#bluePenMajor").val(0);
    $("#bluePenMinor").val(0);

    $("#defParkr1").prop("checked",true);
    $("#defParkr2").prop("checked",true);
    $("#defParkb1").prop("checked",true);
    $("#defParkb2").prop("checked",true);
    $("#defEndr").prop("checked",true);
    $("#defEndb").prop("checked",true);

    $("#redAutoLarge").prop("checked",false);
    $("#blueAutoLarge").prop("checked",false);
    updateScoresheet();
}

function updateScore() {
    timerObj.redScore = document.getElementById('rscore').value;
    timerObj.blueScore = document.getElementById('bscore').value;
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
