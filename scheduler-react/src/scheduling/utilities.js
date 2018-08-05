import { DateTime } from '../api/DateTime';
import { EventParams } from '../api/EventParams';
import SessionParams from '../api/SessionParams';
import { TeamParams } from '../api/TeamParams';
import Instance from '../scheduling/Instance';
import { SessionType } from '../api/SessionTypes';

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

export function saveToFile_json(filename, content) {
    let file = new Blob([content], {type : 'application/json'});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
export function saveToFile_csv(filename, content) {
    let file = new Blob([content], {type : 'application/csv'});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

// Should be called from a file input
export function loadFromFile(evt) {
    // //https://www.html5rocks.com/en/tutorials/file/dndfiles/
    // // ^ Explains how to read files as binary, text, etc.
    // var reader = new FileReader();
    // reader.onload = function(e) {
    //     console.log("Loaded: ");
    //     console.log(e.target.result);
    //     loadFile(e.target.result);
    // }
    // if (evt.files[0]) {
    //     reader.readAsText(evt.files[0]);
    // }
    // printToDom(tournament);
    // toggleAdvMode();
    // alert ("Loaded " + evt.files[0].name + "!");
}

// Replacer function for JSON.stringify
// Saves any class instance as an object with its data and a class descriptor.
export function freeze(key, object) {
  if (object instanceof DateTime) {
    return DateTime.freeze(object);
  } else if (object instanceof EventParams) {
    return EventParams.freeze(object);
  } else if (object instanceof SessionParams) {
    return SessionParams.freeze(object);
  } else if (object instanceof TeamParams) {
    return TeamParams.freeze(object);
  } else if (object instanceof Instance) {
    return Instance.freeze(object);
  } else if (object instanceof SessionType) {
    return SessionType.freeze(object);
  } else return object;
}

// Reviver function for JSON.parse
// Returns any object as an instance of its class descriptor and data
export function thaw(key, value) {
  if (value instanceof Object && value._class) {
    switch (value._class) {
      case 'DateTime':
        return DateTime.thaw(value);
      case 'EventParams':
        return EventParams.thaw(value);
      case 'SessionParams':
        return SessionParams.thaw(value);
      case 'TeamParams':
        return TeamParams.thaw(value);
      case 'Instance':
        return Instance.thaw(value);
      case 'SessionType':
        return SessionType.thaw(value);
      default:
        return value;
    }
  } else {
    return value;
  }
}
