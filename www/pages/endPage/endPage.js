(function () {
    endPage = new Page('endPage', function (name) {

        // dataLayer.push({
        //     'event': 'user-app-step-7'
        // });
        // EventToFire('user_app_step_7');

        let service = globalData['goBack'];

        let dataAppStep7 = {
            'event': 'user-app-step-7',
        };
        if (getCookie('lead_source') != '' && getCookie('lead_source') != null) {
            dataAppStep7.user_source_e = getCookie('lead_source');
        }
        let userData = {};
        let userDataCache = JSON.parse(localStorage.getItem('userData'));
        for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];
        if (userData['user_id'] > 0) {
            dataAppStep7.user_id_e = userData['user_id'];
        }
        dataLayer.push(dataAppStep7)
        console.log(dataAppStep7.event, dataAppStep7);
        EventToFire('user_app_step_7');

        var self = this; self.render({ 'text': globalData['endData']['text'], 'success': globalData['endData']['success'], 'service': service }, function () {

        });
    });
})();
