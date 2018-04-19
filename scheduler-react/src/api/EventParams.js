import { TeamParams } from "./TeamParams";
import { TYPES } from './SessionTypes';
import { DateTime } from "./DateTime";
import SessionParams from "./SessionParams";

import Instance from '../scheduling/Instance';
import { overlaps } from "../scheduling/utilities";

export class EventParams {
    constructor(version, title="Tournament", nTeams=24, startTime=new DateTime(9*60), endTime=new DateTime(9*17)) {
        this._version = version;
        this.title = title;
        let A = [];
        while (nTeams > 0) {
            A.push(new TeamParams(nTeams));
            nTeams--;
        }
        this.uid_counter = 1;

        this.teams = A.sort((a,b) => {return parseInt(a.number,10) - parseInt(b.number,10);});

        this.startTime = startTime;
        this.endTime = endTime;

        this.minTravel = 10;
        this.extraTime = 5;
        this.sessions = [];
        this.days = ["Day 1"];
        this.startTime.days=this.days;
        this.endTime.days=this.days;
        this.errors = Infinity;

        this.populateFLL();
    }

    populateFLL() {
        // First guesses at all schedule parameters.  User can then tweak to their hearts' content without auto updates
        let actualStart = this.startTime.clone(30);
        let actualEnd = this.endTime.clone(-30);
        let timeAvailable = actualEnd.mins - actualStart.mins - 30;
        let timePerMatch = Math.floor(timeAvailable / (this.nTeams * 3 / 2));

        let matchLen = Math.ceil(timePerMatch/2);
        let matchBuf = Math.floor(timePerMatch/2);
        let nSims = 2;
        let nLocs = Math.ceil(this.nTeams / 11);
        let nJudgings = Math.ceil(this.nTeams/nLocs);
        let startLunch = actualStart.clone(nJudgings*15);
        let endLunch = startLunch.clone(30);

        for (let i = 1; i <= 3; i++) {
            let S = new SessionParams(this.uid_counter++, TYPES.MATCH_ROUND, "Round " + i, 4,
                actualStart.clone(), actualEnd.clone());
            S.nSims = nSims;
            S.len = matchLen;
            S.buf = matchBuf;
            this.sessions.push(S);
        }
        this.sessions.push(new SessionParams(this.uid_counter++,TYPES.JUDGING, "Robot Design Judging", nLocs,
            actualStart.clone(), actualEnd.clone()));
        this.sessions.push(new SessionParams(this.uid_counter++,TYPES.JUDGING, "Core Values Judging", nLocs,
            actualStart.clone(), actualEnd.clone()));
        this.sessions.push(new SessionParams(this.uid_counter++,TYPES.JUDGING, "Research Project Judging", nLocs,
            actualStart.clone(), actualEnd.clone()));
        this.sessions.push(new SessionParams(this.uid_counter++,TYPES.BREAK, "Opening Ceremony", 1,
            this.startTime.clone(), actualStart.clone()));
        this.getSession(this.uid_counter-1).universal = true;
        this.sessions.push(new SessionParams(this.uid_counter++,TYPES.BREAK, "Lunch", 1,
            startLunch.clone(), endLunch.clone()));
        this.getSession(this.uid_counter-1).universal = true;
        this.sessions.push(new SessionParams(this.uid_counter++,TYPES.BREAK, "Closing Ceremony", 1,
            actualEnd.clone(), this.endTime.clone()));
        this.getSession(this.uid_counter-1).universal = true;
    }

    get nTeams() { return this._teams.length; }
    //Given a new number of teams, update things...
    set nTeams(value) {
        while (this.teams.length < value)
            this.teams.push(new TeamParams(this.teams.length+1));
        while (this.teams.length > value)
            this.teams.pop();
        this.teams = this.teams.sort((a,b) => {return parseInt(a.number,10) - parseInt(b.number,10);});
    }

    saveToJSON() {
        return "UNDEFINED";
    }

    populateWithJSON(json) {
        alert("Not yet implemented!");
    }

    getTeam(id) {
        for (let i = 0 ; i < this.teams.length; i++) {
            if (this.teams[i].id === id) return this.teams[i];
        }
        return null;
    }

    getSession(id) {
        for (let i = 0 ; i < this.sessions.length; i++) {
            if (this.sessions[i].id === id) return this.sessions[i];
        }
        return null;
    }

    getSessionDataGrid(id) {
        let session = this.getSession(id);
        let grid = [];
        let cols = [{value: "#"},{value: "Time"}];
        session.locations.forEach(x => cols.push({value: x}));
        grid.push(cols);

        let applyingBreaks = [];
        this.sessions.filter(S => S.type === TYPES.BREAK && S.applies(session.id)).forEach(S => {
            if (overlaps(S,session)) applyingBreaks.push(S);
        });
        let schedule = session.schedule.slice();
        applyingBreaks.forEach(br => schedule.push(new Instance(br.id,"",br.actualStartTime,null)));

        schedule.sort((a,b) => a.time.mins-b.time.mins).forEach((instance) => {
            let A = [];
            A.push({value: instance.num});
            A.push({value: instance.time.time});
            if (this.getSession(instance.session_id).type === TYPES.BREAK) {
                A.push({value: this.getSession(instance.session_id).name, colSpan: session.nLocs});
                grid.push(A);
            } else {
                let diff = session.nLocs;
                for (let dummy = 0; dummy < instance.loc; dummy++) {
                    diff--;
                    A.push({value: ""});
                }
                for (let i = 0; i < instance.teams.length; i++) {
                    let x = instance.teams[i];
                    diff--;
                    A.push({value: (x) ? this.getTeam(x).number : " X "})
                }
                while (diff-- > 0) A.push({value: ""});
                grid.push(A);
            }
        });
        return grid;
    }

    getIndivDataGrid(compact=false) {
        this.teams.sort((a,b) => a.number - b.number);
        let grid = [];
        let usesSurrogates = false;
        this.sessions.forEach(s => {if (s.usesSurrogates) usesSurrogates = true;})
        grid[0] = [{value: "Team", colSpan: 2}];
        for (let i = 0; i < this.sessions.length; i++) {
            if (this.sessions[i].type === TYPES.BREAK) continue;
            grid[0].push({colSpan:compact?2:3,value:this.sessions[i].name});
        }
        grid[0].push({value: "Min. Travel time"});
        if (usesSurrogates) grid[0].push({colSpan:compact?2:3,value:"Surrogate"});
        grid[1] = [{value: "#"}, {value: "Name"}];
        for (let i = 0; i < this.sessions.length; i++) {
            if (this.sessions[i].type === TYPES.BREAK) continue;
            for (let j = 0 ; j < this.sessions[i].instances; j++) {
                if (!compact) grid[1].push({value: "#"});
                grid[1].push({value: "Time"});
                grid[1].push({value: "Loc"});
            }
        }
        grid[1].push({value: ""});
        if (usesSurrogates) {
            if (!compact) grid[1].push({value: "#"});
            grid[1].push({value: "Time"});
            grid[1].push({value: "Loc"});
        }

        for (let i = 0; i < this.teams.length; i++) {
            let row = [];
            let team = this.teams[i];
            row.push({value: team.number});
            row.push({value: team.name});
            for (let j = 0; j < team.schedule.length; j++) {
                if (this.getSession(team.schedule[j].session_id).type === TYPES.BREAK) continue;
                if (team.schedule[j].teams && (team.schedule[j].teams.length - team.schedule[j].teams.indexOf((team.id))) <= team.schedule[j].surrogates) continue; // Surrogate
                if (!team.schedule[j].teams) {
                    row.push({value: ""}); row.push({value: ""}); row.push({value: ""});
                } else {
                    if (!compact) row.push({value: team.schedule[j].num});
                    row.push({value: team.schedule[j].time.time});
                    if (team.schedule[j].loc === -1)
                        row.push({value: "--"});
                    else
                        row.push({value: this.getSession(team.schedule[j].session_id).locations[team.schedule[j].teams.indexOf(team.id)+team.schedule[j].loc]});
                }
            }
            row.push({value: "?"});
            // row.push({value: ""+minTravelTime(team)});
            let hadASurrogate = false;
            for (let j = 0; j < team.schedule.length; j++) {
                if (!team.schedule[j].teams) continue;
                if (!((team.schedule[j].teams.length - team.schedule[j].teams.indexOf((team.uid))) > team.schedule[j].surrogates)) {
                    hadASurrogate = true;
                    if (!compact) row.push({value: team.schedule[j].num});
                    row.push({value: team.schedule[j].time.time});
                    if (team.schedule[j].loc === -1)
                        row.push({value: "--"});
                    else
                        row.push({value: this.getSession(team.schedule[j].session_id).locations[team.schedule[j].teams.indexOf(team.id)+team.schedule[j].loc]});
                }
            }
            if (!hadASurrogate && usesSurrogates) {
                if (!compact) row.push({value: ""});
                row.push({value: ""});
                row.push({value: ""});
            }
            grid.push(row);
        }
        return grid;
    }

    get version() {return this._version;}

    get title() {return this._title}
    set title(value) {this._title = value;}

    get startTime() {return this._startTime}
    set startTime(value) {this._startTime = value;}

    get endTime() {return this._endTime;}
    set endTime(value) {this._endTime = value;}

    get sessions() {return this._sessions;}
    set sessions(value) {this._sessions = value;}

    get teams() {return this._teams;}
    set teams(value) {this._teams = value};

    get minTravel() {return this._minTravel;}
    set minTravel(value) {this._minTravel = value};

    get extraTime() {return this._extraTime;}
    set extraTime(value) {this._extraTime = value};

    get days() {return this._days;}
    // When changing the days, we have to make sure every DateTime gets the updated reference.
    set days(value) {
        this._days = value;
        this.startTime.days = this._days;
        this.endTime.days = this._days;
        this.sessions.forEach(S => {
            S.startTime.days = this._days;
            S.actualStartTime.days = this._days;
            S.endTime.days = this._days;
            S.actualEndTime.days = this._days;
        });
        this.teams.forEach(T => {
            if (T.startTime) T.startTime.days = this._days;
            if (T.endTime) T.endTime.days = this._days;
        });
    };
}
