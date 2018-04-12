export class DateTime {
    constructor(mins) {
        this.mins = mins;
    }

    inTime() {
        let x = (this.mins%(24*60));
        let  h = Math.floor(x/60);
        let m = (x%60);
        let zh = (h < 10) ? "0" : "";
        let zm = (m < 10) ? "0" : "";
        return zh+h+":"+zm+m;

    }

    get mins() { return this._mins };
    set mins(value) { this._mins = value};

    get time() { return this.inTime()};
    set time(value) {
        let res = value.split(":");
        this._mins = parseInt(res[0],10)*60 + parseInt(res[1], 10);
    }
}