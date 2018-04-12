export class Team {
    constructor(number) {
        this.number = number;
        this.name = "Team " + number;
    }

    get name() { return this._name; }
    set name(value) { this._name = value; }

    get number() { return this._number }
    set number(value) { this._number = value; }
}