cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-cache-clear.CacheClear",
    "file": "plugins/cordova-plugin-cache-clear/www/CacheClear.js",
    "pluginId": "cordova-plugin-cache-clear",
    "clobbers": [
      "CacheClear"
    ]
  },
  {
    "id": "cordova-plugin-inappbrowser.inappbrowser",
    "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
    "pluginId": "cordova-plugin-inappbrowser",
    "clobbers": [
      "cordova.InAppBrowser.open",
      "window.open"
    ]
  },
  {
    "id": "cordova-plugin-screen-orientation.screenorientation",
    "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
    "pluginId": "cordova-plugin-screen-orientation",
    "clobbers": [
      "cordova.plugins.screenorientation"
    ]
  },
  {
    "id": "cordova-plugin-x-toast.Toast",
    "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
    "pluginId": "cordova-plugin-x-toast",
    "clobbers": [
      "window.plugins.toast"
    ]
  },
  {
    "id": "es6-promise-plugin.Promise",
    "file": "plugins/es6-promise-plugin/www/promise.js",
    "pluginId": "es6-promise-plugin",
    "runs": true
  },
  {
    "id": "ionic-plugin-keyboard.keyboard",
    "file": "plugins/ionic-plugin-keyboard/www/ios/keyboard.js",
    "pluginId": "ionic-plugin-keyboard",
    "clobbers": [
      "cordova.plugins.Keyboard"
    ],
    "runs": true
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-cache-clear": "1.3.7",
  "cordova-plugin-inappbrowser": "3.0.0",
  "cordova-plugin-screen-orientation": "3.0.1",
  "cordova-plugin-whitelist": "1.2.2",
  "cordova-plugin-x-toast": "2.6.2",
  "es6-promise-plugin": "4.2.2",
  "ionic-plugin-keyboard": "2.2.1"
};
// BOTTOM OF METADATA
});