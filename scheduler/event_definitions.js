const TYPE_JUDGING = new sessionType("Judging", 8);
const TYPE_ROUND = new sessionType("Matches", 16);
const TYPE_BREAK = new sessionType("Breaks", 0);

var UID_counter = 1;
var start_time_offset = 0; // Set to number of minutes to start if wanted

function sessionType(name,priority) {
	this.name = name;
	this.priority = priority;
}

function EventParameters(name,nTeams,nDays,teamNumbers,teamNames,days) {
	this.name = name || "2017 FLL Tournament";
	this.nTeams = nTeams || 24;
	this.nDays = nDays || 1;
	this.allSessions = [];
	this.teamNumbers = teamNumbers || [];
	this.teamNames = teamNames || [];
	this.days = days || [];
	while (this.days.length < this.nDays) this.days.push("Day " + (this.days.length+1));
	while (this.teamNumbers.length < this.nTeams) this.teamNumbers.push("" + (this.teamNumbers.length+1)); 
	while (this.teamNames.length < this.nTeams) this.teamNames.push("Team " + (this.teamNames.length+1)); 
	this.updateDays = function(num_days) {
		this.nDays = num_days;
		while (this.days.length < this.nDays) {
			this.days.push("Day "+ (this.days.length+1));
			addBreak("Night "+(this.days.length-1),((this.days.length-1)*24*60-360),((this.days.length-1)*24*60+540));
		}
		while (this.days.length > this.nDays) {
			this.days.splice(this.days.length-1,1);
		}
	}
}

// session parameters
function SessionParameters(type,name,start,end,nSims,nLocs,length,buffer,locs) {
	this.uid = UID_counter++;
	this.type = type || TYPE_JUDGING;
	if (name) this.name = name;
	else {
		if (this.type == TYPE_JUDGING) this.name = "Judging " + this.uid;
		if (this.type == TYPE_ROUND) this.name = "Round " + this.uid;
		if (this.type == TYPE_BREAK) this.name = "Lunch";
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
		if (this.type == TYPE_ROUND) this.nSims = 2;
		if (this.type == TYPE_BREAK) this.nSims = tournament.nTeams;
	}
	if (length) this.length = length;
	else {
		if (this.type == TYPE_JUDGING) this.length = 10;
		if (this.type == TYPE_ROUND) this.length = 4;
		if (this.type == TYPE_BREAK) this.length = (this.end-this.start);
	}
	if (buffer) this.buffer = buffer;
	else {
		if (this.type == TYPE_JUDGING) this.buffer = 5;
		if (this.type == TYPE_ROUND) this.buffer = 4;
		if (this.type == TYPE_BREAK) this.buffer = 0;
	}
	this.locations = locs || [];
}

function loadPresetFLL() {
	addRound("Round 1",600,1020,2,4,5,5);
	addRound("Round 2",600,1020,2,4,5,5);
	addRound("Round 3",600,1020,2,4,5,5);
	addJudging("Robot Design Judging",600,1020,4,4,10,5);
	addJudging("Core Values Judging",600,1020,4,4,10,5);
	addJudging("Research Project Judging",600,1020,4,4,10,5);
	addBreak("Lunch");
}

function updateParams(id) {
	getSession(id).update();
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
	tournament.allSessions.splice(toDelete,1);
	tourn_ui.allPanels.splice(toDelete,1);
}


function getSession(uid) {
	for (var i = 0; i < tournament.allSessions.length; i++) {
		if (tournament.allSessions[i].uid == uid) return tournament.allSessions[i];
	}
	console.log("Failed to find session " + uid);
	return null;
}



