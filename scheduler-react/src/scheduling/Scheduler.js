import { TYPES } from '../api/SessionTypes';
import { DateTime } from '../api/DateTime';

import Instance from './Instance';
import { shuffle, hasDone } from './utilities';

export class Scheduler {
    constructor(E) {
        this.event = E;
    }

    empty() {
        this.event.sessions.forEach(session => {
            session.schedule = [];
            session.usesSurrogates = false;
        });
        this.event.teams.forEach(team => {
            team.schedule = [];
            team.isSurrogate = false;
        });
    }

    evaluate() {
        this.event.errors = 0;
        // Add errors for each session (errors due to empty spots)
        this.event.sessions.forEach(session => {
            session.errors = 0;
            session.schedule.forEach(instance => {
                session.errors += (instance.teams.length-instance.teams.filter(t=>t).length);
            });
            this.event.errors += session.errors;
        });
        // Adelaide Ken bug: Teams getting assigned weirdly. Count the number of these errors.
        this.event.teams.forEach(team => {
                //     for (let j = 0; j < team.schedule.length; j++) {
                //         if (team.schedule[j].teams.indexOf(team.id) === -1) {
                //             this.event.errors++;
                //         }
                //     }
        });
    }

    buildAllTables() {
        this.empty();
        let willWork = null;
        this.event.sessions.sort((a,b) => {
            if (a.type.priority === b.type.priority) return a.startTime.mins - b.startTime.mins;
            return a.type.priority - b.type.priority;
        });
        this.event.sessions.forEach((session) => {
            // Make sure the start time isn't in a break
            if (session.type !== TYPES.BREAK) session.actualStartTime = new DateTime(this.timeInc(session.startTime,0,session));
            let end = -Infinity;
            if (!(session.type === TYPES.MATCH_ROUND || session.type === TYPES.MATCH_ROUND_PRACTICE)) {
                end = this.tableSession(session);
                session.actualEndTime = new DateTime(end);
                if (session.type !== TYPES.BREAK && end > session.endTime.mins) {
                    if (willWork) willWork = willWork + ", " + session.name;
                    else willWork = session.name;
                }
            }
        });
        [TYPES.MATCH_ROUND, TYPES.MATCH_ROUND_PRACTICE].forEach(T=> {
            let end = -Infinity;
            let offset = 0;
            let locOffset = 0;
            this.event.sessions.filter(s=>s.type===T).forEach((session) => {
                if (session.actualStartTime.mins < end) session.actualStartTime = new DateTime(end);
                end = this.tableSession(session, offset, locOffset);
                session.actualEndTime = new DateTime(end);
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
        let now = new DateTime(session.actualStartTime.mins);
        let L = Math.ceil(teams.length / session.nSims);
        let lastNTeams = (teams.length % session.nSims);
        lastNTeams = (lastNTeams===0) ? session.nSims : lastNTeams;
        session.schedule = new Array(L);

        // Figure out how many rounds to make extra long
        let everyN = (session.extraTimeEvery>0)?session.extraTimeEvery:Infinity;
        let extraTimeTeams = teams.filter(x=>x.extraTime).length;

        let roundsSinceExtra = 0;
        let flag = false;

        let extraRoundsNeeded = Math.ceil(extraTimeTeams/session.nSims);
        let extraRoundsMade = ((session.extraTimeFirst)?1:0) +((session.extraTimeEvery>0)?L/everyN:0);
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
                now = new DateTime(this.timeInc(now,session.len+session.buf,session));
                roundsSinceExtra++;
                if ((i === 0 && session.extraTimeFirst) || (roundsSinceExtra >= everyN)) {
                    if (!(flag && extraRounds >= extraRoundsNeeded)) {
                        session.schedule[i].extra = true;
                        now = new DateTime(this.timeInc(now,this.event.extraTime,session));
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

    fillAllTables() {
        this.initialFill();
        this.swapFill();
    }

    initialFill() {
        let oneSetOfTeams = this.event.teams.slice();
        shuffle(oneSetOfTeams);
        this.event.sessions.forEach(session => {
            let teams = [];
            shuffle(oneSetOfTeams).forEach(team => {
                if (session.type !== TYPES.JUDGING || !team.excludeJudging) teams.push(team);
            });
            session.schedule.forEach(instance => this.fillInstance(instance,teams));
        });
    }

    fillInstance(instance,teams) {
        for (let t = 0; t < instance.teams.length; t++) {
            let T = -1;
            for (let k = 0; k < teams.length; k++) {
                if (this.canDo(teams[k],instance)) {
                    T = k;
                    break;
                }
            }
            if (T !== -1) {
                let team = teams.splice(T,1)[0];
                instance.teams[t] = team.id;
                team.schedule.push(instance);
            }
        }
    }

    /**
     Go through all sessions in the event and fix up errors through first-order swapping.
     **/
    swapFill(event) {
        // 10 attempts.  Why not?
        for (let j = 0; j < 10; j++) {
            let fixed = 0;
            this.evaluate();
            this.event.sessions.filter(s => s.errors > 0).forEach(s => {
                fixed += this.swapFillSession(s, this.event.teams);
            });
            if (fixed === 0) break;
        }
    }

    /**
     Go through a given session, fix all errors with first-order swapping.
     TODO: deal with the case where instances > 1?  How to do this?
     @return Number of errors fixed
     **/
    swapFillSession(session, teams) {
        let fixed = 0;
        // Make list of teams that aren't in this session enough (lost set)
        let lostTeams = [];
        for (let i = 0; i < teams.length ; i++)
            if (hasDone(teams[i],session.id) < session.instances) lostTeams.push(teams[i]);
        // Find every empty slot in the schedule
        session.schedule.forEach(instance_A => {
            for (let j = 0; j < instance_A.teams.length; j++) {
                if (instance_A.teams[j] != null) continue;
                // Found empty slot!
                // Now find a team A from the full set that can do this time
                for (let tA = 0; tA < teams.length; tA++) {
                    if (!this.canDo(teams[tA], instance_A, session.id)) continue;
                    // Now, find a team B from the lost set that can take team A's instance
                    let instance_B = null;
                    for (let x = 0; x < teams[tA].schedule.length; x++) {
                        if (teams[tA].schedule[x].session_id === instance_A.session_id) {
                            instance_B = teams[tA].schedule.splice(x, 1)[0];
                            break;
                        }
                    }
                    let f = fixed;
                    if (instance_B == null) {
                        continue;
                        // Team A can just do instance A; no swap required, add the team in.
                        // instance_A.teams[j] = teams[tA].uid;
                        // teams[tA].schedule.push(instance_A);
                        // fixed++;
                        // break;
                    }
                    for (let tB = 0; tB < lostTeams.length; tB++) {
                        if (!this.canDo(lostTeams[tB], instance_B)) continue;
                        // Found a team that can swap with A!
                        // Now, swap teams A and B
                        // Add instanceA to teamA
                        instance_A.teams[j] = teams[tA].id;
                        teams[tA].schedule.push(instance_A);
                        // Add instanceB to teamB
                        for (let idx = 0; idx < instance_B.teams.length; idx++) {
                            if (instance_B.teams[idx] === teams[tA].id) {
                                instance_B.teams[idx] = lostTeams[tB].id;
                            }
                        }
                        lostTeams[tB].schedule.push(instance_B);
                        lostTeams.splice(tB, 1);
                        fixed++;
                        break;
                    }
                    if (f === fixed) teams[tA].schedule.push(instance_B);
                    else break;
                }
            }
        });
        return fixed;
    }

    /** ========================== UTILITIES ========================== **/

    /**
     Return true if the team can do the given instance.
     Returns false if they don't have time to come from a previous instance or go to a later one.
     if 'excl' is given, do not consider that session ID when checking this.
     **/
    canDo(team, instance, excl) {
        if (team.extraTime && !instance.extra && this.event.getSession(instance.session_id).type !== TYPES.BREAK)
            return false;
        if (team.excludeJudging && this.event.getSession(instance.session_id).type === TYPES.JUDGING)
            return false;
        for (let i = 0; i < team.schedule.length; i++) {
            if (this.event.getSession(team.schedule[i].session_id).type === TYPES.BREAK){
                if (!this.event.getSession(team.schedule[i].session_id).applies(instance.session_id))
                    continue;
                if (this.event.getSession(instance.session_id).type === TYPES.BREAK) continue;
            }
            let startA = team.schedule[i].time.mins;
            if (excl && team.schedule[i].session_id === excl) continue;
            let extra = 0;
            if (team.schedule[i].extra) extra = this.event.extraTime;
            let endA = 0;
            if (this.event.getSession(team.schedule[i].session_id).type === TYPES.BREAK)
                endA = startA + this.event.getSession(team.schedule[i].session_id).len;
            else
                endA = startA + this.event.getSession(team.schedule[i].session_id).len + extra + this.event.minTravel;
            let startB = instance.time.mins;
            extra = 0;
            if (instance.extra) extra = this.event.extraTime;

            let endB = 0;
            if (this.event.getSession(team.schedule[i].session_id).type === TYPES.BREAK)
                endB = startB + this.event.getSession(instance.session_id).len;
            else
                endB = startB + this.event.getSession(instance.session_id).len + this.event.minTravel + extra;
            if ((team.startTime && startB < team.startTime.mins) || (team.endTime && endB > team.endTime.mins)) return false;
            if (startA === startB || (startA < startB && endA > startB) || (startB < startA && endB > startA))
                return false;
        }
        // console.log("Team is " + team.number);
        // console.log(instance);
        // console.log("Schedule: ")
        // team.schedule.forEach(i => console.log(i));
        return true;
    }

    /**
     Increments given time, skipping breaks.
     @return Returns the incremented time.
     */
    timeInc(time, inc, session) {
        let newMins = time.mins + inc;
        this.event.sessions.filter(x=>x.type === TYPES.BREAK && x.applies(session.id)).forEach(x => {
            if (time.mins+inc >= x.actualStartTime.mins && time.mins < x.actualEndTime.mins) newMins = x.actualEndTime.mins;
        });
        return newMins;
    }
}