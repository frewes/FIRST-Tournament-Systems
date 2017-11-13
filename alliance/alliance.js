const MODE_SETUP = 0;
const MODE_SELECTION = 1;
const MODE_PLAYOFF = 2;

var tournament;

function Event() {
    this.mode = MODE_SETUP;
    this.version = "0.2.2";
    this.teams = new Array(30);
    this.alliances = new Array(8);
    this.method="direct";
    for (var i = 0; i < this.alliances.length; i++) {
        this.alliances[i] = new Alliance((i+1),3);
    }
    this.matches = new Array();
    this.title = "FTC National 2017";
    this.logo = "../resources/firstlogo";
}

var DOM_Objects = {
    logo: $("#logoThumb")[0],
    nAlliances: $("#nAlliances")[0],
    nTeamsPerAlliance: $("#nTeamsPerAlliance")[0],
    method: $("#methodRadio")[0],
}

function updateDOM() {
    DOM_Objects.logo.src = tournament.logo;
    DOM_Objects.nAlliances.value = tournament.alliances.length;
    DOM_Objects.nTeamsPerAlliance.value = tournament.alliances[0].teams.length;
}

function update() {
    var nAlliances = DOM_Objects.nAlliances.value;
    while (tournament.alliances.length < nAlliances)
        tournament.alliances.push(new Alliance(tournament.alliances.length+1,3));
    while (tournament.alliances.length > nAlliances)
        tournament.alliances.splice(tournament.alliances.length-1,1);
    DOM_Objects.nAlliances.value = tournament.alliances.length;
    console.log(tournament);
}

function Alliance(seed, nTeams) {
    if (!nTeams) nTeams = 3;
    this.seed = seed;
    this.teams = new Array(nTeams);
}

function Team(rank,number,name) {
    this.rank = rank;
    this.number = number;
    this.name = name;
    this.selected = false;
}

window.onload = function () {
    tournament = new Event();
    $("#version-footer")[0].innerHTML = "Version " + tournament.version;
    if (tournament.mode == MODE_SETUP) loadSetup();
    else if (tournament.mode == MODE_SELECTION) loadSetup();
    else if (tournament.mode == MODE_PLAYOFF) loadPlayoff();

    $("#title")[0].innerHTML = tournament.title;
    setInterval(function() {
        // Using localStorage
        localStorage.setItem("alliances", JSON.stringify(tournament));
    }, 50);
}

function openDisplay() {
    window.open("display.html");
}

function changeLogo() {
    var file = $("#logoFile")[0].files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        tournament.logo = this.result;
        DOM_Objects.logo.src = tournament.logo;
    }
    if (file) {
        reader.readAsDataURL(file);
    }
}

function loadSetup() {
    if (tournament.mode == MODE_SELECTION) {
        if (!confirm("This will reset your alliances;  is this OK?")) return;
    }
    tournament.mode = MODE_SETUP;
    // $("input").change(function() {update();});
    $("#nav-setup-tab").tab('show');
}

function loadSelection() {
    if (tournament.mode == MODE_PLAYOFF) {
        if (!confirm("This will reset your alliances;  is this OK?")) return;
    }
    tournament.mode = MODE_SELECTION;
    // Select tab by name
    $("#nav-select-tab").tab('show');
}

function loadPlayoff() {
    tournament.mode = MODE_PLAYOFF;
    $("#nav-playoff-tab").tab('show');
}


function openTitleModal() {
    $("#sm-modal-body").empty();
    $("#sm-modal-footer").empty();
    $("#sm-modal-title")[0].innerHTML = "Event Title";
    $("#sm-modal-body").append($("<input type=\"text\" class=\"form-control\" value=\""+tournament.title+"\"><br>"));
    $("#sm-modal-footer").append($("<button onclick=\"closeTitleModal()\" class=\"btn btn-default\" data-dismiss=\"modal\">Save</button>"));
    $("#sm-modal-footer").append($("<button class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"));
}

function closeTitleModal() {
    var input = $("#sm-modal-body>input")[0];
    tournament.title = input.value;
    $("#title")[0].innerHTML = tournament.title;
}

function sequence() {

}

function openTeamImportModal() {
    $("#lg-modal-body").empty();
    $("#lg-modal-footer").empty();
    $("#lg-modal-title")[0].innerHTML = "Team rank, number, name";
    $("#lg-modal-body").append($("<p>One line per team.</p>"))
    $("#lg-modal-body").append($("<p><button class=\"btn\" onclick=\"sequence()\">Rank sequentially</button></p>"));
    var x = $("<textarea rows=\""+tournament.teams.length+"\" cols=\"6\"></textarea>");
    for (var i = 0; i < tournament.teams.length; i++)
        x.append((i+1) + "\n");
    $("#lg-modal-body").append(x);
    var x = $("<textarea rows=\""+tournament.teams.length+"\" cols=\"6\"></textarea>");
    for (var i = 0; i < tournament.teams.length; i++)
        x.append((i+1) + "\n");
    $("#lg-modal-body").append(x);
    var x = $("<textarea rows=\""+tournament.teams.length+"\" cols=\"60\"></textarea>");
    for (var i = 0; i < tournament.teams.length; i++)
        x.append("Team " + (i+1) + "\n");
    $("#lg-modal-body").append(x);
    $("#lg-modal-body").append(x);
    $("#lg-modal-footer").append($("<button onclick=\"closeTeamImportModal()\" class=\"btn btn-default\" data-dismiss=\"modal\">Save</button>"));
    $("#lg-modal-footer").append($("<button class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"));
}

function closeTeamImportModal() {
    var inputs = $("#lg-modal-body>textarea");
    tournament.mode = MODE_SELECTION;
}


function clickSave() {

}

function clickLoad() {
    
}