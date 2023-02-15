<script type="text/javascript" src="/assets/templates/eflaundry/js/jquery-3.11.min.js"></script>
<div class="time_view">
</div>
<script type="text/javascript">
(function(){
    var _undefined;
	helper={};
	helper.ObjectLength=function(t){
	    var size = 0, key;
	    for (key in t) {
	        if (t.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
	helper.ObjectType=function(e){
        var t = Object.prototype.toString.call(e);
        if (t == 'undefined') return 'undefined';
		if(/\[object HTML([a-zA-Z]+)Element\]/.test(t))return t.match(/\[object HTML([a-zA-Z]+)Element\]/)[1].toLowerCase();
		if(/\[object ([a-zA-Z]+)\]/.test(t)) return t.match(/\[object ([a-zA-Z]+)\]/)[1].toLowerCase();
	}
	helper.isHTML=function(e){
		var t=Object.prototype.toString.call(e);
		return (/\[object HTML([a-zA-Z]+)\]/.test(t));
	}
	helper.get=function (p,o,s,b,m){
		var xhttp= new XMLHttpRequest();
		var url=p+"?";
		if(o||o!=""){
			//body
			for (var k in o){
				if(helper.ObjectType(o[k])!='string'||helper.ObjectType(o[k])!='number'||'toString' in o[k])url+=k+"="+encodeURIComponent(o[k])+'&';
				else if(helper.ObjectType(o[k])=='object'||helper.ObjectType(o[k])=='array')url+=k+"="+encodeURIComponent(JSON.stringify(o[k]))+'&';
				else if(helper.ObjectType(o[k])=='function')url+=k+"="+encodeURIComponent(JSON.stringify(o[k]()))+'&';
			}
		}
		xhttp.open('GET', url, b);
        //Meta tegs
        if(typeof m != 'undefined') {
            if(!('Content-Type' in m)) xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            if (m) {
                for (var k in m) {
                    xhttp.setRequestHeader(k, m);
                }
            }
        } else {
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

		//---
		if(s){xhttp.onreadystatechange = function () {if(xhttp.readyState==4)s(xhttp.responseText,xhttp.readyState);}
		xhttp.send(null);
		} else {
			xhttp.send(null);
			return xhttp.responseText;
		}
	}
	helper.post=function (p,o,s,b,m){
		var xhttp= new XMLHttpRequest(),body="",response,redy,boundary = String(Math.random()).slice(2),boundaryMiddle = '--' + boundary + '\r\n',boundaryLast = '--' + boundary + '--\r\n'
		if(o||o!=""){
			var body = ['\r\n'];
			for (var k in o) {
			  // добавление поля
			  //body.push('Content-Disposition: form-data; name="' + k + '"\r\n\r\n' + o[k] + '\r\n');
			  if(helper.ObjectType(o[k])!='string'||helper.ObjectType(o[k])!='number'||'toString' in o[k])body.push('Content-Disposition: form-data; name="' + k + '"\r\n\r\n' + o[k] + '\r\n');
				else if(helper.ObjectType(o[k])=='object'||helper.ObjectType(o[k])=='array')body.push('Content-Disposition: form-data; name="' + k + '"\r\n\r\n' + JSON.stringify(o[k]) + '\r\n');
				else if(helper.ObjectType(o[k])=='function')body.push('Content-Disposition: form-data; name="' + k + '"\r\n\r\n' + JSON.stringify(o[k]()) + '\r\n');
			}
			body = body.join(boundaryMiddle) + boundaryLast;
		}
		xhttp.open('POST', p, b);
		//Meta tegs
		if(!('Content-Type' in m))xhttp.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
		if(m){
			for(var k in m){
				xhttp.setRequestHeader(k,m);
			}
		}
		//---
		if(s){
			xhttp.onreadystatechange = function () {if(xhttp.readyState==4)s(xhttp.responseText,xhttp.readyState);}
			xhttp.send(body);
		} else {
			xhttp.send(body);
			return xhttp.responseText;
		}
	}
	helper.upload=function(file,f,u,e){
		var xhr = new XMLHttpRequest();
		xhr.upload.onprogress = function(event){
			u(event);
		}
		xhr.onload = xhr.onerror = function() {
			if(this.status == 200){
				f(this);
			} else {
				e(this);
			}
		};
		xhr.open("POST", "upload", true);
		xhr.send(file);
    }
    helper.inArray = function inArray(value,array){
        for (var i in array) {
            if (array[i] == value) return true;
        } return false;
    }
	//app help
	helper.app={
        'getMonthName': function getMonthName($unixTimeStamp) {
            var d = new Date($unixTimeStamp);
            var $mN = d.getMonth();
            var $monthAr = [
                ['Январь', 'Января'],
                ['Февраль', 'Февраля'],
                ['Март', 'Марта'],
                ['Апрель', 'Апреля'],
                ['Май', 'Мая'],
                ['Июнь', 'Июня'],
                ['Июль', 'Июля'],
                ['Август', 'Августа'],
                ['Сентябрь', 'Сентября'],
                ['Октябрь', 'Октября'],
                ['Ноябрь', 'Ноября'],
                ['Декабрь', 'Декабря']
            ];
            return $monthAr[$mN];
        },
        'getMyDate':function getMyDate($time) {
            $month = helper.app.getMonthName($time);
            var $date = new Date($time);
            return $date.getDay() + ' ' + $month[0] + ' ' + $date.getYear() + ', ' + $date.getHours() + ':' + $date.getMinutes();
        },
        'HomeSite':''
    };
})();
(function(window){
	/* Just some new templater */
	var _string    = "string";
	var _object    = "object";
	var _array 	   = "array";
	var _function  = "function";
	//This code taken from microtemplate created by Paul Miller
	var entityRe = new RegExp('[&<>"\']', 'g');
	var escapeExpr = function(string) {
		if (string == null) return '';
		return ('' + string).replace(entityRe, function(match) {
			return htmlEntities[match];
		});
	};
	var settings = {
		evaluate    : /<%([\s\S]+?)%>/g,
		interpolate : /<%=([\s\S]+?)%>/g,
		escape      : /<%-([\s\S]+?)%>/g
	};
	var matcher = new RegExp([
		(settings.escape || noMatch).source,
		(settings.interpolate || noMatch).source,
		(settings.evaluate || noMatch).source
	].join('|') + '|$', 'g');
	var noMatch = /(.)^/;
	var escapes = {
		"'":      "'",
		'\\':     '\\',
		'\r':     'r',
		'\n':     'n',
		'\t':     't',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

	var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
	var htmlEntities = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;'
	};
	//End
	//Templater
	/*
	* var context - used when calling the generated template function
	* var CacheTemp - last rendered code
	* var RAWTEMP - RAW template code
	* var DataCache - last used data
	*/
	Templater=function(template,object,context){
		this.DataCache=object||{},this.RAWTEMP=template||''; this.context=context||this;
		return this;
	}

    Templater.prototype.Render = function () {
        this.CacheTemp = this.Execute(this.RAWTEMP, this.DataCache);
        return this.CacheTemp;
	}

	Templater.prototype.Execute=function(tmp,obj){
		var HTML=tmp,t=this,templater_data={},index = 0,script = "(function(__templater_data){ \n\
			var __templater_html_text_var=\"\"; \n\
			var __t,echo=function(){ \n\
				__templater_html_text_var+=Array.prototype.join.call(arguments,''); \n\
			} \n\
			var execute=function(t,o){ \n\
				return new Templater(t,o); \n\
			} \n";
		//Add data to array for executing
		for(var k in obj){
			script+="var "+k+"=__templater_data."+k+";";
			templater_data[k]=obj[k];
		}
		//end
		script+="__templater_html_text_var+='";
		//Render script.
		HTML.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
			script+=HTML.slice(index, offset).replace(escaper, function(match) { return '\\' + escapes[match]; });
			if(escape){
				script+="'+\n((__t=(" + escape + "))==null?'':escapeExpr(__t))+\n'";
			}
			if(interpolate){
				script+="'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			}
			if(evaluate){
				script+="';\n" + evaluate + "\n__templater_html_text_var+='";
			}
			index = offset + match.length;
				return match;
		});
		script += "';\n\
			return __templater_html_text_var; \n\
		});"
        try {
            var result = eval(script).call((this.context != "" ? this.context : this), templater_data);
            return result.substring(1);
        } catch (e) {
            console.error(e, script);
            return '';
        }
	}

	Templater.prototype.ReRender=function(o){
		this.CacheTemp=this.Render(this.RAWTEMP,o);
		return this.CacheTemp;
	}
	Templater.prototype.SetData=function(o){
		this.DataCache=o;
		return this;
	}
	Templater.prototype.SetTemp=function(s){
		this.RAWTEMP=s;
		return this;
	}
	Templater.prototype.SetContext=function(c){
		this.context=c;
		return this;
	}
	Templater.prototype.toString=function(){
		return this.CacheTemp;
	}
	Templater.prototype.context="";
	Templater.prototype.CacheTemp="";
	Templater.prototype.RAWTEMP="";
	Templater.prototype.DataCache={};
})(window);
</script>
<script type="text/javascript">
var PickUp = {}, DropOff = {}, cacheFirstTimeDate, wash = { 'washFold': 1, 'dryCleaning': 2, 'homeCleaning': 3 };
var globalData={'goBack':'washFold'};
$.get(helper.app.HomeSite + '/time-schedule', { 'wash': wash[globalData['goBack']] }, function (r) {
	PickUp = JSON.parse(r.replace(/\,\]/gm, "]")); cacheFirstTimeDate = PickUp[0]["day_info"]["value"] + " " + PickUp[0]["work_times"][0]["value"];
	$.get(helper.app.HomeSite + '/time-schedule', { 'pickup': cacheFirstTimeDate, 'wash': wash[globalData['goBack']] }, function (d) {
		DropOff = JSON.parse(d.replace(/\,\]/gm, "]"));
		document.querySelector('.time_view').innerHTML = new Templater(document.querySelector('#time_tmp').innerHTML, { 'title': globalData['title'], 'goBack': globalData['goBack'], 'PickUp': PickUp, 'DropOff': DropOff }, document.querySelector('.time_view')).Render();

		//day-start
		if ($('.time-page-form [name="day-start"]').length > 0) {
			$('.time-page-form [name="day-start"]').change(styledSelector);
			styledSelector.call($('.time-page-form [name="day-start"]')[0]);
			$('.time-page-form [name="day-start"]').change(function () {
				var val = $(this).val(); var time = PickUp[val], options='';
				for (var i in time["work_times"]) options += '<option value="' + time["day_info"]["value"] + ' ' + time["work_times"][i]["value"] + '"> ' + time["work_times"][i]["text"] + '</option>';
				$('.time-page-form [name="time-start"]').html(options);
				chengeDropOffDate($('.time-page-form [name="time-start"]').val());
				styledSelector.call($('.time-page-form [name="time-start"]')[0]);
			});
		}

		//time-start
		if ($('.time-page-form [name="time-start"]').length > 0) {
			$('.time-page-form [name="time-start"]').change(styledSelector);
			styledSelector.call($('.time-page-form [name="time-start"]')[0]);
			$('.time-page-form [name="time-start"]').change(function () {
				chengeDropOffDate($('.time-page-form [name="time-start"]').val());
				styledSelector.call($('.time-page-form [name="time-end"]')[0]);
			});
		}

		//day-end
		if ($('.time-page-form [name="day-end"]').length > 0) {
			$('.time-page-form [name="day-end"]').change(styledSelector);
			styledSelector.call($('.time-page-form [name="day-end"]')[0]);
			$('.time-page-form [name="day-end"]').change(function () {
				var val = $(this).val(); var time = DropOff[val], options = '';
				for (var i in time["work_times"]) options += '<option value="' + time["day_info"]["value"] + ' ' + time["work_times"][i]["value"] + '"> ' + time["work_times"][i]["text"] + '</option>';
				$('.time-page-form [name="time-end"]').html(options);
				styledSelector.call($('.time-page-form [name="time-end"]')[0]);
			});
		}

		//time-end
		if ($('.time-page-form [name="time-end"]').length > 0) {
			$('.time-page-form [name="time-end"]').change(styledSelector);
			styledSelector.call($('.time-page-form [name="time-end"]')[0]);
		}

		function selectFix(){
			$('select').map(function(){
				styledSelector.call(this);
			});
			setTimeout(selectFix,100);
		}
		setTimeout(selectFix,100);

		$('.step-end').click(function () {
            console.log('step-end - step - 5');
			var cache = getFormData();
			globalData['data_time_info'] = cache;
		});

		//if(cordova.platformId!='android') $('.time-page .first-select,.time-page .second-select').css({width:'100%','margin-bottom':'10px'})

		$('.time-page .selected-items-body select').map(function(){
			$(this).css({'width':$(this).parent().width()+'px'});
		});

	});
});
function getFormData() {
	var data = {
		'instruction': $('textarea[name="instructions"]').val(),
		'pickup': $('.time-page-form [name="time-start"]').val(),
		'pickup-day': $('.day-start-text').html(),
		'pickup-time': $('.time-start-text').html(),
		'pickup-title': 'PICK UP',
		'dropoff': 'DROP OFF'
	};
	if ($('.time-page-form [name="day-end"]').length > 0) {
		data['dropoff'] = $('.time-page-form [name="time-end"]').val();
		data['dropoff-day'] = $('.day-end-text').html();
		data['dropoff-time'] = $('.time-end-text').html();
		data['dropoff-title'] = 'DROP OFF';
	}
	if (globalData['goBack'] == 'homeCleaning') data['pickup-title'] = 'STARTING TIME';
	return data;
}
function styledSelector() {
	var $this = $(this); var value = [], selectedItems = $this.val(), $options = $this.find('option'), z = 0, text = '';
	if ($options.length > 0) {
		while (z < $options.length) {
			value.push({ 'text': $options.eq(z).html(), 'value': $options.eq(z).attr('value') });
			z++;
		}
		for (var d in value) {
			if (typeof selectedItems != 'object') {
				if (value[d]['value'] == selectedItems) {
					text = value[d]['text'];
				}
			} else {
				for (var i in selectedItems) {
					if (value[d]['value'] == selectedItems[i]) {
						text += ',' + value[d]['text'];
					}
				}
			}
		}
	} else {
		text = $this.val();
	}
	text = (text != null && text.indexOf(',') == 0 ? text.substr(1) : text);
	$this.parents('.selected-items-body').find('.selected-items .selected-items-text').html(text);
	if (text != '' && text != 'NONE') $this.parents('.selected-items-body').find('.selected-items .selected-items-text').addClass('selected');
	else $this.parents('.selected-items-body').find('.selected-items .selected-items-text').removeClass('selected');
}
function chengeDropOffDate(val) {
	$.get(helper.app.HomeSite + '/time-schedule', { 'pickup': val, 'wash': wash[globalData['goBack']] }, function (d) {
		DropOff = JSON.parse(d.replace(/\,\]/gm, "]"));
		var options = '';
		for (var i in DropOff) options += '<option value="' + i + '">' + DropOff[i]["day_info"]["text"] +'</option>';
		$('.time-page-form [name="day-end"]').html(options);
		styledSelector.call($('.time-page-form [name="day-end"]')[0]);
		options = '';
		for (var i in DropOff[0]["work_times"]) options += '<option value="' + DropOff[0]["day_info"]["value"] + ' ' + DropOff[0]["work_times"][i]["value"] + ' ">' + DropOff[0]["work_times"][i]["text"] +'</option>';
		$('.time-page-form [name="time-end"]').html(options);
		styledSelector.call($('.time-page-form [name="time-end"]')[0]);
	});
}
</script>
<script type="template/jshtml" id="time_tmp">
<div class="time-page-bg">
    <div class="time-page">
        <h2><% echo(title); %></h2>
        <!--Second form-->
        <form class="time-page-form">
            <% if(goBack != 'homeCleaning') {%>
            <div class="form-row">
                <div class="form-row-name">
                    PICK UP
                </div>
                <div class="form-row-value">
                    <div class="width30 float-left first-select" style="width:200px; margin-bottom:20px;">
                        <div class="selected-items-body">
                            <select name="day-start">
                                <%
                                    for(var i in PickUp) echo('<option style="width:200px;" value="'+i+'">'+PickUp[i]["day_info"]["text"]+'</option>');
                                %>
                            </select>
                        </div>
                    </div>
                    <div class="width70 float-left second-select" style="width:200px; margin-bottom:20px;">
                        <div class="selected-items-body">
                            <select name="time-start">
                                <%
                                for(var i in PickUp[0]["work_times"]) {
                                echo('<option value="'+PickUp[0]["day_info"]["value"]+' '+PickUp[0]["work_times"][i]["value"]+'">'+PickUp[0]["work_times"][i]["text"]+'</option>');
                                }
                                %>
                            </select>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="clear"></div>
            </div>
            <div class="form-row">
                <div class="form-row-name">
                    DROP OFF
                </div>
                <div class="form-row-value">
                    <div class="width30 float-left first-select" style="width:200px; margin-bottom:20px;">
                        <div class="selected-items-body">
                            <select name="day-end">
                                <%
                                for(var i in DropOff) echo('<option value="'+i+'">'+DropOff[i]["day_info"]["text"]+'</option>');
                                %>
                            </select>
                        </div>
                    </div>
                    <div class="width70 float-left second-select" style="width:200px; margin-bottom:20px;">
                        <div class="selected-items-body">
                            <select name="time-end">
                                <%
                                for(var i in DropOff[0]["work_times"]) {
                                echo('<option value="'+DropOff[0]["day_info"]["value"]+' '+DropOff[0]["work_times"][i]["value"]+' ">'+DropOff[0]["work_times"][i]["text"]+'</option>');
                                }
                                %>
                            </select>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="clear"></div>
            </div>
            <% } else { %>
            <div class="form-row">
                <div class="form-row-name">
                    STARTING TIME
                </div>
                <div class="form-row-value">
                    <div class="width30 float-left first-select">
                        <div class="selected-items-body">
                            <div class="selected-items">
                                <span class="selected-items-text day-start-text">MAY 1</span><i></i>
                            </div>
                            <select name="day-start">
                                <%
                                for(var i in PickUp) echo('<option value="'+i+'">'+PickUp[i]["day_info"]["text"]+'</option>');
                                %>
                            </select>
                        </div>
                    </div>
                    <div class="width70 float-left second-select">
                        <div class="selected-items-body">
                            <div class="selected-items">
                                <span class="selected-items-text time-start-text">6:00 - 8:00 AM</span><i></i>
                            </div>
                            <select name="time-start">
                                <%
                                for(var i in PickUp[0]["work_times"]) {
                                echo('<option value="'+PickUp[0]["day_info"]["value"]+' '+PickUp[0]["work_times"][i]["value"]+' ">'+PickUp[0]["work_times"][i]["text"]+'</option>');
                                }
                                %>
                            </select>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="clear"></div>
            </div>
            <% } %>
            <label class="form-row not-requered">
                <div class="form-row-name">
                    INSTRUCTIONS
                </div>
                <div class="form-row-value instructions">
                    <textarea class="instructions" name="instructions"></textarea>
                </div>
                <div class="clear"></div>
            </label>
        </form>
        <div class="time-page-buttons first-step">
            <a href="#/<% echo(goBack); %>"><img src="img/back.png" class="width50 step-back float-left" /></a>
            <a href="#/totalPage"><img src="img/total-page.png" class="width50 step-end float-left" /></a>
            <div class="clear"></div>
        </div>
    </div>
</div>
</script>
