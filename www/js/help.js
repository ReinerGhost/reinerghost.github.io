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
        'getFile': function (path, fun) {
            var _path = path;
            window.resolveLocalFileSystemURL(path,
                function (fileSystem) {
                    fileSystem.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            fun(this);
                        };
                        reader.readAsText(file);
                    }, function (err) {
                        console.log(fileSystem,this,err);
                    });
                }, function (err) {
                    console.log(_path,err);
                }
            );
        },
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
        'setTitle': function setTitle(title) {
            $('title').html(title); $('.header-title').html(title);
        },
        'HomeSite': window.location.origin
    };
})();
