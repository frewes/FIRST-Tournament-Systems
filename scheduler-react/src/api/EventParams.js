import { TeamParams } from "./TeamParams";
import { TYPES } from './SessionTypes';
import { DateTime } from "./DateTime";
import SessionParams from "./SessionParams";

export class EventParams {
    constructor(version, title="Tournament", nTeams=24, startTime=new DateTime(9*60), endTime=new DateTime(9*17)) {
        this._version = version;
        this.title = title;
        let A = [];
        while (nTeams > 0) {
            A.push(new TeamParams(nTeams));
            nTeams--;
        }
        this.teams = A.sort((a,b) => {return parseInt(a.number,10) - parseInt(b.number,10);});

        this.startTime = startTime;
        this.endTime = endTime;

        this.minTravel = 10;
        this.extraTime = 5;
        this.sessions = [];
        this.days = ["Day 1"];
        this.errors = Infinity;

        this.populateFLL();
    }

    populateFLL() {
        // First guesses at all schedule parameters.  User can then tweak to their hearts' content without auto updates
        let timeAvailable = this.endTime.mins - this.startTime.mins - 60;
        // console.log("Time available: " + timeAvailable);
        let timePerMatch = Math.round(timeAvailable / (this.nTeams * 3 / 2));
        // console.log("Time per match: " + timePerMatch);
        let matchLen = Math.ceil(timePerMatch/2);
        let matchBuf = Math.floor(timePerMatch/2);
        let nSims = 2;
        let nLocs = Math.ceil(this.nTeams / 11);
        let nJudgings = Math.ceil(this.nTeams/nLocs);
        let startLunch = new DateTime(this.startTime.mins + nJudgings*15);
        let endLunch = new DateTime(startLunch.mins + 60);

        for (let i = 1; i <= 3; i++) {
            let S = new SessionParams(i, TYPES.MATCH_ROUND, "Round " + i, 4,
                new DateTime(this.startTime.mins), new DateTime(this.endTime.mins));
            S.nSims = nSims;
            S.len = matchLen;
            S.buf = matchBuf;
            this.sessions.push(S);
        }
        this.sessions.push(new SessionParams(4,TYPES.JUDGING, "Robot Design Judging", nLocs,
            new DateTime(this.startTime.mins), new DateTime(startLunch.mins)));
        this.sessions.push(new SessionParams(5,TYPES.JUDGING, "Core Values Judging", nLocs,
            new DateTime(this.startTime.mins), new DateTime(startLunch.mins)));
        this.sessions.push(new SessionParams(6,TYPES.JUDGING, "Research Project Judging", nLocs,
            new DateTime(this.startTime.mins), new DateTime(startLunch.mins)));
        this.sessions.push(new SessionParams(7,TYPES.BREAK, "Lunch", 1,
            new DateTime(startLunch.mins), new DateTime(endLunch.mins)));
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
    set days(value) {this._days = value};
}
