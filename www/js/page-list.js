/*
var Scripts = new ScriptsLoader([
    '../js/jquery.min.js',
    '../js/imask.js',
    '../js/jquery.maskedinput-1.3.js',
    '../js/creditcard.js',
    '../js/raty.js',
    '../js/help.js',
    '../js/view.js',
    '../js/rout.js',
    '../js/app-template.js',
]).on('scripts_loaded', function () {
    Pages = new PageLoader();

    Pages.AddPage('startPage');
    Pages.AddPage('login');
    Pages.AddPage('registerFirstStep');
    Pages.AddPage('registerSecendStep');
    Pages.AddPage('menuPage');
    Pages.AddPage('washFold');
    Pages.AddPage('totalPage');
    Pages.AddPage('dryCleaning');
    Pages.AddPage('timePage');
    Pages.AddPage('homeCleaning');
    Pages.AddPage('endPage');
    Pages.AddPage('rating');
    Pages.AddPage('lastOrder');
    Pages.AddPage('userProfile');
    Pages.AddPage('userProfileEdit');
    Pages.on('Page_loaded', function () {
        if (this.pages.length == this.loadedPages) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'js/app.js';
            script.async = false;
            document.getElementsByTagName('body')[0].appendChild(script);
        }
    });
});*/
Pages = new PageLoader();

Pages.AddPage('startPage');
Pages.AddPage('login');
Pages.AddPage('howItWorks');
Pages.AddPage('orderHistory');
Pages.AddPage('orderDetails');
Pages.AddPage('rewards');
Pages.AddPage('registerFirstStep');
Pages.AddPage('registerSecendStep');
Pages.AddPage('menuPage');
Pages.AddPage('washFold');
Pages.AddPage('totalPage');
Pages.AddPage('dryCleaning');
Pages.AddPage('Maid');
Pages.AddPage('timePage');
Pages.AddPage('homeCleaning');
Pages.AddPage('endPage');
Pages.AddPage('lastOrder');
Pages.AddPage('userProfile');
Pages.AddPage('userNotifications');
Pages.AddPage('userProfileEdit');
Pages.AddPage('registerProfile');
Pages.AddPage('registerDryCleaning');
Pages.AddPage('registerWashFold');
Pages.AddPage('registerMaid');
Pages.AddPage('registerMenuPage');
Pages.AddPage('registerOrderEndPage');
Pages.AddPage('registerTimePage');
Pages.AddPage('registerAccountAdress');
Pages.AddPage('registerTotalPage');
Pages.AddPage('rating');

Pages.on('Page_loaded', function () {
    if (this.pages.length == this.loadedPages) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'js/app.js?' + new Date().getTime();
        script.async = false;
        document.getElementsByTagName('body')[0].appendChild(script);
    }
});

orderDetailsId = null;
orderDetailsToken = null;

function clickOnOrderDetailsLink(id, token, goToLink) {
    orderDetailsId = id;
    orderDetailsToken = token;
    console.log('click on order Id:', id, ', token: ', token);
    window.location.hash = goToLink;
}

function clickOnOrderDetailsSelect(id, token) {
    orderDetailsId = id;
    orderDetailsToken = token;
    console.log('click on order Id (select onchange):', id, ', token: ', token);
    window.location.hash = '#/orderDetails';
}


