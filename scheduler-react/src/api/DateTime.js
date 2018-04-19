export class DateTime {
    constructor(mins, days=["Day 1"]) {
        this.mins = mins;
        this.days = days;
    }

    displayTime() {
        let x = (this.mins%(24*60));
        let d = Math.floor(this.mins/(24*60));
        let  h = Math.floor(x/60);
        let m = (x%60);
        let zh = (h < 10) ? "0" : "";
        let zm = (m < 10) ? "0" : "";
        return (this.days.length > 1 ? this.days[d]+" " : "")+zh+h+":"+zm+m;
    }

    justDay() {
        let d = Math.floor(this.mins/(24*60));
        return this.days[d];
    }

    justTime() {
        let x = (this.mins%(24*60));
        let h = Math.floor(x/60);
        let m = (x%60);
        let zh = (h < 10) ? "0" : "";
        let zm = (m < 10) ? "0" : "";
        return zh+h+":"+zm+m;
    }

    get mins() { return this._mins };
    set mins(value) { this._mins = value};

    get time() { return this.displayTime()};
    set time(value) {
        let res = value.split(":");
        this._mins = parseInt(res[0],10)*60 + parseInt(res[1], 10);
    }

    get timeValue() { return this.justTime()}
    get day() { return this.days;}
    set day(value) {
        if (this.days.includes(value)) this.mins = (this.mins%(24*60))+(this.days.indexOf(value)*24*60);
    }

    get days() { return this._days; }
    set days(value) { this._days = value;}

    clone(inc=0) {return new DateTime(this.mins+inc, this.days);}
}