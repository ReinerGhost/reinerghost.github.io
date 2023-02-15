(function () {
    var workedOf = false;
    startPage = new Page('startPage', function (name) {
        workedOf = true;
        var self = this;
        self.render({}, function () {

            Pages.on('Page_loaded', function () {
                $('.start-progress-line').css({ 'width': Pages.loadedPages / (Pages.pages.length / 100) + '%'});
            });

            let googleLogin = false;
            $.ajax({
                type: "GET",
                url: helper.app.HomeSite + '/mobile-home',
                data: {'callback': true},
                dataType: 'json',
                async: false,
                success: function (data) {
                    // console.log(data);
                    if (data['data'] && data['data']['24'] && data['data']['24']['value']) {
                        dataLayer.push({
                            'user_id': data['data']['24']['value']
                        });
                    }

                    if (typeof data.data == 'object') {
                        localStorage.setItem('userData', JSON.stringify(data.data));
                        window.location.hash = "/menuPage";
                        googleLogin = true;
                    }
                }
            });

            if (googleLogin)
                return;

            // console.log(localStorage.getItem('userName'));

            if (localStorage.getItem('userName') != null && localStorage.getItem('userName') != '' && localStorage.getItem('userPass') != null && localStorage.getItem('userData') != null) {
                $.ajax({
                    type: "POST",
                    url: helper.app.HomeSite + '/mobile-home',
                    //async:false,
                    data: { 'username': localStorage.getItem('userName'), 'password': localStorage.getItem('userPass'), 'service': 'login' },
                    success: function (r, b, c) {
                        try {
                            // var data = JSON.parse(r);
                            var data = r;
                            if (data.success == 'false' && typeof data.error != 'undefined') {
                                if (window.plugins) {
                                    window.plugins.toast.showShortBottom(data.error);
                                }
                                localStorage.removeItem('userName', '');
                                localStorage.removeItem('userPass', '');
                                localStorage.removeItem('userData', '');

                                window.location.hash = '/login';

                            } else if (typeof data.data == 'object') {

                                localStorage.setItem('userData', JSON.stringify(data.data));
                                window.location.hash = "/menuPage";

                            } else {
                                // console.log(typeof data.data == 'object');
                                if (window.plugins) {
                                    window.plugins.toast.showShortBottom('Undefined error');
                                }
                                localStorage.removeItem('userName', '');
                                localStorage.removeItem('userPass', '');
                                localStorage.removeItem('userData', '');

                                window.location.hash = '/login';
                            }
                        } catch (e) {
                            console.log(e);
                        }

                    },
                    error: function (v) {
                        if (window.plugins) {
                            window.plugins.toast.showShortBottom('Error. Problems with the network connection');
                        }
                        localStorage.removeItem('userName', '');
                        localStorage.removeItem('userPass', '');
                        localStorage.removeItem('userData', '');

                        window.location.hash = '/login';
                    },
                    timeout: 5000
                });
            } else {
                localStorage.removeItem('userName', '');
                localStorage.removeItem('userPass', '');
                localStorage.removeItem('userData', '');

                window.location.hash = '/login';
            }


        });
    });
})();

/*(function () {
    var workedOf = false;
    startPage = new Page('startPage', function (name) {
        workedOf = true;
        var self = this;
        self.render({}, function () {
            Pages.on('Page_loaded', function () {
                $('.start-progress-line').css({ 'width': Pages.loadedPages / (Pages.pages.length / 100) + '%'});
            });
            if (localStorage.getItem('userName') != null && localStorage.getItem('userPass') != null && localStorage.getItem('userData') != null) {
                $.ajax({
                    type: "POST",
                    //url: helper.app.HomeSite + '/mobile-home',
                    url: 'https://www.lioxcleaners.com/mobile-home',
                    data: { 'username': localStorage.getItem('userName'), 'password': localStorage.getItem('userPass'), 'service': 'login' },
                    async: false,
                    success: function (r, b, c) {
                        try {
                            var data = JSON.parse(r);
                            if (data.success == 'false' && typeof data.error != 'undefined') {
                                window.plugins.toast.showShortBottom(data.error);
                                window.location.hash = '/login';
                            } else if (typeof data.data == 'object') {
                                localStorage.setItem('userData', JSON.stringify(data.data));
                                window.location.hash = "/menuPage";
                            } else {
                                console.log(typeof data.data == 'object');
                                window.plugins.toast.showShortBottom('Undefined error');
                                window.location.hash = '/login';
                            }
                        } catch (e) {
                            console.log(e);
                        }

                    },
                    error: function (v) {
                        window.plugins.toast.showShortBottom('Error. Problems with the network connection');
                        window.location.hash = '/login';
                    },
                    timeout: 5000
                });
            } else {
                window.location.hash = '/login';
            }


        });
    });
})();*/
