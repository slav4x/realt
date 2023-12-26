/* eslint-disable operator-linebreak */
/* eslint-disable no-inner-declarations */

const viewportFix = (width) => {
  const meta = document.querySelector('meta[name="viewport"]');
  meta.setAttribute('content', `user-scalable=no, width=${screen.width <= width ? width : 'device-width'}`);
};

viewportFix(420);

document.addEventListener('DOMContentLoaded', function () {
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

  maskPhone();

  const faq = document.querySelector('.faq');
  if (faq) {
    const faqItem = faq.querySelectorAll('.faq-item');
    faqItem.forEach((item) => {
      const title = item.querySelector('.faq-title');
      const text = item.querySelector('.faq-text');
      title.addEventListener('click', function () {
        text.classList.toggle('open');
        title.classList.toggle('open');

        if (text.classList.contains('open')) {
          text.style.maxHeight = text.scrollHeight + 'px';
        } else {
          text.style.maxHeight = null;
        }
      });
    });
  }

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

  const service = document.querySelector('.service');
  if (service) {
    const serviceItem = service.querySelectorAll('.service-item');
    serviceItem.forEach((item) => {
      const title = item.querySelector('.service-item__section');
      const text = item.querySelector('.service-item__links');
      if (title) {
        title.addEventListener('click', function () {
          text.classList.toggle('open');
          title.classList.toggle('open');

          if (text.classList.contains('open')) {
            text.style.maxHeight = text.scrollHeight + 'px';
          } else {
            text.style.maxHeight = null;
          }
        });
      }
    });
  }

  const contactType = document.querySelectorAll('.contact-map__tabs li');
  contactType.forEach((item) => {
    item.addEventListener('click', function () {
      contactType.forEach((i) => i.classList.remove('active'));
      this.classList.add('active');

      const dataId = this.dataset.id;

      const contactList = document.querySelectorAll('.contact-map__list');
      contactList.forEach((item) => {
        if (item.dataset.id === dataId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });
  });

  const contactInfo = document.querySelectorAll('.contact-info__tabs li');
  contactInfo.forEach((item) => {
    item.addEventListener('click', function () {
      contactInfo.forEach((i) => i.classList.remove('active'));
      this.classList.add('active');

      const dataId = this.dataset.id;

      const contactBase = document.querySelectorAll('.contact-info__base');
      contactBase.forEach((item) => {
        if (item.dataset.id === dataId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      const contactData = document.querySelectorAll('.contact-info__data');
      contactData.forEach((item) => {
        if (item.dataset.id === dataId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });
  });

  // Получаем все элементы с классом service-price__more
  const servicePrice = document.querySelector('.service-price__table');
  if (servicePrice) {
    const moreButtons = document.querySelectorAll('.service-price__more');

    // Для каждой кнопки добавляем обработчик события клика
    moreButtons.forEach((button) => {
      button.addEventListener('click', () => {
        // Для текущей кнопки находим родительский элемент
        const parent = button.closest('.service-price__row');

        // Если родитель найден, добавляем/удаляем классы active
        if (parent) {
          button.classList.toggle('active');

          // Находим элемент с классом service-price__text и также добавляем/удаляем класс active
          const textElement = parent.querySelector('.service-price__text');
          if (textElement) {
            textElement.classList.toggle('active');
          }
        }
      });
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

  Fancybox.bind('[data-fancybox]', {
    dragToClose: false,
    autoFocus: false,
    placeFocusBack: false,
  });

  const directions = document.querySelector('.directions-links');
  if (directions) {
    const links = directions.querySelectorAll('li');
    const sidebarItems = document.querySelectorAll('.directions-sidebar__item');

    links.forEach((link) => {
      link.addEventListener('mouseover', function () {
        links.forEach((li) => li.classList.remove('active'));
        this.classList.add('active');

        const activeDataId = this.getAttribute('data-id');

        sidebarItems.forEach((item) => {
          item.classList.remove('active');
          if (item.getAttribute('data-id') === activeDataId) {
            item.classList.add('active');
          }
        });
      });
    });
  }

  const reviews = document.querySelector('.reviews');
  if (reviews) {
    const items = document.querySelectorAll('.reviews-item');
    const reviewsAuthor = document.querySelectorAll('.reviews-author__item');

    items.forEach((link) => {
      link.addEventListener('mouseover', function () {
        items.forEach((li) => li.classList.remove('active'));
        this.classList.add('active');

        const activeDataId = this.getAttribute('data-id');

        reviewsAuthor.forEach((item) => {
          item.classList.remove('active');
          if (item.getAttribute('data-id') === activeDataId) {
            item.classList.add('active');
          }
        });
      });
    });
  }

  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);

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

  const servicePage = document.querySelector('.service-single');
  if (servicePage) {
    let scrollInterval;

    const leftBtn = document.querySelector('.service-head__prev');
    const rightBtn = document.querySelector('.service-head__next');
    const content = document.querySelector('.service-head__slider');
    const wrapper = document.querySelector('.service-head__wrapper');
    const control = document.querySelector('.service-head__control');

    function startScrolling(direction) {
      const scrollAmount = direction === 'left' ? -10 : 10;
      scrollInterval = setInterval(() => {
        content.scrollLeft += scrollAmount;
      }, 20);
    }

    function stopScrolling() {
      clearInterval(scrollInterval);
    }

    function onMouseUpOrLeave() {
      stopScrolling();
      isDown = false;
    }

    leftBtn.addEventListener('mousedown', () => startScrolling('left'));
    rightBtn.addEventListener('mousedown', () => startScrolling('right'));

    [leftBtn, rightBtn].forEach((btn) => {
      btn.addEventListener('mouseup', onMouseUpOrLeave);
      btn.addEventListener('mouseleave', onMouseUpOrLeave);
    });

    let isDown = false;
    let startX;
    let scrollLeft;

    content.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'A') {
        return;
      }

      isDown = true;
      startX = e.pageX - content.offsetLeft;
      scrollLeft = content.scrollLeft;
    });

    content.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - content.offsetLeft;
      const walk = (x - startX) * 1;
      content.scrollLeft = scrollLeft - walk;
    });

    function toggleScrollButtons() {
      control.style.display = content.scrollWidth <= wrapper.offsetWidth ? 'none' : 'flex';
    }

    toggleScrollButtons();
    window.addEventListener('resize', toggleScrollButtons);

    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('.service-section');
      const sliderItems = document.querySelectorAll('.service-head__item');

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top - 100;
        const sectionBottom = section.getBoundingClientRect().bottom;

        if (sectionTop <= 0 && sectionBottom >= 0) {
          const currentActiveId = section.getAttribute('data-id');
          sliderItems.forEach((item) => {
            item.classList.remove('active');
            if (item.getAttribute('data-id') === currentActiveId) {
              item.classList.add('active');
            }
          });
        }
      });
    });
  }

  const pricePage = document.querySelector('.price');
  if (pricePage) {
    let scrollInterval;

    const leftBtn = document.querySelector('.price-head__prev');
    const rightBtn = document.querySelector('.price-head__next');
    const content = document.querySelector('.price-head__slider');
    const wrapper = document.querySelector('.price-head__wrapper');
    const control = document.querySelector('.price-head__control');

    function startScrolling(direction) {
      const scrollAmount = direction === 'left' ? -10 : 10;
      scrollInterval = setInterval(() => {
        content.scrollLeft += scrollAmount;
      }, 20);
    }

    function stopScrolling() {
      clearInterval(scrollInterval);
    }

    function onMouseUpOrLeave() {
      stopScrolling();
      isDown = false;
    }

    leftBtn.addEventListener('mousedown', () => startScrolling('left'));
    rightBtn.addEventListener('mousedown', () => startScrolling('right'));

    [leftBtn, rightBtn].forEach((btn) => {
      btn.addEventListener('mouseup', onMouseUpOrLeave);
      btn.addEventListener('mouseleave', onMouseUpOrLeave);
    });

    let isDown = false;
    let startX;
    let scrollLeft;

    content.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'A') {
        return;
      }

      isDown = true;
      startX = e.pageX - content.offsetLeft;
      scrollLeft = content.scrollLeft;
    });

    content.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - content.offsetLeft;
      const walk = (x - startX) * 1;
      content.scrollLeft = scrollLeft - walk;
    });

    function toggleScrollButtons() {
      control.style.display = content.scrollWidth <= wrapper.offsetWidth ? 'none' : 'flex';
    }

    toggleScrollButtons();
    window.addEventListener('resize', toggleScrollButtons);

    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('.price-section');
      const sliderItems = document.querySelectorAll('.price-head__item');

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top - 100;
        const sectionBottom = section.getBoundingClientRect().bottom;

        if (sectionTop <= 0 && sectionBottom >= 0) {
          const currentActiveId = section.getAttribute('data-id');
          sliderItems.forEach((item) => {
            item.classList.remove('active');
            if (item.getAttribute('data-id') === currentActiveId) {
              item.classList.add('active');
            }
          });
        }
      });
    });
  }

  // Функция для вычисления ширины скроллбара
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  // Функция для открытия popup
  function openPopup(popupId) {
    const popup = document.querySelector(`[data-popup="${popupId}"]`);

    if (!popup) {
      console.error(`Error: popup "${popupId}" not defined`);
      return;
    }

    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollbarWidth + 'px';

    if (popup) {
      popup.classList.add('open');
    }
  }

  // Функция для закрытия popup
  function closePopup() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    const popups = document.querySelectorAll('[data-popup]');
    popups.forEach(function (popup) {
      popup.classList.remove('open');
    });
  }

  // Обработчик клика на элементы с data-button
  document.querySelectorAll('[data-button]').forEach(function (button) {
    button.addEventListener('click', function () {
      const popupId = button.getAttribute('data-button');
      openPopup(popupId);
    });
  });

  // Обработчик клика на элементы для закрытия popup
  document.querySelectorAll('.popup-close, .popup-bg').forEach(function (closeTrigger) {
    closeTrigger.addEventListener('click', function () {
      closePopup();
    });
  });

  new TomSelect('#specialists-select', {
    plugins: ['remove_button'],
  });

  const textarea = document.getElementById('reviewTextarea');
  const counter = document.getElementById('counter');

  textarea.addEventListener('keyup', function () {
    const currentLength = textarea.value.length;
    counter.innerText = `${currentLength}/1000`;
  });

  const searchInput = document.querySelector('.service-search input');
  const serviceBlock = document.querySelector('.service'); // Элемент, до которого будет производиться прокрутка

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

      // Прокрутка до первого элемента service-item, если есть видимые элементы
      if (hasVisibleItems) {
        serviceBlock.scrollIntoView({ block: 'start' });
      }
    });
  }
});

window.addEventListener('resize', function () {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
});
