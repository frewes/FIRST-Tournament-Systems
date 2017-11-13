const MODE_NODATA = 0;
const MODE_SELECTION = 1;
const MODE_TREE = 2;

var allianceObj;

function EventParameters() {
    this.mode = "NODATA";
    this.teams = new Array(30);
    this.alliances = new Array(8);
    for (var i = 0; i < this.alliances.length; i++) {
        this.alliances[i] = new AllianceParameters((i+1),3);
    }
    this.title = "FTC National 2017";
}

function AllianceParameters(seed, nTeams) {
    if (!nTeams) var nTeams = 3;
    this.seed = seed;
    this.teams = new Array(nTeams);
}

function TeamParameters(rank,number,name) {
    this.rank = rank;
    this.number = number;
    this.name = name;
    this.selected = false;
}

window.onload = function () {
    allianceObj = new EventParameters();
    $("#title")[0].innerHTML = allianceObj.title;
    setInterval(function() {
        // Using localStorage
        localStorage.setItem("alliances", JSON.stringify(allianceObj));
    }, 50);
}

function openDisplay() {
    window.open("display.html");
}

function loadSelection() {

}

function loadPlayoff() {
    
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

function sequence() {

}

function openTeamImportModal() {
    $("#lg-modal-body").empty();
    $("#lg-modal-footer").empty();
    $("#lg-modal-title")[0].innerHTML = "Team rank, number, name";
    $("#lg-modal-body").append($("<p>One line per team.</p>"))
    $("#lg-modal-body").append($("<p><button class=\"btn\" onclick=\"sequence()\">Rank sequentially</button></p>"));
    var x = $("<textarea rows=\""+allianceObj.teams.length+"\" cols=\"6\"></textarea>");
    for (var i = 0; i < allianceObj.teams.length; i++)
        x.append((i+1) + "\n");
    $("#lg-modal-body").append(x);
    var x = $("<textarea rows=\""+allianceObj.teams.length+"\" cols=\"6\"></textarea>");
    for (var i = 0; i < allianceObj.teams.length; i++)
        x.append((i+1) + "\n");
    $("#lg-modal-body").append(x);
    var x = $("<textarea rows=\""+allianceObj.teams.length+"\" cols=\"60\"></textarea>");
    for (var i = 0; i < allianceObj.teams.length; i++)
        x.append("Team " + (i+1) + "\n");
    $("#lg-modal-body").append(x);
    $("#lg-modal-body").append(x);
    $("#lg-modal-footer").append($("<button onclick=\"closeTeamImportModal()\" class=\"btn btn-default\" data-dismiss=\"modal\">Save</button>"));
    $("#lg-modal-footer").append($("<button class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"));
}

function closeTeamImportModal() {
    var inputs = $("#lg-modal-body>textarea");
    allianceObj.mode = MODE_SELECTION;
}


function clickSave() {

}

function clickLoad() {
    
}