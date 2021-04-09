const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    // 브라우저 창을 생성
    let win = new BrowserWindow({
        width: 1280,
        height: 720,
        titleBarStyle:"hiddenInset",
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.setMenu(null);
    win.loadFile('ui/login.html');
};

app.on('ready', createWindow);
