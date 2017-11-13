const MATCH_ROS = {priority:0,n:8,prefix:"Ro16"};
const MATCH_QF = {priority:1,n:4,prefix:"QF"};
const MATCH_SF = {priority:2,n:2,prefix:"SF"};
const MATCH_F = {priority:3,n:1,prefix:"F"};

function loadPlayoff() {
    tournament.mode = MODE_PLAYOFF;
    $("#nav-playoff-tab").tab('show');

    generateMatches();
}

function generateMatches() {
    // Create matches
    tournament.matches = [];
    var minMode = -1;
    var nByes = 0;
    if (tournament.alliances.length > MATCH_ROS.n) {
        minMode = MATCH_ROS;
        nByes = 16-Math.floor(tournament.alliances.length);
    } else if (tournament.alliances.length > MATCH_QF.n) {
        minMode = MATCH_QF; 
        nByes = 8-Math.floor(tournament.alliances.length);
    } else if (tournament.alliances.length > MATCH_SF.n) {
        minMode = MATCH_SF; 
        nByes = 4-Math.floor(tournament.alliances.length);
    } else minMode = MATCH_F; 

    var offset = 0;
    while (nByes-- > 0) {
        tournament.matches.push(new Match(minMode.prefix, minMode, tournament.alliances[offset], null, true));
        offset++;
    }

    // Add all of current matches.
    var j = tournament.alliances.length-1;
    for (var i = offset; i < minMode.n; i++) {
        tournament.matches.push(new Match(minMode.prefix,minMode,tournament.alliances[i],tournament.alliances[j--],false));
    }
    tournament.matches = tournament.matches.concat(tournament.matches.splice(1,1));

    for (var i = 0; i < tournament.matches.length; i++) {
        tournament.matches[i].name += "-"+(i+1);
    }

    // Add all unfilled matches
    if (minMode.n >= MATCH_ROS.n)
        for (var i = 0; i < MATCH_QF.n; i++)
            tournament.matches.push(new Match(MATCH_QF.prefix+"-"+(i+1),MATCH_QF,null,null,false));
    if (minMode.n >= MATCH_QF.n)
        for (var i = 0; i < MATCH_SF.n; i++)
            tournament.matches.push(new Match(MATCH_SF.prefix+"-"+(i+1),MATCH_SF,null,null,false));
    if (minMode.n >= MATCH_SF.n) 
        for (var i = 0; i < MATCH_F.n; i++)
            tournament.matches.push(new Match(MATCH_F.prefix+"-"+(i+1),MATCH_F,null,null,false));

    console.log(tournament.matches);
    updateMatchList();
}

function updateMatchList() {
    $(DOM_Objects.matchSelect).empty();
    $(DOM_Objects.matchSelect).append($("<option value='-1' selected></option>"))
    var al = tournament.matches;
    for (var i = 0; i < al.length; i++) {
        $(DOM_Objects.matchSelect).append($("<option value='"+i+"' selected>"+al[i]+"</option>"))
    }
    $(DOM_Objects.matchSelect)[0].value = -1;
    // Lol funny workaround
    selectTeam({value:-1});
}
