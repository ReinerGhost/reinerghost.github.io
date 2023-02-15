Page = function (name, fun) {
    this.name = name; var self = this;
    return function usePage() {
        try {
            fun.call(self, self.name);
        } catch (e) {
            console.error(e);
            displayErrorPage(e);
        }
    };
}
Page.prototype.render = function (data, fun) {
    var self = this;
    try {
        helper.get('pages/' + self.name + '/' + self.name + '.html?' + new Date().getTime(), {}, function (file) {
            document.querySelector('main').innerHTML = new Templater(file, (typeof data != 'undefined' ? data : {}), document.querySelector('main')).Render();
            //litle fix
            upViewPort();
            if (typeof fun != 'undefined') fun.call(self, self.name);
        }, true);
    //    helper.app.getFile(cordova.file.applicationDirectory + 'www/pages/' + self.name + '/' + self.name + '.html?' + new Date().getTime(), function (file) {
    //         document.querySelector('main').innerHTML = new Templater(file._result, (typeof data != 'undefined' ? data : {}), document.querySelector('main')).Render();
    //         //litle fix
    //         upViewPort();
    //         if (typeof fun != 'undefined') fun.call(self, self.name);
    //     });

    } catch (e) {
        console.error(e);
        displayErrorPage(e);
    }

    return this;
}
