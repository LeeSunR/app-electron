const { ipcRenderer } = require('electron');

getAccessToken = () => {
    const token = localStorage.accessToken;
    const payload = parseJwt(token);
    const expTime = console.log(payload.exp - parseInt(new Date().getTime() / 1000));
    if (expTime < 259200) {
        //토큰 재발급
    } else if (expTime < 1) {
        logout();
    } else {
        return token;
    }
};

logout = () => {
    localStorage.accessToken = null;
};

parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload);
};

const ipc = {
    main: (event) => {
        ipcRenderer.send('MAIN', {
            event: event,
        });
    },
    player: (event) => {
        ipcRenderer.send('PLAYER', {
            event: event,
        });
    },
    play: (aid, filename, path, time) => {
        ipcRenderer.send('VIDEO_PLAY', {
            aid,
            filename,
            path,
            time,
        });
    },
};
