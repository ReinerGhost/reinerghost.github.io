(function () {
    var months = { 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 },
        detergent = { 'TIDE': 0, 'ARM & HAMMER': 1, 'SEVENTH GENERATION': 2 }, softener = { 'NONE': 0, 'DOWNY': 1, 'BOUNCE': 2, 'DOWNY FREE SENSITIVE': 3 },
        apartment = { 'Studio': 1, '1BR': 2, '2BR': 3, '3BR': 4 },
        posted = false;
    totalPage = new Page('totalPage', function () {
        var data_time_info_raw = globalData['data_time_info'];
        if (data_time_info_raw['pickup-day'] == data_time_info_raw['dropoff-day']) globalData['total'] = parseInt(globalData['total']) + 5;
        var self = this; self.render({ 'User': getUserData(), data: globalData['data'], textData: globalData['textData'], data_time_info: globalData['data_time_info'], total: globalData['total'], 'goBack': globalData['goBack'] }, function () {

            console.log('step-end - step - render 2');

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
    function submit() {
        if (globalData['goBack'] == 'dryCleaning') submitDryCleaning();
        else if (globalData['goBack'] == 'washFold') submitWashFold();
        else if (globalData['goBack'] == 'homeCleaning') submitHomeCleaning();
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
                            'text': 'Congratulations<br /> Another laundry day done easy!'
                        };
                        localStorage.setItem('lastOrder', JSON.stringify(globalData));
                        window.location.hash = '/endPage';
                    } else {
                        globalData['endData'] = {
                            'success': 'false',
                            'text': 'PAYMENT FAILED<br />Please check your card on file'
                        };
                        window.location.hash = '/endPage';
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
        var data = { total: globalData['total'] }, cacheDateTime = globalData['data_time_info'], userData = {}, userDataCache = JSON.parse(localStorage.getItem('userData')), dayStart, dayEnd;
        for (var i in globalData['data']) data[globalData['data'][i]['name']] = globalData['data'][i]['value'];
        for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];

        data['example8'] = cacheDateTime['pickup'];
        data['example7'] = cacheDateTime['dropoff'];
        data['instructions'] = cacheDateTime['instruction'];

        data['bags'] = (data['extra_bag'] == 'NONE' ? 0 : 1);
        data['clorox_vl'] = (data['bleach'] == 'NONE' ? 0 : 1);
        data['detergent'] = detergent[data['detergent']];
        data['softener'] = detergent[data['softener']];

        data['user_id'] = userData['user_id'];

        postData(helper.app.HomeSite + '/mobile-order-total', data);

    }
    function submitDryCleaning() {
        var data = { total: globalData['total'] }, cacheDateTime = globalData['data_time_info'], userData = {}, userDataCache = JSON.parse(localStorage.getItem('userData')), dayStart, dayEnd;
        for (var i in globalData['data']) data[globalData['data'][i]['name']] = globalData['data'][i]['value'];
        for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];

        data['example8'] = cacheDateTime['pickup'];
        data['example7'] = cacheDateTime['dropoff'];
        data['instructions'] = cacheDateTime['instruction'];

        data['user_id'] = userData['user_id'];

        postData(helper.app.HomeSite + '/mobile-order-total-dry-cleaning', data);

    }
    function submitHomeCleaning() {
        var data = { total: globalData['total'] }, cacheDateTime = globalData['data_time_info'], userData = {}, userDataCache = JSON.parse(localStorage.getItem('userData')), dayStart, dayEnd;
        for (var i in globalData['data']) data[globalData['data'][i]['name']] = globalData['data'][i]['value'];
        for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];

        data['example8'] = cacheDateTime['pickup'];
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
})();
