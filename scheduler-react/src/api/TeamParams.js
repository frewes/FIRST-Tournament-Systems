export class TeamParams {
    constructor(number) {
        this.number = number;
        this.name = "Team " + number;

        // So far unused
        this.pitNum = 0;
        this.extraTime = false;
        this.excludeJudging = false;
        this.startTime = null;
        this.endTime = null;
        this.isSurrogate = false;
    }

    get name() { return this._name; }
    set name(value) { this._name = value; }

    get number() { return this._number }
    set number(value) { this._number = value; }
}