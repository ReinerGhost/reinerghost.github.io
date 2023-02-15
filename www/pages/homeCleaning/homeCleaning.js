(function () {
    var defaultPrice = 0, Price = 0, PriceData = { 'apt_size': { 'Studio': 60, '1BR': 85, '2BR': 110, '3BR': 135 }, 'supplies': { 'YES':10, 'NONE':0 } };
    function getFormData() {
        var els = document.querySelectorAll('form label.form-row'), i = 0, cache = {}, formData = [];
        while (i < els.length) {
            cache = {};
            cache['text'] = els[i].querySelector('.form-row-name').innerHTML.replace(/\s+/, '');
            cache['name'] = els[i].querySelector('select,input,textarea').getAttribute('name');
            cache['value'] = $(els[i].querySelector('select,input,textarea')).val();
            formData.push(cache);
            i++;
        }
        return formData;
    }
    function getDataText(FormDataArray) {
        var data = [], cacheData = {}, additional = $('.home-cleaning-form [name="additional"]').val(); for (var i in FormDataArray) cacheData[FormDataArray[i]['name']] = FormDataArray[i];

        data.push({
            'text': cacheData['apt_size']['value'],
            'value': '$'+PriceData['apt_size'][cacheData['apt_size']['value']]
        });
        data.push({
            'text': cacheData['supplies']['text'],
            'value': '$' + PriceData['supplies'][cacheData['supplies']['value']]
        });
        if (additional != null && typeof additional == 'object' && additional.length > 0) {
            for (var i in additional) {
                data.push({
                    'text': additional[i],
                    'value': '$15'
                });
            }
        }
        else if (typeof additional == 'string' && additional.length > 0) {
            data.push({
                'text': additional,
                'value': '$15'
            });
        }

        return data;
    }
    function summationPrice() {
        var additional = $('.home-cleaning-form [name="additional"]').val();
        Price = 0; Price = parseInt(Price) + parseInt(defaultPrice) + parseInt($('.chois-number-input-real-value').val());
        Price = Price + PriceData['apt_size'][$('.home-cleaning-form [name="apt_size"]').val()];
        Price = Price + PriceData['supplies'][$('.home-cleaning-form [name="supplies"]').val()];

        if (additional != null && typeof additional == 'object' && additional.length > 0) Price = Price + (additional.length * 15);
        else if (typeof additional == 'string' && additional.length > 0) Price = Price + 15;

        $('.sum-body').html(Price);
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
                            text += ', ' + value[d]['text'];
                        }
                    }
                }
            }
        } else {
            text = $this.val();
        }
        text = (text != null && text.indexOf(', ') == 0 ? text.substr(2) : text);
        $this.parents('.selected-items-body').find('.selected-items .selected-items-text').html(text);
        if (text != '' && text != 'NONE') $this.parents('.selected-items-body').find('.selected-items .selected-items-text').addClass('selected');
        else $this.parents('.selected-items-body').find('.selected-items .selected-items-text').removeClass('selected');
        summationPrice();
    }

    homeCleaning = new Page('homeCleaning', function (name) {
        // console.log(name);
        var self = this; self.render({}, function () {
            //apt_size
            $('.home-cleaning-form [name="apt_size"]').change(styledSelector);
            styledSelector.call($('.home-cleaning-form  [name="apt_size"]')[0]);
            //supplies
            $('.home-cleaning-form [name="supplies"]').change(styledSelector);
            styledSelector.call($('.home-cleaning-form [name="supplies"]')[0]);
            //additional
            $('.home-cleaning-form [name="additional"]').change(styledSelector);
            styledSelector.call($('.home-cleaning-form [name="additional"]')[0]);

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
            $('img.second-step').click(function () {
                var cache = getFormData(); globalData['total'] = $('.sum-body').html();
                globalData['data'] = cache; globalData['textData'] = getDataText(cache);  globalData['title'] = 'HOME CLEANING'; globalData['goBack'] = 'homeCleaning';
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
