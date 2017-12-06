function exportBL(event) {
	saveToFile(prompt("Enter filename", tourn_ui.params.name.replace(/ /g, '_'))+".csv",saveToBL(event));
}

function exportFTC(event) {
	saveToFTC(event);
}

function saveToBL(event) {
	var csv = "Version Number,1\n";
	csv += "Block Format,1\n";
	csv += "Number of Teams,"+event.teams.length+"\n";
	for (var i = 0; i < event.teams.length; i++) {
		csv += event.teams[i].number + "," + event.teams[i].name + ","+event.teams[i].pitNum+",\n";
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
			var len = getSession(instance.session_uid).length;
			csv += instance.num + ",";
			csv += minsToExcel(event.startDate,instance.time) + ",";
			var extra = 0;
			if (instance.extra) extra = event.extraTime;
			csv += minsToExcel(event.startDate,instance.time+len+extra) + ",";
	        for (var dummy = 0; dummy < instance.loc; dummy++) {
	            csv += ",";
	        }

			for (var t = 0; t < instance.teams.length; t++) {
				csv += getTeam(instance.teams[t]).number + ",";
			}
			csv += "\n";
		}
	}
	var allJudging = allTypes(event, TYPE_JUDGING);
	csv += "Block Format,3\n"
	csv += "Number of Judged Events,"+allJudging.length+"\n";
	csv += "Number of Event Time Slots,"+allJudging[0].schedule.length + "\n";
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
			var len = getSession(instance.session_uid).length;
			csv += instance.num + ",";
			csv += minsToExcel(event.startDate,instance.time) + ",";
			var extra = 0;
			if (instance.extra) extra = event.extraTime;
			csv += minsToExcel(event.startDate,instance.time+len+extra) + ",";
	        for (var dummy = 0; dummy < instance.loc; dummy++) {
	            csv += ",";
	        }
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
			var len = getSession(instance.session_uid).length;
			var instance = allMatches[i].schedule[j];
			csv += instance.num + ",";
			csv += minsToExcel(event.startDate,instance.time) + ",";
			var extra = 0;
			if (instance.extra) extra = event.extraTime;
			csv += minsToExcel(event.startDate,instance.time+len+extra) + ",";
	        for (var dummy = 0; dummy < instance.loc; dummy++) {
	            csv += ",";
	        }
			for (var t = 0; t < instance.teams.length; t++) {
				csv += getTeam(instance.teams[t]).number + ",";
			}
			csv += "\n";
		}
	}
	return csv;
}

// Excel represents time decimally as follows:
// Time = x.yyyyyyyy
// Where x = Number of days since 1/1/1900
// and	 y = Proportion of day (mins/(24*60))
function minsToExcel(sd,m) {
	var t = minsToDT(m).replace(/$/,":00");
	if (m%(24*60) < (12*60)) t = t + " AM";
	else t = t + " PM";
	return t;
	// var millenium = new Date();
	// sd = new String(sd);
	// millenium.setFullYear(1900,0,1);
	// var tourn = new Date();
	// tourn.setFullYear(sd.split("-")[0],sd.split("-")[1]-1,sd.split("-")[2]);
	// if (tournament.days.length > 1) {
	// 	console.log(Date.daysBetween(millenium,tourn)+(m/(24*60)));
	// 	return Date.daysBetween(millenium,tourn)+(m/(24*60));
	// } else return m/(24*60);
}

Date.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}

function saveToFTC(event) {
	//matches.txt:
	//phase?|1|no.|0||red1|red2|0|blu1|blu2|0|0|0|0|false|false|false|0|0|0|false|false|false|sur1|sur2|sur3|sur4|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0
	//1|1|7|0||6|2|0|1|7|0|0|0|0|false|false|false|0|0|0|false|false|false|1|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0
	matches="";
	schedule = allTypes(event,TYPE_MATCH_FILLER)[0].schedule;
	for (var i = 0 ; i < schedule.length; i++) {
		matches+="1|1|"+(i+1)+"|0||";
		matches+=getTeam(schedule[i].teams[0]).number+"|"+getTeam(schedule[i].teams[1]).number+"|0|";
		matches+=getTeam(schedule[i].teams[2]).number+"|"+getTeam(schedule[i].teams[3]).number+"|0|";
		matches+="0|0|0|false|false|false|0|0|0|false|false|false";
		matches+=(schedule[i].surrogates>=4)?"|1":"|0";
		matches+=(schedule[i].surrogates>=3)?"|1":"|0";
		matches+="|0";
		matches+=(schedule[i].surrogates>=2)?"|1":"|0";
		matches+=(schedule[i].surrogates>=1)?"|1":"|0";
		matches+="|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0\n";
	}
	console.log(matches);
	saveToFile("matches.txt",matches);
}
