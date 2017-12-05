import $ from 'jquery';
import 'bootstrap';
import gmaps from '@google/maps';

// import places from './config/places.json';
import words from './config/words.json';
import { GMAPS_API_KEY, GIPHY_API_KEY, LOCATION } from './config/config';

window.jQuery = $;
window.$ = $;

let places = [];

const giveMeOnePlace = (places) => {
  let place = places[Math.floor(Math.random()*places.length)];

  if (!place.opening_hours || place.opening_hours.open_now) {
    return place;
  }

  return giveMeOnePlace(places);
};

const giveMeOneWord = (words) => {
  return words[Math.floor(Math.random()*words.length)].name;
};

const initMaps = () => {
  const client = gmaps.createClient({
    key: GMAPS_API_KEY
  });
  const radius = 300;
  const type = 'restaurant';

  const request = {
    location: LOCATION.latlng,
    radius,
    type
  };

  client.placesNearby(request, ({ results }) => {
    console.log(results);
  });

  const urlString = `nearbysearch/json?location=${LOCATION.latlng}&radius=${radius}&type=${type}&key=${GMAPS_API_KEY}`;

  $.get(urlString, ({ results }) => {
    places = results;
  });
};

const initFoodThing = () => {
  const limit = 50;
  const searchTerms = 'delicious+food';
  const giphyApi = `gifs/search?q=${searchTerms}&api_key=${GIPHY_API_KEY}&limit=${limit}`;
  let gifs = [];

  $.get(giphyApi)
    .done(({ data }) => {
      gifs = data;
      $('#givemefood').removeClass('disabled');
    });

  $('#givemefood').click(() => {
    const place = giveMeOnePlace(places);
    const word = giveMeOneWord(words);
    const number = Math.floor(Math.random() * gifs.length);
    const url = gifs[number].images.fixed_height.url;
    const alt = gifs[number].slug;

    $('#foodplace').empty().append(`<p>${word} <a href="https://www.google.com/maps/?q=${place.geometry.location.lat},${place.geometry.location.lng}" target="_blank" class="text-primary">${place.name}</a></p>`);
    $('#foodimg').empty().append(`<img src="${url}" alt="${alt}" />`);
    $('#givemefood').empty().append('something else...');
  });
};

initMaps();
initFoodThing();
