const version = 1;

window.onload = () => {
    commnet = document.getElementById('comment');
    commnet.innerText = '클라이언트 버전을 체크하는 중';
    axios
        .request({
            method: 'GET',
            url: `http://baka.kr:1017/api/v1/version`,
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (response.data.versionCode > version) {
                alert('최신 버전을 다운받아주세요');
                next('CLOSE');
            } else {
                commnet.innerText = '로그인 토큰 체크중';
                axios
                    .request({
                        method: 'POST',
                        url: `http://baka.kr:1017/api/v1/auth/token/renewal`,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.accessToken}`,
                        },
                    })
                    .then((response) => {
                        localStorage.accessToken = response.data.accessToken;
                        next('MAIN');
                    })
                    .catch((err) => {
                        localStorage.accessToken = null;
                        next('LOGIN');
                    });
            }
        })
        .catch((err) => {
            alert('버전 체크에 실패하였습니다.');
            next('CLOSE');
        });
};

next = (target) => {
    const { ipcRenderer } = require('electron');
    const payload = { target: target };
    ipcRenderer.send('LOADING_COMPLETED', payload);
};
