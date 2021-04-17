page = 0;
accessToken = '';

nextPage = () => {
    page++;
    axios
        .request({
            method: 'GET',
            url: `http://baka.kr:1017/api/v1/animes?page=${page}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.accessToken}`,
            },
        })
        .then((response) => {
            response.data.data.animeList.forEach((anime) => {
                const box = document.createElement('div');
                box.classList.add('dashboard-ani-item');
                box.setAttribute('onclick', `aniDetailOpen(${anime.no})`);

                const image = document.createElement('img');
                image.src = anime.photo !== null ? anime.photo : 'image/sample-poster.jpg';

                const span = document.createElement('span');
                span.innerText = anime.title;

                box.appendChild(image);
                box.appendChild(span);

                document.getElementById('dashboard-ani').appendChild(box);
            });
        });
};

document.getElementById('board').addEventListener('scroll', () => {
    let scrollLocation = document.getElementById('board').scrollTop; // 현재 스크롤바 위치
    let windowHeight = window.innerHeight; // 스크린 창
    let fullHeight = document.getElementById('board').scrollHeight; //  margin 값은 포함 x
    if (scrollLocation + windowHeight >= fullHeight) {
        nextPage();
    }
});

nextPage();
