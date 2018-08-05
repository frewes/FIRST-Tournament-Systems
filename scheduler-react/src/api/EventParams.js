import { TeamParams } from "./TeamParams";
import { TYPES } from './SessionTypes';
import { DateTime } from "./DateTime";
import SessionParams from "./SessionParams";

import Instance from '../scheduling/Instance';
import { overlaps, getBase64Image, toDataUrl } from "../scheduling/utilities";

import firstlogo from '../resources/firstlogo.png';
import flllogo from '../resources/flllogo.jpg';
import mqlogo from '../resources/mqlogo.png';
import gamelogo from '../resources/gamelogo.jpg';

export class EventParams {
    constructor(version, title="Tournament", nTeams=24, startTime=new DateTime(9*60), endTime=new DateTime(9*17)) {
        this._version = version;
        this.title = title;
        let id = Math.floor((Math.random() * 100) + 1);
        let A = [];
        while (nTeams > 0) {
            A.push(new TeamParams(id, nTeams));
            nTeams--;
            id += Math.floor((Math.random() * 100) + 1);
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

        this.tempNames = null;

        toDataUrl(flllogo, (base) => {this.logoTopLeft = base;});
        toDataUrl(gamelogo, (base) => {this.logoTopRight = base;});
        toDataUrl(mqlogo, (base) => {this.logoBotLeft = base;});
        toDataUrl(firstlogo, (base) => {this.logoBotRight = base;});

        this.titleFontSize = 22;
        this.baseFontSize = 12;
        this.footerText = 'www.firstaustralia.org';

        // console.log(this.logoBotRight);
        this.errors = Infinity;
        // this.populateFLL();
    }

    populateFLL() {
        // Set team names
        if (this.tempNames) {
            let names = this.tempNames.split("\n");
            this.teams.forEach(t => {
                let saved = t.name;
                if (names.length > 0)
                    t.name = names.shift();
                if (t.name === "") t.name = saved;
            });
        }

        // First guesses at all schedule parameters.  User can then tweak to their hearts' content without auto updates
        let actualStart = this.startTime.clone(30);
        let actualEnd = this.endTime.clone(-30);
        let nLocs = Math.ceil(this.nTeams / 11);
        let nJudgings = Math.ceil(this.nTeams/nLocs);

        let startLunch = new DateTime(Math.max(actualStart.mins+nJudgings*15,12*60),this.days);
        let endLunch = startLunch.clone(30);

        this.sessions.push(new SessionParams(this.uid_counter++,TYPES.BREAK, "Opening Ceremony", 1,
            this.startTime.clone(), actualStart.clone()));
        this.getSession(this.uid_counter-1).universal = true;
        this.sessions.push(new SessionParams(this.uid_counter++,TYPES.BREAK, "Lunch" + ((this.nDays>1)?" 1":""), 1,
            startLunch.clone(), endLunch.clone()));
        this.getSession(this.uid_counter-1).universal = true;
        this.sessions.push(new SessionParams(this.uid_counter++,TYPES.BREAK, "Closing Ceremony", 1,
            actualEnd.clone(), this.endTime.clone()));
        this.getSession(this.uid_counter-1).universal = true;

        let nightStart = new DateTime(this.endTime.mins%(24*60),this.days);
        let nightEnd = this.startTime.clone();

        for (let i = 1; i < this.days.length; i++) {
            nightEnd = nightEnd.clone(24*60);
            this.sessions.push(new SessionParams(this.uid_counter++,TYPES.BREAK, "Night" + ((this.nDays>2)?" "+i:""), 1,
                nightStart.clone(), nightEnd.clone()));
            this.getSession(this.uid_counter-1).universal = true;
            nightStart = nightStart.clone(24*60);

            this.sessions.push(new SessionParams(this.uid_counter++,TYPES.BREAK, "Lunch " + (i+1), 1,
                startLunch.clone(24*60), endLunch.clone(24*60)));
            this.getSession(this.uid_counter-1).universal = true;
        }
        let timeAvailable = this.endTime.mins - this.startTime.mins;
        this.sessions.filter(s=>s.type===TYPES.BREAK).forEach(s=>{timeAvailable = timeAvailable - (s.endTime.mins-s.startTime.mins)});
        let timePerMatch = Math.floor(timeAvailable / (this.nTeams * 3 / 2));

        let matchLen = Math.min(Math.ceil(timePerMatch/2),5);
        let matchBuf = timePerMatch-matchLen;
        let nSims = 2;

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

        this.sessions.sort((a,b) => {return (a.startTime === b.startTime)?a.id-b.id : a.startTime.mins - b.startTime.mins;});
    }

    get nTeams() { return this._teams.length; }
    //Given a new number of teams, update things...
    set nTeams(value) {
        while (this.teams.length < value) {
          let maxId = 0;
          this.teams.forEach(t=>{maxId=(maxId>t.id?maxId:t.id)});
          maxId += Math.floor((Math.random() * 100) + 1);
          this.teams.push(new TeamParams(maxId, this.teams.length+1));
        }
        while (this.teams.length > value)
          this.teams.pop();
        this.teams = this.teams.sort((a,b) => {return parseInt(a.number,10) - parseInt(b.number,10);});
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

    getSessions(type) {
        let A = [];
        for (let i = 0 ; i < this.sessions.length; i++) {
            if (this.sessions[i].type === type) A.push(this.sessions[i]);
        }
        return A;
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
        // Always sort before doing things if you need a particular order.
        this.teams.sort((a,b) => a.number - b.number);
        this.sessions.sort((a,b) => {return a.id-b.id});
        this.teams.forEach(team => {
            team.schedule.sort((a,b) => {return this.getSession(a.session_id).id-this.getSession(b.session_id).id;});
        });

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
            // row.push({value: "?"});
            row.push({value: ""+this.minTravelTime(team)});
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

    minTravelTime(team) {
      let minTravel = Infinity;
      team.schedule.forEach(i => {
        team.schedule.forEach(j => {
          if (i !== j) {
            let sA = i.time.mins;
            let eA = i.time.mins + this.getSession(i.session_id).len + (i.extraTime?this.extraTime:0);
            let sB = j.time.mins;
            let eB = j.time.mins + this.getSession(j.session_id).len + (i.extraTime?this.extraTime:0);
            let dA = sB - eA;
            let dB = sA - eB;
            let d = (dA < 0)?dB:dA;
            minTravel = (minTravel>d)?d:minTravel;
          }
        });
      });
      return minTravel;
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

    get display() {return this._display}
    set display(d) {this._display = d;}

    get logoTopLeft() {return this._logoTopLeft}
    set logoTopLeft(x) {this._logoTopLeft = x;}
    get logoBotLeft() {return this._logoBotLeft}
    set logoBotLeft(x) {this._logoBotLeft = x;}
    get logoTopRight() {return this._logoTopRight}
    set logoTopRight(x) {this._logoTopRight = x;}
    get logoBotRight() {return this._logoBotRight}
    set logoBotRight(x) {this._logoBotRight = x;}

    get footerText() {return this._footer;}
    set footerText(x) {this._footer = x;}

    get nDays() { return this._days.length; }
    set nDays(value) {
        let A = this.days;
        while (A.length < value)
            A.push("Day " + (this.days.length+1));
        while (A.length > value)
            A.pop();
        this.days = A;
    }

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
            T.startTime.days = this._days;
            T.endTime.days = this._days;
        });
    };

    static freeze(o) {
      return {
        _class : 'EventParams',
        _version : o._version,
        _title : o._title,
        _teams : o._teams,
        uid_counter : o.uid_counter,
        _startTime : o._startTime,
        _endTime : o._endTime,
        _sessions : o._sessions,
        _days : o._days,
        errors : o.errors,
        _extraTime: o._extraTime,
        _minTravel: o._minTravel,
        _logoTopLeft: o._logoTopLeft,
        _logoBotLeft: o._logoBotLeft,
        _logoTopRight: o._logoTopRight,
        _logoBotRight: o._logoBotRight,
        _footer: o._footer
      };
    }

    static thaw(o) {
      let E = new EventParams(o._version, o._title);
      E._teams = o._teams;
      E.uid_counter = o.uid_counter;
      E._startTime = o._startTime;
      E._endTime = o._endTime;
      E._minTravel = o._minTravel;
      E._extraTime = o._extraTime;
      E._sessions = o._sessions;
      E._days = o._days;
      E.errors = o.errors;
      E._logoTopLeft = o._logoTopLeft;
      E._logoBotLeft = o._logoBotLeft;
      E._logoTopRight = o._logoTopRight;
      E._logoBotRight = o._logoBotRight;
      E._footer = o._footer;
      if (!E.errors) E.errors = Infinity;
      return E;
    }
}
