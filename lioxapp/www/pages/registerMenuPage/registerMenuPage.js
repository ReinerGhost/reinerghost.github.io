(function () {
    registerMenuPage = new Page('registerMenuPage', function (name) {
        dataLayer.push({
            'event': 'app-step-2'
        });
        EventToFire('app_step_2');
        //console.log("app-step-2");
        //Bundle bundle = new Bundle();
        //bundle.putString(FirebaseAnalytics.Param.METHOD, method);
        //mFirebaseAnalytics.logEvent(FirebaseAnalytics.Event.FIRE_STEP_2, bundle);
        var self = this; self.render({}, function () {
            $('.logout').click(function () {
                $.ajax({
                    type: "POST",
                    url: helper.app.HomeSite + '/mobile-home',
                    data: { 'username': '', 'password': '', 'service': 'logout' },
                    success: function (r, b, c) {
                        // console.log(r, b, c);
                        localStorage.removeItem('userData');
                        getOrderUid();
                        window.location.hash = "/login";
                    },
                    error: function (v) {
                        // console.log(v);
                        if (window.plugins) {
                            window.plugins.toast.showShortBottom('Error. Problems with the network connection');
                        }
                    },
                    timeout: 5000
                });
            });

            $('.help-question').show();
            $('.help-question-login').hide();

        });
    });

})();
