import { TYPES } from './SessionTypes'

export default class SessionParams {
    constructor(uid, type, name, nLocs=4, startTime=null, endTime=null) {
        this._id = uid;
        this._type = type;

        this.name = (name) ? name : this.type.defaultTitle + " " + this._id;

        let A = [];
        for (let i = 1; i <= nLocs; i++) A.push(this.type.defaultLocs + " " + i);
        this.locations = A;

        this.startTime = startTime;
        this.endTime = endTime;

        this.nSims = this.locations.length;
        this.len = 10;
        this.buf = 5;

        this.schedule = []; // To be filled in later
        this.errors = 0;

        this.instances = 1; // Can be changed in later versions, specifically for TYPE_MATCH_FILLER.
        this.extraTimeFirst = false; // Should the first round be a little longer?
        this.extraTimeEvery = null; // Extra time every N round
        this.appliesTo = []; // Which sessions a break applies to
        this.usesSurrogates = false;
    }

    // These are immutable
    get type() { return this._type; }
    get id() { return this._id; }

    get name() { return this._name; }
    set name (value) { this._name = value; }

    get nLocs() {return this._locations.length;}
    set nLocs(value) {
        while (this.nLocs < value)
            this._locations.push(this.type.defaultLocs + " " + (this.nLocs + 1));
        while (this.nLocs > value)
            this._locations.pop();
        if (this.type === TYPES.JUDGING) this.nSims = this.nLocs;
    }

    get locations() { return this._locations; }
    set locations(value) { this._locations = value; }

    get schedule() { return this._schedule; }
    set schedule(value) { this._schedule = value; }

    get nSims() { return this._nSims; }
    set nSims(value) { this._nSims = value; }

    get startTime() { return this._startTime; }
    set startTime(value) { this._startTime = value; }

    get endTime() { return this._endTime; }
    set endTime(value) { this._endTime = value; }

    get len() { return this._len ; }
    set len(value) { this._len = value; }

    get buf() { return this._buf ; }
    set buf(value) { this._buf = value; }

    get errors() { return this._errors; }
    set errors(value) { this._errors = value; }

    get instances() { return this._instances; }
    set instances(value) { this._instances = value; }

    get extraTimeFirst() { return this._extraTimeFirst; }
    set extraTimeFirst(value) { this._extraTimeFirst = value; }

    get extraTimeEvery() { return this._extraTimeEvery; }
    set extraTimeEvery(value) { this._extraTimeEvery = value; }

    get appliesTo() { return this._appliesTo; }
    set appliesTo(value) { this._appliesTo = value; }

    get usesSurrogates() { return this._usesSurrogates; }
    set usesSurrogates(value) { this._usesSurrogates = value; }
}
