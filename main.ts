import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';

const path = require('path');
let player: BrowserWindow | null = null;
let main: BrowserWindow | null = null;
let intro: BrowserWindow | null = null;
let tray = null;
const createWindow = () => {
    // 브라우저 창을 생성
    main = new BrowserWindow({
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
    intro = new BrowserWindow({
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

    main.on('close', () => {
        if (player) {
            player.close();
        }
    });
};

//로딩 완료
ipcMain.on('LOADING_COMPLETED', (event, payload) => {
    if (payload.target == 'MAIN') main?.loadFile('ui/main.html');
    else if (payload.target == 'LOGIN') main?.loadFile('ui/login.html');
    else if (payload.target == 'CLOSE') {
        app.exit(0);
        return;
    }
    main?.show();
    //main?.webContents.openDevTools();
    intro?.close();
});

//비디오 플레이
ipcMain.on('VIDEO_PLAY', (event, payload) => {
    if (player) {
        player.loadFile(`ui/player.html`, { query: { aid: payload.aid, filename: payload.filename, time: payload.time } });
        player.moveTop();
    } else {
        player = new BrowserWindow({
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
        player.loadFile(`ui/player.html`, { query: { aid: payload.aid, filename: payload.filename, time: payload.time } });
    }

    player.on('close', () => {
        player = null;
    });
});

//메인 이벤트
ipcMain.on('MAIN', (event, payload) => {
    switch (payload.event) {
        case 'HIDE':
            main?.close();
            break;
        case 'MINIMIZE':
            main?.minimize();
            break;
        case 'MAXIMIZE':
            if (!main?.isMaximized()) main?.maximize();
            else main?.unmaximize();
            break;
        default:
            break;
    }
});

//플레이어 이벤트
ipcMain.on('PLAYER', (event, payload) => {
    console.log(payload.event);
    switch (payload.event) {
        case 'HIDE':
            break;
        case 'CLOSE':
            if (player) player.close();
            break;
        case 'ALWAYSONTOP':
            if (player) player.setAlwaysOnTop(!player.isAlwaysOnTop());
            break;
        default:
            break;
    }
});

app.on('ready', createWindow);
