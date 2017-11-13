var saveFile = null;

function saveToFile(filename, content) {
	if (filename.startsWith("null.")) return;
	var data = new Blob([content], {type: 'text/plain'});
    if (saveFile !== null) {
      window.URL.revokeObjectURL(saveFile); //Prevents memory leaks on multiple saves.
    }
    saveFile = window.URL.createObjectURL(data);
    saveLink = $("#saveLink")[0];
    saveLink.download = filename;
    saveLink.href = saveFile;
    saveLink.click();
}

// Should be called from a file input
function loadFromFile(evt) {
    //https://www.html5rocks.com/en/tutorials/file/dndfiles/
    // ^ Explains how to read files as binary, text, etc.
    var reader = new FileReader();
    reader.onload = function(e) {
        console.log("Loaded: ");
        console.log(e.target.result);
        loadFile(e.target.result);
    }
    if (evt.files[0]) {
        reader.readAsText(evt.files[0]);
    }
    printToDom(tournament);
    toggleAdvMode();
    alert ("Loaded " + evt.files[0].name + "!");
}

//https://stackoverflow.com/questions/6832596/how-to-compare-software-version-number-using-js-only-number, LeJared
function cmpVersions (a, b) {
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

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

