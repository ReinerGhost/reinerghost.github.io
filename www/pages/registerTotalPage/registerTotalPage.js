(function () {
    var months = { 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 },

        detergent = {},
        softener = {},

        //apartment = { 'Studio': 1, '1BR': 2, '2BR': 3, '3BR': 4 },
        posted = false, userData = {};

    try {
        registerTotalPage = new Page('registerTotalPage', function () {

            let dataAppStep6 = {
                'event': 'app-step-6',
            };
            if (getCookie('lead_source') != '' && getCookie('lead_source') != null) {
                dataAppStep6.user_source_e = getCookie('lead_source');
            }
            dataLayer.push(dataAppStep6)
            console.log(dataAppStep6.event, dataAppStep6);
            EventToFire('app_step_6');

            var self = this; self.render({ 'Settings': settings, 'User': userData, data: globalData['data'], textData: globalData['textData'], data_time_info: globalData['data_time_info'], total: globalData['total'], 'goBack': globalData['goBack'] }, function () {
                console.log('step-end - step - render 1');
                $('.step-end').click(submit);
                posted = false;
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
    } catch (e) {
        console.error(e);
    }

    function submit() {
        registerUser().then( function (registerRes) {

            // console.log('globalData', globalData);

            reloginUser().then( function () {

                if (globalData['goBack'] == 'registerDryCleaning') submitDryCleaning();
                else if (globalData['goBack'] == 'registerWashFold') submitWashFold();
                else if (globalData['goBack'] == 'registerMaid') submitMaid();

                $.post('/lead-after-registration', { 'uid': OrderUid, 'user_id': userData['user_id'], 'source': 'lioxapp', 'login': true }, function (response) {
                    console.log('lead: set logged_at after login');
                });

                // setTimeout(function() {
                //
                //     // Clean lead_uid cookie
                //     document.cookie="lead_uid=0;max-age=0;path=/";
                //     OrderUid = '';
                //     getOrderUid();
                //
                // }, 3000);

            }).catch( function (e) {
                $('.error-log').html(e);
                upViewPort();
            });
        }).catch( function (registerErr) {
            $('.error-log').html(registerErr);
            upViewPort();
        })

    }
    function inArray(val,array){
        for (var i in array){
            if (val == array[i]) return true;
        } return false;
    }
    function postData(url, data) {
        if (posted == false){
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function (v) {
                    // var data = JSON.parse(v);
                    var data = v;
                    posted = true;
                    if (data.success != 'false') {
                        globalData['endData'] = {
                            'success': 'true',
                            // 'text': '<h2>Congratulations</h2>Another laundry day done easy!'
                            'text': '<h2>Thanks, ' + getUserData()['firstname'] +'</h2>Your order has been received<br />and is being processed'
                        };
                        localStorage.setItem('lastOrder', JSON.stringify(globalData));
                        window.location.hash = '/registerOrderEndPage';
                    } else {
                        globalData['endData'] = {
                            'success': 'false',
                            'text': '<h2>PAYMENT FAILED</h2><br />Please check your card on file<br />Your bank may have blocked your payment'
                        };
                        window.location.hash = '/registerOrderEndPage';
                    }
                },
                error: function (v) {
                    if (window.plugins) {
                        window.plugins.toast.showShortBottom('Error. Problems with the network connection');
                    }
                },
                timeout: 5000
            });
        }

    }
    function submitWashFold() {
        var data = { total: globalData['total'] }, cacheDateTime = globalData['data_time_info'],
            userData = {}, userDataCache = JSON.parse(localStorage.getItem('userData')), dayStart, dayEnd;
        for (var i in globalData['data']) data[globalData['data'][i][0]] = globalData['data'][i][1];
        for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];

        data['timestart'] = cacheDateTime['pickup'];
        data['timeend'] = cacheDateTime['dropoff'];
        data['instructions'] = cacheDateTime['instruction'];

        data['bag_vl'] = (data['extra_bag'] == 'NONE' ? 0 : 1);
        data['clorox_vl'] = (data['bleach'] == 'NONE' ? 0 : 1);

        var settings_wash_and_fold_supplies_detergent_1 = settings.wash_and_fold_supplies_detergent_1;
        detergent[settings.wash_and_fold_supplies_detergent_1] = 0
        var settings_wash_and_fold_supplies_detergent_2 = settings.wash_and_fold_supplies_detergent_2;
        detergent[settings.wash_and_fold_supplies_detergent_2] = 1
        var settings_wash_and_fold_supplies_detergent_3 = settings.wash_and_fold_supplies_detergent_3;
        detergent[settings.wash_and_fold_supplies_detergent_3] = 2
        var settings_wash_and_fold_supplies_detergent_4 = settings.wash_and_fold_supplies_detergent_4;
        detergent[settings.wash_and_fold_supplies_detergent_4] = 3

        var settings_wash_and_fold_supplies_softener_1 = settings.wash_and_fold_supplies_softener_1;
        softener[settings.wash_and_fold_supplies_softener_1] = 1;
        var settings_wash_and_fold_supplies_softener_2 = settings.wash_and_fold_supplies_softener_2;
        softener[settings.wash_and_fold_supplies_softener_2] = 2;
        var settings_wash_and_fold_supplies_softener_3 = settings.wash_and_fold_supplies_softener_3;
        softener[settings.wash_and_fold_supplies_softener_3] = 3;
        var settings_wash_and_fold_supplies_softener_4 = settings.wash_and_fold_supplies_softener_4;
        softener[settings.wash_and_fold_supplies_softener_4] = 4;

        // console.log('detergent');
        // console.log(detergent);

        // console.log('softener');
        // console.log(softener);

        // console.log('before');
        // console.log(data);

        data['detergent'] = detergent[data['detergent']];

        data['softener'] = softener[data['softener']];

        // console.log('after');
        // console.log(data);

        data['discount'] = '10';
        data['user_id'] = userData['user_id'];

        postData(helper.app.HomeSite + '/mobile-order-total', data);

    }
    function submitDryCleaning() {
        var data = { total: globalData['total'] }, cacheDateTime = globalData['data_time_info'], userData = {}, userDataCache = JSON.parse(localStorage.getItem('userData')), dayStart, dayEnd;
        for (var i in globalData['data']) data[globalData['data'][i]['name']] = globalData['data'][i]['value'];
        for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];

        data['timestart'] = cacheDateTime['pickup'];
        data['timeend'] = cacheDateTime['dropoff'];
        data['instructions'] = cacheDateTime['instruction'];
        data['discount'] = '10';
        data['user_id'] = userData['user_id'];

        postData(helper.app.HomeSite + '/mobile-order-total-dry-cleaning', data);
    }

    function submitMaid() {
        var data = { total: globalData['total'] }, cacheDateTime = globalData['data_time_info'], userData = {}, userDataCache = JSON.parse(localStorage.getItem('userData')), dayStart, dayEnd;
        for (var i in globalData['data']) data[globalData['data'][i]['name']] = globalData['data'][i]['value'];
        for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];

        data['timestart'] = cacheDateTime['pickup'];
        data['instructions'] = cacheDateTime['instruction'];

        data['bedrooms'] = data['bedrooms'];
        data['bathrooms'] = data['bathrooms'];
        data['clean_type'] = data['clean_type'];
        data['frequency'] = data['frequency'];
        data['extras_1'] = data['extras_1'];
        data['extras_2'] = data['extras_2'];
        data['extras_3'] = data['extras_3'];

        data['discount'] = '40';
        data['store_credit'] = '40';
        data['user_id'] = userData['user_id'];

        postData(helper.app.HomeSite + '/mobile-order-total-maid', data);

    }

    function registerUser() {
        return new Promise(function (resolve, reject) {
            const Data = globalData['userData'];
            let uid_check = 0;
            for (let i = 0; i < Data.length; i++) {
                if (Data[i].name == 'uid') {
                    uid_check = 1;
                }
            }
            if (!uid_check) {
                Data.push( {name: 'uid', value: OrderUid });
            }

            $.ajax({
                type: 'post',
                url: helper.app.HomeSite + '/new-registration-silent',
                data: Data,
                dataType: 'text',
                success: function (r) {
                    $('.loading-block').hide();
                    if(r != 'good'){
                        reject(r);
                        return;
                    }
                    // console.log('result', r);
                    resolve(globalData['userData']);
                },
                error: function (v) {
                    reject(v);
                },
            });
        })
    }

    function reloginUser() {
        //user logout
        return new Promise(function (FSuccess, FError) {
                    //user login
            $.ajax({
                type: "POST",
                url: helper.app.HomeSite + '/mobile-home',
                dataType: 'json',
                data: { 'username': globalData['userData'][0]['value'], 'password': globalData['userData'][1]['value'], 'service': 'login' },
                success: function (r, b, c) {
                    // console.log('result relogin', r);
                    var data = r;
                    if (typeof data.error != 'undefined') {
                        FError(data.error);
                    } else if (typeof data.data == 'object') {

                        if ($('.register-profile form [name="email"]').val() != undefined && $('.register-profile form [name="password"]').val() != undefined) {
                            localStorage.setItem('userName', $('.register-profile form [name="email"]').val());
                            localStorage.setItem('userPass', $('.register-profile form [name="password"]').val());
                        }

                        console.log('reloginUser() - success - ', data.data);

                        localStorage.setItem('userData', JSON.stringify(data.data));

                        $('.loading-block').hide();
                        FSuccess();
                    } else {
                        //console.log(typeof data.data == 'object');
                        FError('Undefined error');
                    }
                },
                error: function (v) {
                    FError('Undefined error');
                }
            });

        });
    }

})();
