function exportBL(event) {
	saveToFile(prompt("Enter filename", tourn_ui.params.name.replace(/ /g, '_'))+".csv",saveToCSV(event));
}

function saveToCSV(event) {
	var csv = "Version Number,1\n";
	csv += "Block Format,1\n";
	csv += "Number of Teams,"+event.teams.length+"\n";
	for (var i = 0; i < event.teams.length; i++) {
		csv += event.teams[i].number + "," + event.teams[i].name + ",0\n";
	}
	csv += "Block Format,2\n";
	var rankingMatches = 0;
	var allMatches = allTypes(event,TYPE_MATCH_ROUND);
	for (var i = 0; i < allMatches.length; i++) {
		rankingMatches += allMatches[i].schedule.length;
	}
	csv +="Number of Ranking Matches,"+rankingMatches+"\n";
	csv +="Number of Tables,"+allMatches[0].nLocs+"\n";
	csv +="Number of Teams Per Table,"+allMatches[0].nSims+"\n";
	csv +="Number of Simultaneous Tables,"+Math.floor(allMatches[0].nLocs/allMatches[0].nSims)+"\n";
	csv +="Table Names,";
	for (var i = 0; i < allMatches[0].locations.length; i++) {
		csv += allMatches[0].locations[i]+",";
	}
	csv += "\n";
	for (var i = 0; i < allMatches.length; i++) {
		for (var j = 0; j < allMatches[i].schedule.length; j++) {
			var instance = allMatches[i].schedule[j];
			csv += instance.num + ",";
			csv += minsToExcel(instance.start) + ",";
			var extra = 0;
			if (instance.extra) extra = event.extraTime;
			csv += minsToExcel(instance.start+instance.length+extra) + ",";
			for (var t = 0; t < instance.teams.length; t++) {
				csv += getTeam(instance.teams[t]).number + ",";
			}
			csv += "\n";
		}
	}
	var allJudging = allTypes(event, TYPE_JUDGING);
	csv += "Block Format,3\n"
	csv += "Number of Judged Events,"+allJudging.length+"\n";
	csv += "Number of Event Time Slots,"+allJudging[0].schedule.length;
	csv += "Number of Judging Teams,"+allJudging[0].nLocs+"\n";
	for (var i = 0; i < allJudging.length; i++) {
		csv += "Event Name,"+allJudging[i].name+"\n";
		csv +="Room Names,";
		for (var j = 0; j < allJudging[i].locations.length; j++) {
			csv += allJudging[i].locations[j]+",";
		}
		csv += "\n";
		for (var j = 0; j < allJudging[i].schedule.length; j++) {
			var instance = allJudging[i].schedule[j];
			csv += instance.num + ",";
			csv += minsToExcel(instance.start) + ",";
			var extra = 0;
			if (instance.extra) extra = event.extraTime;
			csv += minsToExcel(instance.start+instance.length+extra) + ",";
			for (var t = 0; t < instance.teams.length; t++) {
				csv += getTeam(instance.teams[t]).number + ",";
			}
			csv += "\n";
		}
	}
	var practiceMatches = 0;
	var allMatches = allTypes(event,TYPE_MATCH_ROUND_PRACTICE);
	if (allMatches == null) return csv;
	for (var i = 0; i < allMatches.length; i++) {
		practiceMatches += allMatches[i].schedule.length;
	}
	
	csv += "Block Format,4\n";
	csv +="Number of Practice Matches,"+practiceMatches+"\n";
	csv +="Number of Tables,"+allMatches[0].nLocs+"\n";
	csv +="Number of Teams Per Table,"+allMatches[0].nSims+"\n";
	csv +="Number of Simultaneous Tables,"+Math.floor(allMatches[0].nLocs/allMatches[0].nSims)+"\n";
	csv +="Table Names,";
	for (var i = 0; i < allMatches[0].locations.length; i++) {
		csv += allMatches[0].locations[i]+",";
	}
	csv += "\n";
	for (var i = 0; i < allMatches.length; i++) {
		for (var j = 0; j < allMatches[i].schedule.length; j++) {
			var instance = allMatches[i].schedule[j];
			csv += instance.num + ",";
			csv += minsToExcel(instance.start) + ",";
			var extra = 0;
			if (instance.extra) extra = event.extraTime;
			csv += minsToExcel(instance.start+instance.length+extra) + ",";
			for (var t = 0; t < instance.teams.length; t++) {
				csv += getTeam(instance.teams[t]).number + ",";
			}
			csv += "\n";
		}
	}

}

// Excel represents time decimally as follows:
// Time = x.yyyyyyyy
// Where x = Number of days since 1/1/1900
// and	 y = Proportion of day (mins/(24*60))
function minsToExcel(mins) {
	return mins/(24*60);
}