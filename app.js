// 1) закидываем APi ключ в переменную
const API_KEY = '6cd536dc-7555-4933-a640-533877cac40a'
// 2) задаем URL для запросов к API для получения списка популярных фильмов
const API_KEY_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS'
// 14) задаем URL для запросов к API для поиска фильмов по ключевому слову до keyword=
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='

const API_URL_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'

getMovies(API_KEY_POPULAR)


// 3) создаем асинхронную ф с парметром URL
async function getMovies(url) {
    // 4) Создаем переменную ответ, в ней выполяем запрос на сервер с методом fetch, используя URL и заголовки с ключами и типом контента
    const response = await fetch(url, {
        headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
        }

    })
    // 5) После получение ответа от сервера, извлекаем данные в формате json()
    const responseData = await response.json()
    // console.log(response);
    // console.log(responseData);

    // 6.1) после того как получили данные, вызовем функцию showMovies, где будут лежать полученные данные
    showAllMovies(responseData)
}

// 13) Функция которая в зависимости от рейтинга будет передавать нужный класс с цветом            
function getClassColorForRating(ratingLudei) {
    if (ratingLudei > 7) {
        return 'green'
    } else if (ratingLudei > 5) {
        return 'yellow'
    } else {
        return 'red'
    }
}

// 6) Функция которая будет отрисовывать все карточки. Параметр data содержит массив объектов - много фильмов
function showAllMovies(data) {
    // 7) отловим элемент где будут лежать ВСЕ фильмы
    const allMovies = document.querySelector('.movies')
    // console.log(allMovies);

    // 7.1) Очищаем предыдущие фильмы для результат нового поиска фильмов
    allMovies.innerHTML = ''

    // 8) в data(то же что и responseData) у нас есть массив films. Используем forEach для перебора всех элементов массива films
    data.films.forEach( movie => {
        // 9) создаем элемент или контейнер(каждую отдельную карточку) через js
        const oneMovie = document.createElement('div')
        // console.log(oneMovie);

        // 10) к div-у добавляем класс с именем movie
        oneMovie.classList.add('movie')

        // 11) создаем HTML код карточки
        oneMovie.innerHTML = `
            <div class="movie-cover-inner">
                <img class="movie-cover" src="${movie.posterUrl}" alt="${movie.nameRu}">
                <div class="movie-cover-dark"></div>
            </div>
            <div class="movie-info">
                <div class="movie-title">${movie.nameRu}</div>
                <div class="movie-category">${movie.genres.map(genre => ` ${genre.genre}`)}</div>
                <div class="movie-rate movie-rate-${getClassColorForRating(movie.rating)}">${movie.rating}</div>
            </div>  
        `
        // 
        oneMovie.addEventListener('click', () => openModal(movie.filmId))

        // 12) В элемент ВСЕ ФИЛЬМЫ добавляем каждую отдельную карточку
        allMovies.appendChild(oneMovie)
    })
}


// 15) отловим и зададим переменные для поиска form и search
const form = document.querySelector('form')
const search = document.querySelector('.header-search')

// 16) устанавливаем слушатель для form и передаем функцию которая вызывается после SUBMIT
form.addEventListener('submit', (e) => {
    // 17) Убираем по умолчанию перезагрузку страницы при отправки формы
    e.preventDefault()

    // 18) создаем URL для запроса на сервер
    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`

    // 19) если поле поиска true, то 
    if (search.value) {

        // 20) вызываем getMovies, передавая URL для выполнения запроса для получения результата поиска фильма
        getMovies(apiSearchUrl)

        // 21) обнуляем значение поля поиска после Submit
        search.value = ''
    }

})

// Создаем модульное окно

const modalEl = document.querySelector('.modal')

async function openModal(id) {
    console.log(id);

    const response = await fetch(API_URL_MOVIE_DETAILS + id, {
        headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
        }
    })
    const responseData = await response.json()

    modalEl.classList.add('modal-show')

    document.body.classList.add('stop-scrolling')

    modalEl.innerHTML = `
        <div class="modal-card">
        
            <img class="modal-movie-image" src="${responseData.posterUrl}" alt="${responseData.nameRu}">
            <h2>
                <span class="modal-movie-title">${responseData.nameRu}</span>
                <span class="modal-movie-release-year"> - ${responseData.year}</span>
            </h2>
            <ul class="modal-movie-info">
                <div class="loader"></div>
                <li class="modal-movie-genre">${responseData.genres.map(genre => ` ${genre.genre}`)}</li>
                ${(responseData.filmLength) ? `<li class="modal-movie-runtime">${responseData.filmLength} минут</li>` : ''}
                <li>Сайт: <a class="modal-movie-website" href="${responseData.webUrl}">${responseData.webUrl}</a></li>
                ${(responseData.description) ? `<li class="modal-movie-overview">${responseData.description}</li>` : ''}
            </ul>
            <button type="button" class="modal-button-close">Закрыть</button>
        </div>
    `
    const btnClose = document.querySelector('.modal-button-close')
    console.log(btnClose);
    btnClose.addEventListener('click', () => closeModal())
}


function closeModal() {
    modalEl.classList.remove('modal-show')
    document.body.classList.remove('stop-scrolling')
}

window.addEventListener('click', (e) => {
    // console.log(modalEl);
    if (e.target === modalEl) {
        closeModal()
    }
})

window.addEventListener('keydown', (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 27) {
        closeModal()
    }
})


// // СОЗДАЕМ ПАГИНАЦИЮ СТРАНИЦ
const paginationURL = API_KEY_POPULAR + '&page='
const buttons = document.querySelectorAll('.page-btn')

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const numberOfPage = button.textContent
        const pageLink = paginationURL + numberOfPage
        // console.log(pageLink);

        getMovies(pageLink)
    })
})

