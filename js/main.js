// Import stylesheets
import './style.css';

// Запросы, XMLHttpRequest, AJAX.  Домашняя работа

// Создать контактную книжку на основе Todo List.
// Функционал должен включать в себя:

// 1. Создание контакта (Имя, Фамилия, номер телефона)
// 2. Удаление контакта
// 3. Список контактов на главном экране
// 4. Использовать json-server.
// 5. Редактирование контакта
// 6. Пагинация(дополнительно)
// 7. Поиск(дополнительно)

let url = 'http://localhost:8000/contacts';
let btn = document.getElementById('btn');
let contactName = document.getElementById('name');
let lastName = document.getElementById('last-name');
let phone = document.getElementById('phone');
let contactsDiv = document.getElementById('contacts');
let modal = document.getElementById('modal');
let background = document.getElementById('background');
let saveBtn = document.getElementById('save');
let closeBtn = document.getElementById('close-btn');
let modalName = document.getElementById('modal-name');
let modalLastName = document.getElementById('modal-lastname');
let modalPhone = document.getElementById('modal-phone');
let searchBar = document.getElementById('search-bar');
let page = 1;
let pageCount = 1;
let nextBtn = document.getElementById('next');
let prevBtn = document.getElementById('previous');
let pagesDiv = document.getElementById('pages');

// Вешаем POST запрос на кнопку

btn.addEventListener('click', (e) => {
    let _name = contactName.value;
    let _lastname = lastName.value;
    let _phone = phone.value;
    e.preventDefault();
    if (!_name || !_lastname || !_phone) {
        alert('Заполните форму');
        return;
    }
    let obj = {
        name: _name,
        lastname: _lastname,
        phone: _phone,
    };
    postData(obj);
    contactName.value = '';
    lastName.value = '';
    phone.value = '';
    getPagination();
});

// Функция для POST запроса

function postData(data) {
    fetch(`${url}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
    }).then(() => render());
}

// Функция отрисовки контактов

async function render() {
    let response = await fetch(`${url}?_limit=3&_page=${page}`);
    let data = await response.json();
    contactsDiv.innerHTML = '';
    data.forEach((item) => {
        let p = document.createElement('p');
        p.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/1160/1160515.png" class="btn-edit"> <br> Имя: ${item.name} <br> Фамилия: ${item.lastname} <br> Телефон: ${item.phone} <br> <button class="btn-delete">Удалить контакт</button>`;
        p.setAttribute('id', `${item.id}`);
        contactsDiv.append(p);
    });
    let deleteBtns = document.querySelectorAll('.btn-delete');
    let editBtns = document.querySelectorAll('.btn-edit');
    addDeleteEvent(deleteBtns);
    addEditEvent(editBtns);
}

// Функция добавляет событие удаления кнотактов на динамически созданные кнопки

function addDeleteEvent(buttons) {
    buttons.forEach((item) => {
        item.addEventListener('click', (e) => {
            let id = e.target.parentNode.id;
            deleteContact(id);
            getPagination();
        });
    });
}

// Функция добавляет событие изменение кнотактов на динамически созданные кнопки

function addEditEvent(buttons) {
    buttons.forEach((item) => {
        item.addEventListener('click', (e) => {
            let id = e.target.parentNode.id;
            modal.classList.toggle('active');
            background.classList.toggle('active');
            fetch(`${url}/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    modalName.value = `${data.name}`;
                    modalLastName.value = `${data.lastname}`;
                    modalPhone.value = `${data.phone}`;
                    modalPhone.setAttribute('class', `${id}`);
                });
        });
    });
}

// Собыите для скрытия модалки при клике на серый фон

background.addEventListener('click', () => {
    modal.classList.toggle('active');
    background.classList.toggle('active');
});

// Собыите для скрытия модалки при клике на кнопку X

closeBtn.addEventListener('click', () => {
    modal.classList.toggle('active');
    background.classList.toggle('active');
});

// Функция для удаления контактов

function deleteContact(id) {
    fetch(`${url}/${id}`, {
        method: 'DELETE',
    }).then(() => render());
}

// Собыите на сохраннение измененных данных 

saveBtn.addEventListener('click', () => {
    if (
        !modalName.value.trim() ||
        !modalLastName.value.trim() ||
        !modalPhone.value.trim()
    ) {
        alert('Заполните форму');
        return;
    }
    let id = modalPhone.getAttribute('class');
    editContact(id);
    modal.classList.toggle('active');
    background.classList.toggle('active');
});

// Функция изменения данных

function editContact(id) {
    let obj = {
        name: modalName.value,
        lastname: modalLastName.value,
        phone: modalPhone.value,
    };
    fetch(`${url}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
    }).then(() => render());
}

// Событие поиска контактов

searchBar.addEventListener('input', () => {
    let value = searchBar.value;
    renderSearched(value);
});

// Функция отрисовки найденных данных

async function renderSearched(value) {
    //Запрос данных по значению инпута
    let response = await fetch(`${url}?q=${value}&_limit=3&_page=${page}`);
    let data = await response.json();
    contactsDiv.innerHTML = '';
    data.forEach((item) => {
        let p = document.createElement('p');
        p.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/1160/1160515.png" class="btn-edit"> <br> Имя: ${item.name} <br> Фамилия: ${item.lastname} <br> Телефон: ${item.phone} <br> <button class="btn-delete">Удалить контакт</button>`;
        p.setAttribute('id', `${item.id}`);
        contactsDiv.append(p);
    });
    let deleteBtns = document.querySelectorAll('.btn-delete');
    let editBtns = document.querySelectorAll('.btn-edit');
    addDeleteEvent(deleteBtns);
    addEditEvent(editBtns);
}

// Функция пагинации

function getPagination() {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            pageCount = Math.ceil(data.length / 3);
            pagesDiv.innerHTML = '';
            for (let i = pageCount; i >= 1; i--) {
                let newBtn = document.createElement('button');
                newBtn.setAttribute('class', 'pagination-page');
                newBtn.innerText = `${i}`;
                pagesDiv.prepend(newBtn);
            }
            let pages = document.querySelectorAll('.pagination-page');
            pages.forEach((item) => {
                item.addEventListener('click', (e) => {
                    page = e.target.innerText;
                    render();
                });
            });
        });
}

// Собыите на переключение страниц 

nextBtn.addEventListener('click', () => {
    if (page >= pageCount) return;
    page++;
    render();
});
prevBtn.addEventListener('click', () => {
    if (page <= 1) return;
    page--;
    render();
});

render();
getPagination();

