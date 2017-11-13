const MODE_SETUP = 0;
const MODE_SELECTION = 1;
const MODE_PLAYOFF = 2;

var tournament;

function Event() {
    this.mode = MODE_SETUP;
    this.version = "0.3";
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
    allianceTeams: $("#selectedAlliance > div")[0],
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
    $("#nav-setup-tab").tab('show');

    DOM_Objects.logo.src = tournament.logo;
    DOM_Objects.nAlliances.value = tournament.alliances.length;
    DOM_Objects.nTeamsPerAlliance.value = tournament.alliances[0].teams.length;

    // $("input").change(function() {update();});
}

function loadSelection(startIdx) {
    if (!startIdx) startIdx = 0;
    if (tournament.mode == MODE_PLAYOFF) {
        if (!confirm("This will reset your alliances;  is this OK?")) return;
    }
    tournament.mode = MODE_SELECTION;
    $("#nav-select-tab").tab('show');

    DOM_Objects.allianceSelect.empty();
    DOM_Objects.allianceSelect.append($("<option value='-1' selected></option>"));
    for (var i = 0; i < tournament.alliances.length; i++)
        DOM_Objects.allianceSelect.append($("<option value=\""+i+"\">"+tournament.alliances[i]+"</option>"));
    DOM_Objects.allianceSelect.change(function() {selectAlliance(this.value);});
    selectAlliance(startIdx);
    $(DOM_Objects.allianceSelect)[0].value = startIdx;
}


function loadPlayoff() {
    tournament.mode = MODE_PLAYOFF;
    $("#nav-playoff-tab").tab('show');
}

function selectAlliance(idx) {
    var teamDiv = $("div",DOM_Objects.selectedAlliance)[0];
    var addDiv = $("div",DOM_Objects.selectedAlliance)[1];
    if (getSelectedAlliance() != null) getSelectedAlliance().selected = false;
    $(teamDiv).empty();
    if (idx == -1) {
        $(addDiv).hide();
        return;
    }
    var alliance = tournament.alliances[idx];
    alliance.selected = true;
    // "Alliance" view:
    $(teamDiv).append($("<h5>"+alliance+"</h5>"));
    for (var i = 0; i < alliance.teams.length; i++) {
        var form = $("<form>");
        if (alliance.teams[i] == null) {
            form.append($("<span>_______________</span>"));
            $(teamDiv).append(form);
            continue;
        }
        if (i == 0) {
            form.append($("<span class='team-number captain'>"+alliance.teams[i].number+"</span>, <span class='team-name captain'>"+alliance.teams[i].name+" ("+alliance.teams[i].rank+")</span>"));
        } else {
            form.append($("<span class='team-number'>"+alliance.teams[i].number+"</span>, <span class='team-name'>"+alliance.teams[i].name+" ("+alliance.teams[i].rank+")</span>"));
        }
        // form.append($("<button class='btn btn-danger btn-sm'>Remove</button>"));
        $(teamDiv).append(form);
    }
    // "Add Team" View:
    if (alliance.teams.indexOf(null) != -1) {
        $(addDiv).show();
    }
    updateTeamSelectList();
}

function getSelectedAlliance() {
    for (var i = 0; i < tournament.alliances.length; i++)
        if (tournament.alliances[i].selected) return tournament.alliances[i];
    return null;
}

function getSelectedTeam() {
    for (var i = 0; i < tournament.teams.length; i++)
        if (tournament.teams[i].selected) return tournament.teams[i];
    return null;
}

function updateTeamSelectList() {
    $(DOM_Objects.teamSelect).empty();
    $(DOM_Objects.teamSelect).append($("<option value='-1' selected></option>"))
    var al = availableList();
    for (var i = 0; i < al.length; i++) {
        $(DOM_Objects.teamSelect).append($("<option value='"+i+"' selected>"+al[i]+"</option>"))
    }
    $(DOM_Objects.teamSelect)[0].value = -1;
    // Lol funny workaround
    selectTeam({value:-1});
}

function availableList(allIdx) {
    var list = [];
    for (var i = 0; i < tournament.teams.length; i++) {
        if (!available(tournament.teams[i],allIdx)) continue;
        list.push(tournament.teams[i]);
    }
    return list;
}

function available(team, idx) {
    if (team.refused) return false;
    var minSeed = -1;
    if (idx) minSeed = tournament.alliances[idx].seed; 
    else if (getSelectedAlliance() != null) minSeed = getSelectedAlliance().seed;
    for (var i = 0; i < tournament.alliances.length; i++) {
        var alliance = tournament.alliances[i];
        var count = 0;
        var contained = false;
        for (var j = 0; j < alliance.teams.length; j++) {
            if (alliance.teams[j] != null) {
                count++;
                if (alliance.teams[j].number == team.number) contained = true;
            }
        }
        if ((contained && count > 1) || (contained && alliance.seed <= minSeed)) return false;
    }
    return true;
}

function selectTeam(e) {
    var al = availableList();
    for (var i = 0; i < tournament.teams.length; i++)
        tournament.teams[i].selected = false;
    if (e.value == -1) {
        DOM_Objects.teamSelect.siblings("button").attr("disabled","disabled");
        return;
    }
    al[e.value].selected = true;
    if (getSelectedAlliance().teams.indexOf(null) != -1)
        DOM_Objects.teamSelect.siblings("button").removeAttr("disabled");
}

function refuseSelectedTeam() {
    var team = getSelectedTeam();
    if (team == null) {
        alert ("Error!");
        return;
    }
    team.refused = true;
    loadSelection(tournament.alliances.indexOf(getSelectedAlliance()));
}

function acceptSelectedTeam() {
    var team = getSelectedTeam();
    if (team == null) {
        alert ("Error!");
        return;
    }
    var alliance = getSelectedAlliance();
    if (alliance == null) {
        alert ("Also error!");
        return;
    }
    for (var i = tournament.alliances.indexOf(alliance)+1; i < tournament.alliances.length; i++) {
        if (tournament.alliances[i].teams[0].number == team.number) {
            if (i == tournament.alliances.length-1) {
                tournament.alliances[i].teams[0] = availableList(i)[0];
            } else { 
                tournament.alliances[i].teams[0] = tournament.alliances[i+1].teams[0];
                tournament.alliances[i+1].teams[0] = team;
            }
        }
    }
    alliance.teams[alliance.teams.indexOf(null)] = team;
    console.log(tournament);
    loadSelection(tournament.alliances.indexOf(getSelectedAlliance()));
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