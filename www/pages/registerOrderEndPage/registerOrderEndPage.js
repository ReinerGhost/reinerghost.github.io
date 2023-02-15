(function () {
    registerOrderEndPage = new Page('registerOrderEndPage', function (name) {

        let service = globalData['goBack'];

        let dataAppStep7 = {
            'event': 'app-step-7',
        };
        if (getCookie('lead_source') != '' && getCookie('lead_source') != null) {
            dataAppStep7.user_source_e = getCookie('lead_source');
        }
        dataLayer.push(dataAppStep7)
        console.log(dataAppStep7.event, dataAppStep7);
        EventToFire('app_step_7');

        var self = this; self.render({ 'text': globalData['endData']['text'], 'success': globalData['endData']['success'], 'service': service }, function () {

        });
    });

})();
