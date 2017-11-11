const TYPE_JUDGING = new SessionType(16,"Judging", 8);
const TYPE_MATCH_ROUND = new SessionType(32,"Rounds", 16);
const TYPE_MATCH_ROUND_PRACTICE = new SessionType(33,"Practice Rounds", 128);
const TYPE_MATCH_FILLER = new SessionType(48,"Matches", 32);
const TYPE_MATCH_FILLER_PRACTICE = new SessionType(49,"Practice Matches", 129);
const TYPE_BREAK = new SessionType(64,"Breaks", 0);
const TYPES = [TYPE_JUDGING, TYPE_MATCH_FILLER, TYPE_BREAK, TYPE_MATCH_ROUND, TYPE_MATCH_ROUND_PRACTICE];

const EVENT_FLL = 0;

const LEAVE_BLANKS = 0;
const USE_SURROGATES = 1;	
const USE_STANDINS = 2;
const POLICIES = ["Leave blanks", "Use surrogates"];

const SCHEDULER_VERSION = "2.1.1";

var TEAM_UID_COUNTER = 0;

function SessionType(uid,name,priority) {
	this.name = name;
	this.priority = priority;
}

function EventParameters(type,name,nTeams,nDays,minTravel,extraTime) {
	this.UID_counter = 1;
	this.type = EVENT_FLL;
	this.version = SCHEDULER_VERSION;
	this.startDate = new Date().toDateInputValue();
	this.teamnum_counter = 1;
	this.start_time_offset = 0; // Set to number of minutes to start if wanted
	var year = this.startDate.split("-")[0];
	this.name = (name)?name:(year+" FLL Tournament");
	if (!nTeams) var nTeams=24;
	this.minTravel = (minTravel)?minTravel:10;
	this.extraTime = (extraTime)?extraTime:5;
	this.allSessions = [];
	this.teams = [];
	this.days = [];
	this.method="random";
	this.logos = ["flllogo.jpg","gamelogo.jpg","mqlogo.png","firstlogo.png"];
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
		if (this.type == TYPE_MATCH_ROUND) this.name = "Round " + count;
		if (this.type == TYPE_MATCH_ROUND_PRACTICE) this.name = "Practice Round " + count;
		if (this.type == TYPE_BREAK) this.name = "Break " + count;
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
		if (this.type == TYPE_MATCH_ROUND) this.nSims = 2;
		if (this.type == TYPE_MATCH_ROUND_PRACTICE) this.nSims = 2;
		if (this.type == TYPE_BREAK) this.nSims = tournament.teams.length;
	}
	if (length) this.length = length;
	else {
		if (this.type == TYPE_JUDGING) this.length = 10;
		if (this.type == TYPE_MATCH_ROUND) this.length = 4;
		if (this.type == TYPE_MATCH_ROUND_PRACTICE) this.length = 4;
		if (this.type == TYPE_BREAK) this.length = (this.end-this.start);
	}
	if (buffer) this.buffer = buffer;
	else {
		if (this.type == TYPE_JUDGING) this.buffer = 5;
		if (this.type == TYPE_MATCH_ROUND) this.buffer = 4;
		if (this.type == TYPE_MATCH_ROUND_PRACTICE) this.buffer = 4;
		if (this.type == TYPE_BREAK) this.buffer = 0;
	}
	this.locations = locs || [];
	this.schedule = []; // To be filled in later
	this.nErrors = 0;

	this.instances = 1; // Can be changed in later versions, specifically for TYPE_MATCH_FILLER.
	this.extraTimeFirst = false; // Should the first round be a little longer?
	this.extraTimeEvery = null; // Extra time every N rounds
	if (this.type == TYPE_MATCH_ROUND) this.fillerPolicy = USE_SURROGATES;
	if (this.type == TYPE_MATCH_ROUND_PRACTICE) this.fillerPolicy = USE_SURROGATES;
	else if (this.type == TYPE_MATCH_FILLER) this.fillerPolicy = USE_SURROGATES;
	else this.fillerPolicy = LEAVE_BLANKS; // How to fill in empty spots in non-round-number instances.
	this.appliesTo = []; // Which sessions a break applies to

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

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

//https://stackoverflow.com/questions/6832596/how-to-compare-software-version-number-using-js-only-number, LeJared
function cmpVersions (a, b) {
    var i, diff;
    var regExStrip0 = /(\.0+)+$/;
    var segmentsA = a.replace(regExStrip0, '').split('.');
    var segmentsB = b.replace(regExStrip0, '').split('.');
    var l = Math.min(segmentsA.length, segmentsB.length);

    for (i = 0; i < l; i++) {
        diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
        if (diff) {
            return diff;
        }
    }
    return segmentsA.length - segmentsB.length;
}

