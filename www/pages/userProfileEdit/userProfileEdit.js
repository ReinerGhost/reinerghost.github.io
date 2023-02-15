(function () {
    var groupsMask;
    var fields = [
        //{ 'text': 'Email', 'name': 'email' },
        { 'text': 'Password', 'name': 'password', 'type':'password' },
        { 'text': 'Password Confirm', 'name': 'password.confirm', 'type': 'password' },
        { 'text': 'First Name', 'name': 'firstname' },
        { 'text': 'Last Name', 'name': 'lastname' },
        { 'text': 'Address', 'name': 'address' },
        { 'text': 'Apartment / Suite', 'name': 'apartment' },
        /*{
            'text': 'City', 'name': 'city', 'type': 'select', 'data': [
                {
                    'text': 'New York',
                    'value': 'New York'
                },
                {
                    'text': 'San Francisco',
                    'value': 'San Francisco'
                }
            ]
        },*/
        { 'text': 'Zip Code', 'name': 'zipcode', 'placeholder': 'XXXXX' },
        {
            'text': 'Bank Card', 'name': 'bankcard', 'type': 'select', 'data': [
                {
                    'text': 'Visa',
                    'value': 'Visa'
                },
                {
                    'text': 'MasterCard',
                    'value': 'MasterCard'
                },
                {
                    'text': 'American Express',
                    'value': 'Amex'
                },
                {
                    'text': 'Discover',
                    'value': 'Discover'
                }
            ]
        },
        { 'text': 'Card Number', 'name': 'cardnumber', 'type':'cartnumber', 'placeholder': 'XXXX-XXXX-XXXX-XXXX' },
        { 'text': 'Expiration Date', 'name': 'expiration', 'placeholder': 'mm/yy' },
        { 'text': 'Phone', 'name': 'phone', 'placeholder': 'XXX-XXX-XXXX' },
    ];
    userProfileEdit = new Page('userProfileEdit', function (name) {
        var self = this; console.log(name);
        var d = JSON.parse(localStorage.userData), UserData = {};
        for (k in d) UserData[d[k]['name']] = d[k]['value'];
        var workedOff = false;
        $.ajax({
            url: helper.app.HomeSite + '/mobile-app-view-profile',
            data: { 'user_id': UserData['user_id'] },
            type: 'POST',
            timeout: 5000,
            success: function (r) {
                // console.log(r);
                var data = JSON.parse(r); workedOff = true; renderPage.call(self,data[0]);
            },
            error: function () {
                workedOff = true; renderPage.call(self,UserData);
            }
        });
        //fix
        setTimeout(function () {
            if (workedOff == false) {
                workedOff = true; renderPage.call(self,UserData);
            }
        }, 5030);
    });

    function renderPage(data) {

        var self = this;

        var rawData = data;

        // var Data = data;
        // Data['password'] = { "value": localStorage['userPass'].toString() };
        // Data['password.confirm'] = { "value": localStorage['userPass'].toString() };

        self.render({ 'fields': fields, 'UserData': rawData }, function () {
            for (var i in fields) {
                if ($(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]').length > 0) {
                    $(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]').change(styledSelector);
                    styledSelector.call($(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]')[0]);
                }
            }

            // $('[name="zipcode"]').mask("99999");
            //$.mask.definitions['c'] = '[0-9\*]';
            //$('[name="cardnumber"]').mask("cccc-cccc-cccc-cccc");
            // $('[name="cardnumber"]').mask('?9999 9999 9999 9999');

            //test new masc
            var element = $('[name="zipcode"]')[0];
            var zipCodeMask = new IMask(element, {
                mask: 'C5',
                groups: {
                    C5: new IMask.MaskedPattern.Group.Range([10000, 99999]),
                }
            });

            var element = $('[name="cardnumber"]')[0];
            // $('[name="cardnumber"]').focus(function() {
            //     $('[name="cardnumber"]').val('');
            //     if( !groupsMask )  {
            //         var groupsMask = new IMask($('[name="cardnumber"]')[0], {
            //             mask: 'C1-C-C-CL',
            //             groups: {
            //                 C1: new IMask.MaskedPattern.Group.Range([3400, 6011]),
            //                 C: new IMask.MaskedPattern.Group.Range([0, 9999]),
            //                 CL: new IMask.MaskedPattern.Group.Range([0, 9999]),
            //             }
            //         });
            //     }
            // });
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
                    yy: new IMask.MaskedPattern.Group.Range([00, 99]),
                }
            });
            $('[name="phone"]').mask("999-999-9999");


            $('.user-profile-edit-button').click(function () {

                var Data = $('div.user-profile-edit form').serializeArray(), userData = getUserData();

				if($('[name="cardnumber"]').val().indexOf('*')!=-1){
					$('[name="cardnumber"]').val('');
				}

                let cardnumber = $('[name="cardnumber"]').val().split('-').join('');

				if (cardnumber != '') {
                    if (checkCreditCard(cardnumber) === false) {
                        $('[name="cardnumber"]').css('border-color', 'red')
                        return;
                    } else {
                        $('[name="cardnumber"]').css('border-color', '')
                    }

                    if ($('[name="expiration"]').val() == '') {
                        $('[name="expiration"]').css('border-color', 'red')
                        return;
                    } else {
                        $('[name="expiration"]').css('border-color', '')
                    }
                }

                $('.loading-block').show();

                if ($('[name="cardnumber"]').val() != '') {
                    Data.push({ 'name': 'cardnumber', 'value': $('[name="cardnumber"]').val().split('-').join('') });
                    Data.push({ 'name': 'cardtype', 'value': checkCreditCard(cardnumber)});
                }

                Data.push({ 'name': 'user_id', 'value': userData.user_id });
                Data.push({ 'name': 'app', 'value': 1 });
                Data.push({ 'name': 'submited', 'value': 1 });

                // reloginUser().then(function () {
                //     $('.loading-block').hide();
                //     console.log(Data);
                    $.post(helper.app.HomeSite + '/mobile-app-editing-account', Data, function (r) {

                        $('.loading-block').hide();

                        var result = JSON.parse(r);
                        if (result.error == "true" || result.error == true) {
                            $('.error-log').html(result.message);
                            //litle fix
                            upViewPort();
                        } else {
                            // reloginUser().then(function () {
                                window.location.hash = "/menuPage";
                                if (window.plugins) {
                                    window.plugins.toast.showShortBottom(result.message);
                                }
                            // }).catch(function (e) {
                            //     $('.error-log').html(e);
                            //     //litle fix
                            //     upViewPort();
                            //     //window.location.hash = "/menuPage";
                            // });
                        }
                    });
                // }).catch(function () {
                //     $('.error-log').html('Network error');
                //     //litle fix
                //     upViewPort();
                // });

            })

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
                                FError(data.error);
                            } else if (typeof data.data == 'object') {
                                localStorage.setItem('userData', JSON.stringify(data.data));
                                $('.loading-block').hide();
                                FSuccess();
                            } else {
                                // console.log(typeof data.data == 'object');
                                FError('Undefined error');
                            }
                        },
                        error: function (v) {
                            FError('Undefined error');
                        }
                    });

                },
                error: function (v) {
                    FError('Undefined error');
                },
                timeout: 5000
            });

        });

    }

    function checkZipcode() {
		var zipcode = document.getElementById('zipcode').value;
		var area = '';
		if (!zipcode.includes("_")) {
			// var zipcodes_ok = [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011, 10012, 10013, 10014, 10015, 10016, 10017, 10018, 10019, 10020, 10021, 10022, 10023, 10024, 10025, 10026, 10028, 10128, 10029, 10027, 10031, 10032, 10039, 10030, 10037, 10035, 10038, 10036, 10065, 10041, 10075, 10081, 10105, 10118, 10122, 10111, 10121, 10131, 10133, 10152, 10153, 10154, 10166, 10167, 10169, 10172, 10211, 10213, 10280, 10281, 10282, 10271, 11251, 11201, 11206, 11231, 11217, 11238, 11216, 11215, 11211, 11206, 11225, 11249, 11205, 11222];//, 11251, 11201, 11206, 11231, 11217, 11238, 11216, 11225, 11215, 11211, 11206, 11225, 11249
			var zipcodes_ok = settings['allow_zip_codes'].split(',');
			for (var i = 0; i <= zipcodes_ok.length; i++) {
				if (zipcode == zipcodes_ok[i]) {
					area = 'good';
					break;
				}
			}
			if (area == 'good') {
                document.getElementById('service-area-error').style.display = "none";
                document.getElementById('address-btn').style.visibility = "visible";
				return;
			} else {
				document.getElementById('service-area-error').style.display = "block";
                document.getElementById('address-btn').style.visibility = "hidden";

				//ZipcodeLogs(zipcode);
			}
		}
	}

})();
