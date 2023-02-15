(function () {
    var PickUp = {}, DropOff = {}, cacheFirstTimeDate, wash = { 'washFold': 1, 'dryCleaning': 2, 'Maid': 3 };
    timePage = new Page('timePage', function () {

        dataLayer.push({
            'event': 'user-app-step-4'
        });
        EventToFire('user_app_step_4');

        var self = this;
        $.get(helper.app.HomeSite + '/time-schedule-new', {'wash': wash[globalData['goBack']]}, function (r) {
            // PickUp = JSON.parse(r.replace(/\,\]/gm, "]"));
            PickUp = r;
            cacheFirstTimeDate = PickUp[0]["day_info"]["value"] + " " + PickUp[0]["work_times"][0]["value"];
            $.get(helper.app.HomeSite + '/time-schedule-new', { 'pickup': cacheFirstTimeDate, 'wash': wash[globalData['goBack']] }, function (d) {
                // DropOff = JSON.parse(d.replace(/\,\]/gm, "]"));
                DropOff = d;
                self.render({ 'title': globalData['title'], 'Settings': settings, 'goBack': globalData['goBack'], 'PickUp': PickUp, 'DropOff': DropOff }, function () {
                    $('.loading-block').hide();
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
                    //fix
                    $('.time-page-form select').focus(function(){
                      $('.time-page-form').css({'min-height':'auto'});
                    //   $('.time-page-buttons').css({'margin-top':'0'});
                    }).blur(function(){
                      $('.time-page-form').css({'min-height':'calc(100vh - 210px)'});
                    //   $('.time-page-buttons').css({'margin-top':'60px'});
                    });

                    $('.step-end').click(function () {
                        console.log('step-end - step - 1');
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
        if (globalData['goBack'] == 'homeCleaning' || globalData['goBack'] == 'Maid') data['pickup-title'] = 'STARTING TIME';
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
            $('.time-page-form [name="day-end"]').html(options);
            styledSelector.call($('.time-page-form [name="day-end"]')[0]);
            options = '';
            for (var i in DropOff[0]["work_times"]) options += '<option value="' + DropOff[0]["day_info"]["value"] + ' ' + DropOff[0]["work_times"][i]["value"] + ' ">' + DropOff[0]["work_times"][i]["text"] +'</option>';
            $('.time-page-form [name="time-end"]').html(options);
            styledSelector.call($('.time-page-form [name="time-end"]')[0]);
        });
    }
})();
