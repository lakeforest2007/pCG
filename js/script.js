$(document).ready(function(){

	// text box detects if ENTER key is pressed
	$('.typeahead').on('keypress', function(e) {
        if (e.keyCode == 13) {
        	//TODO: erase hint
            $('.tt-menu').css('display', 'none');


 		    var xhttp = new XMLHttpRequest(); //make XML HttpRequest object
			xhttp.onreadystatechange = function() {
			    if (this.readyState == 4 && this.status == 200) {
			    	handleResponse(this);
			    }
			};
            //gets the html of the search content 
			xhttp.open("GET", "content.html", true); //async
			xhttp.send();

            //inserts the response text into content html
			function handleResponse(xhttp) {
                var propName = "{{fullname}}"; //HARD-CODED for image
                var nameVal = $('.tt-input').val(); //gets the user query from search box
                var string = xhttp.responseText;

                //HARD-CODED for image
                string = string.replace(new RegExp(propName, "g"), nameVal); 

                var xhttp2 = new XMLHttpRequest(); //make another XML HttpRequest object
                xhttp2.onreadystatechange = function() { 
                    if (this.readyState == 4 && this.status == 200) {
                        handleResponse2(this);
                    } 
                };
                xhttp2.open("GET", "http://hp-api.herokuapp.com/api/characters", true);
                xhttp2.send();

                //parse the data from web server
                function handleResponse2(xhttp2) {
                    var json = JSON.parse(xhttp2.responseText);
                    var range = Object.keys(json).length;
                    for(var i = 0; i < range; i++) {
                        if(json[i].name == $('.tt-input').val()) {
                            var object = json[i];
                            for (var key in object) {
                                if(key != "wand") {
                                    var property = "{{" + key + "}}";
                                    var value = json[i][key];
                                    for(var j = 0; j < key.length; j++) {
                                        if(key.charAt(j) == key.charAt(j).toUpperCase()) {
                                            key = key.substring(0, j) + " " + key.slice(j);
                                            j += 2; //skip two character spaces
                                        }
                                    }
                                    key = key.charAt(0).toUpperCase() + key.slice(1);
                                    string = string.replace(new RegExp(property, "g"), key);
                                    string = string.replace("{{value}}", value);
                                    document.querySelector("#search-content").innerHTML = string;
                                }
                            }
                        }
                    }
                }
			}
        }
    });

    // Constructing the suggestion engine
    var names = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        //this url points to a json file thtat contains an array of character names
        prefetch: 'names.json'
    });
    
    // Initialize typeahead
    $('.typeahead').typeahead({
    	hint: true,
    	highlight: true,
    	minLength: 1
    }, 
    {
    	name: 'names',
        source: names,
        limit: 10 /* Specify maximum number of suggestions to be displayed */
    });
});