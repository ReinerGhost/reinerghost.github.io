

(function () {
    var userLogin = function userLogin() {
        $('.loading-block').show();
        var timeOut = setTimeout(function () {
            $('.loading-block').hide();
            if (window.plugins) {
                window.plugins.toast.showShortBottom('Error. Problems with the network connection');
            }
        },6000);
        // var data = new FormData();
        // data.append('username', $('[name="email"]').val());
        // data.append('password', $('[name="password"]').val());
        // data.append('service', 'login');
        $.ajax({
            type: "POST",
            url: helper.app.HomeSite + '/mobile-home', //helper.app.HomeSite + '/mobile-home'
            data: { 'username': $('[name="email"]').val(), 'password': $('[name="password"]').val(), 'service': 'login' },
            dataType: 'json', // Choosing a JSON datatype
            success: function (r, b, c) {
                clearTimeout(timeOut);
                $('.loading-block').hide();
                console.log(r);
                // var data = JSON.parse(r);
                var data = r;

                if (data['data'] && data['data']['24'] && data['data']['24']['value']) {
                    dataLayer.push({
                        'user_id': data['data']['24']['value']
                    });
                }

                if (data.success == false && typeof data.error != 'undefined') {
                    $('.error-log').text(data.error);
                    if (data.forgot_link) {
                        $('.forgot_link').html(data.forgot_link);
                    }
                    //window.plugins.toast.showShortBottom(data.error);
                } else if (typeof data.data == 'object') {
                    localStorage.setItem('userName', $('[name="email"]').val());
                    localStorage.setItem('userPass', $('[name="password"]').val());
                    localStorage.setItem('userData', JSON.stringify(data.data));

                    let userData = {}
                    let userDataCache = JSON.parse(localStorage.getItem('userData')), dayStart, dayEnd;
                    for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];

                    $.post('/lead-clean', { 'uid': OrderUid, 'user_id': userData['user_id'], 'source': 'lioxapp', 'login': true }, function (response) {
                        console.log('delete lead after login: ', response);
                        // console.log('clean lead database after login: ', response);
                        // // Clean lead_uid cookie
                        // document.cookie="lead_uid=0;max-age=0;path=/";
                        // OrderUid = '';
                        // getOrderUid();
                        window.location.hash = "/menuPage";
                    });

                } else {
                    console.log(typeof data.data == 'object');
                    $('.error-log').text('Undefined error');
                    //window.plugins.toast.showShortBottom('Undefined error');
                }
            }
        });
        return false;
    }
    login = new Page('login', function (name) {
        console.log(name);
        var self = this;
        self.render({}, function () {
            if (localStorage.getItem('userData') != null && localStorage.getItem('userName') != '') window.location.hash = "/menuPage";
            $('.login form').submit(userLogin);
            $('.login-button').click(userLogin);
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

            $('.help-question').hide();
            $('.help-question-login').show();

        });
    });

    function EventToFire(event_name){
        console.log("Android " + event_name);
        if(typeof window.webkit !== 'undefined'){
            window.webkit.messageHandlers.jsHandler.postMessage(event_name);
        }
    }

    // let userData = {};
    // let userDataCache = JSON.parse(localStorage.getItem('userData'));
    // for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];
    // if (userData['user_id'] > 0) {
    //     EventToFire('user_app_step_1');
    // } else {
        EventToFire('app_step_1');
    // }

    // if windows resize
    window.addEventListener('resize', function(event) {
        // position: relative; width: 100%; margin-top: 20px;
        if (event.currentTarget.innerHeight < 600 ) {
            $('.login-bottom-buttons').css('position', 'relative');
            $('.login-bottom-buttons').css('width', '100%');
            $('.login-bottom-buttons').css('margin-top', '20px');
        } else {
            $('.login-bottom-buttons').css('position', '');
            $('.login-bottom-buttons').css('width', '');
            $('.login-bottom-buttons').css('margin-top', '');
        }
    }, true);

})();
