//https://stackoverflow.com/questions/6832596/how-to-compare-software-version-number-using-js-only-number, LeJared
export function cmpVersions (a, b) {
    var i, diff;
    var regExStrip0 = /(\.0+)+$/;
    var segmentsA = a.replace(regExStrip0, '').split('.');
    var segmentsB = b.replace(regExStrip0, '').split('.');
    var l = Math.min(segmentsA.length, segmentsB.length);

    for (i = 0; i < l; i++) {
        diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
        if (diff) {
            return diff;
        }
    }
    return segmentsA.length - segmentsB.length;
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
export function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }

    return a;
}

/** Checks if two session overlap at all **/
export function overlaps(a,b) {
    if (a.actualStartTime.mins === b.actualStartTime.mins || a.actualEndTime.mins === b.actualEndTime.mins) return true;
    if (a.actualStartTime.mins < b.actualStartTime.mins && a.actualEndTime.mins > b.actualStartTime.mins) return true;
    return b.actualStartTime.mins < a.actualStartTime.mins && b.actualEndTime.mins > a.actualStartTime.mins;
}

/**
 Returns how many times a team has done a given session
 **/
export function  hasDone(team, id) {
    return team.schedule.filter(i=>i.session_id === id).length;
    }

