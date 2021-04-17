"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require('path');
var playerWindow = null;
var tray = null;
var createWindow = function () {
    // 브라우저 창을 생성
    var win = new electron_1.BrowserWindow({
        show: false,
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
    //로딩창
    var intro = new electron_1.BrowserWindow({
        minWidth: 360,
        minHeight: 480,
        maxWidth: 360,
        maxHeight: 480,
        width: 360,
        height: 480,
        titleBarStyle: 'hidden',
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    intro.setMenu(null);
    intro.loadFile('ui/intro.html');
    electron_1.ipcMain.on('LOADING_COMPLETED', function (event, payload) {
        if (payload.target == 'MAIN')
            win.loadFile('ui/main.html');
        else if (payload.target == 'LOGIN')
            win.loadFile('ui/login.html');
        else if (payload.target == 'CLOSE') {
            electron_1.app.exit(0);
            return;
        }
        win.show();
        intro.close();
    });
    electron_1.ipcMain.on('VIDEO_PLAY', function (event, payload) {
        if (playerWindow) {
            playerWindow.loadFile("ui/player.html", { query: { aid: payload.aid, filename: payload.filename, time: payload.time } });
        }
        else {
            playerWindow = new electron_1.BrowserWindow({
                minWidth: 960,
                minHeight: 580,
                width: 1280,
                height: 720,
                frame: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                },
            });
            playerWindow.setMenu(null);
            playerWindow.setAlwaysOnTop(false);
            playerWindow.webContents.openDevTools();
            playerWindow.loadFile("ui/player.html", { query: { aid: payload.aid, filename: payload.filename, time: payload.time } });
        }
        playerWindow.on('close', function () {
            playerWindow = null;
        });
    });
    electron_1.ipcMain.on('CLOSE_PLAYER', function (event, payload) {
        if (playerWindow) {
            playerWindow.close();
        }
    });
    electron_1.ipcMain.on('HIDE', function (event, payload) {
        console.log('HIDE');
        win.close();
    });
    electron_1.ipcMain.on('MINIMIZE', function (event, payload) {
        console.log('MINIMIZE');
        win.minimize();
    });
    electron_1.ipcMain.on('MAXIMIZE', function (event, payload) {
        console.log('MAXIMIZE');
        if (!win.isMaximized())
            win.maximize();
        else
            win.unmaximize();
    });
    tray = new electron_1.Tray("ui/image/logo.png"); // 현재 애플리케이션 디렉터리를 기준으로 하려면 `__dirname + '/images/tray.png'` 형식으로 입력해야 합니다.
    var contextMenu = electron_1.Menu.buildFromTemplate([{ role: 'reload' }, { role: 'toggleDevTools' }, { role: 'quit' }, { role: 'about' }]);
    tray.setToolTip('이것은 나의 애플리케이션 입니다!');
    tray.setContextMenu(contextMenu);
    win.on('close', function () {
        if (playerWindow) {
            playerWindow.close();
        }
    });
};
electron_1.app.on('ready', createWindow);
