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

    static freeze(o) {
      return {
        _class : 'TeamParams',
        number : o.number,
        name : o.name,
        id : o.id,
        pitNum : o.pitNum,
        extraTime : o.extraTime,
        excludeJudging : o.excludeJudging,
        startTime : o.startTime,
        endTime : o.endTime,
        isSurrogate : o.isSurrogate,
        schedule : o.schedule
      };
    }

    static thaw(o) {
      let T = new TeamParams(o.number);
      T.name = o.name;
      T.id = o.id;
      T.pitNum = o.pitNum;
      T.extraTime = o.extraTime;
      T.excludeJudging = o.excludeJudging;
      T.startTime = o.startTime;
      T.endTime = o.endTime;
      T.isSurrogate = o.isSurrogate;
      T.schedule = o.schedule;
      return T;
    }
}
