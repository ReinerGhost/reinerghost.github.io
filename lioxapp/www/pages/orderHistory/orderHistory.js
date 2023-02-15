(function () {
    orderHistory = new Page('orderHistory', function (name) {
        //dataLayer.push({
        //'event': 'app-step-0'
        //});
        console.log("app-step-0");
        //Bundle bundle = new Bundle();
        //bundle.putString(FirebaseAnalytics.Param.METHOD, method);

        let User = getUserData();

        var self = this;

        $.ajax({
            type: 'POST',
            url: "../../mobile-get-order-history-list",
            data: {
                'user_id': User.user_id
            },
            success: function (response) {

                OrderHistory = response;

                // console.log('OrderHistory: ', OrderHistory);

                self.render({'OrderHistory': OrderHistory}, function () {
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
                });
            },
            error: function(err) {
                console.error('Error get order history');
            }
        });
    });

})();
