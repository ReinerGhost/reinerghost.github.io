(function () {

    var fields = [
        //{ 'text': 'User Name', 'name': 'username' },
        { 'text': 'Washing and Drying', 'name': 'washdry', 'type': 'rating' },
        { 'text': 'Folding', 'name': 'folding', 'type': 'rating' },
        { 'text': 'Dry Cleaning', 'name': 'drycleaning', 'type': 'rating' },
        { 'text': 'Delivery', 'name': 'delivery', 'type': 'rating' },
        { 'text': 'Tell us what you like about Liox and what not.', 'name': 'comments', 'type': 'textarea' },
    ];
    rating = new Page('rating', function (name) {

        var self = this; self.render({ 'fields': fields }, function () {
            for (var i in fields) {
                if ($(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]').length > 0) {
                    $(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]').change(styledSelector);
                    styledSelector.call($(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]')[0]);
                }
            }

            $('.options').raty({
                width: 'width: 150',
                path: 'img/',

                click: function (score) {
                    var ScoreName = $(this).attr('data-score-name');
                    var element = document.getElementById(ScoreName);
                    if (element) {
                        document.getElementById(ScoreName).value = score;
                    } else {
                        //   $(this).append("<input type='hidden' name='rate[" + ScoreName + "]' value='" + score + "'>");
                        $(this).append("<input type='hidden' id='" + ScoreName + "' name='" + ScoreName + "' value='" + score + "'>");
                    }
                }
            });

            $('.raing-button').click(function () {
                var Data = $('.raing-bg form').serializeArray(), userData = getUserData();
                Data.push({ 'name': 'user_id', 'value': userData.user_id });
                Data.push({ 'name': 'app', 'value': 1 });
                Data.push({ 'name': 'submited', 'value': 1 });

                $('.loading-block').show();
                reloginUser().then(function () {
                    console.log(Data);
                    $.post(helper.app.HomeSite + '/app-service-rating-system', Data, function (r) {
                        var result = JSON.parse(r); console.log(result);
                        if (result.error == "true") {
                            $('#raing-error').html(result.message);
                        } else {
                            if (window.plugins) {
                                window.plugins.toast.showShortBottom('Thank you for your feedback');
                            }
                            window.location.hash = "/menuPage";
                        }
                    });
                }).catch(function () {
                    alert('Network error');
                    window.location.hash = "/menuPage";
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

    function reloginUser() {
        //user logout
        return new Promise(function (FSuccess, FError) {
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
                            if (typeof data.error != 'undefined') {
                                if (window.plugins) {
                                    window.plugins.toast.showShortBottom(data.error);
                                }
                                FError();
                            } else if (typeof data.data == 'object') {
                                localStorage.setItem('userData', JSON.stringify(data.data));
                                $('.loading-block').hide();
                                FSuccess();
                            } else {
                                console.log(typeof data.data == 'object');
                                FError();
                                if (window.plugins) {
                                    window.plugins.toast.showShortBottom('Undefined error');
                                }
                            }
                        },
                        error: function (v) {
                            if (window.plugins) {
                                window.plugins.toast.showShortBottom('Error. Problems with the network connection');
                            }
                        }
                    });

                },
                error: function (v) {
                    if (window.plugins) {
                        window.plugins.toast.showShortBottom('Error. Problems with the network connection');
                    }
                },
                timeout: 5000
            });

        });

    }
})();
