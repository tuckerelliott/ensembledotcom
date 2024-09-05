import { createOptimizedPicture } from '../../scripts/aem.js';

export default function CardsPortfolio(block) {
  const link = block.querySelector('a');
  let data = [];

  block.textContent = '';

  function createCards(groups) {
    const updatedCards = [];

    groups.forEach(group => {
      if (group.length === 5) {
        const smallCards = [];

        group.forEach((item, i) => {
          if (i === 0 && item.caseStudy === 'true') {
            const optimizedBgImage = createOptimizedPicture(
              item.backgroundImage,
              item.name,
              true,
              [{ width: '600' }],
            );
            const optimizedLogoImage = createOptimizedPicture(
              item.logoImage,
              item.name,
              true,
              [{ width: '600' }],
            );

            updatedCards.push(`
              <div class="case-study-card">
                <div class="wrapper">
                  <a href="${item.url}">
                    <div class="pill">Case Study</div>
                    <div class="card-images">
                      ${optimizedBgImage.outerHTML}
                      ${optimizedLogoImage.outerHTML}
                    </div>
                  </a>
                </div>
              </div>
            `);
          } else {
            const optimizedBgImage = createOptimizedPicture(
              item.backgroundImage,
              item.name,
              true,
              [{ width: '350' }],
            );
            const optimizedLogoImage = createOptimizedPicture(
              item.logoImage,
              item.name,
              true,
              [{ width: '350' }],
            );

            smallCards.push(`
              <div class="small-card">
                <div class="card-flip wrapper">
                  <div class="card card-images">
                    ${optimizedBgImage.outerHTML}
                    ${optimizedLogoImage.outerHTML}
                  </div>
                  <div class="card card-info">
                    <p class="desktop">${item.description}</p>
                    <p class="mobile"><a href="${item.contactUsLink}">Contact Us</a> to learn more about this project</p>
                    <a class="desktop-contact-us" href="${item.contactUsLink}">Contact Us</a>
                  </div>
                </div>
              </div>
            `);
          }
        });

        updatedCards.push(`
          <div class="small-card-container">
            ${smallCards.join('')}
          </div>
        `);
      } else {
        // TBD: group of 8
      }
    });

    block.innerHTML = `<div class="portfolio-card-container">${updatedCards.join('')}</div>`;

    // Add card-flip animation
    const cards = document.querySelectorAll('.card-flip');
    [...cards].forEach(card => {
      card.addEventListener('click', function () {
        card.classList.toggle('is-flipped');
      });
    });
  }

  // eslint-disable-next-line no-shadow
  function sortData(data) {
    // TBD: Need to optimize to support 8 cards
    const result = [];
    let temp = [];
    let count = 0;
    let caseStudyFound = false;

    for (let i = 0; i < data.length; i++) {
      temp.push(data[i]);
      count++;

      if (data[i].caseStudy === 'true') {
        caseStudyFound = true;
        temp.sort((a, b) => b.caseStudy.localeCompare(a.caseStudy));
      }

      if ((caseStudyFound && count === 5) || (!caseStudyFound && count === 8)) {
        result.push(temp);
        temp = [];
        count = 0;
        caseStudyFound = false;
      }
    }

    // If there are any remaining items in temp, add them to the result
    if (temp.length > 0) {
      result.push(temp);
    }

    return result;
  }

  async function initialize() {
    const response = await fetch(link?.href);

    if (response.ok) {
      const jsonData = await response.json();
      data = jsonData?.data;

      const sortedGroups = sortData(data);
      createCards(sortedGroups);
    } else {
      console.log('Unable to get json data for cards portfolio');
    }
  }

  initialize();
}
