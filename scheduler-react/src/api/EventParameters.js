import { Team } from "./Team"

export class EventParameters {
    constructor(title="undefined", nTeams=0, startTime=null, endTime=null) {
        this.title = title;
        let A = [];
        while (nTeams > 0) {
            A.push(new Team(nTeams));
            nTeams--;
        }
        this.teams = A.sort((a,b) => {return parseInt(a.number,10) - parseInt(b.number,10);});
        this.startTime = startTime;
        this.endTime = endTime;
    }

    get title() {return this._title}
    set title(value) {this._title = value;}

    get startTime() {return this._startTime}
    set startTime(value) {this._startTime = value;}

    get endTime() {return this._endTime;}
    set endTime(value) {this._endTime = value;}

    get teams() {return this._teams;}
    set teams(value) {this._teams = value};

    loadFromJSON(json) {
        alert("Not yet implemented!");
    }
}
