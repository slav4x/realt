/* eslint-disable operator-linebreak */
/* eslint-disable no-inner-declarations */

const viewportFix = (width) => {
  const meta = document.querySelector('meta[name="viewport"]');
  meta.setAttribute('content', `user-scalable=no, width=${screen.width <= width ? width : 'device-width'}`);
};

viewportFix(360);

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
    slidesPerView: 3,
    spaceBetween: 12,
    navigation: {
      nextEl: '.blog-next',
      prevEl: '.blog-prev',
    },
    breakpoints: {
      1760: {
        spaceBetween: 24,
      },
    },
  });

  const licenseSlider = new Swiper('.license-slider', {
    slidesPerView: 2,
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
    },
  });

  const priceSlider = new Swiper('.price-head__slider', {
    slidesPerView: 'auto',
    spaceBetween: 24,
    navigation: {
      nextEl: '.price-head__next',
      prevEl: '.price-head__prev',
    },
    breakpoints: {
      1760: {
        spaceBetween: 30,
      },
    },
    on: {
      init: function () {
        setTimeout(() => {
          const lastSlide = this.slides[this.slides.length - 1];
          const lastSlideWidth = lastSlide.offsetWidth;
          const slider = document.querySelector('.price-head__slider');
          slider.style.width = lastSlideWidth + 'px';
        }, 1000);
      },
    },
  });

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
    slidesPerView: 3,
    spaceBetween: 24,
    navigation: {
      nextEl: '.blog-specialists__next',
      prevEl: '.blog-specialists__prev',
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
});
