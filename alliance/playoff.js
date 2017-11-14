const MATCH_ROS = {priority:0,n:8,prefix:"Ro16"};
const MATCH_QF = {priority:1,n:4,prefix:"QF"};
const MATCH_SF = {priority:2,n:2,prefix:"SF"};
const MATCH_F = {priority:3,n:1,prefix:"F"};

const WIN_NONE = 0;
const WIN_RED = 1;
const WIN_BLUE = 2;

function Match(name, type, red, blue, bye) {
    this.name = name;
    this.type = type;
    this.red = red;
    this.blue = blue;
    this.bye = bye;
    this.redWins = 0;
    this.blueWins = 0;
    this.winner = WIN_NONE;
}

Match.prototype.toString = function () {
    if (this.bye) return this.name + ": " + this.red + " (BYE)";
    if (this.red == null && this.blue == null) return this.name + ": __ v __";
    if (this.red == null) return this.name + ": __ v " + this.blue; 
    if (this.blue == null) return this.name + ": " + this.red + " v __"; 
    return this.name + ": " + this.red + " v " + this.blue;
}


// Order of teams to play, starting at Round of Sixteen
const ORDER = [0,15,7,8,3,12,4,11,1,14,6,9,2,13,5,10];

function loadPlayoff() {
    tournament.mode = MODE_PLAYOFF;
    $("#nav-playoff-tab").tab('show');

    generateMatches();
}

function generateMatches() {
    // Create matches
    tournament.matches = [];
    var minMode = -1;
    if (tournament.alliances.length > MATCH_ROS.n)
        minMode = MATCH_ROS;
    else if (tournament.alliances.length > MATCH_QF.n)
        minMode = MATCH_QF; 
    else if (tournament.alliances.length > MATCH_SF.n)
        minMode = MATCH_SF; 
    else minMode = MATCH_F; 

    // Add all of current matches.
    var match;
    var count = 0;
    for (var i = 0; i < ORDER.length; i++) {
    	if (ORDER[i] >= minMode.n*2) continue;
    	if ((count++)%2 == 0) {
    		match = new Match(minMode.prefix, minMode, tournament.alliances[ORDER[i]], null, false);
		} else {
			if (ORDER[i] >= tournament.alliances.length) match.bye = true;
			else match.blue = tournament.alliances[ORDER[i]];
			tournament.matches.push(match);
		}
    }
    
    for (var i = 0; i < tournament.matches.length; i++) {
        tournament.matches[i].name += "-"+(i+1);
    }

    // Add all unfilled matches
    if (minMode.n >= MATCH_ROS.n)
        for (var i = 0; i < MATCH_QF.n; i++)
            tournament.matches.push(new Match(MATCH_QF.prefix+"-"+(i+1),MATCH_QF,null,null,false));
    if (minMode.n >= MATCH_QF.n)
        for (var i = 0; i < MATCH_SF.n; i++)
            tournament.matches.push(new Match(MATCH_SF.prefix+"-"+(i+1),MATCH_SF,null,null,false));
    if (minMode.n >= MATCH_SF.n) 
        for (var i = 0; i < MATCH_F.n; i++)
            tournament.matches.push(new Match(MATCH_F.prefix+"-"+(i+1),MATCH_F,null,null,false));

    console.log(tournament.matches);
    advanceTeams();
    updateMatchList();
}

function advanceTeams() {
	var ros = getAllMatches(MATCH_ROS);
	var qf = getAllMatches(MATCH_QF);
	var sf = getAllMatches(MATCH_SF);
	var f = getAllMatches(MATCH_F);
	console.log(qf);
	for (var i = 0; i < ros.length; i++) {
		var match = ros[i];
		var next = qf[Math.floor(i/2)];
		if (next.red != null && next.blue != null) continue;
		if ((match.winner == WIN_RED) || (match.winner == WIN_NONE && match.bye)) {
			if (i%2 == 0) next.red = match.red;
			else next.blue = match.red;
		} else if (match.winner == WIN_BLUE) {
			if (i%2 == 0) next.red = match.blue;
			else next.blue = match.blue;
		}
	}
	for (var i = 0; i < qf.length; i++) {
		var match = qf[i];
		var next = sf[Math.floor(i/2)];
		if (next.red != null && next.blue != null) continue;
		if ((match.winner == WIN_RED) || (match.winner == WIN_NONE && match.bye)) {
			if (i%2 == 0) next.red = match.red;
			else next.blue = match.red;
		} else if (match.winner == WIN_BLUE) {
			if (i%2 == 0) next.red = match.blue;
			else next.blue = match.blue;
		}
	}
	for (var i = 0; i < sf.length; i++) {
		var match = sf[i];
		var next = f[Math.floor(i/2)];
		if (next.red != null && next.blue != null) continue;
		if ((match.winner == WIN_RED) || (match.winner == WIN_NONE && match.bye)) {
			if (i%2 == 0) next.red = match.red;
			else next.blue = match.red;
		} else if (match.winner == WIN_BLUE) {
			if (i%2 == 0) next.red = match.blue;
			else next.blue = match.blue;
		}
	}
}

function getAllMatches(type) {
	var list = [];
	for (var i = 0; i < tournament.matches.length; i++) 
		if (tournament.matches[i].type.priority == type.priority) list.push(tournament.matches[i]);
	return list;
}

function updateMatchList() {
    $(DOM_Objects.matchSelect).empty();
    $(DOM_Objects.matchSelect).append($("<option value='-1' selected></option>"))
    var al = tournament.matches;
    for (var i = 0; i < al.length; i++) {
        $(DOM_Objects.matchSelect).append($("<option value='"+i+"' selected>"+al[i]+"</option>"))
    }
    $(DOM_Objects.matchSelect)[0].value = -1;
    // Lol funny workaround
    selectTeam({value:-1});
}
