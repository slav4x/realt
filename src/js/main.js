/* eslint-disable operator-linebreak */
/* eslint-disable no-inner-declarations */

// ** FUNCTIONS ** //

const viewportFix = (width) => {
  const meta = document.querySelector('meta[name="viewport"]');
  meta.setAttribute('content', `user-scalable=no, width=${screen.width <= width ? width : 'device-width'}`);
};

viewportFix(420);

const maskOptions = {
  mask: '+7 (000) 000-00-00',
  onFocus: function () {
    if (this.value === '') this.value = '+7 ';
  },
  onBlur: function () {
    if (this.value === '+7 ') this.value = '';
  },
};

const maskPhone = () => {
  const maskedElements = document.querySelectorAll('.masked');
  maskedElements.forEach((item) => new IMask(item, maskOptions));
};

function setupTabs(tabSelector, contentSelector) {
  document.querySelectorAll(tabSelector).forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll(tabSelector).forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const activeDataId = tab.dataset.id;
      document.querySelectorAll(contentSelector).forEach((content) => {
        content.classList.toggle('active', content.dataset.id === activeDataId);
      });
    });
  });
}

function setupAccordion(sectionSelector, itemSelector, titleSelector, contentSelector) {
  const section = document.querySelector(sectionSelector);
  if (section) {
    section.querySelectorAll(itemSelector).forEach((item) => {
      const title = item.querySelector(titleSelector);
      if (title) {
        const content = item.querySelector(contentSelector);
        title.addEventListener('click', () => {
          content.classList.toggle('open');
          title.classList.toggle('open');
          content.style.maxHeight = content.classList.contains('open') ? `${content.scrollHeight}px` : null;
        });
      }
    });
  }
}

function setupHoverInteraction(containerSelector, itemSelector, targetSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const targetItems = document.querySelectorAll(targetSelector);

  container.addEventListener('mouseover', (event) => {
    const item = event.target.closest(itemSelector);
    if (!item) return;

    container.querySelectorAll(itemSelector).forEach((li) => li.classList.remove('active'));
    item.classList.add('active');

    const activeDataId = item.getAttribute('data-id');
    targetItems.forEach((targetItem) => {
      targetItem.classList.toggle('active', targetItem.getAttribute('data-id') === activeDataId);
    });
  });
}

function setupPageScrolling(pageSelector, sliderSelector, sectionClass, itemClass) {
  const page = document.querySelector(pageSelector);
  if (!page) return;

  let scrollInterval;
  const content = sliderSelector ? document.querySelector(sliderSelector) : null;

  let isDown = false;
  let startX;
  let scrollLeft;

  if (content) {
    content.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'A') return;
      isDown = true;
      startX = e.pageX - content.offsetLeft;
      scrollLeft = content.scrollLeft;
    });

    content.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - content.offsetLeft;
      content.scrollLeft = scrollLeft - (x - startX);
    });
  }

  window.addEventListener('scroll', () => {
    const sections = sectionClass ? document.querySelectorAll(`.${sectionClass}`) : [];
    const sliderItems = itemClass ? document.querySelectorAll(`.${itemClass}`) : [];
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top - 100;
      const sectionBottom = section.getBoundingClientRect().bottom;
      if (sectionTop <= 0 && sectionBottom >= 0) {
        const currentActiveId = section.getAttribute('data-id');
        sliderItems.forEach((item) => {
          item.classList.toggle('active', item.getAttribute('data-id') === currentActiveId);
        });
      }
    });
  });
}

const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

const openPopup = (popupId) => {
  const popup = document.querySelector(`[data-popup="${popupId}"]`);
  if (!popup) {
    console.error(`Error: popup "${popupId}" not defined`);
    return;
  }

  const scrollbarWidth = getScrollbarWidth();
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  popup.classList.add('open');
};

const closePopup = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  document.querySelectorAll('[data-popup]').forEach((popup) => popup.classList.remove('open'));
};

window.addEventListener('resize', function () {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
});

document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);

  Fancybox.bind('[data-fancybox]', {
    dragToClose: false,
    autoFocus: false,
    placeFocusBack: false,
  });

  // ** INIT FUNCTIONS ** //
  maskPhone();

  setupTabs('.contact-map__tabs li', '.contact-map__list');
  setupTabs('.contact-info__tabs li', '.contact-info__base, .contact-info__data');

  setupAccordion('.faq', '.faq-item', '.faq-title', '.faq-text');
  setupAccordion('.service', '.service-item', '.service-item__section .title-md', '.service-item__links');

  setupHoverInteraction('.directions-links', 'li', '.directions-sidebar__item');
  setupHoverInteraction('.reviews', '.reviews-item', '.reviews-author__item');

  setupPageScrolling('.service-single', '.service-head__slider', 'service-section', 'service-head__item');
  setupPageScrolling('.price', '.price-head__slider', 'price-section', 'price-head__item');
  setupPageScrolling('.specialists-single', '.specialists-head__slider', 'specialists-section', 'specialists-head__item');

  // ** POPUP ** //
  document.querySelectorAll('[data-button]').forEach((button) => {
    button.addEventListener('click', () => openPopup(button.getAttribute('data-button')));
  });

  document.querySelectorAll('.popup-close, .popup-bg').forEach((closeTrigger) => {
    closeTrigger.addEventListener('click', closePopup);
  });

  // ** REVIEWS FORM ** //
  new TomSelect('#specialists-select', {
    plugins: ['remove_button'],
  });

  const textarea = document.getElementById('reviewTextarea');
  const counter = document.getElementById('counter');

  textarea.addEventListener('keyup', function () {
    const currentLength = textarea.value.length;
    counter.innerText = `${currentLength}/1000`;
  });

  // ** BURGER MENU ** //
  let isOpen = false;

  document.querySelector('.header-burger').addEventListener('click', function () {
    isOpen = !isOpen;

    const headerBurger = document.querySelector('.header-burger');
    const menu = document.querySelector('.menu');
    const header = document.querySelector('.header');

    headerBurger.classList.toggle('open');
    menu.classList.toggle('open');
    header.classList.toggle('fixed');

    menu.addEventListener('wheel', function (e) {
      e.stopPropagation();
    });

    window.scrollTo(0, 0);

    if (document.body.clientWidth < 1024) {
      document.body.style.overflow = isOpen ? 'hidden' : 'visible';
    }
  });

  // ** PRICE ACCORDION ** //
  const servicePrice = document.querySelector('.service-price__table');
  if (servicePrice) {
    const moreButtons = document.querySelectorAll('.service-price__more');

    moreButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const parent = button.closest('.service-price__row');

        if (parent) {
          button.classList.toggle('active');

          const textElement = parent.querySelector('.service-price__text');
          if (textElement) {
            textElement.classList.toggle('active');
          }
        }
      });
    });
  }

  // ** SEARCH ** //
  const searchInput = document.querySelector('.service-search input');
  const serviceBlock = document.querySelector('.service');

  if (searchInput) {
    document.querySelector('html').style.scrollBehavior = 'auto';
    searchInput.addEventListener('input', function () {
      const searchQuery = this.value.toLowerCase();
      const serviceItems = document.querySelectorAll('.service-item');
      let hasVisibleItems = false;

      serviceItems.forEach((item) => {
        const titleText = item.querySelector('.title-md').textContent.toLowerCase();
        const paragraphText = item.querySelector('p') ? item.querySelector('p').textContent.toLowerCase() : '';

        if (titleText.includes(searchQuery) || paragraphText.includes(searchQuery)) {
          item.style.display = '';
          hasVisibleItems = true;
        } else {
          item.style.display = 'none';
        }
      });

      if (hasVisibleItems) {
        serviceBlock.scrollIntoView({ block: 'start' });
      }
    });
  }

  // ** SLIDERS ** //
  const blogSlider = new Swiper('.blog-slider', {
    slidesPerView: 1,
    spaceBetween: 12,
    navigation: {
      nextEl: '.blog-next',
      prevEl: '.blog-prev',
    },
    breakpoints: {
      1760: {
        spaceBetween: 24,
        slidesPerView: 3,
      },
      1023: {
        slidesPerView: 3,
      },
      767: {
        slidesPerView: 2,
      },
    },
  });

  const licenseSlider = new Swiper('.license-slider', {
    slidesPerView: 1,
    spaceBetween: 12,
    navigation: {
      nextEl: '.license-next',
      prevEl: '.license-prev',
    },
    scrollbar: {
      el: '.license-scrollbar',
    },
    breakpoints: {
      1760: {
        spaceBetween: 24,
        slidesPerView: 2,
      },
      1280: {
        slidesPerView: 2,
      },
    },
  });

  if (window.innerWidth < 768) {
    const specialistsGrid = new Swiper('.specialists-grid__slider', {
      slidesPerView: 1,
      spaceBetween: 12,
      breakpoints: {
        576: {
          slidesPerView: 2,
        },
      },
    });
  }

  const blogSpecialists = new Swiper('.blog-specialists__slider', {
    slidesPerView: 1,
    spaceBetween: 12,
    navigation: {
      nextEl: '.blog-specialists__next',
      prevEl: '.blog-specialists__prev',
    },
    breakpoints: {
      1760: {
        spaceBetween: 24,
      },
      1280: {
        slidesPerView: 3,
      },
      576: {
        slidesPerView: 2,
      },
    },
  });

  const blogMore = new Swiper('.blog-more__slider', {
    slidesPerView: 1,
    spaceBetween: 12,
    navigation: {
      nextEl: '.blog-more__next',
      prevEl: '.blog-more__prev',
    },
    breakpoints: {
      1760: {
        spaceBetween: 24,
      },
      1280: {
        slidesPerView: 3,
      },
      576: {
        slidesPerView: 2,
      },
    },
  });

  const statSlider = new Swiper('.template-stats__slider', {
    slidesPerView: 1,
    spaceBetween: 12,
    navigation: {
      nextEl: '.template-stats__next',
      prevEl: '.template-stats__prev',
    },
  });
});
