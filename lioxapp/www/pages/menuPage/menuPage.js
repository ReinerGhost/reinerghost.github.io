(function () {
    menuPage = new Page('menuPage', function (name) {
        var userData = getUserData();
        dataLayer.push({
            'event': 'user-app-step-2'
        });
        EventToFire('user_app_step_2');
        // console.log(userData);
        var self = this; self.render({ 'user': userData, 'Settings': settings }, function () {

            if (userData.user_id < 1) window.location.hash = "/login";

            $('.logout').click(function () {
                $.ajax({
                    type: "POST",
                    url: helper.app.HomeSite + '/mobile-home',
                    data: { 'username': '', 'password': '', 'service': 'logout' },
                    success: function (r, b, c) {
                        // console.log('menuPage', r, b, c);
                        localStorage.removeItem('userName');
                        localStorage.removeItem('userPass');
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
                        localStorage.removeItem('userName');
                        localStorage.removeItem('userPass');
                        localStorage.removeItem('userData');
                        // // Clean lead_uid cookie
                        // document.cookie="lead_uid=0;max-age=0;path=/";
                        // OrderUid = '';
                        // getOrderUid();
                    },
                    timeout: 5000
                });
            });

            $('.help-question').show();
            $('.help-question-login').hide();

        });
    });


})();
