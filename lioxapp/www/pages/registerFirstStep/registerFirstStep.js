(function () {
    var fields = [
        //{ 'text': 'User Name', 'name': 'username' },
        { 'text': 'Email', 'name': 'email', 'type':'email' },
        { 'text': 'Password <span class="show-password">Show Password<input type="checkbox" /></span>', 'name': 'password', 'type': 'password' },
        { 'text': 'First Name', 'name': 'firstname' },
        { 'text': 'Last Name', 'name': 'lastname' },
        { 'text': 'Phone', 'name': 'phone' },
    ];
    registerFirstStep = new Page('registerFirstStep', function (name) {
        var self = this; self.render({ 'fields': fields }, function () {
            for (var i in fields) {
                if ($(fields[i]['type'] + '[name="' + fields[i]['name']+'"]').length > 0) {
                    $(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]').change(styledSelector);
                    styledSelector.call($(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]')[0]);
                }
            }
            $('[name="phone"]').mask("999-999-9999");
            $('.show-password input').change(function () {
                // console.log($('.show-password input'));
                if ($('.show-password input').prop('checked')) {
                    $('[name="password"]')[0].type = 'text';
                } else {
                    $('[name="password"]')[0].type = 'password';
                }
            });

            $('.register-button').click(function () {
                var Data = $('.register-bg form').serializeArray();
                Data.push({ 'name': 'username', 'value': $('.register-bg form [name="email"]').val() });
                Data.push({ 'name': 'service', 'value': 'register' });
                Data.push({ 'name': 'signed_up', 'value': 'app' });

                var d = new Date(), strDate = '';
                if (d.getDate() > 9) strDate += d.getDate();
                else strDate += '0' + d.getDate();
                strDate += '-';
                if ((d.getMonth()+1) > 9) strDate += (d.getMonth()+1);
                else strDate += '0' + (d.getMonth()+1);
                strDate += '-' + d.getFullYear();

                Data.push({ 'name': 'freebag', 'value': strDate });

                $('.loading-block').show();

                $.post(helper.app.HomeSite + '/sign-up', Data, function (r) {
                    var rawDara = r.match(/<p class="wlpeMessageText">([^<]+)<\/p>/);
                    // console.log(rawDara);
                    if (rawDara != null) var Data = rawDara[1];
                    else var Data = [];

                    $('.loading-block').hide();

                    if (typeof Data != 'undefined' && Data.length > 0) {
                        $('.error-log').html(Data);
                        upViewPort();
                    } else {

                        (function () {
                            $.ajax({
                                type: "POST",
                                url: helper.app.HomeSite + '/mobile-home',
                                data: { 'username': $('[name="email"]').val(), 'password': $('[name="password"]').val(), 'service': 'login' },
                                success: function (r, b, c) {
                                    $('.loading-block').show();

                                    var data = JSON.parse(r);
                                    if (data.success == 'false' && typeof data.error != 'undefined') {
                                        $('.error-log').html(data.error);
                                        upViewPort();
                                        //window.plugins.toast.showShortBottom(data.error);
                                    } else if (typeof data.data == 'object') {
                                        localStorage.setItem('userName', $('[name="email"]').val());
                                        localStorage.setItem('userPass', $('[name="password"]').val());
                                        localStorage.setItem('userData', JSON.stringify(data.data));
                                        window.location.hash = "/registerSecendStep";
                                    } else {
                                        // console.log(typeof data.data == 'object');
                                        if (window.plugins) {
                                            window.plugins.toast.showShortBottom('Undefined error');
                                        }
                                    }

                                    $('.loading-block').hide();
                                },
                                error: function (v) {
                                    if (window.plugins) {
                                        window.plugins.toast.showShortBottom('Error. Problems with the network connection');
                                    }
                                }
                            });
                        })();

                    }
                });
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
})();
