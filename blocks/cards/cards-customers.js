import { createOptimizedPicture } from '../../scripts/aem.js';

export default function CardsCustomers(block) {
  const link = block.querySelector('a');
  let data = [];
  let totalSlides;

  block.textContent = '';

  // eslint-disable-next-line no-shadow
  function sortData(data) {
    const result = [];
    const groupSize = 9;

    for (let i = 0; i < data.length; i += groupSize) {
      result.push(data.slice(i, i + groupSize));
    }
    return result;
  }

  function createSlides(sortedGroups) {
    const updatedSlides = [];

    sortedGroups.forEach(group => {
      const slideDiv = document.createElement('div');
      slideDiv.classList.add('slide');

      group.forEach(customer => {
        const optimizedImage = createOptimizedPicture(
          customer.image,
          customer.name,
          true,
          [{ width: '210' }],
        );

        const cardHtml = `<div class="card">${optimizedImage.outerHTML}</div>`;
        slideDiv.innerHTML += cardHtml;
      });

      updatedSlides.push(slideDiv.outerHTML);
    });

    block.innerHTML = `<div class="carousel-wrapper">
      <div class="cards-carousel">
        ${updatedSlides.join('')}
      </div>
      <div class="carousel-nav-controls">
        <button class="arrow left-arrow">
          <img src="/icons/left-arrow.png" title="Left Arrow Icon"/>
        </button>
        <button class="arrow right-arrow">
          <img src="/icons/right-arrow.png" title="Right Arrow Icon"/>
        </button>
      </div>
    </div>`;

    const carousel = block.querySelector('.cards-carousel');
    carousel.style.width = `${sortedGroups.length * 100}%`;

    // Calculate totalSlides here, after the slides are created
    totalSlides = block.querySelectorAll('.slide').length;

    // eslint-disable-next-line no-use-before-define
    addEventListeners(totalSlides);
  }

  let currentSlide = 0;
  function showSlide(index) {
    // Calculate the new left offset of the carousel
    const newLeftOffset = index * -100; // 100% is the width of each slide
    block.querySelector('.cards-carousel').style.left = `${newLeftOffset}%`;

    // Add or remove 'disabled' class based on the current slide
    const leftArrow = block.querySelector('.left-arrow');
    const rightArrow = block.querySelector('.right-arrow');

    if (index === 0) {
      leftArrow.classList.add('disabled');
    } else {
      leftArrow.classList.remove('disabled');
    }

    if (index === totalSlides - 1) {
      rightArrow.classList.add('disabled');
    } else {
      rightArrow.classList.remove('disabled');
    }
  }

  // eslint-disable-next-line no-shadow
  function addEventListeners(totalSlides) {
    const leftArrow = block.querySelector('.left-arrow');
    const rightArrow = block.querySelector('.right-arrow');

    leftArrow.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
      }
    });

    rightArrow.addEventListener('click', () => {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        showSlide(currentSlide);
      }
    });

    // Initially add the 'disabled' class to the left arrow
    leftArrow.classList.add('disabled');
  }

  async function initialize() {
    const response = await fetch(link?.href);

    if (response.ok) {
      const jsonData = await response.json();
      data = jsonData?.data;

      const sortedGroups = sortData(data);
      createSlides(sortedGroups);
    } else {
      console.log('Unable to get json data for cards customers block');
    }
  }

  initialize();
}
