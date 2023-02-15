(function () {
    var defaultPrice = 30, Price = 0;
    function getFormData() {
        var els = document.querySelectorAll('form .form-row'), i = 0, cache = {}, formData = [];
        while (i < els.length) {
            cache = {};
            cache['text'] = els[i].querySelector('.form-label').innerHTML.replace(/\s+/, '');
            cache['text'] = cache['text'].replace(/(\r\n|\n|\r)/gm, "");
            console.log(els[i].querySelector('select,input,textarea'));
            if (typeof els[i].querySelector('select,input,textarea') != 'undefined' && els[i].querySelector('select,input,textarea') != null) {
                cache['name'] = els[i].querySelector('select,input,textarea').getAttribute('name');
                cache['value'] = els[i].querySelector('select,input,textarea').value;
                formData.push(cache);
                i++;
            }
        }
        for (var j = 1; j <= 3; j++) {
            cache = {};
            //cache['text'] = document.getElementById('extras_' + j).innerHTML;
            cache['text'] = toTitleCase(document.getElementById('extras_' + j).innerHTML);
            cache['name'] = 'extras_' + j;
            cache['value'] = document.getElementById('extras_var_' + j).value;
            formData.push(cache);
        }
        return formData;
    }
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    function getDataText(FormDataArray) {
        var data = [], cacheData = {}; for (var i in FormDataArray) cacheData[FormDataArray[i]['name']] = FormDataArray[i];

        data.push({
            'text': cacheData['bedrooms']['text'],
            'value': cacheData['bedrooms']['value']
        });
        data.push({
            'text': cacheData['bathrooms']['text'],
            'value': cacheData['bathrooms']['value']
        });
        data.push({
            'text': cacheData['clean_type']['text'],
            'value': cacheData['clean_type']['value']
        });
        data.push({
            'text': cacheData['frequency']['text'],
            'value': cacheData['frequency']['value']
        });
        data.push({
            'text': cacheData['extras_1']['text'],
            'value': cacheData['extras_1']['value']
        });
        data.push({
            'text': cacheData['extras_2']['text'],
            'value': cacheData['extras_2']['value']
        });
        data.push({
            'text': cacheData['extras_3']['text'],
            'value': cacheData['extras_3']['value']
        });

        return data;
    }

    function updateMaidTotal() {
        ///START CALCULATION
        var bedrooms = document.getElementById('bedrooms').value; // 15 mins each // 30 mins // 45 mins
        var bathrooms = document.getElementById('bathrooms').value; // 30 mins - standard // 45 mins - premium // 75 mins - deep // move-in-out
        var clean_type = document.getElementById('clean_type').value; // standard // premium // deep // move-in-out
        var frequency = document.getElementById('frequency').value; // 1 - one time // 2 - every 4 weeks // 3 - every 2 weeks // 4 - weekly
        var extras_1 = document.getElementById('extras_var_1').value; // 20 mins each
        var extras_2 = document.getElementById('extras_var_2').value; // 20 mins each
        var extras_3 = document.getElementById('extras_var_3').value; // 20 mins each
        var bedrooms_time = ["0", "16", "25", "35", "35"];
        var bathrooms_time = ["0", "20", "30", "50", "50"];
        var base_time = ["0", "90", "110", "145", "145"];
        var time = parseFloat(base_time[parseInt(clean_type) + 1]) + (bedrooms * bedrooms_time[parseInt(clean_type) + 1]) + (bathrooms * bathrooms_time[parseInt(clean_type) + 1]) + ((parseInt(clean_type) + 1) * 15);
        console.log("time is " + time);
        time = time / 60;
        time = parseFloat((Math.round(time * 4) / 4));
        if (frequency == 1) {
            frequency = 0;
        }

        var time_disc = 1 - (0.05 * frequency);


        console.log(time_disc);
        if (time > 1) {
            var price_per_hour = 50;
        } else if (time > 2) {
            var price_per_hour = 50;
        } else if (time > 3) {
            var price_per_hour = 45;
        } else if (time > 4) {
            var price_per_hour = 35;
        } else if (time > 5) {
            var price_per_hour = 30;
        } else if (time > 6) {
            var price_per_hour = 30;
        } else if (time > 7) {
            var price_per_hour = 30;
        } else {
            var price_per_hour = 50;
        }

        var deep_disc = 0;
        if (parseInt(clean_type) == 2) {
            var deep_disc = 80;
        } else if (parseInt(clean_type) == 3) {
            var deep_disc = 90;
        }

        var extra_clean = extras_1 * 30 + extras_2 * 30 + extras_3 * 30 - deep_disc;
        var cleaning_total = 35 + parseFloat((time * price_per_hour).toFixed(0)) + extra_clean;
        var cleaning_discount = Math.round(cleaning_total - (35 + parseFloat((time * price_per_hour).toFixed(0)) + extra_clean) * time_disc);
        console.log('cleaning_total: ' + cleaning_total);
        var tips = document.getElementById('tips').value;
        var discount = 20;

        var total = parseInt(cleaning_total) + parseInt(tips) - parseInt(discount) - parseInt(cleaning_discount) + 2.50;;
        document.getElementById('sum-body').innerHTML = total;
        // END CALCULATION
    }

    function MaidOrder(type, id) {
        if (type == "clean_type") {
            //document.getElementById(type + '_header_main').innerHTML = document.getElementById(str_type).innerHTML;
            var x_opt = document.getElementById('clean_type').selectedIndex;
            id = document.getElementsByTagName("option")[x_opt].value;
            console.log("SELECTED " + document.getElementsByTagName("option")[x_opt].value);
            if (type == "clean_type" && (id == 2 || id == 3)) {
                console.log("add " + type);
                document.getElementById("extras_1").classList.add('active');
                document.getElementById("extras_2").classList.add('active');
                document.getElementById("extras_3").classList.add('active');
                document.getElementById("extras_var_1").value = 1;
                document.getElementById("extras_var_2").value = 1;
                document.getElementById("extras_var_3").value = 1;
                //document.getElementById("maid_frequency").style.display = 'none';
                //document.getElementById("frequency_1").classList.add('active');
                //document.getElementById("frequency_3").classList.remove('active');
                //document.getElementById("frequency_2").classList.remove('active');
                //document.getElementById("frequency_4").classList.remove('active');
                document.getElementById("frequency").value = 1;
            } else if (type == "clean_type") {
                //console.log("remove " + type);
                document.getElementById("extras_1").classList.remove('active');
                document.getElementById("extras_2").classList.remove('active');
                document.getElementById("extras_3").classList.remove('active');
                document.getElementById("extras_var_1").value = 0;
                document.getElementById("extras_var_2").value = 0;
                document.getElementById("extras_var_3").value = 0;
                //document.getElementById("maid_frequency").style.display = 'block';
                //document.getElementById("frequency_3").classList.add('active');
                //document.getElementById("frequency_1").classList.remove('active');
                //document.getElementById("frequency_2").classList.remove('active');
                //document.getElementById("frequency_4").classList.remove('active');
                //document.getElementById("frequency").value = 3;
            }
        }

        var str_type = type + "_" + id;
        if (type == "extras") {
            var clean_type = parseInt(document.getElementById("clean_type").value);
            if (document.getElementById(str_type).classList.contains('active') && (clean_type != 3 && clean_type != 4)) {
                console.log("remove " + clean_type);
                document.getElementById(str_type).classList.remove('active');
                var tmp_var = type + "_var_" + id;
                document.getElementById(tmp_var).value = 0;
            } else {
                document.getElementById(str_type).classList.add('active');
                var tmp_var = type + "_var_" + id;
                document.getElementById(tmp_var).value = 1;
            }
        }
        updateMaidTotal();
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
        updateMaidTotal();
    }


    registerMaid = new Page('registerMaid', function (name) {
        dataLayer.push({
            'event': 'app-step-3'
        });
        EventToFire('app_step_3');
        //console.log("app-step-3");
        console.log(name);
        var self = this; self.render({ 'Settings': settings, 'User': getUserData() }, function () {
            //detergent
            $('.register-maid-form-first-step [name="bedrooms"]').change(styledSelector);
            styledSelector.call($('.register-maid-form-first-step [name="bedrooms"]')[0]);
            //bedrooms
            $('.register-maid-form-first-step [name="bathrooms"]').change(styledSelector);
            styledSelector.call($('.register-maid-form-first-step [name="bathrooms"]')[0]);
            //bathrooms
            $('.register-maid-form-first-step [name="clean_type"]').change(function () {
                MaidOrder('clean_type', 0);
                styledSelector;
            });
            //cleaning type
            $('.register-maid-form-first-step [name="frequency"]').change(styledSelector);
            styledSelector.call($('.register-maid-form-first-step [name="frequency"]')[0]);
            //frequency

            $('#extras_1').click(function () {
                MaidOrder('extras', 1);
            });
            //inside fridge
            $('#extras_2').click(function () {
                MaidOrder('extras', 2);
            });
            //inside oven
            $('#extras_3').click(function () {
                MaidOrder('extras', 3);
            });
            //inside cabinets
            $('.tips_select').change(function () {
                var value = parseInt($(this).val());
                console.log(value);
                $('.chois-number-input-real-value').val(value);
                updateMaidTotal();
            })
            // $('.chois-number_left-side .minus').click(function () {
            //     var value = parseInt($('.chois-number-input-real-value').val());
            //     if ((value - 1) >= 0) {
            //         $('.chois-number-input-real-value').val(value - 1);
            //     }
            //     $('.chois-number-input-value').html($('.chois-number-input-real-value').val());
            //     updateMaidTotal();
            // });
            // $('.chois-number_right-side .plus').click(function () {
            //     $('.chois-number-input-real-value').val(parseInt($('.chois-number-input-real-value').val()) + 1);
            //     $('.chois-number-input-value').html($('.chois-number-input-real-value').val());
            //     updateMaidTotal();
            // });

            $('button.second-step').click(function () {
                try {
                    globalData = {};
                    console.log(globalData);
                    var cache = getFormData();

                    globalData['total'] = $('.sum-body').html();

                    globalData['data'] = cache;
                    globalData['textData'] = getDataText(cache);
                    globalData['title'] = 'HOME CLEANING';
                    globalData['goBack'] = 'registerMaid';
                    $('.loading-block').show();
                    window.location.hash = "#/registerTimePage";
                } catch (e) {
                    console.error(e);
                }

            });
            //focus fixed
            if (!globalData['event_native_keyboardshow_exist']) {

                globalData['event_native_keyboardshow_exist'] = true;

                window.addEventListener("native.keyboardshow", function (e) {
                    $('.onFocusHide').hide();
                }, false);
                window.addEventListener("native.keyboardhide", function (e) {
                    $('.onFocusHide').show();
                }, false);
            }

        });
    });
})();
