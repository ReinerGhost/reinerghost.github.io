//window.history.back();
(function () {
    location.href = '#/login';
    var fields = [
        //{ 'text': 'User Name', 'name': 'username' },
        { 'text': 'Address *', 'name': 'address' },
        { 'text': 'Apartment *', 'name': 'apartment' },
        { 'text': 'Zipcode *', 'name': 'zipcode', 'placeholder':'XXXXX' },
        { 'text': 'Card Number *', 'name': 'cardnumber', 'placeholder':'XXXX-XXXX-XXXX-XXXX' },
        { 'text': 'Expiration Date *', 'name': 'expiration', 'placeholder':'mm/yy' },
        {
            'text': 'How you found us', 'name': 'source', 'type':'select', 'data': [
                { 'text': 'How you found us', 'value': '' },
                { 'text': 'Yelp', 'value': 'yelp' },
                { 'text': 'Google', 'value': 'google' },
                { 'text': 'Friends', 'value': 'friends' },
                { 'text': 'Facebook', 'value': 'facebook' },
                { 'text': 'App store', 'value': 'app store' },
                { 'text': 'other', 'value': 'other' },
            ]
        },
        { 'text': 'Referral Email', 'name': 'referral_email' }
    ];
    registerSecendStep = new Page('registerSecendStep', function (name) {


        var self = this; self.render({ 'fields': fields }, function () {
            for (var i in fields) {
                if ($(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]').length > 0) {
                    $(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]').change(styledSelector);
                    styledSelector.call($(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]')[0]);
                }
            }

            $('[name="zipcode"]').mask("99999");
            var element = $('[name="cardnumber"]')[0];
            var groupsMask = new IMask(element, {
                mask: 'C1-C-C-CL',
                groups: {
                    C1: new IMask.MaskedPattern.Group.Range([3400, 6011]),
                    C: new IMask.MaskedPattern.Group.Range([0, 9999]),
                    CL: new IMask.MaskedPattern.Group.Range([0, 9999]),
                }
            });
            var element = $('[name="expiration"]')[0];
            var dateMask = new IMask(element, {
                mask: 'dd/yy',
                groups: {
                    dd: new IMask.MaskedPattern.Group.Range([1, 31]),
                    yy: new IMask.MaskedPattern.Group.Range([18, 40]),
                }
            });

            $('.register-second-step-button').click(function () {
                var Data = $('.register-second-step-bg form').serializeArray(), userData = getUserData();
                Data.push({ 'name': 'cardtype', 'value': checkCreditCard($('[name="cardnumber"]').val().split('-').join('')) });
                Data.push({ 'name': 'email', 'value': userData.email });
                Data.push({ 'name': 'userid', 'value': userData.user_id });
                Data.push({ 'name': 'city', 'value': 'New York' });
                Data.push({ 'name': 'submitted', 'value': 1 });
                Data.push({ 'name': 'app', 'value': 1 });
                // console.log(Data);
                for (var i in Data) {
                    if (Data[i]['name'] == 'cardnumber') Data[i]['value'] = Data[i]['value'].split('-').join('');
                }
                var testCard = testCreditCard();
               // showHint(doAjax, testReferral, Data);

                function doAjax(testReferral){
                if (
                    $('[name="cardnumber"]').val().length > 0 &&
                    $('[name="apartment"]').val().length > 0 &&
                    $('[name="address"]').val().length > 0 &&
                    $('[name="zipcode"]').val().length > 0 &&
                    $('[name="expiration"]').val().length > 0 &&
                    testCard &&
                    testReferral
                ) {
                    $('.loading-block').show();
                        //user login
                        $.ajax({
                            type: "POST",
                            url: helper.app.HomeSite + '/mobile-home',
                            data: { 'username': localStorage.getItem('userName'), 'password': localStorage.getItem('userPass'), 'service': 'login' },
                            success: function (r, b, c) {
                                var data = JSON.parse(r);
                                if (typeof data.error != 'undefined') {
                                    $('.error-log').html(data.error);
                                    upViewPort();
                                    //window.plugins.toast.showShortBottom(data.error);
                                } else if (typeof data.data == 'object') {
                                    localStorage.setItem('userData', JSON.stringify(data.data));
                                    editUser(Data);
                                } else {
                                    $('.error-log').html('Undefined error');
                                }
                            },
                            error: function (v) {
                                $('.error-log').html('Error. Problems with the network connection');
                            }
                        });
                    //user data update
                } else if(!testCard) {
                    $('.error-log').html('Wrong Card Number');
                    upViewPort();
                } else if(!testReferral){
                    $('.error-log').html('Bad Referral Email or Code');
                    upViewPort();
                } else {
                    $('.error-log').html('All fields with * requered');
                    upViewPort();
                }
                    }
                showHint(function(testReferral) {doAjax(testReferral);});
                //showHint(doAjax(testReferral));
            });
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
    function styledSelector() {
        var $this = $(this); var value = [], selectedItems = $this.val(), $options = $this.find('option'), z = 0, text = '';
        if ($options.length > 0) {
            while (z < $options.length) {
                value.push({ 'text': $options.eq(z).html(), 'value': $options.eq(z).attr('value') });
                z++;
            }
            for (var d in value) {
                if (typeof selectedItems != 'object') {
                    if (value[d]['value'] == selectedItems) {
                        text = value[d]['text'];
                    }
                } else {
                    for (var i in selectedItems) {
                        if (value[d]['value'] == selectedItems[i]) {
                            text += ',' + value[d]['text'];
                        }
                    }
                }
            }
        } else {
            text = $this.val();
        }
        text = (text != null && text.indexOf(',') == 0 ? text.substr(1) : text);
        $this.parents('.selected-items-body').find('.selected-items .selected-items-text').html(text);
        if (text != '' && text != 'NONE') $this.parents('.selected-items-body').find('.selected-items .selected-items-text').addClass('selected');
        else $this.parents('.selected-items-body').find('.selected-items .selected-items-text').removeClass('selected');
    }
    function testCreditCard() {
        var resp = checkCreditCard($('[name="cardnumber"]').val().split('-').join(''));
        if (resp == "Visa" || resp == "MasterCard" || resp == "Amex" || resp == "Discover") {
            $('[name="cardnumber"]').parent().find('.error').html('');
            return resp;
        } else {
            $('[name="cardnumber"]').parent().find('.error').html('Wrong CreditCard Number');
            return false;
        }
    }

    var typingTimer;                //timer identifier
    var doneTypingInterval = 500;  //time in ms (0.5 seconds)

    //on keyup, start the countdown
    $('[name="referral_email"]').on('input',function () {
        clearTimeout(typingTimer);
        if ($('[name="referral_email"]').val()) {
            typingTimer = setTimeout(function(){showHint()}, 500);
        }
    });


    function showHint(callback) {
        var str = $('[name="referral_email"]').val();
        if (str != localStorage.getItem('userName')) {
            if (str.length == 0) {
                $('.log').html("Your referral friend's email.");
                callback(true);
            } else {
            xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var myarray = xmlhttp.responseText.split("|");
                    if (myarray[0] == "bad") {
                        $('.log').html('No matches were found');
                        callback(false);
                    } else if (myarray[0] == "good") {
                        $('.log').html(myarray[2]);
                        $('[name="store_credit"]').val(myarray[1]);
                        callback(true);
                    }
                }

            }
            xmlhttp.open("GET", helper.app.HomeSite +  "/ajaxresponder?w=" + str, true);
            xmlhttp.send();
            }
        } else {
            $('.log').html("No Cheating Please!");
            return false;
        }
    }

    function editUser(Data) {
        $.post(helper.app.HomeSite + '/app-new-sign-up-address', Data, function (r) {

            try {
                var respons = JSON.parse(r);
            } catch (e) {
                // console.log(r);
                // console.log(e);
                $('.loading-block').hide();
            }

            if (respons.error != true) {
                reloginUser();
            } else {
                if (respons.message == 'Your information is already recorded'){
                    reloginUser();
                } else {
                    $('.error-log').html(data.error);
                    upViewPort();
                    $('.loading-block').hide();
                }
            }
        });
    }

    function reloginUser() {
        //user logout
        $.ajax({
            type: "POST",
            url: helper.app.HomeSite + '/mobile-home',
            data: { 'username': '', 'password': '', 'service': 'logout' },
            success: function (r, b, c) {
                localStorage.removeItem('userData');
                getOrderUid();
                //user login
                $.ajax({
                    type: "POST",
                    url: helper.app.HomeSite + '/mobile-home',
                    data: { 'username': localStorage.getItem('userName'), 'password': localStorage.getItem('userPass'), 'service': 'login' },
                    success: function (r, b, c) {
                        // var data = JSON.parse(r);
                        var data = r;
                        if (data.success == 'false' && typeof data.error != 'undefined') {
                            $('.error-log').html(data.error);
                            upViewPort();
                        } else if (typeof data.data == 'object') {
                            localStorage.setItem('userData', JSON.stringify(data.data));
                            $('.loading-block').hide();
                            window.location.hash = "/menuPage";
                        } else {
                            // console.log(typeof data.data == 'object');
                            $('.error-log').html('Undefined error');
                        }
                    },
                    error: function (v) {
                        $('.error-log').html('Error. Problems with the network connection');
                    }
                });

            },
            error: function (v) {
                // console.log(v);
                if (window.plugins) {
                    window.plugins.toast.showShortBottom('Error. Problems with the network connection');
                }
            },
            timeout: 5000
        });
    }

})();
