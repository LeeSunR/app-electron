window.addEventListener('load', () => {
    selectedMenu({
        id: 'btn-dashboard',
    });
});

selectedMenu = (btn) => {
    let url = '';
    let js = '';
    switch (btn.id) {
        case 'btn-dashboard':
            url = './dashboard.html';
            js = 'js/dashboard.js';
            document.getElementById('btn-dashboard').classList.add('selected');
            document.getElementById('btn-watch').classList.remove('selected');
            document.getElementById('btn-star').classList.remove('selected');
            document.getElementById('btn-profile').classList.remove('selected');
            document.getElementById('btn-setting').classList.remove('selected');
            break;
        case 'btn-watch':
            url = './watch.html';
            js = 'js/watch.js';
            document.getElementById('btn-dashboard').classList.remove('selected');
            document.getElementById('btn-watch').classList.add('selected');
            document.getElementById('btn-star').classList.remove('selected');
            document.getElementById('btn-profile').classList.remove('selected');
            document.getElementById('btn-setting').classList.remove('selected');
            break;
        case 'btn-star':
            url = './star.html';
            js = 'js/star.js';
            document.getElementById('btn-dashboard').classList.remove('selected');
            document.getElementById('btn-watch').classList.remove('selected');
            document.getElementById('btn-star').classList.add('selected');
            document.getElementById('btn-profile').classList.remove('selected');
            document.getElementById('btn-setting').classList.remove('selected');
            break;
        case 'btn-profile':
            url = './profile.html';
            js = 'js/profile.js';
            document.getElementById('btn-dashboard').classList.remove('selected');
            document.getElementById('btn-watch').classList.remove('selected');
            document.getElementById('btn-star').classList.remove('selected');
            document.getElementById('btn-profile').classList.add('selected');
            document.getElementById('btn-setting').classList.remove('selected');
            break;
        case 'btn-setting':
            url = './setting.html';
            js = 'js/setting.js';
            document.getElementById('btn-dashboard').classList.remove('selected');
            document.getElementById('btn-watch').classList.remove('selected');
            document.getElementById('btn-star').classList.remove('selected');
            document.getElementById('btn-profile').classList.remove('selected');
            document.getElementById('btn-setting').classList.add('selected');
            break;
        default:
            break;
    }

    getScript(js, () => {
        axios
            .request({
                method: 'GET',
                url: url,
                headers: { 'Content-Type': 'application/json' },
            })
            .then((response) => {
                document.getElementById('board').innerHTML = response.data;
            });
    });
};

function getScript(source, callback) {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;

    script.onload = script.onreadystatechange = function (_, isAbort) {
        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            script = undefined;

            if (!isAbort && callback) setTimeout(callback, 0);
        }
    };

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
}

aniDetailClose = () => {
    document.getElementById('ani-detail').classList.remove('ani-detail-open-animation');
    document.getElementById('ani-detail').classList.add('ani-detail-close-animation');
};

aniDetailOpen = (aid) => {
    document.getElementById('ani-detail').classList.remove('ani-detail-close-animation');
    document.getElementById('ani-detail').classList.add('ani-detail-open-animation');
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
            document.getElementById('ani-detail-title').innerText = response.data.data.title;
            document.getElementById('ani-detail-files').innerHTML = '';
            document.getElementById('ani-detail-poster').src = response.data.data.photo;

            response.data.data.fileList.forEach((file) => {
                const box = document.createElement('div');
                box.id = 'ani-detail-file-item';
                box.setAttribute('onclick', `ipc.play(${aid},"${file.originFilename}","${file.path}",0)`);

                const image = document.createElement('img');
                image.src = file.thumbnail !== null ? `http://baka.kr:1017/${file.thumbnail}` : 'image/sample-poster.jpg';

                const title = document.createElement('div');
                title.id = 'ani-detail-file-item-title';
                title.innerText = file.originFilename;

                box.appendChild(image);
                box.appendChild(title);

                document.getElementById('ani-detail-files').appendChild(box);
            });
            console.log(response.data.data);
        });
};
