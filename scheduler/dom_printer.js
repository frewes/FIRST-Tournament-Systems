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
			if (instance.teams[t] == NOT_YET_ADDED)
				row.append("<td class=\"unfilled\">--</td>");
			else
				row.append("<td>"+instance.teams[t].number+"</td>");
		}
		while (diff-- >= 0) row.append($("<td>"));
		tbody.append(row);
	}
	table.append(tbody);
	result.append(table);
	return result;
}