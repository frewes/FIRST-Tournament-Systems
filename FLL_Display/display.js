function test() {
    $("#results").empty();
    var ip = $("#ip").val();
    var a = document.createElement('a');
    var url = "http://"+ip+":8008/FLL";
    a.href = url;
    a.appendChild(document.createTextNode("FLL Control Page"));
    a.className = "btn btn-info";
    a.target = "_blank";
    $("#results").add(a);
    $("#results").add(document.createTextNode("Match number " + getCurrentMatch(url)));
    
}

function getCurrentMatch(url){
    //Note: Action=3 starts the timer//
	var xmlDoc = getXML(url+"/Time_Control?Action=2");
	var foo=xmlDoc.getElementsByTagName("Data")[0];
	var match = foo.getElementsByTagName("Current_Match")[0].childNodes[0].nodeValue;
	return match;
}

function getXML(location){
    alert("Getting XML from " + location);
    var xmlhttp=new XMLHttpRequest();
    if ("withCredentials" in xmlhttp)
        xmlhttp.open("GET",location,true);
    else {
        alert("Not supported in this browser");
        return;
    }
	xmlhttp.send();
    alert("Sent XML request");
	var xmlDoc=xmlhttp.responseXML; 
	return xmlDoc;
}