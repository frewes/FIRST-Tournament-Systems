import { TYPES } from '../api/SessionTypes';
import { DateTime } from '../api/DateTime';

import Instance from './Instance';

export class Scheduler {
    constructor(E) {
        this.event = E;
    }

    buildAllTables() {
        let willWork = null;
        this.event.sessions.sort((a,b) => {
            if (a.type.priority === b.type.priority) return a.startTime.mins - b.startTime.mins;
            return a.type.priority - b.type.priority;
        });
        this.event.sessions.forEach((session) => {
            // Make sure the start time isn't in a break
            if (session.type !== TYPES.BREAK) session.startTime = this.timeInc(session.startTime,0,session);
            let end = -Infinity;
            if (!(session.type === TYPES.MATCH_ROUND || session.type === TYPES.MATCH_ROUND_PRACTICE))
                end = this.tableSession(session);
            if (session.type !== TYPES.BREAK && end > session.endTime.mins) {
                if (willWork) willWork = willWork+", "+session.name;
                else willWork = session.name;
            }
        });
        [TYPES.MATCH_ROUND, TYPES.MATCH_ROUND_PRACTICE].forEach(T=> {
            let end = -Infinity;
            let offset = 0;
            let locOffset = 0;
            this.event.sessions.filter(s=>s.type===T).forEach((session) => {
                console.log(end);
                if (session.startTime.mins < end) session.startTime = new DateTime(end);
                end = this.tableSession(session, offset, locOffset);
                if (session.schedule[session.schedule.length-1].loc === 0) locOffset = 1;
                else locOffset = 0;
                offset += session.schedule.length;
                if (end > session.endTime.mins) {
                    if (willWork) willWork = willWork + ", " + session.name;
                    else willWork = session.name;
                }
            });
        });
    }

    /**
     Sets up all the timeslots for the given session.
     numOffset: offset at which to start counting (facilitates round numbering)
     @return Returns the time the schedule is finished (i.e. the end time of the last event)
     */
    tableSession(session, numOffset=0, locD=0) {
        let teams = [];
        this.event.teams.forEach(team => {
            if (session.type !== TYPES.JUDGING || !team.excludeJudging) teams.push(team);
        });
        if (session.type === TYPES.BREAK) session.nSims = teams.length;
        let now = new DateTime(session.startTime.mins);
        let L = Math.ceil(teams.length / session.nSims);
        let lastNTeams = (teams.length % session.nSims);
        lastNTeams = (lastNTeams===0) ? session.nSims : lastNTeams;
        session.schedule = new Array(L);

        // Figure out how many rounds to make extra long
        let everyN = (session.extraTimeEvery)?session.extraTimeEvery:Infinity;
        let extraTimeTeams = teams.filter(x=>x.extraTime).length;

        let roundsSinceExtra = 0;
        let flag = false;

        let extraRoundsNeeded = Math.ceil(extraTimeTeams/session.nSims);
        let extraRoundsMade = ((session.extraTimeFirst)?1:0) +((session.extraTimeEvery)?L/everyN:0);
        if (extraRoundsMade < extraRoundsNeeded) {
            everyN = (L+1)/(extraRoundsNeeded+1);
            everyN += Math.round(Math.random()*2);
            roundsSinceExtra += Math.floor(Math.random()*L);
            flag = true;
        }
        let extraRounds = 0;
        if (session.type === TYPES.BREAK) everyN = Infinity;
        for (var i = 0; i < L; i++) {
            var d = Math.floor(session.nLocs/session.nSims);
            var locOffset = ((i+locD)%d)*session.nSims;
            if ((i%L) < L-1) {
                session.schedule[i] = new Instance(session.id,i+1+numOffset,now,new Array(session.nSims),locOffset);
                now = this.timeInc(now,session.len+session.buf,session);
                roundsSinceExtra++;
                if ((i === 0 && session.extraTimeFirst) || (roundsSinceExtra >= everyN)) {
                    if (!(flag && extraRounds >= extraRoundsNeeded)) {
                        session.schedule[i].extra = true;
                        now = this.timeInc(now,this.event.extraTime,session);
                        roundsSinceExtra = 0;
                        extraRounds++;
                    }
                }
            } else {
                session.schedule[i] = new Instance(session.id,i+1+numOffset,now,new Array(lastNTeams),locOffset);
                now = new DateTime(now.mins + session.len + session.buf);
                roundsSinceExtra++;
                if (roundsSinceExtra >= everyN) {
                    if (flag && extraRounds >= extraRoundsNeeded) {
                        console.log("Enough rounds added");
                    } else {
                        session.schedule[i].extra = true;
                        now = new DateTime(now.mins + this.event.extraTime);
                    }
                }
            }
            // Not sure why this existed
            // for (var t = 0; t < session.schedule[i].teams.length; t++) {
            //     session.schedule[i].teams[t] = null;
            // }
        }
        return now.mins;
    }

    timeInc(time, inc, session) {
        let newMins = time.mins + inc;
        this.event.sessions.filter(x=>x.type !== TYPES.BREAK || !x.appliesTo.includes(session.id)).forEach(x => {
            if (time.mins+inc >= x.startTime && time.mins < x.end) newMins = x.endTime.mins;
        });
        return new DateTime(newMins);
    }
}