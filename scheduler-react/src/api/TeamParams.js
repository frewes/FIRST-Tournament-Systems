import ShortUniqueId from 'short-unique-id';

import { DateTime } from "./DateTime";

export class TeamParams {
    constructor(number) {
        this.number = number;
        this.name = "Team " + number;

        this.id = new ShortUniqueId();

        // So far unused
        this.pitNum = 0;
        this.extraTime = false;
        this.excludeJudging = false;
        this.startTime = new DateTime(null);
        this.endTime = new DateTime(null);
        this.isSurrogate = false;
        this.schedule = [];
    }

    get name() { return this._name; }
    set name(value) { this._name = value; }

    get number() { return this._number }
    set number(value) { this._number = value; }
}