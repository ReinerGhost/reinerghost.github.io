(function () {
    var fields = [
        'address',
        'apartment',
        'bankcard',
        'cardnumber',
        'city',
        'expiration',
        'firstname',
        'lastname',
        'phone',
        'zipcode'
    ];
    userProfile = new Page('userProfile', function (name) {

        dataLayer.push({
            'event': 'user-app-step-5'
        });
        EventToFire('user_app_step_5');

        var self = this; console.log(name);
        var UserData = getUserData();
        var workedOff = false;
        $.ajax({
            url: helper.app.HomeSite + '/mobile-app-view-profile',
            data: { 'user_id': UserData['user_id'] },
            type: 'POST',
            timeout: 5000,
            success: function (r) {
                var data = JSON.parse(r); workedOff = true; renderPage.call(self, data[0]);
            },
            error: function () {
                workedOff = true; renderPage.call(self, UserData);
            }
        });
        //fix
        setTimeout(function () {
            if (workedOff == false) {
                workedOff = true; renderPage.call(self, {});
            }
        }, 5030);
    });
    function renderPage(data) {
        var self = this;
        self.render({ 'fields': fields, 'UserData': data }, function () {
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
    }
})();
