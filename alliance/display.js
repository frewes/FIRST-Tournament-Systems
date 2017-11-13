
var alliance;

window.onload = function() {
    setInterval(updateDisplay, 50);
}

function updateDisplay() {
    getalliance();
    if (alliance == null) return;
    $("#tournName")[0].innerHTML = alliance.title;
}

function getalliance() {
    alliance = JSON.parse(localStorage.getItem("alliances"));
}
