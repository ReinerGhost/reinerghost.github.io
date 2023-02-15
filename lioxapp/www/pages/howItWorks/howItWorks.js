(function () {
    howItWorks = new Page('howItWorks', function (name) {
        //dataLayer.push({
        //'event': 'app-step-0'
        //});
        console.log("app-step-0");
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
                        // // Clean lead_uid cookie
                        // document.cookie="lead_uid=0;max-age=0;path=/";
                        // OrderUid = '';
                        // getOrderUid();
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
