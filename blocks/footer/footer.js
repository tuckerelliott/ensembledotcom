import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Set background image
  const footerWrapper = document.querySelector('footer');
  const firstSection = footer.querySelectorAll('.section')[0];
  const imageSource = firstSection.querySelector('source[type="image/jpeg"]');
  const srcset = imageSource.getAttribute('srcset');

  // eslint-disable-next-line prefer-template
  footerWrapper.style.backgroundImage = 'url(' + srcset + ')';
  const imageWrapper = firstSection.querySelector('p');
  imageWrapper.remove();

  // Modify section html
  const secondSection = footer.querySelectorAll('.section')[1];
  const defaultContentWrapper = secondSection.querySelector(
    '.default-content-wrapper',
  );
  const newDiv = document.createElement('div');
  newDiv.classList.add('wrapper');
  const allParagraphs = defaultContentWrapper.querySelectorAll('p');

  for (let i = allParagraphs.length - 2; i < allParagraphs.length; i++) {
    newDiv.appendChild(allParagraphs[i]);
  }

  defaultContentWrapper.appendChild(newDiv);

  block.append(footer);

  // Update brand logo title attribute
  const section = block.querySelector(
    '.section:nth-child(2) .button-container',
  );
  const iconName = section.querySelector('img');
  const link = section.querySelector('a');
  if (iconName && link) {
    const iconNameValue = iconName.getAttribute('data-icon-name');
    link.setAttribute('title', iconNameValue);
  }
}
