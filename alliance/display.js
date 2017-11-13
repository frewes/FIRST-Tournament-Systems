
var alliance;

window.onload = function() {
    setInterval(updateDisplay, 50);
}

function updateDisplay() {
    getalliance();
    if (alliance == null) return;
    document.getElementById("tournName").innerHTML = alliance.title;
}

function getalliance() {
    ///* Using localStorage 
    alliance = JSON.parse(localStorage.getItem("alliance"));
    //*/
    //Using Ajax
//    $.ajax("alliance_obj.json",success: function(result) {
//        alliance = JSON.parse(this.responseText);        
//    });
}
