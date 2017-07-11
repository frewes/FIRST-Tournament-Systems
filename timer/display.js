
var timer;

window.onload = function() {
    setInterval(updateDisplay, 50);
}

function updateDisplay() {
//    if (flag) document.getElementById("tournName").innerHTML = "Hi";
//    else document.getElementById("tournName").innerHTML = "Bye";
//    flag = !flag;
    getTimer();
    if (timer == null) return;
    document.getElementById("tournName").innerHTML = timer.title;
    document.getElementById('r1').innerHTML = timer.teams[0];
    document.getElementById('r2').innerHTML = timer.teams[1];
    document.getElementById('b1').innerHTML = timer.teams[2];
    document.getElementById('b2').innerHTML = timer.teams[3];
    document.getElementById('timer').innerHTML = timer.time;
    document.getElementById('mode').innerHTML = timer.mode;
    document.getElementById('rscore').innerHTML = timer.redScore;
    document.getElementById('bscore').innerHTML = timer.blueScore;
    if (timer.flash) {
	document.getElementById('timer').style.color = "yellow";
    } else {
	document.getElementById('timer').style.color = "white";
    }
//    $("#title").text = T.title;
}

function getTimer() {
    ///* Using localStorage 
    timer = JSON.parse(localStorage.getItem("timer"));
    //*/
    //Using Ajax
//    $.ajax("timer_obj.json",success: function(result) {
//        timer = JSON.parse(this.responseText);        
//    });
}
