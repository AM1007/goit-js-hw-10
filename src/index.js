import './css/styles.css';
import { CountriesService } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  ulList: document.querySelector('.country-list'),
  divInfo: document.querySelector('.country-info'),
};

// Екземпляр класу CountriesService

const countriesService = new CountriesService();

//Прослуховувач на "input"

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

// Отримання користувальницького тексту в полі "input"

function onSearch(event) {
  event.preventDefault();
  if (event.target.value.trim() === '') {
    clearPage();
    return;
  }
  countriesService.searchInput = event.target.value.trim();
  countriesService
    .fetchCountries()
    .then(data => renderMarkup(data))
    .catch(handleError);
}

// Повідомлення про помилку

const handleError = () => {
  Notify.failure('Oops, there is no country with that name');
};

// Розмітка для однієї страни

function markupOneCountry(data) {
  return data
    .map(country => {
      return `<img src="${
        country.flags.svg
      }" alt="Flag" width="30" height="24"></img>
                <h2 class="country-info-title">${country.name.official}</h2>
            <p>Capital: <span>${
              country.capital
            }</span></p><p>Population: <span>${
        country.population
      }</span></p><p>Languages: <span>${Object.values(
        country.languages
      )}</span></p>`;
    })
    .join('');
}

// Розмітка для декількох стран (від двох до десяти)

function markupMoreCountries(data) {
  return data
    .map(country => {
      return `<li class="country-list-item"><img src="${country.flags.svg}" alt="Flag" width="20" height="16"></img>${country.name.official}</li>`;
    })
    .join('');
}

// Рендер розміткі в залежності від отриманих стран

function renderMarkup(data) {
  clearPage();
  if (data.length === 1) {
    refs.divInfo.insertAdjacentHTML('beforeend', markupOneCountry(data));
  } else if (data.length > 1 && data.length <= 10) {
    refs.ulList.insertAdjacentHTML('beforeend', markupMoreCountries(data));
  } else if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

// Відчищення розмітки

function clearPage() {
  refs.divInfo.innerHTML = '';
  refs.ulList.innerHTML = '';
}
