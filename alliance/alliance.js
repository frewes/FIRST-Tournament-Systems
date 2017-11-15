const MODE_SETUP = 0;
const MODE_SELECTION = 1;
const MODE_PLAYOFF = 2;

var tournament;

function Event() {
    this.mode = MODE_SETUP;
    this.version = "0.7.1";
    this.teams = new Array(30);
    for (var i = 0; i < this.teams.length; i++) {
        this.teams[i] = new Team((i+1),(i+1),"Team "+(i+1));
    }
    this.alliances = [];
    this.method="direct";
    for (var i = 0; i < 8; i++) {
        this.alliances[i] = new Alliance((i+1),3);
        this.alliances[i].teams[0] = this.teams[i];
    }
    this.matches = new Array();
    this.title = "FTC National 2017";
    this.logo = "../resources/firstlogo";
    this.backwards = false;
    console.log(this);
}

// Making dom objects easier to find
var DOM_Objects = {
    logo: $("#logoThumb")[0],
    nAlliances: $("#nAlliances")[0],
    nTeamsPerAlliance: $("#nTeamsPerAlliance")[0],
    method: $("#methodRadio")[0],
    selectedAlliance: $("#selectedAlliance"),
    allianceSelect: $("#allianceSelect"),
    teamSelect: $("#teamSelect"),
    matchSelect: $("#matchSelect"),
    allianceTeams: $("#selectedAlliance > div")[0],
    selectedMatch: $("#selectedMatch"),
    matchRed: $("#selectedMatch > div")[0],
    matchBlue: $("#selectedMatch > div")[1],
}

function update() {
    var nAlliances = DOM_Objects.nAlliances.value;
    var nTeams = DOM_Objects.nTeamsPerAlliance.value;
    //Add/remove alliances as required.
    while (tournament.alliances.length < nAlliances) {
        tournament.alliances.push(new Alliance(tournament.alliances.length+1,nTeams));
        tournament.alliances[tournament.alliances.length-1].teams[0] = availableList(tournament.alliances.length-2)[0];
    }
    while (tournament.alliances.length > nAlliances)
        tournament.alliances.splice(tournament.alliances.length-1,1);
    // Adjust nTeams for each alliance
    for (var i = 0; i < tournament.alliances.length; i++) {
        while (tournament.alliances[i].teams.length < nTeams)
            tournament.alliances[i].teams.push(null);
        while (tournament.alliances[i].teams.length > nTeams)
            tournament.alliances[i].teams.splice(tournament.alliances[i].teams.length-1,1);
    }
}

function Alliance(seed, nTeams) {
    if (!nTeams) nTeams = 3;
    this.seed = seed;
    this.teams = [];
    this.selected = false;
    while (nTeams-- > 0) this.teams.push(null);
}

function Team(rank,number,name) {
    this.rank = rank;
    this.number = number;
    this.name = name;
    this.selected = false;
    this.refused = false;
}

Alliance.prototype.toString = function () {return 'Alliance ' + this.seed;}
Team.prototype.toString = function () {return this.number + ", " + this.name;}

window.onload = function () {
    tournament = new Event();
    $("#version-footer")[0].innerHTML = "Version " + tournament.version;
    if (tournament.mode == MODE_SETUP) loadSetup();
    else if (tournament.mode == MODE_SELECTION) loadSetup();
    else if (tournament.mode == MODE_PLAYOFF) loadPlayoff();

    $("#title")[0].innerHTML = tournament.title;
    DOM_Objects.logo.src = tournament.logo;

    setInterval(function() {
        // Using localStorage
        localStorage.setItem("alliances", JSON.stringify(tournament));
    }, 50);
}

function openDisplay() {
    window.open("display.html");
}

function loadSetup() {
    if (tournament.mode == MODE_SELECTION) {
        if (!confirm("This will reset your alliances;  is this OK?")) return;
    }    

    tournament.mode = MODE_SETUP;
    $("#nav-setup-tab").tab('show');

    // Reset everything
    for (var i = 0; i < tournament.alliances.length; i++) {
        tournament.alliances[i] = new Alliance((i+1),tournament.alliances[i].teams.length);
        tournament.alliances[i].teams[0] = tournament.teams[i];
        tournament.alliances[i].selected = false;
    }
    for (var i = 0; i < tournament.teams.length; i++) {
        tournament.teams[i].refused = false;
        tournament.teams[i].selected = false;
    }
    $("input").change(function() {update();});
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

function openTeamImportModal() {
    $("#lg-modal-body").empty();
    $("#lg-modal-footer").empty();
    $("#lg-modal-title")[0].innerHTML = "Team rank, number, name";
    $("#lg-modal-body").append($("<p>One line per team.</p>"))
    var x = $("<textarea rows=\""+tournament.teams.length+"\" cols=\"6\"></textarea>");
    for (var i = 0; i < tournament.teams.length; i++)
        x.append(tournament.teams[i].rank + "\n");
    $("#lg-modal-body").append(x);
    var x = $("<textarea rows=\""+tournament.teams.length+"\" cols=\"6\"></textarea>");
    for (var i = 0; i < tournament.teams.length; i++)
        x.append(tournament.teams[i].number + "\n");
    $("#lg-modal-body").append(x);
    var x = $("<textarea rows=\""+tournament.teams.length+"\" cols=\"60\"></textarea>");
    for (var i = 0; i < tournament.teams.length; i++)
        x.append(tournament.teams[i].name + "\n");
    $("#lg-modal-body").append(x);
    $("#lg-modal-body").append(x);
    $("#lg-modal-footer").append($("<button onclick=\"closeTeamImportModal()\" class=\"btn btn-default\" data-dismiss=\"modal\">Save</button>"));
    $("#lg-modal-footer").append($("<button class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"));
}

function closeTeamImportModal() {
    var inputs = $("#lg-modal-body>textarea");

    var ranks = inputs[0].value.split("\n");
    while (ranks[ranks.length-1] == "") ranks.splice(ranks.length-1,1);
    var nums = inputs[1].value.split("\n");
    while (nums[nums.length-1] == "") nums.splice(nums.length-1,1);
    var names = inputs[2].value.split("\n");
    while (names[names.length-1] == "") names.splice(names.length-1,1);

    while (nums.length < names.length) nums.push(""+(nums.length+1));
    while (nums.length > names.length) nums.splice(nums.length-1,1);
    while (ranks.length < names.length) ranks.push(""+(ranks.length+1));
    while (ranks.length > names.length) ranks.splice(ranks.length-1,1);

    tournament.teams = [];
    for (var i = 0; i < names.length; i++)
        tournament.teams.push(new Team(ranks[i],nums[i],names[i]));
}


function clickSave() {

}

function clickLoad() {
    
}