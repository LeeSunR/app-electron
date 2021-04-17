getParam = (sname) => {
    var params = location.search.substr(location.search.indexOf('?') + 1);
    var sval = '';
    params = params.split('&');
    for (var i = 0; i < params.length; i++) {
        temp = params[i].split('=');
        if ([temp[0]] == sname) {
            sval = temp[1];
        }
    }
    return sval;
};

window.onload = () => {
    const video = document.getElementById('video');
    video.src = 'http://baka.kr:1017/anime/' + getParam('aid') + '/' + getParam('filename');
    video.onplay = () => {
        document.getElementById('icon-play').classList.remove('fa-play');
        document.getElementById('icon-play').classList.add('fa-pause');
    };
    video.onpause = () => {
        document.getElementById('icon-play').classList.remove('fa-pause');
        document.getElementById('icon-play').classList.add('fa-play');
    };
    video.addEventListener('timeupdate', () => timeUpdate(video));

    video.play();
    var count = 0;
    document.body.onmousemove = (event) => {
        console.log(count++);
    };
};

clickPlayPause = () => {
    const video = document.getElementById('video');
    if (video.paused) video.play();
    else video.pause();
};

timeUpdate = (video) => {
    const duration = parseInt(video.duration);
    const currentTime = parseInt(video.currentTime);
    const persent = (currentTime / duration) * 100;

    document.getElementById('current-time').innerText = timeToString(currentTime);
    document.getElementById('duration-time').innerText = timeToString(duration);
    document.getElementById('progress-bar-inner').setAttribute('style', `width: ${persent}%;`);

    console.log();
};

progressClick = (event) => {
    const progress = document.getElementById('progress-bar-outter');
    const video = document.getElementById('video');
    const clickX = event.clientX - 64;
    const width = progress.offsetWidth;
    const currentTime = parseInt((video.duration * clickX) / width);
    video.currentTime = currentTime;
};

timeToString = (time) => {
    const sec = parseInt(time % 60);
    const min = parseInt(time / 60);
    return `${min}:${sec}`;
};

closePlayer = () => {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('CLOSE_PLAYER', {});
};
