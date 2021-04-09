"use strict";
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var createWindow = function () {
    // 브라우저 창을 생성
    var win = new BrowserWindow({
        width: 1280,
        height: 720,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.setMenu(null);
    win.loadFile('ui/index.html');
};
app.on('ready', createWindow);
