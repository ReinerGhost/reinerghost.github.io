(function () {
    /*var fields = [
        { 'text': 'User Name', 'name': 'username' },
        { 'text': 'Email', 'name': 'email' },
        { 'text': 'Password', 'name': 'password' },
        { 'text': 'Password Confirm', 'name': 'password.confirm' },
        { 'text': 'First Name', 'name': 'firstname' },
        { 'text': 'Last Name', 'name': 'lastname' },
        { 'text': 'Address', 'name': 'address' },
        { 'text': 'Apartment / Suite', 'name': 'apartment' },
        {
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
        },
        { 'text': 'Zip Code', 'name': 'zipcode' },
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
                    'text': 'Amex',
                    'value': 'Amex'
                },
                {
                    'text': 'Discover',
                    'value': 'Discover'
                }
            ]
        },
        { 'text': 'Card Number', 'name': 'cardnumber' },
        { 'text': 'Expiration Date', 'name': 'expiration' },
        { 'text': 'Phone', 'name': 'phone' },
        { 'text': 'Referral Code/Email', 'name': 'referral_email' },
        {
            'text': 'How did you hear about us', 'name': 'source', 'type': 'select', 'data': [
                {
                    'text': 'Select One',
                    'value': ''
                },
                {
                    'text': 'Yelp',
                    'value': 'Yelp'
                },
                {
                    'text': 'Google',
                    'value': 'Google'
                },
                {
                    'text': 'Friends',
                    'value': 'Friends'
                },
                {
                    'text': 'Facebook',
                    'value': 'Facebook'
                },
                {
                    'text': 'Other',
                    'value': 'Other'
                }
            ]
        },
    ];*/
    register = new Page('register', function (name) {
        /*
        $.get('https://www.lioxcleaners.com/app-registration', {}, function (fields) {

        });
        console.log(name); var self = this; self.render({ 'fields': fields }, function () {
            for (var i in fields) {
                if ($(fields[i]['type'] + '[name="' + fields[i]['name']+'"]').length > 0) {
                    $(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]').change(styledSelector);
                    styledSelector.call($(fields[i]['type'] + '[name="' + fields[i]['name'] + '"]')[0]);
                }
            }
            $('.register-button').click(function () {
                $.post(helper.app.HomeSite + '/app-registration', $('div.register form').serializeArray(), function (r) {
                    var text = r.match(/<p class="wlpeMessageText">([^<]+)<\/p>/)[1];
                    window.plugins.toast.showShortBottom(text);
                });
            });
            //focus fixed
            window.addEventListener("native.keyboardshow", function (e) { $('.onFocusHide').hide(); }, false);
            window.addEventListener("native.keyboardhide", function (e) { $('.onFocusHide').show(); }, false);
        });*/
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