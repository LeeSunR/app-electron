let requestId = null;

sendcert = () => {
    const phone = document.getElementById('phone').value;
    const reg = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g;
    if (reg.test(phone)) {
        axios
            .request({
                method: 'POST',
                url: `http://baka.kr:1017/api/v1/phone/vertify/request`,
                headers: { 'Content-Type': 'application/json' },
                data: { phone: phone },
            })
            .then((response) => {
                requestId = response.data.requestId;
                document.getElementById('phone').disabled = true;
                document.getElementById('certNumber').hidden = false;
                document.getElementById('btn-send').hidden = true;
                document.getElementById('btn-check').hidden = false;
            })
            .catch((e) => {
                alert('올바른 전화번호가 아닙니다\n' + e);
            });
    } else {
        alert('올바른 전화번호가 아닙니다');
    }
};

certCheck = () => {
    const phone = document.getElementById('phone').value;
    const code = document.getElementById('certNumber').value;
    const reg = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g;
    if (reg.test(phone)) {
        axios
            .request({
                method: 'POST',
                url: `http://baka.kr:1017/api/v1/phone/vertify/check`,
                headers: { 'Content-Type': 'application/json' },
                data: { requestId: requestId, phone: phone, code: code },
            })
            .then((response) => {
                console.log(response.data.phoneToken);
                location.href = `signup-info.html?phoneToken=${response.data.phoneToken}`;
            })
            .catch((e) => {
                alert('인증 실패\n' + e);
            });
    } else {
        alert('올바른 전화번호가 아닙니다');
    }
};

signUp = () => {
    const phoneToken = getParam('phoneToken');
    const id = document.getElementById('id').value;
    const pw = document.getElementById('pw').value;
    const pwConfirm = document.getElementById('pwConfirm').value;
    const nickname = document.getElementById('nickname').value;

    if (!id || !pw || !pwConfirm || !nickname) return alert('파라미터 미입력');
    if (pw !== pwConfirm) return alert('패스워드가 일치하지 않음');
    console.log({ phoneToken: phoneToken, id: id, password: pw, name: nickname });
    axios
        .request({
            method: 'POST',
            url: `http://baka.kr:1017/api/v1/users`,
            headers: { 'Content-Type': 'application/json' },
            data: { phoneToken: phoneToken, id: id, password: pw, name: nickname },
        })
        .then((response) => {
            location.href = `login.html`;
        })
        .catch((e) => {
            alert('인증 실패\n' + e);
        });
};

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

login = () => {
    const id = document.getElementById('id').value;
    const pw = document.getElementById('pw').value;
    axios
        .request({
            method: 'POST',
            url: `http://baka.kr:1017/api/v1/auth/login`,
            headers: { 'Content-Type': 'application/json' },
            data: { id: id, password: pw },
        })
        .then((response) => {
            console.log(response.data);
            localStorage.accessToken = response.data.accessToken;
            location.href = `main.html`;
        })
        .catch((e) => {
            alert('인증 실패\n' + e);
        });
};
