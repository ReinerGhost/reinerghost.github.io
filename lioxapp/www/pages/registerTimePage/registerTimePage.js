(function () {
    var PickUp = {}, DropOff = {}, cacheFirstTimeDate, wash = { 'registerWashFold': 1, 'registerDryCleaning': 2, 'registerMaid': 3 };
    registerTimePage = new Page('registerTimePage', function () {
        dataLayer.push({
            'event': 'app-step-4'
        });
        EventToFire('app_step_4');
        //console.log("app-step-4");
        var self = this;
        $.get(helper.app.HomeSite + '/time-schedule-new', {'wash': wash[globalData['goBack']]}, function (r) {

            // PickUp = JSON.parse(r.replace(/\,\]/gm, "]"));
            PickUp = r;
            cacheFirstTimeDate = PickUp[0]["day_info"]["value"] + " " + PickUp[0]["work_times"][0]["value"];
            $.get(helper.app.HomeSite + '/time-schedule-new', { 'pickup': cacheFirstTimeDate, 'wash': wash[globalData['goBack']] }, function (d) {

                // DropOff = JSON.parse(d.replace(/\,\]/gm, "]"));
                DropOff = d;
                self.render({ 'title': globalData['title'], 'goBack': globalData['goBack'], 'PickUp': PickUp, 'DropOff': DropOff }, function () {
                    $('[name="zipcode"]').mask("99999");
                    $('.loading-block').hide();
                    //day-start
                    if ($('.register-time-page-form [name="day-start"]').length > 0) {
                        $('.register-time-page-form [name="day-start"]').change(styledSelector);
                        styledSelector.call($('.register-time-page-form [name="day-start"]')[0]);
                        $('.register-time-page-form [name="day-start"]').change(function () {
                            var val = $(this).val(); var time = PickUp[val], options='';
                            for (var i in time["work_times"]) options += '<option value="' + time["day_info"]["value"] + ' ' + time["work_times"][i]["value"] + '"> ' + time["work_times"][i]["text"] + '</option>';
                            $('.register-time-page-form [name="time-start"]').html(options);
                            chengeDropOffDate($('.register-time-page-form [name="time-start"]').val());
                            styledSelector.call($('.register-time-page-form [name="time-start"]')[0]);
                        });
                    }

                    //time-start
                    if ($('.register-time-page-form [name="time-start"]').length > 0) {
                        $('.register-time-page-form [name="time-start"]').change(styledSelector);
                        styledSelector.call($('.register-time-page-form [name="time-start"]')[0]);
                        $('.register-time-page-form [name="time-start"]').change(function () {
                            chengeDropOffDate($('.register-time-page-form [name="time-start"]').val());
                            styledSelector.call($('.register-time-page-form [name="time-end"]')[0]);
                        });
                    }

                    //day-end
                    if ($('.register-time-page-form [name="day-end"]').length > 0) {
                        $('.register-time-page-form [name="day-end"]').change(styledSelector);
                        styledSelector.call($('.register-time-page-form [name="day-end"]')[0]);
                        $('.register-time-page-form [name="day-end"]').change(function () {
                            var val = $(this).val(); var time = DropOff[val], options = '';
                            for (var i in time["work_times"]) options += '<option value="' + time["day_info"]["value"] + ' ' + time["work_times"][i]["value"] + '"> ' + time["work_times"][i]["text"] + '</option>';
                            $('.register-time-page-form [name="time-end"]').html(options);
                            styledSelector.call($('.register-time-page-form [name="time-end"]')[0]);
                        });
                    }

                    //time-end
                    if ($('.register-time-page-form [name="time-end"]').length > 0) {
                        $('.register-time-page-form [name="time-end"]').change(styledSelector);
                        styledSelector.call($('.register-time-page-form [name="time-end"]')[0]);
                    }
                    //fix
                    $('.register-time-page-form select').focus(function(){
                      $('.register-time-page-form').css({'min-height':'auto'});
                    //   $('.register-time-page-buttons').css({'margin-top':'0'});
                    }).blur(function(){
                      $('.register-time-page-form').css({'min-height':'calc(100vh - 210px)'});
                    //   $('.register-time-page-buttons').css({'margin-top':'60px'});
                    });

                    $('.step-end').click(function () {
                        console.log('step-end - step - 6');
                        var cache = getFormData();
                        globalData['data_time_info'] = cache;
                    });
                    $('select').on('change', function () {
                        assignDates();
                    });
                    assignDates();
                });
            });
        });
    });
    function assignDates(){
        $('.day-start-text').html($('.liox-select-day-start').find(":selected").text());
        $('.time-start-text').html($('.liox-select-time-start').find(":selected").text());
        $('.day-end-text').html($('.liox-select-day-end').find(":selected").text());
        $('.time-end-text').html($('.liox-select-time-end').find(":selected").text());
        $('.same-day-select-date').hide();
        if ($('.liox-select-day-end').find(":selected").text() == $('.liox-select-day-start').find(":selected").text()) {
            $('.same-day-select-date').show();
        }
        return;
    }
    function getFormData() {
        var data = {
            'instruction': $('textarea[name="instructions"]').val(),
            'pickup': $('.register-time-page-form [name="time-start"]').val(),
            'pickup-day': $('.day-start-text').html(),
            'pickup-time': $('.time-start-text').html(),
            'pickup-title': 'PICK UP',
            'dropoff': 'DROP OFF'
        };
        if ($('.register-time-page-form [name="day-end"]').length > 0) {
            data['dropoff'] = $('.register-time-page-form [name="time-end"]').val();
            data['dropoff-day'] = $('.day-end-text').html();
            data['dropoff-time'] = $('.time-end-text').html();
            data['dropoff-title'] = 'DROP OFF';
        }
        if (globalData['goBack'] == 'registerHomeCleaning' || globalData['goBack'] == 'registerMaid') data['pickup-title'] = 'STARTING TIME';

        if ($('.register-time-page-form input[name="address"]').length > 0) {
            var userdata = {
                address: $('.register-time-page-form input[name="address"]').val(),
                zipcode: $('.register-time-page-form input[name="zipcode"]').val(),
                apartment: $('.register-time-page-form input[name="apartment"]').val(),
            }
            globalData['userData'] = userdata;
        }
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
        assignDates();
    }
    function chengeDropOffDate(val) {
        $.get(helper.app.HomeSite + '/time-schedule-new', { 'pickup': val, 'wash': wash[globalData['goBack']] }, function (d) {
            // DropOff = JSON.parse(d.replace(/\,\]/gm, "]"));
            DropOff = d;
            var options = '';
            for (var i in DropOff) options += '<option value="' + i + '">' + DropOff[i]["day_info"]["text"] +'</option>';
            $('.register-time-page-form [name="day-end"]').html(options);
            styledSelector.call($('.register-time-page-form [name="day-end"]')[0]);
            options = '';
            for (var i in DropOff[0]["work_times"]) options += '<option value="' + DropOff[0]["day_info"]["value"] + ' ' + DropOff[0]["work_times"][i]["value"] + ' ">' + DropOff[0]["work_times"][i]["text"] +'</option>';
            $('.register-time-page-form [name="time-end"]').html(options);
            styledSelector.call($('.register-time-page-form [name="time-end"]')[0]);
        });
    }
})();

    function toTotalPage(){
        // if(!document.getElementById('address').value || !document.getElementById('apartment').value || !document.getElementById('zipcode').value){
        //         if(!document.getElementById('address').value){
		// 			document.getElementById('address').style.borderColor = 'red';
		// 			document.getElementById('address').style.zIndex = '2';
		// 		} else {
		// 			document.getElementById('address').style.borderColor = '#dce1e5';
		// 		}
		// 		if(!document.getElementById('apartment').value){
		// 			document.getElementById('apartment').style.borderColor = 'red';
		// 		} else {
		// 		document.getElementById('apartment').style.borderColor = '#dce1e5';
		// 		}
		// 		if(!document.getElementById('zipcode').value){
		// 			document.getElementById('zipcode').style.borderColor = 'red';
		// 		} else {
		// 		document.getElementById('zipcode').style.borderColor = '#dce1e5';
		// 		}
        //
        //     return;
        //
        // } else {
            storeLeadTimePage('#/registerAccountAdress');
        // }

    }

    function checkZipcode() {
		var zipcode = document.getElementById('zipcode').value;
		var area = '';
		if (!zipcode.includes("_")) {
			// var zipcodes_ok = [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011, 10012, 10013, 10014, 10015, 10016, 10017, 10018, 10019, 10020, 10021, 10022, 10023, 10024, 10025, 10026, 10028, 10027, 10031, 10032, 10039, 10030, 10037, 10035, 10128, 10029, 10038, 10036, 10065, 10041, 10075, 10081, 10105, 10118, 10122, 10111, 10121, 10131, 10133, 10152, 10153, 10154, 10166, 10167, 10169, 10172, 10211, 10213, 10280, 10281, 10282, 10271, 11251, 11201, 11206, 11231, 11217, 11238, 11216, 11215, 11211, 11206, 11225, 11249, 11205, 11222]; //, 11251, 11201, 11206, 11231, 11217, 11238, 11216, 11225, 11215, 11211, 11206, 11249 // harlem 10027, 10031, 10032, 10039, 10030, 10037, 10035
            var zipcodes_ok = settings['allow_zip_codes'].split(',');
			for (var i = 0; i <= zipcodes_ok.length; i++) {
				if (zipcode == zipcodes_ok[i]) {
					area = 'good';
					break;
				}
			}
			if (area == 'good') {
                document.getElementById('service-area-error').style.display = "none";
                document.getElementById('address-btn').style.visibility = "visible";
				return;
			} else {
				document.getElementById('service-area-error').style.display = "block";
                document.getElementById('address-btn').style.visibility = "hidden";

				//ZipcodeLogs(zipcode);
			}
		}
	}

    function HotelUser(){
        return;//DISABLE FOR NOW
		var date = new Date();
		date.setTime(date.getTime() + (4*60*60*1000));
		var expires = "expires=" + date.toUTCString();
		document.cookie = "hotel_user=1" + "; " + expires;
		document.getElementById('zipcode_alert').innerHTML='Hotel customers are not eligible for $10 discount';
		document.getElementById('discount').value=0;
		document.getElementsByClassName('global-alert')[0].classList.remove('alert-open');
		document.getElementById('tourist').value = '1';
		//setDiscount(0, '');
	}

    function storeLeadTimePage(href = null) {

        let sendingData = {
            'uid': getOrderUid(),
            'address': $('#address').val(),
            'apartment': $('#apartment').val(),
            'zip_code': $('#zipcode').val(),
            'city': "New York",
            'state': "NY",
            'source': 'lioxapp'
        }

        $.post('/lead-store', sendingData, function (response) {
            console.log('send lead: ', sendingData, response);
            if (href) {
                location.href = href;
            }
        });
    }
