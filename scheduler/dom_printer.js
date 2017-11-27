
var colClass = "col-md-4";

function printToDom(event) {
	var results=$("#results");
	evaluate(event);
	results.empty();
	sortThingsOut(event);
	toggleLockedMode();
	if (event.status == STATUS_OVERTIME) {
    	$("#words")[0].style.color = "orange";
        $("#words")[0].innerHTML = "Some sessions will finish late.  Please review parameters.";
        $("#exportBtns").attr("hidden","hidden");
	} else if (event.status == STATUS_FAILURE) {
		var str = (event.errors == 1) ? " error" : " errors";
		$("#words")[0].style.color = "red";
		$("#words")[0].innerHTML = event.errors + str + ".  Try again, or adjust your parameters.";
		$("#exportBtns").attr("hidden","hidden");
	} else if (event.status == STATUS_SUCCESS) {
        $("#words")[0].style.color = "green";
        $("#words")[0].innerHTML = "Schedule generated successfully.  The below tables can be copied into spreadsheets, or you can view or download pre-formatted PDF's using either of the buttons below.  Please note that View PDFs may not work correctly if you have ad blocker installed. <br>NB: PDFs are not currently supported in Internet Explorer, but you can still use the tables.";
        $("#exportBtns").removeAttr("hidden");
    } else {
    	$("#words")[0].style.color = "black";
        $("#words")[0].innerHTML = "Press the above button to attempt to generate a schedule using the given parameters.";
        $("#exportBtns").attr("hidden","hidden");
		return;
	} 

	var judge_row = $("<div>");
	var match_row = $("<div>");
	for (var i = 0; i < event.allSessions.length; i++) {
		var session = event.allSessions[i];
		if (session.type == TYPE_JUDGING) judge_row.append(generateTable(session));
		else if (session.type == TYPE_BREAK) console.log("Not printing break");
		else match_row.append(generateTable(session));
	}
	results.append(judge_row);
	results.append(match_row);
	if (event.errors == 0) results.append(generateIndivTable(event));
}

function generateTable(session) {
	var data = genSessionTable(tournament, session);
	var result = $("<div class=\"session\">");
	result.append($("<h4>"+session.name+"</h4>"));
	var table = $("<table class=\"table resultTable table-responsive\">");
	var header = "<thead><tr>";
	for (var i = 0; i < data[0].length; i++) header += "<th>"+data[0][i]+"</th>";
	header += "</tr></thead>";
	table.append($(header));
	var tbody = $("<tbody>");
	for (var i = 1; i < data.length; i++) {
		var row = $("<tr>");
		row.append($("<td>"+data[i][0]+"</td>"));
		row.append($("<td>"+data[i][1]+"</td>"));
		if (data[i][2].startsWith("colspan")) {
			cols = data[i][2].split('::')[1];
			row.append($("<td colspan='"+cols+"' class='breakrow'>"+data[i][2].split('::')[2]+"</td>"));
			tbody.append(row);
			continue;
		}
		var team = 0;
		for (var j = 2; j < data[i].length; j++) {
			if (data[i][j] == "") row.append($("<td>")); 
			else {
				var deets="event,"+session.uid+","+(i-1)+","+(team++);
				var cell = "<td class='table-team' ondrop='drop("+deets+")' ondragover='allowDrop("+deets+")' ondragstart='drag("+deets+")'>";
				row.append($(cell+data[i][j].split("\n")[0]+"</td>"));
			}
		}
		tbody.append(row);
	}
	table.append(tbody);
	result.append(table);
	return result;
}

function generateIndivTable(event) {
	var data = genIndivTable(tournament, false);
	var result = $("<div class=\"container-fluid indiv table-responsive\">");
	result.append($("<h4>Individual Schedules</h4>"));
	var table = $("<table class=\"table resultTable \">");
	for (var k = 0; k < 2; k++) {
		var header = "<thead><tr>";
		for (var i = 0; i < data[k].length; i++) {
			if (data[k][i].startsWith("colspan")) {
				header += "<th colspan="+data[k][i].split("::")[1]+">"+data[k][i].split("::")[2]+"</th>";
			} else header += "<th>"+data[k][i]+"</th>";
		}
		header += "</tr></thead>";
		table.append($(header));
	}
	var tbody = $("<tbody>");
	for (var k = 2; k < data.length; k++) {
		var row = "<tr>";
		for (var i = 0; i < data[k].length; i++) {
			if (data[k][i].startsWith("colspan")) {
				row += "<td colspan="+data[k][i].split("::")[1]+">"+data[k][i].split("::")[2]+"</td>";
			} else row += "<td>"+data[k][i]+"</td>";
		}
		tbody.append($(row));
	}
	table.append(tbody);
	result.append(table);
	toggleDragMode();
	return result;
}

function drop(evt,uid,i,t) {
	evt.preventDefault();
    var from_uid = parseInt(evt.dataTransfer.getData("uid"));
    var from_i = parseInt(evt.dataTransfer.getData("instance"));
    var from_t = parseInt(evt.dataTransfer.getData("team"));
	var from_instance = getSession(from_uid).schedule[from_i];
    var to_instance = getSession(uid).schedule[i];
    if (from_instance.session_uid != to_instance.session_uid) return;
    var from_team = getTeam(from_instance.teams[from_t]);
    var to_team = getTeam(to_instance.teams[t]);
    if (!canDo(tournament,from_team,to_instance,uid) || !canDo(tournament,to_team,from_instance,from_uid)) {
    	alert ("These two teams cannot swap");
    	return;
    }
    from_instance.teams[from_t] = to_team.uid;
    to_instance.teams[t] = from_team.uid;
    var fromToRemove = null;
    for (var i = 0; i < from_team.schedule.length; i++) {
    	if (from_team.schedule[i].session_uid == from_instance.session_uid) fromToRemove = i;
    }
    var toToRemove = null;
    for (var i = 0; i < to_team.schedule.length; i++) {
    	if (to_team.schedule[i].session_uid == to_instance.session_uid) toToRemove = i;
    }
    if (fromToRemove == null || toToRemove == null) {
    	alert ("Error during swapping");
    	return;
    }
    from_team.schedule.splice(fromToRemove,1);
	to_team.schedule.splice(toToRemove,1);

	from_team.schedule.push(to_instance);
	to_team.schedule.push(from_instance);
	from_team.schedule.sort(function(a,b) {
		var s_a = getSession(a.session_uid);
		var s_b = getSession(b.session_uid);
		if (s_a.type.priority == s_b.type.priority) {
			if (s_a.start == s_b.start) return s_a.uid-s_b.uid;
			return s_a.start - s_b.start;
		}
		return s_a.type.priority - s_b.type.priority;
	});
	to_team.schedule.sort(function(a,b) {
		var s_a = getSession(a.session_uid);
		var s_b = getSession(b.session_uid);
		if (s_a.type.priority == s_b.type.priority) {
			if (s_a.start == s_b.start) return s_a.uid-s_b.uid;
			return s_a.start - s_b.start;
		}
		return s_a.type.priority - s_b.type.priority;
	});
	var errs = tournament.errors;
	evaluate(tournament);
	if (tournament.errors > errs) alert ("Something went wrong!  The schedule is broken");
	autosave();
	printToDom(tournament);
}

function allowDrop(evt,uid,i,t) {
	evt.preventDefault();
}

function drag(evt,uid,i,t) {
    evt.dataTransfer.setData("uid", uid);
    evt.dataTransfer.setData("instance", i);
    evt.dataTransfer.setData("team", t);
}