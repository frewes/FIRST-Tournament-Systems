
const MODE_SETUP = 0;
const MODE_SELECTION = 1;
const MODE_PLAYOFF = 2;

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
    } else if (tournament.mode == MODE_SELECTION) {
    	$("#nodata").hide();
    	$("#selection").show();
    } else {
    	$("#nodata").hide();
    	$("#selection").hide();    	
    }
    $("#nodatalogo")[0].src = tournament.logo;
	$("#selectionlogo")[0].src = tournament.logo;

    var al = availableList();
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

function getTournament() {
    tournament = JSON.parse(localStorage.getItem("alliances"));
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