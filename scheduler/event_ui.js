function EventPanel(params) {
	console.log(params);
	this.params = params;
	this.allPanels = [];
	this.teamInput = $("#nTeams")[0];
	this.daysInput = $("#nDays")[0];
	this.minsInput = $("#minTravel")[0];
	this.titleInput = $("#title")[0];
	this.teamInput.value = this.params.nTeams;
	this.daysInput.value = this.params.nDays;
	this.minsInput.value = this.params.minTravel;
	this.titleInput.innerHTML = this.params.name;
	for (var i = 0; i < params.allSessions.length; i++) {
		var p = new sessionPanel(params.allSessions[i]);
		this.allPanels.push(p);

		if (p.session.type == TYPE_JUDGING)
			p.docObj.insertBefore("#addJudgeBtn");
		else if (p.session.type == TYPE_ROUND)
			p.docObj.insertBefore("#addRoundBtn");
		else if (p.session.type == TYPE_BREAK)
			p.docObj.insertBefore("#addBreakBtn");
	}
	this.changeTitle = function() {
	    var safe = this.params.name;
	    this.params.name = prompt("Enter title here", this.titleInput.textContent);
	    if (this.params.name == null) this.params.name = safe;
	    this.titleInput.innerHTML = this.params.name;
		autosave();
	}
	this.changeNTeams = function() {
		this.params.nTeams = this.teamInput.value;
		while (this.params.teamNumbers.length < this.params.nTeams)
			this.params.teamNumbers.push("" + (this.params.teamNumbers.length+1)); 
		while (this.params.teamNames.length < this.params.nTeams)
			this.params.teamNames.push("Team " + (this.params.teamNames.length+1)); 
		while (this.params.teamNumbers.length > this.params.nTeams)
			this.params.teamNumbers.splice(this.params.teamNumbers.length-1,1); 
		while (this.params.teamNames.length > this.params.nTeams)
			this.params.teamNames.splice(this.params.teamNames.length-1,1); 
		autosave();
	}
	this.changeMinTravel = function() {
		this.params.minTravel = this.minsInput.value;		
		autosave();
	}
	this.changeNDays = function() {
		updateTournDays(this.params, this.daysInput.value);
		var toDelete = [];
		for (var i = 0; i < this.allPanels.length; i++) {
			var panel = this.allPanels[i];
			if (panel.session.type == TYPE_BREAK && panel.session.end > this.params.nDays*(24*60))
				toDelete.push(panel.session.uid);
			while (panel.session.start > this.params.nDays*(24*60)) panel.session.start -= (24*60);
			while (panel.session.end > this.params.nDays*(24*60)) panel.session.end -= (24*60);
			panel.updateDOM();
		}
		for (var i = 0; i < toDelete.length; i++) {
			deleteParams(toDelete[i]);
		}
		autosave();
	}
}

function autosave() {
	var json = save();
	localStorage.setItem("schedule", json);
}

var saveFile = null;
function saveToFile(filename) {
	fullname = filename+".schedule";
	json = save();
	var data = new Blob([json], {type: 'text/plain'});
    if (saveFile !== null) {
      window.URL.revokeObjectURL(saveFile); //Prevents memory leaks on multiple saves.
    }
    saveFile = window.URL.createObjectURL(data);
    saveLink = $("#saveLink")[0];
    saveLink.download = fullname;
    saveLink.href = saveFile;
    saveLink.click();
}

function loadFromFile(evt) {
	//https://www.html5rocks.com/en/tutorials/file/dndfiles/
	// ^ Explains how to read files as binary, text, etc.
    var reader = new FileReader();
    reader.onload = function(e) {
		console.log("Loaded: ");
		console.log(e.target.result);
		// Should probably check that this 'looks' like a schedule file.  check field names, number of fields, etc.
		// Step 1: Delete everything in the UI.
		var uids = [];
		for (var i = 0; i < tourn_ui.allPanels.length; i++) {
			uids.push(tourn_ui.allPanels[i].session.uid);
		}
		for (var i = 0; i < uids.length; i++) {
			deleteParams(uids[i]);
		}
		//Step 2: Replace tournament and tourn_ui
        tournament = load(e.target.result);
        tourn_ui = new EventPanel(tournament);
    }
    if (evt.files[0]) {
        reader.readAsText(evt.files[0]);
    }
	alert ("Loaded " + evt.files[0].name + "!");
}

function getPanel(uid) {
	for (var i = 0; i < tourn_ui.allPanels.length; i++) {
		if (tourn_ui.allPanels[i].session.uid == uid) return tourn_ui.allPanels[i];
	}
	console.log("Failed to find Panel " + uid);
	return null;
}



function sessionPanel(session) {
	this.session = session;

	// Create elements of DOM input form
	this.docObj = $("<table class=roundtable>");

	// DOM objects
	this.title=$("<input class=\"form-control\" type=text value=\"Title\">");
	this.startDateInput=$("<select class=\"form-control\"></select>");
	for (var i = 0; i < tournament.days.length; i++)
		this.startDateInput.append($("<option value=\""+i+"\">"+tournament.days[i]+"</option>"));
	if (tournament.days.length <= 1) this.startDateInput.hide();
	else this.startDateInput.show();
	this.startTimeInput=$("<input class=\"form-control\" type=time value=\"09:00\" step=\"900\">");
	this.endDateInput=$("<select class=\"form-control\"></select>");
	for (var i = 0; i < tournament.days.length; i++)
		this.endDateInput.append($("<option value=\""+i+"\">"+tournament.days[i]+"</option>"));
	if (tournament.days.length <= 1) this.endDateInput.hide();
	else this.endDateInput.show();
	this.endTimeInput=$("<input class=\"form-control\" type=time value=\"14:00\" step=\"900\">");
	this.lenInput=$("<input class=\"form-control\" type=number min=0 max=1000 value=10>")
	this.bufInput=$("<input class=\"form-control\" type=number min=0 max=1000 value=10>")
	this.simInput=$("<input class=\"form-control\" type=number min=1 max=100 value=1>");
	this.locsInput=$("<input class=\"form-control\" type=number min=1 max=100 value=1>");

	// Build docObj
	if (this.session.type != TYPE_BREAK)
		var x = $("<tr><td><h3></h3></td><td><button class=\"btn\" onclick=\"copyToAll("+this.session.uid+")\">Copy to all</button></td></tr>");
	else var x = $("<tr><td colspan=\"2\"><h3></h3></td></tr>");
	$("h3", x).append(this.title);
	this.docObj.append(x);
	var x = $("<tr><td>Start time:</td><td><div></div></td></tr>");
	$("div", x).append(this.startDateInput);
	$("div", x).append(this.startTimeInput);
	this.docObj.append(x);
	var x = $("<tr><td>Must be done by:</td><td><div></div></td></tr>");
	$("div", x).append(this.endDateInput);
	$("div", x).append(this.endTimeInput);
	this.docObj.append(x);
	if (this.session.type != TYPE_BREAK) {
		var x = $("<tr><td>Duration (min):</td><td><div></div></td></tr>");
		$("div", x).append(this.lenInput);
		this.docObj.append(x);
		var x = $("<tr><td>Buffer/cleanup time (min):</td><td><div></div></td></tr>");
		$("div", x).append(this.bufInput);
		this.docObj.append(x);
		var x = $("<tr><td># Simultaneous teams:</td><td><div></div></td></tr>");
		if (this.session.type == TYPE_JUDGING) x = $("<tr hidden><td># Simultaneous teams:</td><td><div></div></td></tr>");
		$("div", x).append(this.simInput);
		this.docObj.append(x);
	}
	if (this.session.type == TYPE_JUDGING)
		var x = $("<tr><td># judging panels:</td><td><div></div></td></tr>");
	else if (this.session.type == TYPE_ROUND)
		var x = $("<tr><td># tables:</td><td><div></div></td></tr>");
	else if (this.session.type == TYPE_BREAK)
		var x = null;
	else 
		var x = $("<tr><td># locations:</td><td><div></div></td></tr>");
	// var x = $("<tr><td># locations:</td><td><div></div></td></tr>");
	if (x) {
		$("div", x).append(this.locsInput);
		this.docObj.append(x);
	}
	this.docObj.append($("<tr><td><button class=\"btn\" onclick=\"openLocationModal("+this.session.uid+")\" data-toggle=\"modal\" data-target=\"#locationModal\">Edit location names</button>\
		</td><td><button class=\"btn\" onclick=deleteParams("+this.session.uid+")>Delete</button></td></tr>"));
	// Add change listeners
    var ins = $("input,select", this.docObj);
    for (var i = 0; i < ins.length; i++) {
    	$(ins[i]).attr('onchange','getPanel('+this.session.uid+').update();');
	}

	this.updateDOM = function() {
		this.startDateInput.empty();
		this.endDateInput.empty();
		for (var i = 0; i < tournament.nDays; i++)
			this.startDateInput.append($("<option value=\""+i+"\">"+tournament.days[i]+"</option>"));
		if (tournament.nDays <= 1) this.startDateInput.hide();
		else this.startDateInput.show();
		for (var i = 0; i < tournament.nDays; i++)
			this.endDateInput.append($("<option value=\""+i+"\">"+tournament.days[i]+"</option>"));
		if (tournament.nDays <= 1) this.endDateInput.hide();
		else this.endDateInput.show();

		this.title[0].value = this.session.name;
		this.startDateInput[0].value = minsToDate(this.session.start);
		this.startTimeInput[0].value = minsToTime(this.session.start);
		this.endDateInput[0].value = minsToDate(this.session.end);
		this.endTimeInput[0].value = minsToTime(this.session.end);
		this.lenInput[0].value = this.session.length;
		this.bufInput[0].value = this.session.buffer;
		this.locsInput[0].value = this.session.nLocs;
		this.simInput[0].value = this.session.nSims;
		autosave();
	}
	this.update = function() {
		this.session.name = this.title[0].value;
		this.session.start = tdToMins(this.startDateInput[0].value,this.startTimeInput[0].value);
		this.session.end = tdToMins(this.endDateInput[0].value,this.endTimeInput[0].value);
		this.session.length = this.lenInput[0].value;
		this.session.buffer = this.bufInput[0].value;
		this.session.nLocs = this.locsInput[0].value;
		if (this.session.type != TYPE_JUDGING) this.session.nSims = this.simInput[0].value;
		else this.session.nSims = this.session.nLocs;

		while (this.session.locations.length < this.session.nLocs) {
			if (this.session.type == TYPE_JUDGING)
				this.session.locations.push("Room "+ (this.session.locations.length+1));
			else if (this.session.type == TYPE_ROUND)
				this.session.locations.push("Table "+ (this.session.locations.length+1));				
			else this.session.locations.push("Lunch area");
		}
		while (this.session.locations.length > this.session.nLocs) {
			this.session.locations.splice(this.session.locations.length-1,1);
		}
		autosave();
	}
	this.updateDOM();
	this.update();

}

function copyToAll(uid) {
	var basePanel = getPanel(uid);
	for (var i = 0; i < tourn_ui.allPanels.length; i++) {
		var panel = tourn_ui.allPanels[i];
		if (panel.session.uid != uid && panel.session.type == basePanel.session.type) {
			panel.session.start = basePanel.session.start;
			panel.session.end = basePanel.session.end;
			panel.session.length = basePanel.session.length;
			panel.session.buffer = basePanel.session.buffer;
			panel.session.nLocs = basePanel.session.nLocs;
			panel.session.nSims = basePanel.session.nSims;
			panel.updateDOM();
			panel.update();
		}
	}
}

function addJudging(name,start,end,nSims,nLocs,length,buffer,locs) {
	// alert("Hello");
	var s = new SessionParameters(TYPE_JUDGING,name,start,end,nSims,nLocs,length,buffer,locs);
	tournament.allSessions.push(s);
	var p = new sessionPanel(s);
	tourn_ui.allPanels.push(p);
	p.docObj.insertBefore("#addJudgeBtn")
}

function addRound(name,start,end,nSims,nLocs,length,buffer,locs) {
	// alert("Hello");
	var s = new SessionParameters(TYPE_ROUND,name,start,end,nSims,nLocs,length,buffer,locs);
	tournament.allSessions.push(s);
	var p = new sessionPanel(s);
	tourn_ui.allPanels.push(p);
	p.docObj.insertBefore("#addRoundBtn")
}

function addBreak(name,start,end,locs) {
	// alert("Hello");
	var s = new SessionParameters(TYPE_BREAK,name,start,end,null,null,null,null,locs);
	tournament.allSessions.push(s);
	var p = new sessionPanel(s);
	tourn_ui.allPanels.push(p);
	p.docObj.insertBefore("#addBreakBtn")
}

function minsToDate(x) {
	return Math.floor(x/(24*60));
}

function minsToTime(x) {
	x = (x%(24*60)) + start_time_offset;
	var h = (x/60);
	var m = (x%60);
	var zh = (h < 10) ? "0" : "";
	var zm = (m < 10) ? "0" : "";
	return zh+h+":"+zm+m;
}

function tdToMins(d,t) {
    var res = t.split(":");
    return d*(60*24) + parseInt(res[0])*60 + parseInt(res[1]) - start_time_offset;
}

function openLocationModal(uid) {
	panel = getPanel(uid);
    $("#loc-modal-body").empty();
    $("#loc-modal-body").append($("<input type=\"hidden\" value=\""+uid+"\">"));
    for (var i = 0; i < panel.session.locations.length; i++) {
    	var input = $("<input type=\"text\" class=\"form-control\" value=\""+panel.session.locations[i]+"\">");
        $("#loc-modal-body").append(input);
        $("#loc-modal-body").append(document.createElement("BR"));
    }
}

function closeLocationModal() {
	var inputs = $("#loc-modal-body>input");
	uid = inputs[0].value;
	panel = getPanel(uid);
	for (var i = 1; i < inputs.length; i++)
		panel.session.locations[i-1] = inputs[i].value;
}

function openDayModal() {
    $("#day-modal-body").empty();
    for (var i = 0; i < tournament.nDays; i++) {
    	var input = $("<input type=\"text\" class=\"form-control\" value=\""+tournament.days[i]+"\">");
        $("#day-modal-body").append(input);
        $("#day-modal-body").append(document.createElement("BR"));
    }
}

function closeDayModal() {
	var inputs = $("#day-modal-body>input");
	for (var i = 0; i < inputs.length; i++)
		tournament.days[i] = inputs[i].value;
	tourn_ui.changeNDays();
}

function openTeamModal() {
    $("#team-modal-body").empty();
    $("#team-modal-body").append($("<p>One line per team.  Team numbers will automatically add\/delete to match the number of team names.</p>"))
    var x = $("<textarea rows=\""+tournament.nTeams+"\" cols=\"5\"></textarea>");
    for (var i = 0; i < tournament.teamNumbers.length; i++)
    	x.append(tournament.teamNumbers[i]+"\n");
    $("#team-modal-body").append(x);
    var x = $("<textarea rows=\""+tournament.nTeams+"\" cols=\"60\"></textarea>");
    for (var i = 0; i < tournament.teamNames.length; i++)
    	x.append(tournament.teamNames[i]+"\n");
    $("#team-modal-body").append(x);
}

function closeTeamModal() {
	var inputs = $("#team-modal-body>textarea");
	var nums = inputs[0].value.split("\n");
	if (nums[nums.length-1] == "") nums.splice(nums.length-1,1);
	var names = inputs[1].value.split("\n");
	if (names[names.length-1] == "") names.splice(names.length-1,1);
	while (nums.length < names.length) nums.push(""+(nums.length+1));
	while (nums.length > names.length) nums.splice(nums.length-1,1);
	tournament.teamNumbers = nums;
	tournament.teamNames = names;
	tournament.nTeams = names.length;
	$("#nTeams")[0].value = tournament.nTeams;
}


function clickSave() {
	saveToFile(prompt("Enter filename", tournament.name.replace(/ /g, '_')));
}

function clickLoad() {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	  $("#loadFileInput").click();
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	}
}
