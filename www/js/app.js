var globalData = {};

var settings = {};

$.ajax({
    type: 'POST',
    url: "../../mobile-get-settings",
    success: function (response) {
        settings = response;
        console.log(settings);
    },
    error: function(err) {
        console.error('Error get settings');
    }
});

function openModalPrice() {
    $('.pricing-modal').slideToggle();
}
function closeModalPrice() {
    $('.pricing-modal').slideToggle();
}
function getUserData() {
    var data = localStorage.getItem('userData'), userData = {};
    if (typeof data == 'string') data = JSON.parse(data);
    for (var k in data) {
        userData[data[k]['name']] = data[k]['value'];
    }
    return userData;
}
function upViewPort() {
    $('html, body, main, main > div').animate({
        scrollTop: 0
    }, 300);
}

function EventToFire(event_name){
    console.log("Android " + event_name);
    if(typeof window.webkit !== 'undefined'){
        window.webkit.messageHandlers.jsHandler.postMessage(event_name);
    }
}

function affterLoad() {

    Routs = new RouteCross({ 'index': '/startPage' });
    Routs.addLink({
        'link': '/startPage',
        'function': startPage
    }).addLink({
        'link': '/howItWorks',
        'function': howItWorks
    }).addLink({
        'link': '/orderHistory',
        'function': orderHistory
    }).addLink({
        'link': '/orderDetails',
        'function': orderDetails
    }).addLink({
        'link': '/rewards',
        'function': rewards
    }).addLink({
        'link': '/userProfile',
        'function': userProfile
    }).addLink({
        'link': '/userProfileEdit',
        'function': userProfileEdit
    }).addLink({
        'link': '/userNotifications',
        'function': userNotifications
    }).addLink({
        'link': '/login',
        'function': login
    }).addLink({
        'link': '/registerFirstStep',
        'function': registerFirstStep
    }).addLink({
        'link': '/registerSecendStep',
        'function': registerSecendStep
    }).addLink({
        'link': '/menuPage',
        'function': menuPage
    }).addLink({
        'link': '/washFold',
        'function': washFold
    }).addLink({
        'link': '/Maid',
        'function': Maid
    }).addLink({
        'link': '/totalPage',
        'function': totalPage
    }).addLink({
        'link': '/dryCleaning',
        'function': dryCleaning
    }).addLink({
        'link': '/timePage',
        'function': timePage
    }).addLink({
        'link': '/homeCleaning',
        'function': homeCleaning
    }).addLink({
        'link': '/endPage',
        'function': endPage
    }).addLink({
        'link': '/lastOrder',
        'function': lastOrder
    }).addLink({
        'link': '/registerProfile',
        'function': registerProfile
    }).addLink({
        'link': '/registerDryCleaning',
        'function': registerDryCleaning
    }).addLink({
        'link': '/registerWashFold',
        'function': registerWashFold
    }).addLink({
        'link': '/registerMaid',
        'function': registerMaid
    }).addLink({
        'link': '/registerMenuPage',
        'function': registerMenuPage
    }).addLink({
        'link': '/registerOrderEndPage',
        'function': registerOrderEndPage
    }).addLink({
        'link': '/registerTimePage',
        'function': registerTimePage
    }).addLink({
        'link': '/registerAccountAdress',
        'function': registerAccountAdress
    }).addLink({
        'link': '/rating',
        'function': rating
    }).set404({
        'function': function () {
            alert(this.msg); window.location.hash = '/menuPage';
        }
    });

    (function () {
        var used = false;
        setTimeout(function () {
            document.addEventListener("backbutton", backbutton);
            function backbutton() {
                if (window.location.hash == '#/menuPage' || window.location.hash == '#/login' || window.location.hash == '#/startPage') {
                    if (used) {
                        if (navigator.app) {
                            navigator.app.exitApp();
                        } else if (navigator.device) {
                            navigator.device.exitApp();
                        }
                    } else {
                        used = true;
                        if (window.plugins) {
                            window.plugins.toast.showShortBottom('Use the back button again to close the application');
                        }
                        setTimeout(function () {
                            used = false;
                        }, 800);
                    }
                }
            }
        }, 1000);
    })();
}


function hardRefresh() {

    $.ajax({
        type: 'GET',
        url: '/hard-refresh',
        success: function (response) {

            console.log('hard-refresh return: ', response);

            document.cookie = 'liox_session=; expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/;';
            document.cookie = 'liox_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            localStorage.removeItem('userName', '');
            localStorage.removeItem('userPass', '');
            localStorage.removeItem('userData', '');

            document.location.reload(true);
        },
    });
}

function displayErrorPage(e) {

    console.log(e);

    var displayErrorWithButtonHtml = '<div class="error-liox-bg">' +
        '    <div class="error-liox">' +
        '       <div class="error-info">' +

        '       <div class="text">' +
        '           Something went wrong' +
        '       </div>' +
        '       <div class="button-reload">' +
        '           <button id="emergencyrestart" onclick="hardRefresh()">Click to Reload the App</button>' +
        '       </div>' +
        '       <div class="text">' +
        '           If problem persists <br>' +
        '           Please reinstall the app <br>' +
        '           and clear cache. <br>' +
        '       </div>' +

        '       </div>' +
        '    </div>' +
        '</div>';

    $('div.body > main').html(displayErrorWithButtonHtml);
}

$(document).ready(function () {

    try {

        affterLoad();

    } catch (e) {

        displayErrorPage(e);

    }

});
