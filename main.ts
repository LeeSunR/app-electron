import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
const path = require('path');
let playerWindow: BrowserWindow | null = null;
let tray = null;
const createWindow = () => {
    // 브라우저 창을 생성
    let win = new BrowserWindow({
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
    let intro = new BrowserWindow({
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
    ipcMain.on('LOADING_COMPLETED', (event, payload) => {
        if (payload.target == 'MAIN') win.loadFile('ui/main.html');
        else if (payload.target == 'LOGIN') win.loadFile('ui/login.html');
        else if (payload.target == 'CLOSE') {
            app.exit(0);
            return;
        }
        win.show();
        intro.close();
    });
    ipcMain.on('VIDEO_PLAY', (event, payload) => {
        if (playerWindow) {
            playerWindow.loadFile(`ui/player.html`, { query: { aid: payload.aid, filename: payload.filename, time: payload.time } });
        } else {
            playerWindow = new BrowserWindow({
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
            playerWindow.loadFile(`ui/player.html`, { query: { aid: payload.aid, filename: payload.filename, time: payload.time } });
        }

        playerWindow.on('close', () => {
            playerWindow = null;
        });
    });

    ipcMain.on('CLOSE_PLAYER', (event, payload) => {
        if (playerWindow) {
            playerWindow.close();
        }
    });

    ipcMain.on('HIDE', (event, payload) => {
        console.log('HIDE');
        win.close();
    });

    ipcMain.on('MINIMIZE', (event, payload) => {
        console.log('MINIMIZE');
        win.minimize();
    });

    ipcMain.on('MAXIMIZE', (event, payload) => {
        console.log('MAXIMIZE');
        if (!win.isMaximized()) win.maximize();
        else win.unmaximize();
    });

    tray = new Tray(`ui/image/logo.png`); // 현재 애플리케이션 디렉터리를 기준으로 하려면 `__dirname + '/images/tray.png'` 형식으로 입력해야 합니다.
    const contextMenu = Menu.buildFromTemplate([{ role: 'reload' }, { role: 'toggleDevTools' }, { role: 'quit' }, { role: 'about' }]);
    tray.setToolTip('이것은 나의 애플리케이션 입니다!');
    tray.setContextMenu(contextMenu);

    win.on('close', () => {
        if (playerWindow) {
            playerWindow.close();
        }
    });
};

app.on('ready', createWindow);
