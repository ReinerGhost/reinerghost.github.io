(function (global) {
    var PageLoader = function pageLoader(Routs) {
        this.pages = [];
        this.loadedPages = 0;
    }
    PageLoader.prototype = EventListner.prototype;
    PageLoader.prototype.AddPage = function addPage(PageName) {
        var self = this;
        self.pages.push(PageName);
        self._PageLoaded(PageName);
        self.AddCSS(PageName);
        self.AddJS(PageName);
        return self;
    }
    PageLoader.prototype.AddJS = function addJS(PageName) {
        var self = this;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = './pages/' + PageName + '/' + PageName + '.js?'+new Date().getTime();
        //script.src = 'pages/' + PageName + '/' + PageName + '.js?' + new Date().getTime();
        script.async = false;
        document.getElementsByTagName('body')[0].appendChild(script);
        script.onload = function () {
            self.emit(PageName + '_script_loaded');
        }
    }
    PageLoader.prototype.AddCSS = function addCSS(PageName) {
        var self = this;
        var link = document.createElement('link');
        link.href = './pages/' + PageName + '/' + PageName + '.css?'+new Date().getTime();
        //link.href = 'pages/' + PageName + '/' + PageName + '.css?' + new Date().getTime();
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(link);
        link.onload = function () {
            self.emit(PageName + '_link_loaded');
        }
    }
    PageLoader.prototype._PageLoaded = function _pageLoaded(PageName) {
        try {
            var self = this; var script = false, link = false;
            self.on(PageName + '_script_loaded', function () {
                script = true;
                if (link == true) {
                    self.loadedPages = self.loadedPages + 1;
                    self.emit(PageName + '_loaded');
                    self.emit('Page_loaded');
                }
            }).on(PageName + '_link_loaded', function () {
                link = true;
                if (script == true) {
                    self.loadedPages = self.loadedPages + 1;
                    self.emit(PageName + '_loaded');
                    self.emit('Page_loaded');
                }
            });
        } catch (e){
            console.error(e);
            displayErrorPage(e);
        }

    }
    global.PageLoader = PageLoader;
})(window);
