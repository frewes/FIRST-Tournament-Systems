/**
 num: Count of instance
 time: Time (mins) of instance
 teams: List of teams in instance
 loc: Location offset (i.e. for staggered sessions, location index of where the teams begin)
 extra: true/false if extra time is allocated
 */
export default class Instance {
    constructor(session, num, time, teams, loc) {
        this.session = session;
        this.num = num;
        this.time = time;
        this.teams = teams;
        this.loc = loc;
        this.surrogates = 0;
        this.standins = 0;
        this.extra = false;
    }
}
