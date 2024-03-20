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

const openPopup = (popupId, form) => {
  const popup = document.querySelector(`[data-popup="${popupId}"]`);
  const nameForm = popup.querySelector('input[name="form"]');
  if (nameForm) nameForm.value = !form ? 'Заявка с формы' : form;

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

  setupHoverInteraction('.directions-links', 'li', '.directions-sidebar__item');
  setupHoverInteraction('.reviews', '.reviews-item', '.reviews-author__item');

  setupPageScrolling('.service-single', '.service-head__slider', 'service-section', 'service-head__item');
  setupPageScrolling('.price', '.price-head__slider', 'price-section', 'price-head__item');
  setupPageScrolling('.specialists-single', '.specialists-head__slider', 'specialists-section', 'specialists-head__item');

  // ** POPUP ** //
  document.querySelectorAll('[data-button]').forEach((button) => {
    button.addEventListener('click', () => openPopup(button.getAttribute('data-button'), button.getAttribute('data-form')));
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

    document.body.style.overflow = isOpen ? 'hidden' : 'visible';
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
        const linkItems = item.querySelectorAll('.service-item__links a');
        let isItemMatch = titleText.includes(searchQuery) || paragraphText.includes(searchQuery);
        let isAnyLinkMatch = false;

        linkItems.forEach((linkItem) => {
          const linkText = linkItem.textContent.toLowerCase();
          if (linkText.includes(searchQuery)) {
            linkItem.style.display = '';
            isAnyLinkMatch = true;
          } else {
            linkItem.style.display = 'none';
          }
        });

        const mainToggle = item.querySelector('.service-item__main.toggle');
        const linksList = item.querySelector('.service-item__links');

        if (isItemMatch || isAnyLinkMatch) {
          item.style.display = '';
          hasVisibleItems = true;
          if (mainToggle) mainToggle.classList.add('show');
          if (linksList) linksList.classList.add('show');
        } else {
          item.style.display = 'none';
          if (mainToggle) mainToggle.classList.remove('show');
          if (linksList) linksList.classList.remove('show');
        }
      });

      if (!searchQuery) {
        serviceItems.forEach((item) => {
          const mainToggle = item.querySelector('.service-item__main.toggle');
          const linksList = item.querySelector('.service-item__links');
          if (mainToggle) mainToggle.classList.remove('show');
          if (linksList) linksList.classList.remove('show');
        });
      }

      if (hasVisibleItems) {
        serviceBlock.scrollIntoView({ block: 'start' });
      }
    });
  }

  const serviceItems = document.querySelectorAll('.service-item');
  serviceItems?.forEach((item) => {
    const itemMain = item.querySelector('.service-item__main');
    const itemLinks = item.querySelector('.service-item__links');

    if (itemMain.classList.contains('toggle')) {
      itemMain.addEventListener('click', (e) => {
        if (!itemLinks.classList.contains('show')) {
          e.preventDefault();
          itemLinks.classList.add('show');
          itemMain.classList.add('show');
        }
      });
    }
  });

  // ** SLIDERS ** //
  const blogSlider = new Swiper('.blog-slider', {
    slidesPerView: 1,
    spaceBetween: 12,
    navigation: {
      nextEl: '.blog-next',
      prevEl: '.blog-prev',
    },
    breakpoints: {
      767: {
        slidesPerView: 2,
      },
      1023: {
        slidesPerView: 3,
      },
      1760: {
        spaceBetween: 24,
        slidesPerView: 3,
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
      1280: {
        slidesPerView: 2,
      },
      1760: {
        spaceBetween: 24,
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
      576: {
        slidesPerView: 2,
      },
      1280: {
        slidesPerView: 3,
      },
      1760: {
        spaceBetween: 24,
        slidesPerView: 3,
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
      576: {
        slidesPerView: 2,
      },
      1280: {
        slidesPerView: 3,
      },
      1760: {
        spaceBetween: 24,
        slidesPerView: 3,
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

  // Генерация случайного токена
  function generateToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 30; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }

  // Установка токена в скрытое поле формы
  function setToken(form) {
    const token = generateToken();
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 't';
    hiddenInput.value = token;
    form.appendChild(hiddenInput);
  }

  // Инициализация токена для каждой формы на странице
  const forms = document.querySelectorAll('form');
  forms.forEach(function (form) {
    setToken(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const button = form.querySelector('.btn p');

      button.style.opacity = 0.5;
      button.style.cursor = 'not-allowed';
      button.disabled = true;

      const inputs = form.querySelectorAll('.label');
      const thanks = document.querySelectorAll('.popup-thanks');

      setTimeout(() => {
        thanks.forEach((el) => {
          el.classList.add('show');
          button.style.opacity = 1;
          button.disabled = false;
        });

        inputs.forEach((label) => {
          const input = label.querySelector('input');
          input.value = '';
          label.classList.remove('fill');
        });
      }, 500);

      if (form.classList.contains('js-thanks')) {
        setTimeout(() => {
          openPopup('thanks');
        }, 500);
      }

      const formUrl = form.getAttribute('action');
      const formData = new FormData(this);

      fetch(formUrl, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .catch((error) => console.error('Error:', error));
    });
  });

  const thanksPopup = document.querySelectorAll('.popup-thanks');
  const thanksBtn = document.querySelectorAll('.popup-thanks .btn');

  thanksBtn.forEach((el) => {
    el.addEventListener('click', () => {
      thanksPopup.forEach((popup) => {
        popup.classList.remove('show');
        closePopup();
      });
    });
  });

  document.querySelectorAll('input').forEach(function (el) {
    el.addEventListener('blur', function () {
      if (this.value === '+7 ' || this.value === '') {
        this.closest('label').classList.remove('fill');
      } else {
        this.closest('label').classList.add('fill');
      }
    });
  });

  const groupMore = document.querySelectorAll('.specialists-list__more');
  if (groupMore) {
    groupMore.forEach((group) => {
      const btn = group.querySelector('.btn');

      btn.addEventListener('click', () => {
        const list = group.previousElementSibling;
        if (list) list.classList.add('full');

        group.style.display = 'none';
      });
    });
  }

  const listSymptoms = document.querySelectorAll('.specialists-list__symptom');

  if (listSymptoms) {
    listSymptoms.forEach((item) => {
      const content = item.querySelector('p');

      item.addEventListener('click', () => {
        item.classList.toggle('open');
        content.style.maxHeight = item.classList.contains('open') ? `${content.scrollHeight}px` : null;
      });
    });
  }

  const filters = {
    spec: '',
    help: '',
    format: '',
    symptoms: [],
    diagnoses: [],
  };

  // Функция для безопасного получения значений атрибутов
  function getAttributeValues(element, attributeName) {
    const value = element.getAttribute(attributeName);
    return value ? value.split(' | ') : [];
  }

  // Функция для обновления фильтров
  function updateFilters(category, value) {
    if (['spec', 'help', 'format'].includes(category)) {
      filters[category] = value === 'Все' ? '' : value;
    } else {
      const index = filters[category].indexOf(value);
      if (index > -1) {
        filters[category].splice(index, 1);
      } else {
        filters[category].push(value);
      }
    }
  }

  // Функция для фильтрации карточек
  function filterItems() {
    const items = document.querySelectorAll('.specialists-item');

    items.forEach((item) => {
      const spec = item.getAttribute('data-spec') || '';
      const help = item.getAttribute('data-help') || '';
      const format = item.getAttribute('data-format') || '';
      const symptoms = getAttributeValues(item, 'data-symptoms');
      const diagnoses = getAttributeValues(item, 'data-diagnoses');

      const isSpecMatch = !filters.spec || spec.includes(filters.spec);
      const isHelpMatch = !filters.help || help.includes(filters.help);
      const isFormatMatch = !filters.format || format.includes(filters.format);
      const isSymptomsMatch = !filters.symptoms.length || filters.symptoms.some((symptom) => symptoms.includes(symptom));
      const isDiagnosesMatch = !filters.diagnoses.length || filters.diagnoses.some((diagnosis) => diagnoses.includes(diagnosis));

      if (isSpecMatch && isHelpMatch && isFormatMatch && isSymptomsMatch && isDiagnosesMatch) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Обработчики для спанов
  document.querySelectorAll('.specialists-type span[data-filter]').forEach((span) => {
    span.addEventListener('click', function () {
      const category = this.getAttribute('data-filter');
      if (!this.classList.contains('active')) {
        document.querySelectorAll(`span[data-filter="${category}"].active`).forEach((activeSpan) => {
          activeSpan.classList.remove('active');
        });
        this.classList.add('active');
        updateFilters(category, this.textContent);
        filterItems();
      }
    });
  });

  // Обработчики для чекбоксов (symptoms и diagnoses)
  document.querySelectorAll('[data-filter="symptoms"], [data-filter="diagnoses"]').forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      const category = this.name.endsWith('[]') ? this.name.slice(0, -2) : this.name; // Определение категории
      updateFilters(category, this.value, this.checked);
    });
  });

  const popupFilter = document.querySelector('.popup-filter');
  const filterGroup = document.querySelectorAll('.popup-filter__group');
  const filterSearch = document.querySelector('.popup-filter__search input[type="text"]');
  const filterApply = document.querySelector('.popup-filter__apply');

  if (filterGroup) {
    filterGroup.forEach((group) => {
      const head = group.querySelector('.popup-filter__head');
      const content = group.querySelector('.popup-filter__wrapper');
      const checkboxes = group.querySelectorAll('input[type="checkbox"]');
      const countElement = group.querySelector('.count');

      const updateCount = () => {
        const checkedCount = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length;
        countElement.textContent = checkedCount;
        countElement.classList.toggle('hide', checkedCount === 0);
      };

      checkboxes.forEach((checkbox) => checkbox.addEventListener('change', updateCount));

      head.addEventListener('click', () => {
        group.classList.toggle('open');
        content.style.maxHeight = group.classList.contains('open') ? `${content.scrollHeight}px` : null;
      });
    });
  }

  function updateSelectedVisibility() {
    const specialistsSelected = document.querySelector('.specialists-selected');

    if (specialistsSelected) {
      if (filters.symptoms.length > 0 || filters.diagnoses.length > 0) {
        specialistsSelected.classList.add('show');
      } else {
        specialistsSelected.classList.remove('show');
      }
    }
  }

  // Функция для снятия чекбокса по значению
  function uncheckCheckbox(value, type) {
    const selector = `label.popup-filter__checkbox input[name="${type}[]"]`;
    const checkboxes = document.querySelectorAll(selector);
    checkboxes.forEach((checkbox) => {
      if (checkbox.value === value) {
        checkbox.checked = false;
      }
    });
  }

  // Обработчик для полной очистки
  const clearFilter = document.querySelector('.specialists-selected a');
  clearFilter?.addEventListener('click', (event) => {
    event.preventDefault(); // Предотвращаем действие по умолчанию
    filters.symptoms = [];
    filters.diagnoses = [];

    // Снимаем выбор со всех чекбоксов
    const allCheckboxes = document.querySelectorAll('label.popup-filter__checkbox input[type="checkbox"]');
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    updateSelectedVisibility();
    setSelected(); // Обновляем список выбранных элементов
    filterItems(); // Применяем фильтрацию
  });

  // Модифицированная функция setSelected для удаления отдельных элементов
  function setSelected() {
    const ul = document.querySelector('.specialists-selected ul');
    ul.innerHTML = ''; // Очищаем список

    filters.symptoms.forEach((symptom, index) => {
      const li = document.createElement('li');
      li.textContent = symptom;
      li.addEventListener('click', () => {
        uncheckCheckbox(symptom, 'symptoms'); // Снимаем чекбокс для симптома
        filters.symptoms.splice(index, 1);
        setSelected(); // Обновляем список
        updateSelectedVisibility();
        filterItems();
      });
      ul.appendChild(li);
    });

    filters.diagnoses.forEach((diagnosis, index) => {
      const li = document.createElement('li');
      li.textContent = diagnosis;
      li.addEventListener('click', () => {
        uncheckCheckbox(diagnosis, 'diagnoses'); // Снимаем чекбокс для диагноза
        filters.diagnoses.splice(index, 1);
        setSelected(); // Обновляем список
        updateSelectedVisibility();
        filterItems();
      });
      ul.appendChild(li);
    });
  }

  if (popupFilter) {
    filterApply.addEventListener('click', () => {
      closePopup();
      filterItems();
      setSelected();
      updateSelectedVisibility();
    });

    const updateGroupVisibility = (group, isMatchFound) => {
      if (isMatchFound) {
        group.classList.add('open');
        const content = group.querySelector('.popup-filter__wrapper');
        content.style.maxHeight = `${content.scrollHeight}px`;
      } else {
        group.classList.remove('open');
        const content = group.querySelector('.popup-filter__wrapper');
        content.style.maxHeight = null;
      }
    };

    filterSearch.addEventListener('input', () => {
      const searchText = filterSearch.value.toLowerCase();

      filterGroup.forEach((group) => {
        const checkboxes = group.querySelectorAll('.popup-filter__checkbox p');
        let isMatchFound = false;

        checkboxes.forEach((checkbox) => {
          if (checkbox.textContent.toLowerCase().includes(searchText)) {
            checkbox.parentElement.style.opacity = 1;
            isMatchFound = true;
          } else {
            checkbox.parentElement.style.opacity = 0.3;
          }
        });

        group.style.display = isMatchFound ? '' : 'none';
        updateGroupVisibility(group, isMatchFound);
      });
    });
  }

  if (window.innerWidth < 768) {
    const galleryGrid = new Swiper('.gallery-grid__slider', {
      slidesPerView: 1,
      spaceBetween: 12,
      breakpoints: {
        576: {
          slidesPerView: 2,
        },
      },
    });
  }

  const popupReviews = document.querySelector('.popup-reviews');
  const anonymousReviews = document.querySelector('.popup-reviews__checkbox input[type="checkbox"]');
  const nameReviews = document.querySelector('.popup-reviews__name');
  anonymousReviews.addEventListener('change', () => {
    if (anonymousReviews.checked) {
      nameReviews.classList.add('anonymous');
      nameReviews.querySelector('input').disabled = true;
    } else {
      nameReviews.classList.remove('anonymous');
      nameReviews.querySelector('input').disabled = false;
    }
  });

  document.querySelectorAll('.footer-address__switch li').forEach((item) => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.footer-address__switch li').forEach((i) => i.classList.remove('active'));
      this.classList.add('active');
      const id = this.getAttribute('data-id');
      document.querySelectorAll('.footer-address .title-md, .footer-address .title-sm').forEach((address) => {
        address.classList.remove('active');
        if (address.getAttribute('data-id') === id) {
          address.classList.add('active');
        }
      });
    });
  });

  document.querySelectorAll('.menu-address ul li').forEach((item) => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.menu-address ul li').forEach((i) => i.classList.remove('active'));
      this.classList.add('active');
      const id = this.getAttribute('data-id');
      document.querySelectorAll('.menu-address p').forEach((address) => {
        address.classList.remove('active');
        if (address.getAttribute('data-id') === id) {
          address.classList.add('active');
        }
      });
    });
  });

  document.querySelectorAll('.contact-switch li').forEach((item) => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.contact-switch li').forEach((i) => i.classList.remove('active'));
      this.classList.add('active');
      const id = this.getAttribute('data-id');
      document.querySelectorAll('.contact-address').forEach((address) => {
        address.classList.remove('active');
        if (address.getAttribute('data-id') === id) {
          address.classList.add('active');
        }
      });
    });
  });
});
