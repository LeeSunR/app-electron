const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    // 브라우저 창을 생성
    let win = new BrowserWindow({
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
