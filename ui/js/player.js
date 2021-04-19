let responseIconAnimation = null;
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
    episodeInit();
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

    video.onvolumechange = () => {
        const volume = parseInt(video.volume * 100);
        if (volume > 50) showResponseIcon('fa-volume-up', `Change volume\n${volume}`);
        else if (volume > 0) showResponseIcon('fa-volume-down', `Change volume\n${volume}`);
        else showResponseIcon('fa-volume-off', `Change volume\n${volume}`);
        console.log('볼륨이 변경되었습니다');
    };

    video.addEventListener('timeupdate', () => timeUpdate(video));

    video.play();

    window.addEventListener('keydown', (e) => {
        const code = e.which || e.charCode || e.keyCode || 0;

        switch (code) {
            case 13: // ENTER
                if (document.fullscreenElement) document.exitFullscreen();
                else document.body.webkitRequestFullScreen();
                break;
            case 32: // SPACE BAR
                clickPlayPause();
                break;
            case 37: // left
                video.currentTime -= 5;
                showResponseIcon('fa-backward', `5초 뒤로`);
                break;
            case 39: // right
                video.currentTime += 5;
                showResponseIcon('fa-forward', `5초 앞으로`);
                break;
            case 38: // up
                video.volume = video.volume + 0.1 > 1 ? 1 : video.volume + 0.1;
                break;
            case 40: // down
                video.volume = video.volume - 0.1 < 0 ? 0 : video.volume - 0.1;
                break;
            case 49: // 1
                break;
            case 50: // 2
                break;
            case 51: // 3
                break;
            case 52: // 4
                break;
            case 27: // ESC
                video.pause();
                hidePlayer();
                break;
            default:
                break;
        }
    });
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

hidePlayer = () => {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('HIDE_PLAYER', {});
};

function startFS(element) {
    if (document.exitFullscreen) {
        alert(1);
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        alert(2);
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        alert(3);
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        alert(4);
        document.webkitExitFullscreen();
    }
}

showResponseIcon = (fa, message) => {
    const icon = document.getElementById('response-icon');
    const icon_i = document.getElementById('response-icon-icon');
    const icon_msg = document.getElementById('response-icon-message');
    icon_msg.innerText = message;
    icon_i.className = 'fa ' + fa;
    clearInterval(responseIconAnimation);
    responseIconAnimation = setInterval(frame, 10);
    let pos = 0;
    function frame() {
        if (pos == 40) {
            clearInterval(responseIconAnimation);
        } else {
            pos++;
            icon.style.opacity = 1 - pos / 40;
            console.log(icon.style.opacity);
        }
    }
};

episodeToggle = () => {
    const episode = document.getElementById('episode');
    if (episode.className == 'episode-close') episode.className = 'episode-open';
    else episode.className = 'episode-close';
};

episodeInit = () => {
    const aid = getParam('aid');
    const filename = getParam('filename');
    axios
        .request({
            method: 'GET',
            url: `http://baka.kr:1017/api/v1/animes/${aid}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.accessToken}`,
            },
        })
        .then((response) => {
            response.data.data.fileList.forEach((file) => {
                const box = document.createElement('li');
                box.id = 'episode-item';
                box.setAttribute('onclick', `play(${aid},"${file.originFilename}","${file.path}",0)`);

                if (file.originFilename == decodeURI(filename)) box.className = 'playing';
                const image = document.createElement('img');
                image.src = file.thumbnail !== null ? `http://baka.kr:1017/${file.thumbnail}` : 'image/sample-poster.jpg';

                const title = document.createElement('div');
                title.id = 'episode-item-title';
                title.innerText = file.originFilename;

                box.appendChild(image);
                box.appendChild(title);

                document.getElementById('episode').appendChild(box);
            });
        });
};
play = (aid, filename, path, time) => {
    const { ipcRenderer } = require('electron');
    const payload = { aid, filename, path, time };
    ipcRenderer.send('VIDEO_PLAY', payload);
};
