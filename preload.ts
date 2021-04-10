window.onload = () => {
    console.log('onload');

    const title_bar = document.createElement('div');
    const title_bar_drag_area = document.createElement('div');
    const btns = document.createElement('div');
    const image = document.createElement('img');
    btns.id = 'title-bar-btns';
    title_bar.id = 'title-bar';
    title_bar_drag_area.id = 'title-bar-drag-area';
    image.src = 'image/small-logo.png';
    image.id = 'title-bar-logo';
    btns.appendChild(createButton('fa-minus', 'btn-close'));
    btns.appendChild(createButton('fa-square-o', 'btn-full'));
    btns.appendChild(createButton('fa-times', 'btn-hide'));
    title_bar.appendChild(title_bar_drag_area);
    title_bar.appendChild(image);
    title_bar.appendChild(btns);

    document.body.insertBefore(title_bar, document.body.firstChild);
};

const createButton = (iconClass: string, id: string) => {
    const btn = document.createElement('button');
    btn.classList.add('title-bar-btn');
    const icon = document.createElement('i');
    icon.classList.add('fa', iconClass);
    btn.id = id;
    btn.appendChild(icon);
    return btn;
};
