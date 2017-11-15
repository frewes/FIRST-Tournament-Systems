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
    var nextIdx = tournament.alliances.indexOf(getSelectedAlliance())+1;
    if (tournament.backwards) nextIdx -= 2;
    if (nextIdx >= tournament.alliances.length) {
        if ($("input[name=methodRadio]:checked").val() == "serpentine") {
            nextIdx--;
            tournament.backwards = !tournament.backwards;
        } else nextIdx = 0;
    }
    if (nextIdx == -1) nextIdx = 0;
    loadSelection(nextIdx);
}

