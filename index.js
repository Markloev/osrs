
var your_url = 'http://services.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws?player=igraver';
// jquery.xdomainajax.js  ------ from padolsey

jQuery.ajax = (function(_ajax){

    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';

    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }

    return function(o) {

        var url = o.url;

        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {

            // Manipulate options so that JSONP-x request is made to YQL

            o.url = YQL;
            o.dataType = 'json';

            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };

            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }

            o.success = (function(_success){
                return function(data) {

                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: data.results[0]
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }

                };
            })(o.success);

        }

        return _ajax.apply(this, arguments);

    };

})(jQuery.ajax);



$.ajax({
    url: your_url,
    type: 'GET',
    success: function(res) {
        var text = res.responseText;
				$("#characterInfo").html(text);
				text = $("#characterInfo").text();
				parseCharacterInfo(text);

    }
});

function parseCharacterInfo(text)
{
	var groups = text.split("\n");
	var skill = ["Overall", "Attack", "Defence", "Strength", "Hitpoints", "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming", "Runecraft", "Hunter", "Construction"];
	var rank = [];
	var level = [];
	var xp = [];
	for(var i=0; i<groups.length; i++)
	{
			var numbers = groups[i].split(",");
			if (numbers.length == 3)
			{
				rank.push(numbers[0]);
				level.push(numbers[1]);
				xp.push(numbers[2]);
			}
	}

var tableText = "<div><img src='includes/images/scrollTop.gif'></img></div>" +
"<table id='scrollMiddle' background='includes/images/scrollMiddle.gif' cellpadding='0' cellspacing='0' border='0'>" +
	"<tbody>" +
		"<tr><th colspan='5' style='text-align:center;'>Personal Scores for iGraver</th></tr>" +
		"<tr><th></th><th class='skillAlign'>Skill</th><th>Rank</th><th>Level</th><th>XP</th></tr>";
	for(var i=0; i<rank.length; i++)
	{
		tableText += "<tr>" +
													"<td class='skillAlign'>" +
																"<img src='includes/images/skills/" + i + ".gif'</img>" +
													"</td>" +
													"<td class='skillAlign'>" +
															skill[i] +
													"</td>" +
													"<td>" +
																numberWithCommas(rank[i]) +
													"</td>" +
													"<td>" +
																numberWithCommas(level[i]) +
													"</td>" +
													"<td>" +
																numberWithCommas(xp[i]) +
													"</td>" +
								 "</tr>";
	}
	tableText += "</tbody>" +
	"</table>" +
	"<div><img src='includes/images/scrollBottom.gif'></img></div>";
	$("#characterInfo").html(tableText);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function print_r(obj, t) {

    // define tab spacing
    var tab = t || '';

    // check if it's array
    var isArr = Object.prototype.toString.call(obj) === '[object Array]';

    // use {} for object, [] for array
    var str = isArr ? ('Array\n' + tab + '[\n') : ('Object\n' + tab + '{\n');

    // walk through it's properties
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var val1 = obj[prop];
            var val2 = '';
            var type = Object.prototype.toString.call(val1);
            switch (type) {

                // recursive if object/array
                case '[object Array]':
                case '[object Object]':
                    val2 = print_r(val1, (tab + '\t'));
                    break;

                case '[object String]':
                    val2 = '\'' + val1 + '\'';
                    break;

                default:
                    val2 = val1;
            }
            str += tab + '\t' + prop + ' => ' + val2 + ',\n';
        }
    }

    // remove extra comma for last property
    str = str.substring(0, str.length - 2) + '\n' + tab;

    return isArr ? (str + ']') : (str + '}');
};
