function printToDom(event) {
	var results=$("#results");
	results.empty();
	for (var i = 0; i < event.allSessions.length; i++) {
		var session = event.allSessions[i];
		if (session.type != TYPE_BREAK) results.append(generateTable(session));
	}
}

function generateTable(session) {
	var result = $("<div class=\"container-fluid session\">");
	result.append($("<h4>"+session.name+"</h4>"));
	var table = $("<table class=\"table resultTable table-responsive\">");
	var header = "<thead><tr><th>#</th><th>Time</th>";
	for (var i = 0; i < session.locations.length; i++) 
		header += "<th>"+session.locations[i]+"</th>";
	header += "</tr></thead>";
	table.append($(header));

	var tbody = $("<tbody>");
	for (var i = 0; i < session.schedule.length; i++) {
		var instance = session.schedule[i];
		var row = $("<tr>");
		row.append("<td>"+instance.num+"</td>");
		row.append("<td>"+minsToDT(instance.time)+"</td>");

        var diff = instance.loc+instance.teams.length+1;
        for (var dummy = 0; dummy < instance.loc; dummy++) {
        	diff--;
            row.append($("<td>"));
        }

		for (var t = 0; t < instance.teams.length; t++) {
			diff--;
			var deets="event,"+session.uid+","+i+","+t;
			if (instance.teams[t] == NOT_YET_ADDED)
				row.append($("<td draggable=\"true\" class=\"unfilled\" ondrop=\"drop("+deets+")\" ondragstart=\"drag("+deets+")\" ondragover=\"allowDrop("+deets+")\">--</td>"));
			else 
				row.append($("<td draggable=\"true\" ondrop=\"drop("+deets+")\" ondragover=\"allowDrop("+deets+")\" ondragstart=\"drag("+deets+")\">"+instance.teams[t].number+"</td>"));
			console.log
		}
		while (diff-- >= 0) row.append($("<td>"));
		tbody.append(row);
	}
	table.append(tbody);
	result.append(table);
	return result;
}

function drop(evt,uid,i,t) {
	evt.preventDefault();
    var from_uid = parseInt(evt.dataTransfer.getData("uid"));
    var from_i = parseInt(evt.dataTransfer.getData("instance"));
    var from_t = parseInt(evt.dataTransfer.getData("team"));
	var from_instance = getSession(from_uid).schedule[from_i];
    console.log(from_instance);
    var to_instance = getSession(uid).schedule[i];
    console.log(to_instance);
}

function allowDrop(evt,uid,i,t) {
	evt.preventDefault();
}

function drag(evt,uid,i,t) {
    evt.dataTransfer.setData("uid", uid);
    evt.dataTransfer.setData("instance", i);
    evt.dataTransfer.setData("team", t);
}