const TYPE_JUDGING = new SessionType(16,"Judging", 8);
const TYPE_INSPECTION = new SessionType(24,"Inspection", 12);
const TYPE_MATCH_ROUND = new SessionType(32,"Rounds", 16);
const TYPE_MATCH_ROUND_PRACTICE = new SessionType(33,"Practice Rounds", 128);
const TYPE_MATCH_FILLER = new SessionType(48,"Matches", 32);
const TYPE_MATCH_FILLER_PRACTICE = new SessionType(49,"Practice Matches", 129);
const TYPE_BREAK = new SessionType(64,"Breaks", 0);
const TYPES = [TYPE_JUDGING, TYPE_INSPECTION, TYPE_MATCH_FILLER, TYPE_BREAK, TYPE_MATCH_ROUND, TYPE_MATCH_ROUND_PRACTICE];

const EVENT_FLL = 0;
const EVENT_FTC = 1;

const STATUS_EMPTY = 0;
const STATUS_OVERTIME = 1;
const STATUS_INPROGRESS = 2;
const STATUS_FAILURE = 3;
const STATUS_SUCCESS = 4;

const LEAVE_BLANKS = 0;
const USE_SURROGATES = 1;	
const USE_STANDINS = 2;
const POLICIES = ["Leave blanks", "Use surrogates"];

const SCHEDULER_VERSION = "2.2.4";

var TEAM_UID_COUNTER = 0;

function SessionType(uid,name,priority) {
	this.name = name;
	this.priority = priority;
}

function EventParameters(type,name,nTeams,nDays,minTravel,extraTime) {
	this.UID_counter = 1;
	this.type = type;
	this.status = STATUS_EMPTY;
	this.version = SCHEDULER_VERSION;
	this.startDate = new Date().toDateInputValue();
	this.teamnum_counter = 1;
	var year = this.startDate.split("-")[0];
	this.name = (name)?name:(year+((type == EVENT_FLL)?" FLL Tournament":" FTC Tournament"));
	if (!nTeams) var nTeams=24;
	this.minTravel = (minTravel)?minTravel:10;
	this.extraTime = (extraTime)?extraTime:5;
	this.allSessions = [];
	this.teams = [];
	this.days = [];
	this.method="random";
	this.logos = ["../resources/flllogo.jpg","../resources/gamelogo.jpg","../resources/mqlogo.png","../resources/firstlogo.png"];
	if (this.type == EVENT_FTC) {
		this.logos[0] = "../resources/ftclogo.jpg";
		this.logos[1] = "../resources/ftcgamelogo.jpg";
	}
	this.errors = Infinity;
	if (!nDays) var nDays = 1
	while (this.days.length < nDays) this.days.push("Day " + (this.days.length+1));
	while (this.teams.length < nTeams) this.teams.push(new TeamParameters(this.teams.length+1)); 
}

function updateTournDays(event, num_days) {
	// event.nDays = num_days;
	while (event.days.length < num_days) {
		event.days.push("Day "+ (event.days.length+1));
		addBreak("Night "+(event.days.length-1),((event.days.length-1)*24*60-360),((event.days.length-1)*24*60+540));
		tournament.allSessions[tournament.allSessions.length-1].locations = [""];
	}
	while (event.days.length > num_days) {
		event.days.splice(event.days.length-1,1);
	}
}

// session parameters
function SessionParameters(type,name,start,end,nSims,nLocs,length,buffer,locs) {
	this.uid = tournament.UID_counter++;
	this.type = type || TYPE_JUDGING;
	if (name) this.name = name;
	else {
		var count = 1; 
		for (var i = 0; i < tournament.allSessions.length; i++) if (tournament.allSessions[i].type == this.type) count++;
		if (this.type == TYPE_JUDGING) this.name = "Judging " + count;
		if (this.type == TYPE_INSPECTION) this.name = "Inspection " + count;
		if (this.type == TYPE_MATCH_ROUND) this.name = "Round " + count;
		if (this.type == TYPE_MATCH_ROUND_PRACTICE) this.name = "Practice Round " + count;
		if (this.type == TYPE_BREAK) this.name = "Break " + count;
		if (this.type == TYPE_MATCH_FILLER) this.name = "Qualifying Session " + count;
		if (this.type == TYPE_MATCH_FILLER_PRACTICE) this.name = "Practice Session " + count;
	}
	if (start) this.start = start;
	else this.start = (this.type==TYPE_BREAK)?(12*60):(10*60);
	if (end) this.end = end;
	else this.end = (this.type==TYPE_BREAK)?(13*60):(17*60);
	if (nLocs) this.nLocs = nLocs;
	else this.nLocs = (this.type==TYPE_BREAK)?1:4;
	if (nSims) this.nSims = nSims;
	else {
		if (this.type == TYPE_JUDGING) this.nSims = nLocs;
		if (this.type == TYPE_INSPECTION) this.nSims = nLocs;
		if (this.type == TYPE_MATCH_ROUND) this.nSims = 2;
		if (this.type == TYPE_MATCH_ROUND_PRACTICE) this.nSims = 2;
		if (this.type == TYPE_MATCH_FILLER) this.nSims = 4;
		if (this.type == TYPE_MATCH_FILLER_PRACTICE) this.nSims = 4;
		if (this.type == TYPE_BREAK) this.nSims = tournament.teams.length;
	}
	if (length) this.length = length;
	else {
		if (this.type == TYPE_JUDGING) this.length = 10;
		if (this.type == TYPE_INSPECTION) this.length = 10;
		if (this.type == TYPE_MATCH_ROUND) this.length = 4;
		if (this.type == TYPE_MATCH_ROUND_PRACTICE) this.length = 4;
		if (this.type == TYPE_MATCH_FILLER) this.length = 6;
		if (this.type == TYPE_MATCH_FILLER_PRACTICE) this.length = 6;
		if (this.type == TYPE_BREAK) this.length = (this.end-this.start);
	}
	if (buffer) this.buffer = buffer;
	else {
		if (this.type == TYPE_JUDGING) this.buffer = 5;
		if (this.type == TYPE_INSPECTION) this.buffer = 5;
		if (this.type == TYPE_MATCH_ROUND) this.buffer = 4;
		if (this.type == TYPE_MATCH_ROUND_PRACTICE) this.buffer = 4;
		if (this.type == TYPE_MATCH_FILLER) this.buffer = 4;
		if (this.type == TYPE_MATCH_FILLER_PRACTICE) this.buffer = 4;
		if (this.type == TYPE_BREAK) this.buffer = 0;
	}
	this.locations = locs || [];
	this.schedule = []; // To be filled in later
	this.nErrors = 0;

	this.instances = 1; // Can be changed in later versions, specifically for TYPE_MATCH_FILLER.
	this.extraTimeFirst = false; // Should the first round be a little longer?
	this.extraTimeEvery = null; // Extra time every N rounds
	if (this.type == TYPE_MATCH_ROUND) this.fillerPolicy = USE_SURROGATES;
	else if (this.type == TYPE_MATCH_ROUND_PRACTICE) this.fillerPolicy = USE_SURROGATES;
	else if (this.type == TYPE_MATCH_FILLER) this.fillerPolicy = USE_SURROGATES;
	else if (this.type == TYPE_MATCH_FILLER_PRACTICE) this.fillerPolicy = USE_SURROGATES;
	else this.fillerPolicy = LEAVE_BLANKS; // How to fill in empty spots in non-round-number instances.
	this.appliesTo = []; // Which sessions a break applies to
	this.usesSurrogates = false;
}

function TeamParameters(number,name) {
	this.uid = TEAM_UID_COUNTER++;
	this.number = (number)?number:(tournament.teamnum_counter++);
	this.name = (name)?name:("Team " +this.number);
	this.pitNum = 0;
	this.extraTime = false;
	this.excludeJudging = false;
	this.start = null; // Can be used to define when the team must arrive.
	this.end = null; // Can be used to define when the team must leave.
	this.isSurrogate = false;
	this.schedule = [];
	// For the above two parameters, will probably need to conduct a check before scheduling; if they physically can't fit anything, don't try.
}

function loadPresetFLL() {
	addRound("Round 1",600,1020,2,4,5,5);
	addRound("Round 2",600,1020,2,4,5,5);
	addRound("Round 3",600,1020,2,4,5,5);
	addJudging("Robot Design Judging",600,1020,3,3,10,5);
	addJudging("Core Values Judging",600,1020,3,3,10,5);
	addJudging("Research Project Judging",600,1020,3,3,10,5);
	addBreak("Lunch");
	toggleAdvMode();
}

function loadPresetFTC() {
	addInspection("Robot Inspection",540,720,2,2,10,5);
	addJudging("Judging",540,720,3,3,10,5);
	addMatchFiller("Matches",720,990,4,4,6,4);
}

function deleteParams(id) {
	var toDelete = -1;
	for (var i = 0; i < tourn_ui.allPanels.length; i++) {
		if (tourn_ui.allPanels[i].session.uid == id) {
			$(tourn_ui.allPanels[i].docObj).remove();
			toDelete = i;
			break;
		}
	}
	if (toDelete == -1) {
		console.log("Delete failed....whattup?");
		return;
	}
	tourn_ui.allPanels.splice(toDelete,1);
	toDelete = -1;
	for (var i = 0; i < tourn_ui.params.allSessions.length; i++) {
		if (tourn_ui.params.allSessions[i].uid == id) {
			toDelete = i;
		}
	}
	if (toDelete == -1) {
		alert ("Something terrible went wrong D:");
		return;
	}
	tourn_ui.params.allSessions.splice(toDelete,1);
}

function allTypes(event, type) {
	var types=[];
	for (var i = 0; i < event.allSessions.length; i++) {
		if (event.allSessions[i].type == type) types.push(event.allSessions[i]);
	}
	if (types.length == 0) return null;
	return types;
}

function getSession(uid) {
	for (var i = 0; i < tournament.allSessions.length; i++) {
		if (tournament.allSessions[i].uid == uid) return tournament.allSessions[i];
	}
	console.log("Failed to find session " + uid);
	return null;
}

function getTeam(uid) {
	for (var i = 0; i < tournament.teams.length; i++) {
		if (tournament.teams[i].uid == uid) return tournament.teams[i];
	}
	console.log("Failed to find team " + uid);
	return null;
}

// Returns a single string JSON of all the stuffs.
function save() {
	return JSON.stringify(tournament);
}

// Reads given json string, makes parameters match.
function load(json) {
	var evt = JSON.parse(json);
	if (!evt.version) evt.version = "1.0";
	// Do legacy checks
	if (cmpVersions(""+evt.version, "1.1")) {
		evt.startDate = new Date().toDateInputValue();
		for (var t = 0; t < evt.teams.length; t++) {
			evt.teams[t].extraTime = evt.teams[t].special;
			evt.teams[t].excludeJudging = false;
			if (!(evt.teams[t].pitNum)) evt.teams[t].pitNum = 0;
		}
	}
	if (cmpVersions(""+evt.version, "1.2")) {
		if (evt.startDate == null) evt.startDate = new Date().toDateInputValue();
	}
	if (cmpVersions(""+evt.version, "2.0")) {
		evt.type = EVENT_FLL;
	}
	if (cmpVersions(""+evt.version, "2.1.2")) {
		for (var i = 0; i < evt.logos.length; i++) {
			if (evt.logos[i].startsWith("data")) continue;
			evt.logos[i] = "../resources/"+evt.logos[i];
			// evt.logos = ["../resources/flllogo.jpg","../resources/gamelogo.jpg","../resources/mqlogo.png","../resources/firstlogo.png"];
		}
	}
	if (cmpVersions(""+evt.version, "2.1.4")) {
		if (evt.allSessions[0].schedule.length == 0) {
			evt.status = STATUS_EMPTY;
		} else {
			if (evt.errors == Infinity || evt.errors == null) {
				evt.status = STATUS_OVERTIME;
			} else if (evt.errors == 0) {
				evt.status = STATUS_SUCCESS;
			} else {
				evt.status = STATUS_FAILURE;
			}
		}
	}
	if (cmpVersions(""+evt.version, "2.2.3")) {
		for (var k = 0; k < evt.allSessions.length; k++)  {
			evt.allSessions[k].usesSurrogates = false;
			var schedule = evt.allSessions[k].schedule;	
			for (var i = 0; i < schedule.length; i++) {
				var instance = schedule[i];
				if (instance.teams == null) continue;
				for (var t = 0; t < instance.teams.length; t++) {
					if ((instance.teams.length - t) <= instance.surrogates) evt.allSessions[k].usesSurrogates = true;
				}
			}
		}

	}

	evt.version = SCHEDULER_VERSION;
	// Convert types to literal TYPE objects for later comparisons
	for (var i = 0; i < evt.allSessions.length; i++) {
		var s = evt.allSessions[i];
		for (var j = 0; j < TYPES.length; j++) {
			if (s.type.uid && s.type.uid == TYPES[j].uid) s.type = TYPES[j];
			else if (s.type.name == TYPES[j].name) s.type = TYPES[j];
		}
	}
	// Fix UID counters
	for (var i = 0; i < evt.teams.length; i++) {
		if (evt.teams[i].uid >= TEAM_UID_COUNTER) TEAM_UID_COUNTER = evt.teams[i].uid+1;
	}
	toggleAdvMode();
	console.log(evt);
	return evt;
}

// TODO: Don't consider the start of TYPE_BREAK
function minTravelTime(team) {
	var time = Infinity;
	for (var i = 0; i < team.schedule.length; i++) {
		for (var j = 0; j < team.schedule.length; j++) {
			if (i == j) continue;
			if (getSession(team.schedule[i].session_uid).type == TYPE_BREAK) continue;
			if (getSession(team.schedule[j].session_uid).type == TYPE_BREAK) continue;
			if (!team.schedule[i].teams || !team.schedule[j].teams) continue;
			var inst1 = team.schedule[i];
			var start1 = inst1.time; 
			var end1 = start1 + getSession(inst1.session_uid).length + ((inst1.extra)?tournament.extraTime:0);
			var inst2 = team.schedule[j];
			var start2 = inst2.time; 
			var end2 = start2 + getSession(inst2.session_uid).length + ((inst2.extra)?tournament.extraTime:0);
			var dt12 = end1 - start2;
			var dt21 = end2 - start1; 
			var currMin = Math.min(Math.abs(dt12),Math.abs(dt21));
			time = Math.min(currMin,time);
		}
	}
	return time;
}

function genSessionTable(event, session) {
	var table = [];
    var applyingBreaks = [];
    for (var j = 0; j < event.allSessions.length; j++) {
        if (event.allSessions[j].type == TYPE_BREAK && applies(event.allSessions[j],session))
            if (overlaps(event.allSessions[j],session)) applyingBreaks.push(event.allSessions[j]);
    }
    var schedule = session.schedule.slice();
    for (var i = 0; i < applyingBreaks.length; i++) {
        schedule.push(new Instance(applyingBreaks[i].uid,"",applyingBreaks[i].start,null));
    }
    schedule.sort(function(a,b) {
        return a.time - b.time;
    });
	// Header
	var header = ["#", "Time"];
	for (var i = 0; i < session.locations.length; i++)
		header.push(session.locations[i]);
	table.push(header);
	// Body
	for (var i = 0; i < schedule.length; i++) {
		var instance = schedule[i];
		var row = [];
		row.push(instance.num+"");
		if (instance.extra)
			row.push(minsToDT(instance.time)+"+");
		else
			row.push(minsToDT(instance.time)+"");
        if (getSession(schedule[i].session_uid).type == TYPE_BREAK) {
            row.push("colspan::"+session.nLocs+"::"+getSession(schedule[i].session_uid).name);
            table.push(row);
            continue;
        }
        var diff = session.nLocs;
        for (var dummy = 0; dummy < instance.loc; dummy++) {
        	diff--;
            row.push("");
        }		
		for (var t = 0; t < instance.teams.length; t++) {
			diff--;
			var surrogate = "";
			if ((instance.teams.length - t) <= instance.surrogates) surrogate = "*";
			if (instance.teams[t] == NOT_YET_ADDED)
				row.push("--"+surrogate+"");
			else 
				row.push(getTeam(instance.teams[t]).number+surrogate+"\n"+getTeam(instance.teams[t]).name);
		}
		while (diff-- > 0) row.push("");
		table.push(row);
	}
	return table;
}

function genIndivTable(event, compact) {	
	event.teams.sort(function(a,b) {
		return a.uid - b.uid;
	});
	var table = [];
	var usesSurrogates = false;
	for (var k = 0; k < event.allSessions.length; k++)
		if (event.allSessions[k].usesSurrogates) usesSurrogates = true;

	table[0] = ["colspan::2::Team"];
	for (var i = 0; i < event.allSessions.length; i++) { 
		if (event.allSessions[i].type == TYPE_BREAK) continue;
		for (var j = 0 ; j < event.allSessions[i].instances; j++) 
			table[0].push("colspan::"+(compact?2:3)+"::"+event.allSessions[i].name);
	}
	table[0].push("Min. Travel time");
	if (usesSurrogates) table[0].push("colspan::"+(compact?2:3)+"::Surrogate");
	table[1] = ["#", "Name"];
	for (var i = 0; i < event.allSessions.length; i++) { 
		if (event.allSessions[i].type == TYPE_BREAK) continue;
		for (var j = 0 ; j < event.allSessions[i].instances; j++) {
			if (!compact) table[1].push("#");
			table[1].push("Time");
			table[1].push("Loc");
		}
	}
	table[1].push("");
	if (usesSurrogates) {
		if (!compact) table[1].push("#");
		table[1].push("Time");
		table[1].push("Loc");
	}
	for (var i = 0; i < event.teams.length; i++) {
		var row = [];
		var team = event.teams[i];
		row.push(""+team.number);
		row.push(""+team.name);
		for (var j = 0; j < team.schedule.length; j++) {
			if (getSession(team.schedule[j].session_uid).type == TYPE_BREAK) continue;
			if (team.schedule[j].teams && (team.schedule[j].teams.length - team.schedule[j].teams.indexOf((team.uid))) <= team.schedule[j].surrogates) continue; // Surrogate
			if (!team.schedule[j].teams) {
				row.push(""); row.push(""); row.push("");
			} else {
				if (!compact) row.push(""+team.schedule[j].num);
				row.push(""+minsToDT(team.schedule[j].time));
				if (team.schedule[j].loc == -1)
					row.push("--");
				else
					row.push(""+getSession(team.schedule[j].session_uid).locations[team.schedule[j].teams.indexOf(team.uid)+team.schedule[j].loc]);
			}
		}
		row.push(""+minTravelTime(team));
		var hadASurrogate = false;
		for (var j = 0; j < team.schedule.length; j++) {
			if (!team.schedule[j].teams) continue;
			if ((team.schedule[j].teams.length - team.schedule[j].teams.indexOf((team.uid))) > team.schedule[j].surrogates) continue;
			else {
				hadASurrogate = true;
				if (!compact) row.push(""+team.schedule[j].num);
				row.push(""+minsToDT(team.schedule[j].time));
				if (team.schedule[j].loc == -1)
					row.push("--");
				else
					row.push(""+getSession(team.schedule[j].session_uid).locations[team.schedule[j].teams.indexOf(team.uid)+team.schedule[j].loc]);
			}
		}
		if (!hadASurrogate && usesSurrogates) {
			if (!compact) row.push("");
			row.push("");
			row.push("");
		}
		table.push(row);
	}
	return table;
}