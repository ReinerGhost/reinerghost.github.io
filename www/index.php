<?php

function getSettings()
{
    // Prepare new cURL resource
    $crl = curl_init($_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . '/mobile-get-settings');
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($crl, CURLOPT_VERBOSE, true);
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($crl, CURLOPT_VERBOSE, true);
    curl_setopt($crl, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($crl, CURLOPT_POST, true);
    curl_setopt($crl, CURLOPT_POSTFIELDS, []);

    // Submit the POST request
    $result = curl_exec($crl);
    if (!$result) {
        die('Error: "' . curl_error($crl) . '" - Code: ' . curl_errno($crl));
    }
    curl_close($crl);
    $settings = (json_decode($result));

    return $settings;
}

$settings = getSettings();

?>

<!DOCTYPE html><!-- php -->
<html>
    <head>
        <meta charset="utf-8">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
        <link rel="stylesheet" type="text/css" href="/lioxapp/www/css/style.css">
        <link rel="stylesheet" type="text/css" href="/lioxapp/www/pages/startPage/startPage.css?v=1">
        <title>Liox Apps</title>
    </head>
    <body>

        <?php
        echo ($settings->google_analytics_mobile ?? '');
        ?>

        <div class="app">
            <div class="menu">

            </div>
            <div class="body">
                <header>
                    <div class="help-question" style="position: absolute; right: 14px; top: 15px;  display: none;">
                        <a href="tel:+1-855-550-4545" class="phone-number">
                            <img class="svg" src="/lioxapp/images/help.png" alt="help question" width="30" height="30">
                        </a>
                    </div>
                    <div class="help-question-login" style="position: absolute; left: 14px; top: 15px; display: none;">
                        <a href="tel:+1-855-550-4545" class="phone-number">
                            <img class="svg" src="/lioxapp/images/help.png" alt="help question" width="30" height="30">
                        </a>
                    </div>
                </header>
                <main>
                    <div class="start-bg">
                        <div class="start">
                            <div class="logo"></div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <div class="loading-block">
            <div class="loading"></div>
        </div>
        <script type="text/javascript" src="cordova.js?v=3"></script>
        <link rel="stylesheet" type="text/css" href="/lioxapp/www/css/style.css">
        <script type="text/javascript" src="/lioxapp/www/js/EventListner.js?v=3"></script>
        <script type="text/javascript" src="/lioxapp/www/js/pageLoader.js?v=3"></script>
        <script type="text/javascript" src="/lioxapp/www/js/ScriptsLoader.js?v=3"></script>

        <script type="text/javascript" src="/lioxapp/www/js/jquery.min.js"></script>
        <script type="text/javascript" src="/lioxapp/www/js/imask.js"></script>
        <script type="text/javascript" src="/lioxapp/www/js/jquery.maskedinput-1.3.js"></script>
        <script type="text/javascript" src="/lioxapp/www/js/creditcard.js"></script>
        <script type="text/javascript" src="/lioxapp/www/js/raty.js"></script>
        <script type="text/javascript" src="/lioxapp/www/js/help.js?v=3"></script>
        <script type="text/javascript" src="/lioxapp/www/js/view.js?v=3"></script>
        <script type="text/javascript" src="/lioxapp/www/js/rout.js?v=3"></script>
        <script type="text/javascript" src="/lioxapp/www/js/app-template.js?v=3"></script>

        <script type="text/javascript" src="/lioxapp/www/js/page-list.js?v=3"></script>
        <script>

            function appStep() {
                let dataAppStep1 = {}
                if (getCookie('lead_source') != '' && getCookie('lead_source') != null) {
                    dataAppStep1.user_source_e = getCookie('lead_source');
                }
                let userData = {};
                let userDataCache = JSON.parse(localStorage.getItem('userData'));
                for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];
                if (userData['user_id'] > 0) {
                    dataAppStep1.user_id_e = userData['user_id'];
                    // dataAppStep1.event = 'user-app-step-1';
                } else {
                    // dataAppStep1.event = 'app-step-1';
                }
                dataAppStep1.event = 'app-step-1';
                console.log(dataAppStep1.event, dataAppStep1);
                dataLayer.push(dataAppStep1);
            }

            function getCookie(name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1,c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                }
                return null;
            }

            OrderUid = null;

            function getOrderUid() {

                let userData = {};
                let userDataCache = JSON.parse(localStorage.getItem('userData'));
                for (var i in userDataCache) userData[userDataCache[i]['name']] = userDataCache[i]['value'];

                // if (userData['user_id'] > 0) {
                //     OrderUid = '';
                //     return OrderUid;
                // }

                console.log('get lead_uid');

                if (!OrderUid) {

                    let timestamp = Math.floor(Date.now() / 1000)
                    let randomValue = ('00' + Math.floor((Math.random() * 1000))).slice(-3);
                    OrderUid = timestamp + '' + randomValue
                    // document.cookie = "lead_uid=" + OrderUid + "; path=/";

                    if (!getCookie('lead_uid')) {
                        // get lead_uid from database
                        $.ajax({
                            type: 'get',
                            url: '/lead-uid-get',
                            success: function (response) {
                                console.log("lead-uid-get:");
                                console.log(response, response.success === true);
                                if (response.success == true) {
                                    // set lead_uid
                                    OrderUid = response.uid
                                    document.cookie = "lead_uid=" + response.uid + "; path=/";
                                    document.cookie = "lead_source=" + response.source + "; path=/";
                                    appStep();
                                } else {
                                    // set lead_uid
                                    document.cookie = "lead_uid=" + OrderUid + "; path=/";
                                    // get lead_uid from database
                                    $.ajax({
                                        type: 'post',
                                        url: '/lead-uid-set',
                                        data: {
                                            uid: OrderUid,
                                            source: 'lioxapp'
                                        },
                                        success: function (response) {
                                            console.log("lead-uid-set:");
                                            console.log(response);
                                            // set lead_uid
                                            if (response.success === true) {
                                                OrderUid = response.uid
                                                document.cookie = "lead_uid=" + response.uid + "; path=/"
                                                document.cookie = "lead_source=" + response.source + "; path=/";
                                                appStep();
                                            } else {
                                                console.log('error set lead uid')
                                                document.cookie = "lead_uid=" + OrderUid + "; path=/";
                                            }
                                        }
                                    });
                                }
                            }
                        });

                    } else {
                        OrderUid = getCookie('lead_uid')
                        appStep();
                    }
                }

                return OrderUid;
            }

            getOrderUid();

        </script>
    </body>
</html>
