(function () {


    registerProfile = new Page('registerProfile', function (name) {
        dataLayer.push({
            'event': 'app-step-5'
        });
        EventToFire('app_step_5');
        //console.log("app-step-5");
        var self = this;
        // console.log(name);
        renderPage.call(self);


    });
    function renderPage() {
        var self = this;
        self.render({}, function () {
            $('#show_password').change(function () {
                if ($('#show_password').prop('checked')) {
                    $('[name="password"]')[0].type = 'text';
                } else {
                    $('[name="password"]')[0].type = 'password';
                }
            });
            $('[name="zipcode"]').mask("10999");
            //$.mask.definitions['c'] = '[0-9\*]';
            //$('[name="cardnumber"]').mask("cccc-cccc-cccc-cccc");

            //test new masc
            var element = $('[name="cardnumber"]')[0];
            var groupsMask = new IMask(element, {
                mask: 'C1-C-C-CL',
                groups: {
                    C1: new IMask.MaskedPattern.Group.Range([3400, 6011]),
                    C: new IMask.MaskedPattern.Group.Range([0, 9999]),
                    CL: new IMask.MaskedPattern.Group.Range([0, 9999]),
                }
            });
            $('[name="cardnumber"]').change(function () {
                $(this).parent().find('.cartnumber-text').html($(this).val());
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


            $('.register-profile-button').click(function () {
                var creditcard1 = document.getElementById('cardnumber');
                var exp1 = document.getElementById('expiration');
                var firstname1 = document.getElementById('firstname');
                var lastname1 = document.getElementById('lastname');
                var email1 = document.getElementById('email');
                var password1 = document.getElementById('password');
                var phone1 = document.getElementById('phone');
                if (!firstname1.value || !lastname1.value || !email1.value || !password1.value || !phone1.value) {

                    if (!firstname1.value) {
                        firstname1.style.borderColor = 'red';
                    } else {
                        firstname1.style.borderColor = '#ddd';
                    }
                    if (!lastname1.value) {
                        lastname1.style.borderColor = 'red';
                    } else {
                        lastname1.style.borderColor = '#ddd';
                    }
                    if (!email1.value) {
                        email1.style.borderColor = 'red';
                    } else {
                        email1.style.borderColor = '#ddd';
                    }
                    if (!password1.value) {
                        password1.style.borderColor = 'red';
                    } else {
                        password1.style.borderColor = '#ddd';
                    }
                    if (!phone1.value) {
                        phone1.style.borderColor = 'red';
                    } else {
                        phone1.style.borderColor = '#ddd';
                    }
                    return;
                } else {
                    creditcard1.style.borderColor = '#ddd';
                    exp1.style.borderColor = '#ddd';
                    firstname1.style.borderColor = '#ddd';
                    lastname1.style.borderColor = '#ddd';
                    email1.style.borderColor = '#ddd';
                    password1.style.borderColor = '#ddd';
                    phone1.style.borderColor = '#ddd';
                }

                var Data = $('div.register-profile form').serializeArray();
                var userData = globalData['userData'];
                // console.log('globalData', globalData);

                if ($('.register-profile form [name="cardnumber"]').val().indexOf('*') != -1) {
                    $('.register-profile form [name="cardnumber"]').val('');
                }

                if ($('.register-profile form [name="cardnumber"]').val() != '') {
                    Data.push({ 'name': 'cardnumber', 'value': $('.register-profile form [name="cardnumber"]').val().split('-').join('') });
                }

                let address = '';
                let zipcode = '';
                let apartment = '';
                if (typeof userData === 'object') {
                    console.log('set address: ');
                    Object.entries(userData).forEach(entry => {

                        const [key, item] = entry;

                        if (item.name == 'address') address = item.value;
                        if (item.name == 'zipcode') zipcode = item.value;
                        if (item.name == 'apartment') apartment = item.value;

                        if (key == 'address') address = item;
                        if (key == 'zipcode') zipcode = item;
                        if (key == 'apartment') apartment = item;

                    });
                } else {
                    console.log('oops 1');
                }

                console.log('address', address);
                console.log('zipcode', zipcode);
                console.log('apartment', apartment);

                Data.push({ 'name': 'app', 'value': 1 });
                Data.push({ 'name': 'submited', 'value': 1 });
                Data.push({ 'name': 'address', 'value': address });
                Data.push({ 'name': 'zipcode', 'value': zipcode });
                Data.push({ 'name': 'apartment', 'value': apartment });
                Data.push({ 'name': 'username', 'value': $('.register-profile form [name="email"]').val() });
                Data.push({ 'name': 'service', 'value': 'register' });
                Data.push({ 'name': 'signed_up', 'value': 'app' });
                if (globalData['goBack'] == 'registerMaid') {
                    var store_credit = '40';
                    var order_service = 'maid';
                } else if (globalData['goBack'] == 'registerWashFold') {
                    var store_credit = '10';
                    var order_service = 'wash';
                } else {
                    var store_credit = '10';
                    var order_service = 'dryclean';
                }
                Data.push({ 'name': 'store_credit', 'value': store_credit });
                Data.push({ 'name': 'order_service', 'value': order_service });

                var d = new Date(), strDate = '';
                if (d.getDate() > 9) strDate += d.getDate();
                else strDate += '0' + d.getDate();
                strDate += '-';
                if ((d.getMonth() + 1) > 9) strDate += (d.getMonth() + 1);
                else strDate += '0' + (d.getMonth() + 1);
                strDate += '-' + d.getFullYear().toString().substr(-2);
                Data.push({ 'name': 'freebag', 'value': strDate });
                var dd = new Date();
                var seconds = Math.round(dd.getTime() / 1000);
                Data.push({ 'name': 'signup_date', 'value': seconds });

                console.log('register data', Data);

                globalData['userData'] = Data;

                globalData['username'] = $('.register-profile form [name="email"]').val();
                globalData['password'] = $('.register-profile form [name="password"]').val();

                storeLeadRegisterProfile("/registerTotalPage");
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
    }

})();
function removeSpaces(string) {
    return $('#cardnumber').val().replace(/[^\d.*]/g, ""); //string.split(' ').join('');
}
function testCreditCard() {
    var temp_var = removeSpaces(document.getElementById('cardnumber').value);
    var resp = checkCreditCard(temp_var);
    if (resp == "Visa" || resp == "MasterCard" || resp == "Amex" || resp == "Discover") {
        document.getElementById('cardnumber').style.color = '#16374b';
        document.getElementById('cardnumber').style.borderColor = '#ddd';
        document.getElementById("cardtype").value = resp;
    } else {
        document.getElementById('cardnumber').style.color = 'red';
        document.getElementById('cardnumber').style.borderColor = 'red';
    }
}

/*CARD CHECK SCRIPT*/
var ccErrorNo = 0;
var ccErrors = new Array()

ccErrors[0] = "Unknown card type";
ccErrors[1] = "No card number provided";
ccErrors[2] = "Credit card number is in invalid format";
ccErrors[3] = "Credit card number is invalid";
ccErrors[4] = "Credit card number has an inappropriate number of digits";

function checkCreditCard(cardnumber) {
    var cardname = "none";
    var cardprefix = 0;
    cardprefix = cardnumber.substring(0, 1); if (cardprefix == "4") { cardname = "Visa"; }
    cardprefix = cardnumber.substring(0, 2); if (cardprefix == "51" || cardprefix == "52" || cardprefix == "53" || cardprefix == "54" || cardprefix == "55") { cardname = "MasterCard"; }
    cardprefix = cardnumber.substring(0, 2); if (cardprefix == "34" || cardprefix == "37") { cardname = "Amex"; }
    cardprefix = cardnumber.substring(0, 4); if (cardprefix == "6011") { cardname = "Discover"; }
    cardprefix = cardnumber.substring(0, 3); if (cardprefix == "622" || cardprefix == "37") { cardname = "Discover"; }
    cardprefix = cardnumber.substring(0, 2); if (cardprefix == "64" || cardprefix == "65") { cardname = "Discover"; }

    // Array to hold the permitted card characteristics
    var cards = new Array();

    // Define the cards we support. You may add addtional card types as follows.

    //  Name:         As in the selection box of the form - must be same as user's
    //  Length:       List of possible valid lengths of the card number for the card
    //  prefixes:     List of possible prefixes for the card
    //  checkdigit:   Boolean to say whether there is a check digit

    cards[0] = {
        name: "Visa",
        length: "13,16",
        prefixes: "4",
        checkdigit: true
    };
    cards[1] = {
        name: "MasterCard",
        length: "16",
        prefixes: "51,52,53,54,55",
        checkdigit: true
    };
    cards[2] = {
        name: "Amex",
        length: "15",
        prefixes: "34,37",
        checkdigit: true
    };
    cards[3] = {
        name: "Discover",
        length: "16",
        prefixes: "6011,622,64,65",
        checkdigit: true
    };

    // Establish card type
    var cardType = -1;
    for (var i = 0; i < cards.length; i++) {

        // See if it is this card (ignoring the case of the string)
        if (cardname.toLowerCase() == cards[i].name.toLowerCase()) {
            cardType = i;
            break;
        }
    }

    // If card type not found, report an error
    if (cardType == -1) {
        ccErrorNo = 0;
        return false;
    }

    // Ensure that the user has provided a credit card number
    if (cardnumber.length == 0) {
        ccErrorNo = 1;
        return false;
    }

    // Now remove any spaces from the credit card number
    cardnumber = cardnumber.replace(/\s/g, "");

    // Check that the number is numeric
    var cardNo = cardnumber
    var cardexp = /^[0-9]{13,19}$/;
    if (!cardexp.exec(cardNo)) {
        ccErrorNo = 2;
        return false;
    }

    // Now check the modulus 10 check digit - if required
    if (cards[cardType].checkdigit) {
        var checksum = 0;                                  // running checksum total
        var mychar = "";                                   // next char to process
        var j = 1;                                         // takes value of 1 or 2

        // Process each digit one by one starting at the right
        var calc;
        for (i = cardNo.length - 1; i >= 0; i--) {

            // Extract the next digit and multiply by 1 or 2 on alternative digits.
            calc = Number(cardNo.charAt(i)) * j;

            // If the result is in two digits add 1 to the checksum total
            if (calc > 9) {
                checksum = checksum + 1;
                calc = calc - 10;
            }

            // Add the units element to the checksum total
            checksum = checksum + calc;

            // Switch the value of j
            if (j == 1) { j = 2 } else { j = 1 };
        }

        // All done - if checksum is divisible by 10, it is a valid modulus 10.
        // If not, report an error.
        if (checksum % 10 != 0) {
            ccErrorNo = 3;
            return false;
        }
    }

    // The following are the card-specific checks we undertake.
    var LengthValid = false;
    var PrefixValid = false;
    var undefined;

    // We use these for holding the valid lengths and prefixes of a card type
    var prefix = new Array();
    var lengths = new Array();

    // Load an array with the valid prefixes for this card
    prefix = cards[cardType].prefixes.split(",");

    // Now see if any of them match what we have in the card number
    for (i = 0; i < prefix.length; i++) {
        var exp = new RegExp("^" + prefix[i]);
        if (exp.test(cardNo)) PrefixValid = true;
    }

    // If it isn't a valid prefix there's no point at looking at the length
    if (!PrefixValid) {
        ccErrorNo = 3;
        return false;
    }

    // See if the length is valid for this card
    lengths = cards[cardType].length.split(",");
    for (j = 0; j < lengths.length; j++) {
        if (cardNo.length == lengths[j]) LengthValid = true;
    }

    // See if all is OK by seeing if the length was valid. We only check the length if all else was
    // hunky dory.
    if (!LengthValid) {
        ccErrorNo = 4;
        return false;
    };

    // The credit card is in the required format.
    return cardname;
}

function storeLeadRegisterProfile(hash = null) {
    let sendingData = {
        'uid': getOrderUid(),
        'email': document.getElementById('email').value,
        'phone': document.getElementById('phone').value,
        'first_name': document.getElementById('firstname').value,
        'last_name': document.getElementById('lastname').value,
        'source': 'lioxapp'
    }

    $.post('/lead-store', sendingData, function (response) {
        console.log('send lead: ', sendingData, response);
        if (hash) {
            window.location.hash = hash;
        }
    });
}
function toggleBack() {
    $('.openBank').show();
    $('.openBankData').hide();
}
/*================================================================================================*/
