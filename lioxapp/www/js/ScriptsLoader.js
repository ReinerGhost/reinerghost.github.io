var ScriptsLoader = function scriptsLoader(Files) {
    this.Scripts = Files;
    this.LoadedFiles = {};
    for (var i in this.Scripts) {
        this.LoadedFiles[this.Scripts[i]] = false;
    }
    this.LoadScripts();
}
ScriptsLoader.prototype = EventListner.prototype;
ScriptsLoader.prototype.LoadScripts = function loadScripts() {
    var self = this;
    // console.log(self.Scripts);
    for (var i in self.Scripts) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = self.Scripts[i] + '?' + new Date().getTime();
        script.async = false;
        document.getElementsByTagName('head')[0].appendChild(script);
        (function (link) {
            // console.log(link, self);
            script.onload = function () {
                console.log(link);
                self.LoadedFiles[link] = true;
                if (self.isScriptsLoaded()) {
                    self.emit('scripts_loaded', self.Scripts, self);
                }
            };
        })(self.Scripts[i]);

    }
}
ScriptsLoader.isScriptsLoaded = function scriptsLoaded() {
    for (var i in this.LoadedFiles) {
        if (this.LoadedFiles[i] == false) return false;
    }
    return true;
}
