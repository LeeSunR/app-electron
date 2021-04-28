"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require('path');
var player = null;
var main = null;
var intro = null;
var tray = null;
var createWindow = function () {
    // 브라우저 창을 생성
    main = new electron_1.BrowserWindow({
        show: false,
        minWidth: 720,
        minHeight: 600,
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
    main.setMenu(null);
    //로딩창
    intro = new electron_1.BrowserWindow({
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
    main.on('close', function () {
        if (player) {
            player.close();
        }
    });
};
//로딩 완료
electron_1.ipcMain.on('LOADING_COMPLETED', function (event, payload) {
    if (payload.target == 'MAIN')
        main === null || main === void 0 ? void 0 : main.loadFile('ui/main.html');
    else if (payload.target == 'LOGIN')
        main === null || main === void 0 ? void 0 : main.loadFile('ui/login.html');
    else if (payload.target == 'CLOSE') {
        electron_1.app.exit(0);
        return;
    }
    main === null || main === void 0 ? void 0 : main.show();
    //main?.webContents.openDevTools();
    intro === null || intro === void 0 ? void 0 : intro.close();
});
//비디오 플레이
electron_1.ipcMain.on('VIDEO_PLAY', function (event, payload) {
    if (player) {
        player.loadFile("ui/player.html", { query: { aid: payload.aid, filename: payload.filename, time: payload.time } });
        player.moveTop();
    }
    else {
        player = new electron_1.BrowserWindow({
            minWidth: 320,
            minHeight: 180,
            width: 1280,
            height: 720,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        player.setMenu(null);
        player.setAlwaysOnTop(false);
        //player.webContents.openDevTools();
        player.loadFile("ui/player.html", { query: { aid: payload.aid, filename: payload.filename, time: payload.time } });
    }
    player.on('close', function () {
        player = null;
    });
});
//메인 이벤트
electron_1.ipcMain.on('MAIN', function (event, payload) {
    switch (payload.event) {
        case 'HIDE':
            main === null || main === void 0 ? void 0 : main.close();
            break;
        case 'MINIMIZE':
            main === null || main === void 0 ? void 0 : main.minimize();
            break;
        case 'MAXIMIZE':
            if (!(main === null || main === void 0 ? void 0 : main.isMaximized()))
                main === null || main === void 0 ? void 0 : main.maximize();
            else
                main === null || main === void 0 ? void 0 : main.unmaximize();
            break;
        default:
            break;
    }
});
//플레이어 이벤트
electron_1.ipcMain.on('PLAYER', function (event, payload) {
    console.log(payload.event);
    switch (payload.event) {
        case 'HIDE':
            break;
        case 'CLOSE':
            if (player)
                player.close();
            break;
        case 'ALWAYSONTOP':
            if (player)
                player.setAlwaysOnTop(!player.isAlwaysOnTop());
            break;
        default:
            break;
    }
});
electron_1.app.on('ready', createWindow);
