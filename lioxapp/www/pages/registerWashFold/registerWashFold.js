(function () {
    var defaultPrice = 30, Price = 0;


    function getFormData() {
        let formDataTmp = new FormData(document.querySelector('form.register-wash-fold-form-first-step'));
/*        console.log(Array.from(formDataTmp));
        var els = document.querySelectorAll('form label.form-row'), i = 0, cache = {}, formData = [];
        while (i < els.length) {
            cache = {};
            cache['text'] = els[i].querySelector('.form-row-name').innerHTML.replace(/\s+/, '');
            console.log(els[i].querySelector('select,input,textarea'));
            if (typeof els[i].querySelector('select,input,textarea') != 'undefined' && els[i].querySelector('select,input,textarea') != null)
                cache['name'] = els[i].querySelector('select,input,textarea').getAttribute('name');
            cache['value'] = els[i].querySelector('select,input,textarea').value;
            formData.push(cache);
            i++;
        }
        console.log(formData);*/
        return Array.from(formDataTmp);
    }

    function summationPrice() {
        Price = 0; Price = parseInt(Price) + parseInt(defaultPrice) + parseInt($('.chois-number-input-real-value').val());
        if ($('.register-wash-fold-form-first-step [name="bleach"]').val() == 'YES') Price = Price + parseInt(settings.wash_bleach_whites_price);
        if ($('.register-wash-fold-form-first-step [name="extra_bag"]').val() == 'YES') Price = Price + parseInt(settings.wash_laundry_bag_price);
        $('.sum-body').html(Price);
    }

    function getDataText(FormDataArray) {

        var data = [], cacheData = {};// for (var i in FormDataArray) cacheData[FormDataArray[i]['name']] = FormDataArray[i];

        FormDataArray.forEach(function(value){
            if (value[1] != 'NONE') {
                let label = value[0];
                if (value[0] === 'detergent') label = 'Detergent';
                if (value[0] === 'softener') label = 'Softener';
                if (value[0] === 'bleach') label = 'Bleach';
                if (value[0] === 'extra_bag') label = 'Extra bag';
                if (value[0] === 'tips') label = 'Tips';

                data.push({
                    'text': label,
                    'value': value[1]
                });
            }
        });

/*        data.push({
            'text': cacheData['detergent']['text'],
            'value': cacheData['detergent']['value']
        });
        if (cacheData['softener']['value'] != 'NONE') data.push({
            'text': cacheData['softener']['text'],
            'value': cacheData['softener']['value']
        });
        if (cacheData['bleach']['value'] != 'NONE') data.push({
            'text': cacheData['bleach']['text'],
            'value': '$2'
        });
        if (cacheData['extra_bag']['value'] != 'NONE') data.push({
            'text': cacheData['extra_bag']['text'],
            'value': '$5'
        });*/
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
        summationPrice();
    }

    registerWashFold = new Page('registerWashFold', function (name) {
        dataLayer.push({
        'event': 'app-step-3'
        });
        EventToFire('app_step_3');
        //console.log("app-step-3");
        // console.log(name);
        var self = this; self.render({ 'Settings': settings, 'User': getUserData() }, function () {
            //detergent
            $('.register-wash-fold-form-first-step [name="detergent"]').change(styledSelector);
            styledSelector.call($('.register-wash-fold-form-first-step [name="detergent"]')[0]);
            //softener
            $('.register-wash-fold-form-first-step [name="softener"]').change(styledSelector);
            styledSelector.call($('.register-wash-fold-form-first-step [name="softener"]')[0]);
            //bleach
            $('.register-wash-fold-form-first-step [name="bleach"]').change(styledSelector);
            styledSelector.call($('.register-wash-fold-form-first-step [name="bleach"]')[0]);
            //extra bag
            $('.register-wash-fold-form-first-step [name="extra_bag"]').change(styledSelector);
            styledSelector.call($('.register-wash-fold-form-first-step [name="extra_bag"]')[0]);
            //tips numbers
            $('.chois-number_left-side .minus').click(function () {
                var value = parseInt($('.chois-number-input-real-value').val());
                if ((value - 1) >= 0) {
                    $('.chois-number-input-real-value').val(value - 1);
                }
                $('.chois-number-input-value').html($('.chois-number-input-real-value').val());
                summationPrice();
            });
            $('.chois-number_right-side .plus').click(function () {
                $('.chois-number-input-real-value').val(parseInt($('.chois-number-input-real-value').val()) + 1);
                $('.chois-number-input-value').html($('.chois-number-input-real-value').val());
                summationPrice();
            });
            $('button.second-step').click(function () {
                try {
                    globalData = {};
                    // console.log(globalData);
                    var cache = getFormData(); globalData['total'] = $('.sum-body').html();
                    globalData['data'] = cache; globalData['textData'] = getDataText(cache); globalData['title'] = 'WASH &amp; FOLD'; globalData['goBack'] = 'registerWashFold';
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
