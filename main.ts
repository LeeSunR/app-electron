import { app, BrowserWindow, ipcMain } from 'electron';
const path = require('path');

const createWindow = () => {
    // 브라우저 창을 생성
    let win = new BrowserWindow({
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
    setInterval(() => {
        win.webContents.send('event', 'hello');
    }, 1000);
};

app.on('ready', createWindow);
