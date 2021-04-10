"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require('path');
var createWindow = function () {
    // 브라우저 창을 생성
    var win = new electron_1.BrowserWindow({
        minWidth: 960,
        minHeight: 580,
        width: 1280,
        height: 720,
        titleBarStyle: 'hidden',
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    win.setMenu(null);
    win.webContents.openDevTools();
    win.loadFile('ui/login.html');
    setInterval(function () {
        win.webContents.send('event', 'hello');
    }, 1000);
};
electron_1.app.on('ready', createWindow);
