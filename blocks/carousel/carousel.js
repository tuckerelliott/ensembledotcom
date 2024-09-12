import { createOptimizedPicture } from '../../scripts/aem.js';

async function fetchCarouselData(block) {
  const link = block.querySelector('a');
  let data = [];
  const response = await fetch(link?.href);
  if (response.ok) {
    const jsonData = await response.json();

    // grab nested array from the response
    data = jsonData.data;
  } else {
    // eslint-disable-next-line no-console
    console.log('Failed to fetch carousel data');
  }

  // remove element after fetching data
  link?.remove();
  return data;
}

function groupDataByTitle(data) {
  const groupedData = {};
  data.forEach(item => {
    // use the title as the group key
    const groupKey = item.Title.toLowerCase().replace(/\s+/g, '-');
    groupedData[groupKey] = item;
  });
  return groupedData;
}

function createCarouselCard(card, key) {
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card', key);
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-wrapper');
  const infoContainer = document.createElement('div');
  infoContainer.classList.add('info-wrapper');

  const title = document.createElement('p');
  title.textContent = card.Title;

  const services = document.createElement('p');
  services.textContent = card.Services;

  const description = document.createElement('p');
  description.textContent = card.Description;

  // only append image if imageUrl exists
  const image = createOptimizedPicture(card.image, card.Title, true, [
    { width: '210' },
  ]);

  // append elements to the containers
  infoContainer.appendChild(title);
  infoContainer.appendChild(services);
  infoContainer.appendChild(description);
  imageContainer.appendChild(image);
  cardContainer.appendChild(imageContainer);
  cardContainer.appendChild(infoContainer);

  return cardContainer;
}

function renderData(groupedData, block) {
  // create carousel container for the items
  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-container');

  // create carousel navigation container & buttons
  const navContainer = document.createElement('div');
  navContainer.classList.add('carousel-nav');
  const prevButton = document.createElement('button');
  const prevIcon = document.createElement('img');
  prevIcon.src = '/icons/left-arrow.png';
  prevButton.classList.add('left-arrow');
  prevButton.appendChild(prevIcon);

  const nextButton = document.createElement('button');
  const nextIcon = document.createElement('img');
  nextButton.classList.add('right-arrow');
  nextIcon.src = '/icons/right-arrow.png';
  nextButton.appendChild(nextIcon);

  block.appendChild(prevButton);
  block.appendChild(carouselInner);
  block.appendChild(nextButton);
  navContainer.appendChild(prevButton);
  navContainer.appendChild(nextButton);
  block.appendChild(navContainer);

  function determineCardCount() {
    return window.innerWidth < 768 ? 1 : 2;
  }

  Object.keys(groupedData).forEach((key, index) => {
    const card = groupedData[key];
    const cardElement = createCarouselCard(card, key);

    // set active class for the first item
    let currentIndex = 0;
    if (index >= currentIndex && index < currentIndex + determineCardCount()) {
      cardElement.classList.add('active');
    }
    carouselInner.appendChild(cardElement);
  });

  // add event listeners for navigation buttons
  let currentIndex = 0;
  const totalItems = Object.keys(groupedData).length;

  function updateActiveCard() {
    const cards = carouselInner.querySelectorAll('.card');
    const cardCount = determineCardCount();
    cards.forEach((card, index) => {
      if (index >= currentIndex && index < currentIndex + cardCount) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  prevButton.addEventListener('click', () => {
    const cardCount = determineCardCount();
    currentIndex = (currentIndex - cardCount + totalItems) % totalItems;
    updateActiveCard();
  });

  nextButton.addEventListener('click', () => {
    const cardCount = determineCardCount();
    currentIndex = (currentIndex + cardCount) % totalItems;
    updateActiveCard();
  });

  window.addEventListener('resize', () => {
    const cardCount = determineCardCount();
    if (currentIndex >= totalItems - cardCount + 1) {
      currentIndex = cardCount > totalItems ? 0 : totalItems - cardCount;
    }

    updateActiveCard();
  });
}

export default async function decorate(block) {
  const data = await fetchCarouselData(block);
  const groupedData = groupDataByTitle(data);
  renderData(groupedData, block);
}