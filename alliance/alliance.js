var allianceObj = {
    mode:"NODATA",
    teams:new Array(),
    title:document.getElementById("title").innerHTML.toString(),
}

window.onload = function () {
    setInterval(function() {
        // Using localStorage
        localStorage.setItem("alliance", JSON.stringify(allianceObj));
    }, 50);
}

function openDisplay() {
    window.open("display.html");
}

function secsToTime(s) {
    var mins = Math.floor(s/60);
    var secs = s%60;
    var minString = (mins<10) ? "0"+mins : mins;
    var secString = (secs<10) ? "0"+secs : secs;
    return minString+":"+secString;
}

function openTitleModal() {
    $("#sm-modal-body").empty();
    $("#sm-modal-footer").empty();
    $("#sm-modal-title")[0].innerHTML = "Event Title";
    $("#sm-modal-body").append($("<input type=\"text\" class=\"form-control\" value=\""+allianceObj.title+"\"><br>"));
    $("#sm-modal-footer").append($("<button onclick=\"closeTitleModal()\" class=\"btn btn-default\" data-dismiss=\"modal\">Save</button>"));
    $("#sm-modal-footer").append($("<button class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"));
}

function closeTitleModal() {
    var input = $("#sm-modal-body>input")[0];
    allianceObj.title = input.value;
    $("#title")[0].innerHTML = allianceObj.title;
}

function clickSave() {

}

function clickLoad() {
    
}