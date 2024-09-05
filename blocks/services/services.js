export default function decorate(block) { 
  // Create a container for the service cards
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');

  // Iterate over each child element within the block
  [...block.children].forEach((child) => {
    // Add a class to each child element for clearer CSS targeting
    child.classList.add('card');

    // Assign a unique class to the div containing the image
    const imageWrapper = child.firstElementChild;
    imageWrapper.classList.add('image-wrapper');

    // Assign a unique class to the div containing the card information
    const infoWrapper = child.lastElementChild;
    infoWrapper.classList.add('info-wrapper');

    // Find and remove the last <p> element that contains the link. Keep track of href value. 
    const lastParagraph = infoWrapper.querySelector('p:last-of-type');
    const link = lastParagraph.querySelector('a');
    let href = '#';

    if (lastParagraph.contains(link)) {
      href = link?.href;
      lastParagraph.remove();
    }
  
    // Create a new <a> element to wrap the entire card, enabling redirect on click
    const wrapperLink = document.createElement('a');
    wrapperLink.href = href;

    // Append the child element into the wrapper link
    wrapperLink.appendChild(child);

    // Append the wrapper link to the card container
    cardContainer.appendChild(wrapperLink);
  });

  // Append the card container to the block element
  block.appendChild(cardContainer);
}
