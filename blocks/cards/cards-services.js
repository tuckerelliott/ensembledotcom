export default function CardsServices(block) {
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');

  [...block.children].forEach(child => {
    child.classList.add('card');

    const imageWrapper = child.firstElementChild;
    imageWrapper.classList.add('image-wrapper');

    const infoWrapper = child.lastElementChild;
    infoWrapper.classList.add('info-wrapper');

    const lastParagraph = infoWrapper.querySelector('p:last-of-type');
    const link = lastParagraph.querySelector('a');
    let href = '#';

    if (lastParagraph.contains(link)) {
      href = link?.href;
      lastParagraph.remove();
    }

    const wrapperLink = document.createElement('a');
    wrapperLink.href = href;

    wrapperLink.appendChild(child);
    cardContainer.appendChild(wrapperLink);
  });

  block.appendChild(cardContainer);
}
