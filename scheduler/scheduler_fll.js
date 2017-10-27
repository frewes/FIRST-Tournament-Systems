/**
SessionType [name, priority]:
	TYPE_JUDGING
	TYPE_ROUND
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

const NOT_YET_ADDED = -64;

function Schedule(event) {
	event.allSessions.sort(function(a,b) {
		return a.type.priority - b.type.priority;
	});
	for (var i = 0; i < event.allSessions.length; i++) {
		tableSession(event,event.allSessions[i]);
	}
	console.log(event);
}

/**
	num: Count of instance 
	time: Time (mins) of instance
	teams: List of teams in instance
	loc: Location offset (i.e. for staggered sessions, location index of where the teams begin)
*/
function Instance(num, time, teams, loc) {
	this.num = num;
	this.time = time;
	this.teams = teams;
	this.loc = loc;
}
/**
    Sets up all the timeslots for the given session.
    @return Returns the time the schedule is finished (i.e. the end
    time of the last event)
*/
function tableSession(event, session) {
    var now = session.start;
    var L = Math.ceil(event.teams.length/session.nSims);
    var lastNTeams = (event.teams.length % session.nSims);
    lastNTeams = (lastNTeams==0) ? session.nSims : lastNTeams;
    session.schedule = new Array(L);
    for (var i = 0; i < L; i++) {
        var d = Math.floor(session.nLocs/session.nSims);
        var locOffset = (i%d)*session.nSims;
        if (i < L-1) { 
	        session.schedule[i] = new Instance(i+1,now,new Array(session.nSims),locOffset);
	        now = timeInc(event,now,session.length+session.buffer);
	    } else {
	    	session.schedule[i] = new Instance(i+1,now,new Array(lastNTeams),locOffset);
	    }
        for (var t = 0; t < session.schedule[i].teams.length; t++) {
            session.schedule[i].teams[t] = NOT_YET_ADDED;
        }
    }
    return now + session.length + session.buffer;
}

/** 
	Increments given time, skipping breaks.
	@return Returns the incremented time.
*/
function timeInc(event,time,len) {
    var newTime = time + len;
    for (var i = 0; i < event.allSessions; i++) {
    	var session = event.allSessions[i];
    	if (session.type != TYPE_BREAK) continue;
    	if ((time+len) >= session.start && time < session.end)
    		newTime = time;
    }
    return newTime;
}

