(function () {
    var defaultPrice = 0, Price = 0;
    function getFormData() {
        var els = document.querySelectorAll('form label.form-row'), i = 0, cache = {}, formData = [];
        while (i < els.length) {
            cache = {};
            cache['text'] = els[i].querySelector('.form-row-name').innerHTML.replace(/\s+/, '');
            if (typeof els[i].querySelector('select,input,textarea') != 'undefined' && els[i].querySelector('select,input,textarea') != null)
                cache['name'] = els[i].querySelector('select,input,textarea').getAttribute('name');
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

    registerDryCleaning = new Page('registerDryCleaning', function (name) {
        dataLayer.push({
            'event': 'app-step-3'
        });
        EventToFire('app_step_3');
        //console.log("app-step-3");
        console.log(name);
        // var Prices = {}; var userData = getUserData();
        // if (typeof userData['price_sweater'] != 'undefined') Prices['price_sweater'] = userData['price_sweater'];
        // if (typeof userData['price_suit'] != 'undefined') Prices['price_suit'] = userData['price_suit'];
        // if (typeof userData['price_skirt'] != 'undefined') Prices['price_skirt'] = userData['price_skirt'];
        // if (typeof userData['price_shirt'] != 'undefined') Prices['price_shirt'] = userData['price_shirt'];
        // if (typeof userData['price_pants'] != 'undefined') Prices['price_pants'] = userData['price_pants'];
        // if (typeof userData['price_lshirt'] != 'undefined') Prices['price_lshirt'] = userData['price_lshirt'];
        // if (typeof userData['price_load'] != 'undefined') Prices['price_load'] = userData['price_load'];
        // if (typeof userData['price_lb'] != 'undefined') Prices['price_lb'] = userData['price_lb'];
        // if (typeof userData['price_jacket'] != 'undefined') Prices['price_jacket'] = userData['price_jacket'];
        // if (typeof userData['price_dress'] != 'undefined') Prices['price_dress'] = userData['price_dress'];
        // if (typeof userData['price_coat'] != 'undefined') Prices['price_coat'] = userData['price_coat'];
        var Prices = {
            price_coat: (settings['dryclean_regular_coat_price'] ? settings['dryclean_regular_coat_price'] : "30"),
            price_dress: (settings['dryclean_dress_price'] ? settings['dryclean_dress_price'] : "20"),
            price_jacket: (settings['dryclean_blaser_suit_jacket_price'] ? settings['dryclean_blaser_suit_jacket_price'] : "11"),
            price_lb: (settings['wash_lbs_price'] ? settings['wash_lbs_price'] : "1.45"),
            price_load: "25",
            price_lshirt: (settings['dryclean_launder_shirt_price'] ? settings['dryclean_launder_shirt_price'] : "9"),
            price_pants: (settings['dryclean_pants_price'] ? settings['dryclean_pants_price'] : "9"),
            price_shirt: (settings['dryclean_shirt_price'] ? settings['dryclean_shirt_price'] : "6"),
            price_skirt: (settings['dryclean_shorts_skirt_price'] ? settings['dryclean_shorts_skirt_price'] : "6"),
            price_suit: (settings['dryclean_jumpsuit_price'] ? settings['dryclean_jumpsuit_price'] : "8"),
            price_sweater: (settings['dryclean_sweater_blouse_price'] ? settings['dryclean_sweater_blouse_price'] : "8")
        }
        var self = this; self.render({'Settings' : settings, 'Prices': Prices, 'User': getUserData() }, function () {

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
                    if ((parseInt($('.sum-body').html()) - parseInt($('.tips-row .chois-number-input-real-value').val())) >= 0) { //Changed to 0 from 30 min order
                        globalData = {};
                        var cache = getFormData(); globalData['total'] = $('.sum-body').html();
                        globalData['data'] = cache; globalData['title'] = 'DRY CLEANING'; globalData['goBack'] = 'registerDryCleaning';
                        $('.loading-block').show();
                        window.location.hash = "#/registerTimePage";
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
