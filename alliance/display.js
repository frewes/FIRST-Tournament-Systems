
const MODE_SETUP = 0;
const MODE_SELECTION = 1;
const MODE_PLAYOFF = 2;

const MATCH_ROS = {priority:0,n:8,prefix:"Ro16"};
const MATCH_QF = {priority:1,n:4,prefix:"QF"};
const MATCH_SF = {priority:2,n:2,prefix:"SF"};
const MATCH_F = {priority:3,n:1,prefix:"F"};

const WIN_NONE = 0;
const WIN_RED = 1;
const WIN_BLUE = 2;

var tournament;

window.onload = function() {
    setInterval(updateDisplay, 50);
}

var DOM_alliances = $("#selectalliances")[0];
var DOM_teams = $("#selectteams")[0];

function updateDisplay() {
    getTournament();
    if (tournament == null) return;
    $("#tournName")[0].innerHTML = tournament.title;
    if (tournament.mode == MODE_SETUP) {
    	$("#nodata").show();
        $("#selection").hide();
        $("#playoff").hide();
        $("#nodatalogo")[0].src = tournament.logo;
    } else if (tournament.mode == MODE_SELECTION) {
        $("#nodata").hide();
        $("#selection").show();
        $("#playoff").hide();
        updateSelectionDisplay();
    } else if (tournament.mode == MODE_PLAYOFF) {
        $("#nodata").hide();
        $("#selection").hide();
        $("#playoff").show();
        updatePlayoffDisplay();
    } else {
    	$("#nodata").show();
    	$("#selection").hide();    	
        $("#playoff").hide();
    }

}

function updateSelectionDisplay() {
    var al = availableList();
    $("#selectionlogo")[0].src = tournament.logo;
    $(DOM_teams).empty();
    $(DOM_teams).append("<h2>Available teams</h2>");
    $(DOM_alliances).empty();
    // $(DOM_alliances).append("<h2>Alliances</h2>");
    $(DOM_alliances).append("<br>");
    // console.log($(DOM_teams));
    var table = $("<table class='roundtable'>");
    var row = $("<tr>");
    var count = 0;
    for (var i = 0; i < al.length; i++) {
        var cell = $("<td class='team'>"+al[i].number+" ("+al[i].rank+")</td>");
        if (al[i].selected) cell.addClass("sel");
        if (al[i].refused) cell.addClass("ref");
        $(row).append(cell);
        if (count++ > 3) {
            $(table).append(row);
            row = $("<tr>");
            count = 0;
        } 
    }
    $(DOM_teams).append(table);
    var count = 0;
    var table = $("<table class='roundtable'>");
    for (var i = 0; i < tournament.alliances.length; i++) {
        var alliance = tournament.alliances[i];
        var row = $("<tr>");
        $(row).append("<td>Alliance "+(i+1)+": </td>");
        for (var t = 0; t < alliance.teams.length; t++) {
            if (alliance.teams[t] != null) $(row).append("<td>"+alliance.teams[t].number+"</td>");
        }
        if (alliance.selected) row.addClass("sel");
        $(table).append(row);
        if (count++ > 6) {
            count = 0;
            $(DOM_alliances).append(table);
            table = $("<table class='roundtable'>");
        }
    }
    $(DOM_alliances).append(table);
    $(DOM_alliances).append("<br>");
    $(DOM_alliances).append("<br>");
}

function updatePlayoffDisplay() {
    // $("#playofflogo")[0].src = tournament.logo;
    $("#playoff").empty();
    var table = $("<table class='table playoffTable h-75'>");
    var rows = [];
    for (var i = 0 ; i < 32; i++ ) rows[i] = $("<tr>");

    var ros = getAllMatches(MATCH_ROS);
    var qf = getAllMatches(MATCH_QF);
    var sf = getAllMatches(MATCH_SF);
    var f = getAllMatches(MATCH_F);
    var r = 0;
    for (var i = 0; i < ros.length; i++) {
        rows[r++].append($("<td>&nbsp;</td>"));
        rows[r].append(matchCell(ros[i],3));
        r+=3;
    }
    for (var i = 1 ; i < 32; i++ ) rows[i].append($("<td></td>"));
    for (var i = 1 ; i < 32; i++ ) rows[i].append($("<td></td>"));

    var r = 0;
    for (var i = 0; i < qf.length; i++) {
        for (var j = 0; j < 2; j++) rows[r++].append($("<td>"));
        rows[r].append(matchCell(qf[i],5));
        r+=5;
        rows[r++].append($("<td>"));
    }
    for (var i = 1 ; i < 32; i++ ) rows[i].append($("<td></td>"));
    for (var i = 1 ; i < 32; i++ ) rows[i].append($("<td></td>"));
    var r = 0;
    for (var i = 0; i < sf.length; i++) {
        for (var j = 0; j < 6; j++) rows[r++].append($("<td>"));
        rows[r].append(matchCell(sf[i],5));
        r+=5;
        for (var j = 0; j < 5; j++) rows[r++].append($("<td>"));
    }
    for (var i = 1 ; i < 32; i++ ) rows[i].append($("<td></td>"));
    for (var i = 1 ; i < 32; i++ ) rows[i].append($("<td></td>"));
    var r = 0;
    for (var i = 0; i < f.length; i++) {
        for (var j = 0; j < 14; j++) rows[r++].append($("<td>"));
        rows[r].append(matchCell(f[i],5));
        r+=5;
        for (var j = 0; j < 11; j++) rows[r++].append($("<td>"));
    }

    for (var i = 1 ; i < 32; i++ ) table.append($(rows[i]));
    $("#playoff").append(table);
}

function getTournament() {
    tournament = JSON.parse(localStorage.getItem("alliances"));
}

function getAllMatches(type) {
    var list = [];
    for (var i = 0; i < tournament.matches.length; i++) 
        if (tournament.matches[i].type.priority == type.priority) list.push(tournament.matches[i]);
    return list;
}

function matchCell(match,span) {
    var red = match.red;
    var blue = match.blue;

    var cell = $("<td class='match' style='' rowspan='"+span+"'></td>");
    if (red == null && blue == null) {
        cell.append($("<span class='playoffUnfilled'>---</span><br><span class='playoffUnfilled'>---</span>"));
        return cell;
    }

    if (red != null) cell.append($("<span class='playoffRed'>Alliance " + red.seed + "</span>"));
    for (var i = 0; i < match.redWins; i++) cell.append($("<span class='playoffRed'>&nbsp;<img src='../resources/octicons/star'></span>"));
    // else cell.append($(""));
    // if (red != null && blue != null || match.bye)
    cell.append($("<br>"));
    if (blue != null) cell.append($("<span class='playoffBlue'>Alliance " + blue.seed + "</span>"));
    else if (match.bye) cell.append("<span>BYE</span>");
    else cell.append($("<span>---</span>"));
    for (var i = 0; i < match.blueWins; i++) cell.append($("<span class='playoffBlue'>&nbsp;<img src='../resources/octicons/star'></span>"));
    // else cell.append($("<td></td>"));
    if (match.winner == WIN_RED) cell.addClass('winRed');
    if (match.winner == WIN_BLUE) cell.addClass('winBlue');
    return cell;
}

function availableList() {
    var list = [];
    for (var i = 0; i < tournament.teams.length; i++) {
    	var contained = false;
	    for (var j = 0; j < tournament.alliances.length; j++) {
        	for (var k = 0; k < tournament.alliances[j].teams.length; k++) 
        		if (tournament.alliances[j].teams[k] != null && tournament.alliances[j].teams[k].number == tournament.teams[i].number) contained = true;        	
	    }
		if (!contained) list.push(tournament.teams[i]);
		// if (!contained && !tournament.teams[i].refused) list.push(tournament.teams[i]);
    }
    return list;
}