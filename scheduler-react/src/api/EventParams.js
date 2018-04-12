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
        // uid, type, name
        for (var i = 1; i <= 3; i++) {
            let S = (new SessionParams(i, TYPES.MATCH_ROUND, "Round " + i, 4, this.startTime, this.endTime));
            S.nSims = 2;
            S.len = 5;
            S.buf = 3;
            this.sessions.push(S);
        }
        // These should be calculated...
        let nLocs = 3;
        let startLunch = new DateTime(12*60);
        let endLunch = new DateTime(13*60);
        this.sessions.push(new SessionParams(4,TYPES.JUDGING, "Robot Design Judging", nLocs,this.startTime, this.endTime));
        this.sessions.push(new SessionParams(5,TYPES.JUDGING, "Core Values Judging", nLocs,this.startTime, this.endTime));
        this.sessions.push(new SessionParams(6,TYPES.JUDGING, "Research Project Judging", nLocs,this.startTime, this.endTime));
        this.sessions.push(new SessionParams(7,TYPES.BREAK, "Lunch", 1 ,startLunch, endLunch));
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
