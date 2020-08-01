'use strict';
import items_gallery from './gallery_template.hbs';
import '@pnotify/core/dist/BrightTheme.css';
import { alert } from '@pnotify/core/dist/PNotify.js';

const refs = {
  gallery_place: document.querySelector('.gallery_place'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.input_Text'),
  loadMore: document.querySelector('.load_more'),
  numberOfphotos: document.querySelector('.numberOfphotos'),
  item_gallery: document.querySelector('.item_gallery'),
};

const debounce = require('lodash/debounce');
const state = {
  itemsPerPage: 12,
  page: 1,
  images: [],
};

///=================
refs.numberOfphotos.value = state.itemsPerPage;
refs.numberOfphotos.disabled = true;

const handlerSetPages = nextPage => {
  refs.numberOfphotos.value = state.itemsPerPage * nextPage;
  return;
};
const withANewTerm = () => {
  state.images = [];
  refs.numberOfphotos.value = 12;
  state.page = 1;
};

const paint = array => {
  const showFirstPageGallery = array
    .map(items => items_gallery(items))
    .join('');

  refs.gallery.innerHTML = showFirstPageGallery;

  return;
};

const info = () => {
  alert({
    type: 'info',
    shadow: true,
    styling: 'brighttheme',
    icons: 'brighttheme',
    title: 'Увага Друже !',
    text: 'Заповни поле ',
    delay: 1000,
  });
};

const erred = () => {
  alert({
    type: 'error',
    shadow: true,
    styling: 'brighttheme',
    icons: 'brighttheme',
    title: 'Увага Друже !',
    text: 'Мабудь щось пішло не так. Спробуй ще раз... Латиницею ',
    delay: 1000,
  });
};

const load = str => {
  if (str !== '') {
    const templ = /[а-я]|ї|є|ё|ґ/ig;
    if(templ.test(str)===true){
      return erred();
    };
    const url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${str}&page=${state.page}&per_page=12&key=17529185-ee1c09177ccec717363f5cb46`;
    fetch(url)
      .then(data => data.json())
      .then(data => {
        state.images = data.hits;

        paint(state.images);

        return;
      })
      .catch(() => {
        erred();
        return;
      });
  } else {
    withANewTerm();
    info();
    return;
  }
};

const getInput = event => {
  state.str = '';
  refs.gallery.innerHTML = '';
  const str = event.target.value;
  load(str);
  state.str = str;
};

const loadMore = event => {
  event.preventDefault();
  const str = state.str;
  if (str === '') {
    erred();
    return;
  }

  state.page++;

  const nextPage = state.page;

  handlerSetPages(nextPage);

  const url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${str}&page=${nextPage}&per_page=12&key=17529185-ee1c09177ccec717363f5cb46`;

  fetch(url)
    .then(data => data.json())
    .then(data => {
      if (str !== '') {
        state.images = [...data.hits];
        refs.gallery.insertAdjacentHTML('beforeend', state.image);
        paint(state.images);
        console.log();
        window.scrollTo(0, window.innerHeight);

        return;
      }

      withANewTerm();

      return;
    });
};
// =============================

// =========================

refs.loadMore.addEventListener('click', loadMore);

refs.input.addEventListener('input', debounce(getInput, 1000));
