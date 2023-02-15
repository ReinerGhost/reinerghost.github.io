(function () {
    var defaultPrice = 0, Price = 0;
    function getFormData() {
        var els = document.querySelectorAll('form label.form-row'), i = 0, cache = {}, formData = [];
        while (i < els.length) {
            cache = {};
            cache['text'] = els[i].querySelector('.form-row-name').innerHTML.replace(/\s+/, '');
            if (typeof els[i].querySelector('select,input,textarea') != 'undefined' && els[i].querySelector('select,input,textarea') != null)
                cache['name'] = els[i].querySelector('select,input,textarea').getAttribute('name');
            // console.log(cache['name']);
            cache['value'] = els[i].querySelector('select,input,textarea').value;
            formData.push(cache);
            i++;
        }
        return formData;
    }
    function summationPrice() {
        Price = 0; Price = parseInt(Price) + parseInt($('.tips-row .chois-number-input-real-value').val()), els = document.querySelectorAll('.form-row'), i = 0;
        while (i < els.length) {
            if (els[i].querySelector('.label-sum') != null) Price = parseInt(Price) + (parseInt(els[i].querySelector('input[type="hidden"]').value) * parseInt(els[i].querySelector('.label-sum').innerHTML.replace("$","")))
            i++;
        }
         var min_pr = 30 + parseInt(document.getElementsByClassName('chois-number-input-value')[9].innerHTML);
        $('.sub-sum-body').html(min_pr);
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

    dryCleaning = new Page('dryCleaning', function (name) {

        dataLayer.push({
            'event': 'user-app-step-3'
        });
        EventToFire('user_app_step_3');

        // console.log(name);

        var Prices = {}; var userData = getUserData();
        if (typeof userData['price_sweater'] != 'undefined') Prices['price_sweater'] = userData['price_sweater'];
        if (typeof userData['price_suit'] != 'undefined') Prices['price_suit'] = userData['price_suit'];
        if (typeof userData['price_skirt'] != 'undefined') Prices['price_skirt'] = userData['price_skirt'];
        if (typeof userData['price_shirt'] != 'undefined') Prices['price_shirt'] = userData['price_shirt'];
        if (typeof userData['price_pants'] != 'undefined') Prices['price_pants'] = userData['price_pants'];
        if (typeof userData['price_lshirt'] != 'undefined') Prices['price_lshirt'] = userData['price_lshirt'];
        if (typeof userData['price_load'] != 'undefined') Prices['price_load'] = userData['price_load'];
        if (typeof userData['price_lb'] != 'undefined') Prices['price_lb'] = userData['price_lb'];
        if (typeof userData['price_jacket'] != 'undefined') Prices['price_jacket'] = userData['price_jacket'];
        if (typeof userData['price_dress'] != 'undefined') Prices['price_dress'] = userData['price_dress'];
        if (typeof userData['price_coat'] != 'undefined') Prices['price_coat'] = userData['price_coat'];
        if(typeof userData['user_id'] != 'undefined'){
            dataLayer.push({
				'user_id': userData['user_id']
            });
        }
        // console.log('prices', Prices);
        var self = this; self.render({ 'Settings' : settings, 'Prices': Prices, 'User': getUserData() }, function () {

            //rows
            $('.chois-number_left-side .minus').click(function () {
                var $parent = $(this).parents('.form-row'); var $input = $parent.find('input[type="hidden"]');
                var value = parseInt($input.val());
                if ((value - 1) >= 0) {
                    $input.val(value - 1);
                }
                if ($input.val() > 0) {
                    $parent.addClass('using');
                } else {
                    $parent.removeClass('using');
                }
                $parent.find('.chois-number-input-value').html($input.val());
                summationPrice();
            });
            $('.chois-number_right-side .plus').click(function () {
                var $parent = $(this).parents('.form-row'); var $input = $parent.find('input[type="hidden"]');
                $input.val(parseInt($input.val()) + 1);
                if ($input.val() > 0) {
                    $parent.addClass('using');
                } else {
                    $parent.removeClass('using');
                }
                $parent.find('.chois-number-input-value').html($input.val());
                summationPrice();
            });

            $('button.second-step').click(function () {
                try {
                    // console.log(parseInt($('.sum-body').html()) - parseInt($('.tips-row .chois-number-input-real-value').val()));
                    if ((parseInt($('.sum-body').html()) - parseInt($('.tips-row .chois-number-input-real-value').val())) >= 0) { //>= changed 30
                        globalData = {};
                        var cache = getFormData(); globalData['total'] = $('.sum-body').html();
                        globalData['data'] = cache; globalData['title'] = 'DRY CLEANING'; globalData['goBack'] = 'dryCleaning';
                        $('.loading-block').show();
                        window.location.hash = "#/timePage";
                    } else {
                        if (window.plugins) {
                            var minimum_order_price = 30;
                            if (settings['minimum_order_price']) {
                                minimum_order_price = settings['minimum_order_price'];
                            }
                            window.plugins.toast.showShortBottom('Dry cleaning orders for pickup minimum $' + minimum_order_price);
                        }
                        return false;
                    }
                } catch (e) {
                    console.log(e);
                }
                return false;
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
