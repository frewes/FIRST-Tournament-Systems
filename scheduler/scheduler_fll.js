/**
SessionType [name, priority]:
	TYPE_JUDGING
	TYPE_MATCH_ROUND
	TYPE_BREAK

Methods:
	METHOD_RANDOM
	METHOD_BLOCK

EventParameters:
	[ UID_counter, teamnum_counter, start_time_offset, name, majorLogo, gameLogo, days ]
	minTravel
	method
	teams (TeamParameters):
		function TeamParameters(number,name) {
		[number, name]
		special
		start
		end
		schedule
	allSessions (SessionParameters):
		uid
		type
		name
		start
		end
		nLocs
		nSims
		length
		buffer
		locations
		schedule
**/
function schedule(event) {
	buildAllTables(event);

	initialFill(event);

	console.log(event);
}

function emptySchedule(event) {
	for (var i = 0; i < event.allSessions.length; i++) event.allSessions.schedule = [];
	for (var i = 0; i < event.teams.length; i++) event.teams[i].schedule = [];
}

/**
	num: Count of instance 
	time: Time (mins) of instance
	teams: List of teams in instance
	loc: Location offset (i.e. for staggered sessions, location index of where the teams begin)
	extra: true/false if extra time is allocated
*/
function Instance(uid, num, time, teams, loc) {
	this.session_uid = uid;
	this.num = num;
	this.time = time;
	this.teams = teams;
	this.loc = loc;
	this.extra = false;
}

const NOT_YET_ADDED = -64;

function buildAllTables(event) {
	event.allSessions.sort(function(a,b) {
		if (a.type.priority == b.type.priority) return a.start - b.start;
		return a.type.priority - b.type.priority;
	});
	for (var i = 0; i < event.allSessions.length; i++) {
		if (event.allSessions[i].type == TYPE_MATCH_ROUND) continue;
		var end = tableSession(event,event.allSessions[i],0);
		if (end > event.allSessions[i].end) alert (event.allSessions[i].name + " will finish late! Consider revising");
	}
	var end = -Infinity;
	var offset = 0;
	for (var i = 0; i < event.allSessions.length; i++) {
		if (event.allSessions[i].type != TYPE_MATCH_ROUND) continue;
		if (event.allSessions[i].start < end) event.allSessions[i].start = end;
		end = tableSession(event,event.allSessions[i],offset);
		offset += event.allSessions[i].schedule.length;
		if (end > event.allSessions[i].end) alert (event.allSessions[i].name + " will finish late! Consider revising");
	}
}

/**
    Sets up all the timeslots for the given session.
    numOffset: offset at which to start counting (facilitates round numbering)
    @return Returns the time the schedule is finished (i.e. the end
    time of the last event)
*/
function tableSession(event, session, numOffset) {
	if (!numOffset) numOffset = 0;
    var now = session.start;
    var L = Math.ceil((event.teams.length*session.instances) / session.nSims);
    var lastNTeams = ((event.teams.length*session.instances) % session.nSims);
    lastNTeams = (lastNTeams==0) ? session.nSims : lastNTeams;
    session.schedule = new Array(L);
    
    // Figure out how many rounds to make extra long
    var everyN = (session.extraTimeEvery)?session.extraTimeEvery:Infinity;
    var specialTeams = 0;
    for (var i = 0; i < event.teams.length; i++) {
    	if (event.teams[i].special) specialTeams++;
    }
    var extraRoundsNeeded = Math.ceil(specialTeams/session.nSims);
    var everyNRounds = ((session.extraTimeFirst)?1:0) +((session.extraTimeEvery)?L/everyN:0);
    if (everyNRounds < extraRoundsNeeded) {
    	everyN = (L+1)/(extraRoundsNeeded+1);
    }

    var roundsSinceExtra = 0;
    var extraRounds = 0;
    if (session.type == TYPE_BREAK) everyN = Infinity;
    for (var i = 0; i < L; i++) {
        var d = Math.floor(session.nLocs/session.nSims);
        var locOffset = (i%d)*session.nSims;
        if (i < L-1) { 
	        session.schedule[i] = new Instance(session.uid,i+1+numOffset,now,new Array(session.nSims),locOffset);
	        now = timeInc(event,now,session.length+session.buffer);
	        roundsSinceExtra++;
            if (((i == 0 && session.extraTimeFirst) || (roundsSinceExtra >= everyN)) && extraRounds < extraRoundsNeeded) {
	        	session.schedule[i].extra = true;
	        	now = timeInc(event,now,event.extraTime);
	        	roundsSinceExtra = 0;
	        	extraRounds++;
	        }
	    } else {
	    	session.schedule[i] = new Instance(session.uid,i+1+numOffset,now,new Array(lastNTeams),locOffset);
	    	now = now + session.length + session.buffer;
	        roundsSinceExtra++;
            if (roundsSinceExtra >= everyN) {
	        	session.schedule[i].extra = true;
	        	now = now + event.extraTime;
	        }
	    }

        for (var t = 0; t < session.schedule[i].teams.length; t++) {
            session.schedule[i].teams[t] = NOT_YET_ADDED;
        }
    }
    return now;
}

function initialFill(event) {
	var oneSetOfTeams = event.teams.slice();
	for (var i = 0; i < event.allSessions.length; i++) {
		var teams = [];
		for (var j = 0; j < event.allSessions[i].instances; j++) 
			teams = teams.concat(oneSetOfTeams.slice());
		fillSession(event,event.allSessions[i],teams);
	}
}

function fillSession(event, session, teams) {
	for (var i = 0; i < session.schedule.length; i++) {
		var instance = session.schedule[i];
		for (var t = 0; t < instance.teams.length; t++) {
			var team = -1;
			for (var k = 0; k < teams.length; k++) {
				if (canDo(event,teams[k],instance)) {
					team = k;
					break;
				}
			}
			if (team != -1) {
				var team = teams.splice(team,1)[0];
				instance.teams[t] = team.uid;
				team.schedule.push(instance);
			} else continue;
		}
	}
	for (var i = 0; i < teams.length; i++) teams[i].schedule.push(new Instance(session.uid, -1,null,null,-1));
}


/** ========================== UTILITIES ========================== **/

/** 
	Increments given time, skipping breaks.
	@return Returns the incremented time.
*/
function timeInc(event,time,len) {
    var newTime = time + len;
    for (var i = 0; i < event.allSessions.length; i++) {
    	var session = event.allSessions[i];
    	if (session.type != TYPE_BREAK) continue;
    	if ((time+len) >= session.start && time < session.end)
    		newTime = session.end;
    }
    return newTime;
}

function canDo(event, team, instance) {
	// Check if team already has something in their schedule
	for (var i = 0; i < team.schedule.length; i++) {
		var startA = team.schedule[i].time;
		if (getSession(team.schedule[i].session_uid).type == TYPE_BREAK)
			var endA = startA + getSession(team.schedule[i].session_uid).length;
		else 
			var endA = startA + getSession(team.schedule[i].session_uid).length + event.minTravel;
		var startB = instance.time;
		if (getSession(team.schedule[i].session_uid).type == TYPE_BREAK)
			var endB = startB + getSession(instance.session_uid).length;
		else
			var endB = startB + getSession(instance.session_uid).length + event.minTravel;
		if (startA == startB) return false;
		if (startA < startB && endA > startB) return false;
		if (startA > startB && startA < endB) return false;
	}
	return true;
}