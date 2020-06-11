
function initEntranceAnimations(container) {
    var items = container.getElementsByClassName('anim-entrance');
    for (var i = 0; i < items.length; i++) {
        items[i].style.opacity = 0;
        items[i].style.animationDelay = (i * 0.3) + "s";
    }
}

function loadPage(source, callback) {
    var content = document.getElementById('content');
    content.classList.add('hiding');
    
    setTimeout(function() {
        content.innerHTML = "";
        fetch('pages/' + source)
            .then(response => {
                return response.text()
            })
            .then(text => {
                content.innerHTML = '';
                content.classList.remove('hiding');
                var container = document.createElement('div');
                container.innerHTML = text;

                initEntranceAnimations(container);

                content.appendChild(container);
                callback();
            });
    }, 500);
}

function menuItemClick(e) {
    e.preventDefault();

    if (e.srcElement.classList.contains('menu-item-selected')) {
        return;
    }

    Array.from(document.getElementsByClassName('menu-item')).forEach(element => {
        element.classList.remove('menu-item-selected');
        element.classList.remove('menu-item-active');
    });
    var sourceUrl = e.srcElement.getAttribute('data-source');
    e.srcElement.classList.add('menu-item-selected');
    e.srcElement.classList.add('menu-item-active');

    loadPage(sourceUrl, function() {
        e.srcElement.classList.remove('menu-item-active');
    });
}

function createMenu(data, activeUrl) {
    var menu = document.getElementById("menu-items");
    data.pages.forEach(element => {
        var item = document.createElement('a');
        item.classList.add('menu-item');
        item.href = element.url;
        item.setAttribute("data-source", element.source);
        item.addEventListener('click', menuItemClick);
        item.innerText = element.name;

        var progressItem1 = document.createElement('div');
        progressItem1.classList.add('menu-item-progress-slow');
        item.appendChild(progressItem1);
        var progressItem2 = document.createElement('div');
        progressItem2.classList.add('menu-item-progress-fast');
        item.appendChild(progressItem2);

        menu.appendChild(item);

        if (element.url == activeUrl) {
            item.classList.add('menu-item-selected');
            loadPage(element.source);
        }
    });
}

function applyTheme() {
    theme = window.localStorage.getItem('theme');
    document.body.classList.remove('dark', 'light', 'light2');
    document.body.classList.add(theme);
}

function switchTheme(theme) {
    window.localStorage.setItem('theme', theme);
    applyTheme();
}

window.addEventListener('load', (event) => {
    createMenu(data, "/");

    // Set avatar
    document.getElementById('header-logo').style.backgroundImage = "url(" + data.avatarUrl + ")";
    
    // Set theme change button event handlers
    document.getElementsByClassName('switch-theme-button-dark')[0].addEventListener('click', function() {
        switchTheme('dark');
    });
    document.getElementsByClassName('switch-theme-button-light')[0].addEventListener('click', function() {
        switchTheme('light2');
    });

    // Set default theme
    if (window.localStorage.getItem('theme') == null) {
        window.localStorage.setItem('theme', 'light2');
    }
    applyTheme();
});
