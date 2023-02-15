(function () {

    var months = { 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 },

        detergent = {},
        softener = {},

        apartment = { 'Studio': 1, '1BR': 2, '2BR': 3, '3BR': 4 },
        posted = false;

    try {
        totalPage = new Page('totalPage', function () {

            let dataAppStep6 = {
                'event': 'user-app-step-6',
            };

            if (getCookie('lead_source') != '' && getCookie('lead_source') != null) {
                dataAppStep6.user_source_e = getCookie('lead_source');
            }

            let userData = {};
            let userDataCache = JSON.parse(localStorage.getItem('userData'));
            for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];
            if (userData['user_id'] > 0) {
                dataAppStep6.user_id_e = userData['user_id'];
            }
            console.log(dataAppStep6.event, dataAppStep6);
            dataLayer.push(dataAppStep6);

            EventToFire('user_app_step_6');

            var self = this; self.render({ 'User': getUserData(), 'Settings': settings, data: globalData['data'], textData: globalData['textData'], data_time_info: globalData['data_time_info'], total: globalData['total'], 'goBack': globalData['goBack'] }, function () {

                console.log('step-end - step - render 3');

                $('.step-end').click(submit); posted = false;
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
        if (globalData['goBack'] == 'dryCleaning') submitDryCleaning();
        else if (globalData['goBack'] == 'washFold') submitWashFold();
        else if (globalData['goBack'] == 'homeCleaning' || globalData['goBack'] == 'Maid') submitMaid();
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
                dataType: 'json', // Choosing a JSON datatype
                success: function (v) {
                    // var data = JSON.parse(v);
                    var data = v;
                    posted = true;

                    let service = "";
                    if (globalData['goBack'] == 'registerDryCleaning') service = "dryclean";
                    else if (globalData['goBack'] == 'registerWashFold') service = "wash";
                    else if (globalData['goBack'] == 'registerMaid') service = "maid";

                    if (data.success != 'false') {
                        globalData['endData'] = {
                            'success': 'true',
                            'service': service,
                            // 'text': '<h2>Congratulations</h2>Another laundry day done easy!'
                            'text': '<h2>Thanks, ' + getUserData()['firstname'] +'</h2>Your order has been received<br />and is being processed'
                        };
                        localStorage.setItem('lastOrder', JSON.stringify(globalData));
                        window.location.hash = '/endPage';
                    } else {
                        globalData['endData'] = {
                            'success': 'false',
                            'service': service,
                            'text': '<h2>OOPS IT FAILED</h2><br />Something went wrong. Please send us an email with details about this transaction.'
                        };
                        window.location.hash = '/endPage';
                    }
                },
                error: function (responseError) {
                    if (window.plugins) {
                        window.plugins.toast.showShortBottom('Error. Problems with the network connection');
                    }
                    let v = JSON.parse(responseError.responseText);
                    if ((v.status == false) && v.message)
                    {
                        $('.error-log').html(v.message);
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

        console.log('detergent');
        console.log(detergent);

        console.log('softener');
        console.log(softener);

        console.log('prev');
        console.log(data);

        data['detergent'] = detergent[data['detergent']];

        data['softener'] = softener[data['softener']];

        data['user_id'] = userData['user_id'];

        console.log('modified');
        console.log(data);

        postData(helper.app.HomeSite + '/mobile-order-total', data);
    }

    function submitDryCleaning() {
        var data = { total: globalData['total'] }, cacheDateTime = globalData['data_time_info'], userData = {}, userDataCache = JSON.parse(localStorage.getItem('userData')), dayStart, dayEnd;
        for (var i in globalData['data']) data[globalData['data'][i]['name']] = globalData['data'][i]['value'];
        for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];

        data['timestart'] = cacheDateTime['pickup'];
        data['timeend'] = cacheDateTime['dropoff'];
        data['instructions'] = cacheDateTime['instruction'];

        data['user_id'] = userData['user_id'];

        postData(helper.app.HomeSite + '/mobile-order-total-dry-cleaning', data);

    }
    function submitHomeCleaning() {
        var data = { total: globalData['total'] }, cacheDateTime = globalData['data_time_info'], userData = {}, userDataCache = JSON.parse(localStorage.getItem('userData')), dayStart, dayEnd;
        for (var i in globalData['data']) data[globalData['data'][i]['name']] = globalData['data'][i]['value'];
        for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];

        data['example8'] = cacheDateTime['pickup'];
        data['timestart'] = cacheDateTime['pickup'];
        //data['example7'] = cacheDateTime['dropoff'];
        data['instructions'] = cacheDateTime['instruction'];
        data['apartment'] = apartment[data['apt_size']];
        data['supplies'] = (data['supplies'] == 'NONE' ? 0 : 1);
        console.log(data['additional']);
        if (
            ((typeof data['additional'] != 'undefined' && data['additional'] != null) && typeof data['additional']['value'] == 'string' && data['additional']['value'] == 'Stove') ||
            ((typeof data['additional'] != 'undefined' && data['additional'] != null) && typeof data['additional']['value'] == 'object' && inArray('Stove', data['additional']['value']))
           ) {
            data['additional_1'] = 1;
        } else data['additional_1'] = 0;
        if (
            ((typeof data['additional'] != 'undefined' && data['additional'] != null) && typeof data['additional']['value'] == 'string' && data['additional']['value'] == 'Refrigerator') ||
            ((typeof data['additional'] != 'undefined' && data['additional'] != null) && typeof data['additional']['value'] == 'object' && inArray('Refrigerator', data['additional']['value']))
        ) {
            data['additional_2'] = 1;
        } else data['additional_2'] = 0;
        if (
            ((typeof data['additional'] != 'undefined' && data['additional'] != null) && typeof data['additional']['value'] == 'string' && data['additional']['value'] == 'Cabinets') ||
            ((typeof data['additional'] != 'undefined' && data['additional'] != null) && typeof data['additional']['value'] == 'object' && inArray('Cabinets', data['additional']['value']))
        ) {
            data['additional_3'] = 1;
        } else data['additional_3'] = 0;
        if (
            ((typeof data['additional'] != 'undefined' && data['additional'] != null) && typeof data['additional']['value'] == 'string' && data['additional']['value'] == 'Windows(inside only)') ||
            ((typeof data['additional'] != 'undefined' && data['additional'] != null) && typeof data['additional']['value'] == 'object' && inArray('Windows(inside only)', data['additional']['value']))
        ) {
            data['additional_4'] = 1;
        } else data['additional_4'] = 0;

        data['user_id'] = userData['user_id'];

        postData(helper.app.HomeSite + '/mobile-order-total-maid', data);

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

        data['user_id'] = userData['user_id'];

        postData(helper.app.HomeSite + '/mobile-order-total-maid', data);

    }

})();
