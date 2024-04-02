/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-inner-declarations */

document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function (e) {
    const button = e.target.closest('[data-step]');

    if (!button || button.classList.contains('disabled')) return;

    const currentTab = document.querySelector('.popup-online__tab.active');
    const isFourthTabActive = currentTab.getAttribute('data-tab') === '4';
    const isSpecialistIdNotChecked = document.querySelector('input[name="specialistId"]:checked') === null;
    const stepTab = button.getAttribute('data-step');
    let targetTab;

    if (isFourthTabActive && isSpecialistIdNotChecked) {
      targetTab = stepTab === '5' ? 5 : 6;
    } else {
      targetTab = button.getAttribute('data-step');
    }

    const nextTab = document.querySelector(`.popup-online__tab[data-tab="${targetTab}"]`);

    if (currentTab && nextTab) {
      currentTab.classList.remove('active');
      nextTab.classList.add('active');
    }
  });

  const currentDate = new Date();
  const finishDate = new Date();
  finishDate.setDate(currentDate.getDate() + 7);

  function formatDate(date) {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  function formatDateReverse(date) {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('.');
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function formatDaysDate(date) {
    const day = date.getDate();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  }

  const firstWeekStart = addDays(currentDate, 0);
  const firstWeekEnd = addDays(firstWeekStart, 6);

  const secondWeekStart = addDays(firstWeekEnd, 1);
  const secondWeekEnd = addDays(secondWeekStart, 6);

  const thirdWeekStart = addDays(secondWeekEnd, 1);
  const thirdWeekEnd = addDays(thirdWeekStart, 6);

  const weeks = [
    { start: formatDaysDate(firstWeekStart), end: formatDaysDate(firstWeekEnd) },
    { start: formatDaysDate(secondWeekStart), end: formatDaysDate(secondWeekEnd) },
    { start: formatDaysDate(thirdWeekStart), end: formatDaysDate(thirdWeekEnd) },
  ];

  const weeksCode = weeks
    .map((week, index) => `<li ${index === 0 ? 'class="active"' : ''} data-time="${index + 1}">${week.start} - ${week.end}</li>`)
    .join('');

  document.querySelector('.getSpecialists').addEventListener('click', () => {
    const popupSpecialistsContainer = document.querySelector('.popup-specialists');
    popupSpecialistsContainer.innerHTML = '<div class="loader"></div>';

    fetch('https://cdz-alter.ru/api/crm.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          wid: 'newOnlineWidgetForm',
          mode: 'autocomplete',
          data: {
            attribute: 'executor_id',
            arg_fields: {
              agreementPrivacy: false,
              agreementMessaging: false,
              autocompleteCountry: 'RU',
              start_date: formatDateReverse(currentDate),
              finish_day: formatDate(finishDate),
              start_day: formatDate(currentDate),
              account_id: 22727,
            },
          },
        },
      ]),
    })
      .then((response) => response.json())
      .then((data) => {
        const specialists = data.newOnlineWidgetForm.items;

        const loader = popupSpecialistsContainer.querySelector('.loader');
        loader.classList.add('hide');

        specialists.forEach((specialist) => {
          const specialistElement = document.createElement('label');
          specialistElement.className = 'popup-specialists__item';

          const nameParts = specialist.name.split(' ');

          const nameWithBreak = [nameParts[0], '<br>', ...nameParts.slice(1)].join(' ');

          specialistElement.innerHTML = `
          <input type="radio" name="specialistId" value="${specialist.id}" />
          <div class="popup-specialists__item-photo"><img src="https://klientiks.ru${specialist.image}" alt=""></div>
          <h4 class="popup-specialists__item-name">${nameWithBreak}</h4>
          <div class="popup-specialists__item-quote"><p>${specialist.position}</p></div>
        `;

          popupSpecialistsContainer.appendChild(specialistElement);
        });
      })
      .catch((error) => console.error('Ошибка:', error));
  });

  document.querySelector('.popup-specialists').addEventListener('click', function (event) {
    let target = event.target;
    while (target != this) {
      if (target.classList.contains('popup-specialists__item')) {
        const specialistName = target.querySelector('.popup-specialists__item-name').innerHTML.replace(' <br>', '');
        const checkedElement = document.querySelector('[data-specialist] .popup-online__checked b');
        const nextElement = document.querySelector('[data-specialist] .popup-online__next');

        if (checkedElement) {
          checkedElement.innerHTML = specialistName;
          checkedElement.closest('.popup-online__checked').classList.remove('hide');
        }

        document.querySelector('input[name="specialistName"]').value = specialistName;

        if (nextElement) {
          nextElement.classList.remove('disabled');
        }

        return;
      }
      target = target.parentNode;
    }
  });

  document.querySelector('.getSpecialistServices').addEventListener('click', () => {
    const popupServicesContainer = document.querySelector('.popup-services:not(.all)');
    popupServicesContainer.innerHTML = '<div class="loader"></div>';

    const id = document.querySelector('input[name="specialistId"]:checked').value;
    fetch('https://cdz-alter.ru/api/crm.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          wid: 'newOnlineWidgetForm',
          mode: 'autocomplete',
          data: {
            attribute: 'service_id',
            arg_fields: {
              agreementPrivacy: false,
              agreementMessaging: false,
              autocompleteCountry: 'RU',
              executor_id: id,
              start_date: formatDateReverse(currentDate),
              finish_day: formatDate(finishDate),
              start_day: formatDate(currentDate),
              account_id: 22727,
            },
          },
        },
      ]),
    })
      .then((response) => response.json())
      .then((data) => {
        const services = data.newOnlineWidgetForm.items;

        const loader = popupServicesContainer.querySelector('.loader');
        loader.classList.add('hide');

        services.forEach((service) => {
          const serviceElement = document.createElement('label');
          serviceElement.className = 'popup-services__item';

          const price = parseInt(service.price, 10);
          const formattedPrice = `${price.toLocaleString('ru-RU')} руб.`;

          const hours = Math.floor(service.duration / 60);
          const minutes = service.duration % 60;
          let formattedDuration = '';
          if (hours > 0) {
            if (minutes === 0) {
              formattedDuration += `60 минут`;
            } else {
              formattedDuration += `${hours} час${hours > 1 ? 'а' : ''} ${minutes} минут`;
            }
          } else if (minutes > 0) {
            formattedDuration += `${minutes} минут`;
          }

          serviceElement.innerHTML = `
          <input type="radio" name="serviceId" value="${service.id}" />
          <h4>${service.name}</h4>
          <span>${formattedPrice}</span>
          <span>${formattedDuration}</span>
        `;

          popupServicesContainer.appendChild(serviceElement);
        });
      })
      .catch((error) => console.error('Ошибка:', error));
  });

  document.querySelector('.getServices').addEventListener('click', () => {
    const popupServicesContainer = document.querySelector('.popup-services.all');
    popupServicesContainer.innerHTML = '<div class="loader"></div>';

    fetch('https://cdz-alter.ru/api/crm.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          wid: 'newOnlineWidgetForm',
          mode: 'autocomplete',
          data: {
            attribute: 'service_id',
            arg_fields: {
              agreementPrivacy: false,
              agreementMessaging: false,
              autocompleteCountry: 'RU',
              start_date: formatDateReverse(currentDate),
              finish_day: formatDate(finishDate),
              start_day: formatDate(currentDate),
              account_id: 22727,
            },
          },
        },
      ]),
    })
      .then((response) => response.json())
      .then((data) => {
        const services = data.newOnlineWidgetForm.items;

        const loader = popupServicesContainer.querySelector('.loader');
        loader.classList.add('hide');

        services.forEach((service) => {
          const serviceElement = document.createElement('label');
          serviceElement.className = 'popup-services__item';

          const price = parseInt(service.price, 10);
          const formattedPrice = `${price.toLocaleString('ru-RU')} руб.`;

          const hours = Math.floor(service.duration / 60);
          const minutes = service.duration % 60;
          let formattedDuration = '';
          if (hours > 0) {
            if (minutes === 0) {
              formattedDuration += `60 минут`;
            } else {
              formattedDuration += `${hours} час${hours > 1 ? 'а' : ''} ${minutes} минут`;
            }
          } else if (minutes > 0) {
            formattedDuration += `${minutes} минут`;
          }

          serviceElement.innerHTML = `
          <input type="radio" name="serviceId" value="${service.id}" />
          <h4>${service.name}</h4>
          <span>${formattedPrice}</span>
          <span>${formattedDuration}</span>
        `;

          popupServicesContainer.appendChild(serviceElement);
        });
      })
      .catch((error) => console.error('Ошибка:', error));
  });

  document.querySelector('.popup-services:not(.all)').addEventListener('click', function (event) {
    let target = event.target;
    while (target != this) {
      if (target.classList.contains('popup-services__item') || target.closest('.popup-services__item')) {
        const serviceItem = target.closest('.popup-services__item');

        const serviceName = serviceItem.querySelector('h4').innerText;
        const checkedElement = document.querySelector('[data-service] .popup-online__checked b');
        const nextElement = document.querySelector('[data-service] .popup-online__next');

        document.querySelectorAll('.popup-services__item').forEach((item) => {
          item.classList.remove('checked');
        });

        serviceItem.classList.add('checked');

        document.querySelector('input[name="serviceName"]').value = serviceName;

        if (checkedElement) {
          checkedElement.innerText = serviceName;
          checkedElement.closest('.popup-online__checked').classList.remove('hide');
        }

        if (nextElement) {
          nextElement.classList.remove('disabled');
        }

        return;
      }
      target = target.parentNode;
    }
  });

  document.querySelector('.popup-services.all').addEventListener('click', function (event) {
    let target = event.target;
    while (target != this) {
      if (target.classList.contains('popup-services__item') || target.closest('.popup-services__item')) {
        const serviceItem = target.closest('.popup-services__item');

        const serviceName = serviceItem.querySelector('h4').innerText;
        const checkedElement = document.querySelector('[data-service-all] .popup-online__checked b');
        const nextElement = document.querySelector('[data-service-all] .popup-online__next');

        document.querySelectorAll('.popup-services__item').forEach((item) => {
          item.classList.remove('checked');
        });

        serviceItem.classList.add('checked');

        document.querySelector('input[name="serviceName"]').value = serviceName;

        if (checkedElement) {
          checkedElement.innerText = serviceName;
          checkedElement.closest('.popup-online__checked').classList.remove('hide');
        }

        if (nextElement) {
          nextElement.classList.remove('disabled');
        }

        return;
      }
      target = target.parentNode;
    }
  });

  function formatTimeDate(date) {
    const options = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('ru-RU', options);
  }

  function formatTimeDay(date) {
    const options = { weekday: 'long' };
    return date.toLocaleDateString('ru-RU', options);
  }

  function createCard(date, appointments) {
    const day = formatTimeDate(date);
    const weekday = formatTimeDay(date);
    let contentHtml = '';

    if (appointments && appointments.length > 0) {
      const timesListHtml = appointments
        .map(
          (time) =>
            `<label><input type="radio" name="time" value="${new Date(time).getHours()}:${
              new Date(time).getMinutes() === 0 ? '00' : new Date(time).getMinutes()
            }:00" />${new Date(time).getHours()}:${new Date(time).getMinutes() === 0 ? '00' : new Date(time).getMinutes()}</label>`
        )
        .join('');
      contentHtml = `
        <div class="popup-time__content">
          <div class="popup-time__list">${timesListHtml}</div>
        </div>
        <div class="popup-time__btn"><a href="javascript:;" class="btn btn-outline btn-md disabled" data-step="5"><p>Записаться</p></a></div>
      `;
    } else {
      contentHtml = `
        <div class="popup-time__content"><small>На этот день нет записи или не осталось свободного времени</small></div>
        <div class="popup-time__btn"><a href="javascript:;" class="btn btn-outline btn-md" data-step="5"><p>Оставить заявку</p></a></div>
      `;
    }

    return `
      <label class="popup-time__item">
        <input type="radio" name="date" value="${formatDate(date)}" />
        <div class="popup-time__date">${day}</div>
        <div class="popup-time__day">${weekday}</div>
        ${contentHtml}
      </label>
    `;
  }

  document.querySelectorAll('.getServiceDate').forEach((selector) => {
    selector.addEventListener('click', () => {
      const popupTimeContainer = document.querySelector('.popup-time');
      popupTimeContainer.innerHTML = '<div class="loader"></div>';

      document.querySelector('.popup-time__tabs').innerHTML = weeksCode;

      const specialistId = document.querySelector('input[name="specialistId"]:checked')
        ? document.querySelector('input[name="specialistId"]:checked').value
        : '';
      const serviceId = document.querySelector('input[name="serviceId"]:checked').value;

      fetch('https://cdz-alter.ru/api/crm.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            wid: 'newOnlineWidgetForm',
            mode: 'autocomplete',
            data: {
              attribute: 'times',
              arg_fields: {
                agreementPrivacy: false,
                agreementMessaging: false,
                autocompleteCountry: 'RU',
                executor_id: specialistId,
                start_date: formatDateReverse(currentDate),
                finish_day: formatDate(thirdWeekEnd),
                start_day: formatDate(currentDate),
                service_id: [parseInt(serviceId)],
                account_id: 22727,
              },
            },
          },
        ]),
      })
        .then((response) => response.json())
        .then((data) => {
          const loader = popupTimeContainer.querySelector('.loader');
          loader.classList.add('hide');

          const appointmentsData = data.newOnlineWidgetForm.items;
          updateUI(appointmentsData);
        })
        .catch((error) => console.error('Ошибка:', error));
    });
  });

  function updateUI(appointmentsData) {
    const popupTimeContainer = document.querySelector('.popup-time');
    popupTimeContainer.innerHTML = '';

    for (let week = 1; week <= 3; week++) {
      const weekGroupDiv = document.createElement('div');
      weekGroupDiv.className = `popup-time__group ${week === 1 ? 'active' : ''}`;
      weekGroupDiv.setAttribute('data-time', week);

      for (let day = 0; day < 7; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day + (week - 1) * 7);
        const dateString = date.toISOString().split('T')[0];

        weekGroupDiv.innerHTML += createCard(date, appointmentsData[dateString]);
      }

      popupTimeContainer.appendChild(weekGroupDiv);
    }
  }

  document.querySelector('.popup-time__tabs').addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
      document.querySelectorAll('.popup-time__tabs li').forEach(function (tab) {
        tab.classList.remove('active');
      });

      e.target.classList.add('active');

      const time = e.target.getAttribute('data-time');

      document.querySelectorAll('.popup-time__group').forEach(function (content) {
        if (content.getAttribute('data-time') === time) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    }
  });

  document.body.addEventListener('change', function (e) {
    // Проверяем, выбрано ли время внутри popup-time__list
    if (e.target.matches('.popup-time__list input[type="radio"]')) {
      const selectedItem = e.target.closest('.popup-time__item');

      document.querySelectorAll('.popup-time__list label.active').forEach((label) => {
        label.classList.remove('active');
      });
      e.target.parentNode.classList.add('active');

      document.querySelectorAll('.popup-time__item .popup-time__list ~ .popup-time__btn .btn').forEach((btn) => {
        btn.classList.remove('disabled');
      });

      document.querySelectorAll('.popup-time__item').forEach((item) => {
        if (item.querySelector('.popup-time__list') && item !== selectedItem) {
          item.querySelector('.popup-time__btn .btn').classList.add('disabled');
        }
      });

      selectedItem.querySelector('.popup-time__btn .btn').classList.remove('disabled');
    }
  });

  document.body.addEventListener('click', function (e) {
    if (
      e.target.matches('.popup-time__item .popup-time__btn .btn:not(.disabled), .popup-time__item .popup-time__btn .btn:not(.disabled) *')
    ) {
      const currentItem = e.target.closest('.popup-time__item');
      const dateRadio = currentItem.querySelector('input[type="radio"][name="date"]');
      if (dateRadio) {
        dateRadio.checked = true;
      }
    }
  });

  document.querySelectorAll('.popup-time__item').forEach((item) => {
    if (item.querySelector('.popup-time__list')) {
      item.querySelector('.popup-time__btn .btn').classList.add('disabled');
    }
  });

  const btnSpecId = document.querySelectorAll('[data-specId]');
  btnSpecId?.forEach((btn) => {
    btn.addEventListener('click', () => {
      const popupSpecialistsContainer = document.querySelector('.popup-specialists');
      popupSpecialistsContainer.innerHTML = '<div class="loader"></div>';

      fetch('https://cdz-alter.ru/api/crm.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            wid: 'newOnlineWidgetForm',
            mode: 'autocomplete',
            data: {
              attribute: 'executor_id',
              arg_fields: {
                agreementPrivacy: false,
                agreementMessaging: false,
                autocompleteCountry: 'RU',
                start_date: formatDateReverse(currentDate),
                finish_day: formatDate(finishDate),
                start_day: formatDate(currentDate),
                account_id: 22727,
              },
            },
          },
        ]),
      })
        .then((response) => response.json())
        .then((data) => {
          const specialists = data.newOnlineWidgetForm.items;

          const loader = popupSpecialistsContainer.querySelector('.loader');
          loader.classList.add('hide');

          specialists.forEach((specialist) => {
            const specialistElement = document.createElement('label');
            specialistElement.className = 'popup-specialists__item';

            const nameParts = specialist.name.split(' ');

            const nameWithBreak = [nameParts[0], '<br>', ...nameParts.slice(1)].join(' ');

            specialistElement.innerHTML = `
            <input type="radio" name="specialistId" value="${specialist.id}" />
            <div class="popup-specialists__item-photo"><img src="https://klientiks.ru${specialist.image}" alt=""></div>
            <h4 class="popup-specialists__item-name">${nameWithBreak}</h4>
            <div class="popup-specialists__item-quote"><p>${specialist.position}</p></div>
          `;

            popupSpecialistsContainer.appendChild(specialistElement);
          });
        })
        .catch((error) => console.error('Ошибка:', error));

      const specId = document.querySelector('[data-specId').getAttribute('data-specId');
      const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === 1 && node.matches('.popup-specialists__item')) {
              const input = node.querySelector('input[name="specialistId"][value="' + specId + '"]');
              if (input) {
                input.click();
                observer.disconnect();
              }
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      const popupServicesContainer = document.querySelector('.popup-services:not(.all)');
      popupServicesContainer.innerHTML = '<div class="loader"></div>';

      fetch('https://cdz-alter.ru/api/crm.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            wid: 'newOnlineWidgetForm',
            mode: 'autocomplete',
            data: {
              attribute: 'service_id',
              arg_fields: {
                agreementPrivacy: false,
                agreementMessaging: false,
                autocompleteCountry: 'RU',
                executor_id: specId,
                start_date: formatDateReverse(currentDate),
                finish_day: formatDate(finishDate),
                start_day: formatDate(currentDate),
                account_id: 22727,
              },
            },
          },
        ]),
      })
        .then((response) => response.json())
        .then((data) => {
          const services = data.newOnlineWidgetForm.items;

          const loader = popupServicesContainer.querySelector('.loader');
          loader.classList.add('hide');

          services.forEach((service) => {
            const serviceElement = document.createElement('label');
            serviceElement.className = 'popup-services__item';

            const price = parseInt(service.price, 10);
            const formattedPrice = `${price.toLocaleString('ru-RU')} руб.`;

            const hours = Math.floor(service.duration / 60);
            const minutes = service.duration % 60;
            let formattedDuration = '';
            if (hours > 0) {
              if (minutes === 0) {
                formattedDuration += `60 минут`;
              } else {
                formattedDuration += `${hours} час${hours > 1 ? 'а' : ''} ${minutes} минут`;
              }
            } else if (minutes > 0) {
              formattedDuration += `${minutes} минут`;
            }

            serviceElement.innerHTML = `
            <input type="radio" name="serviceId" value="${service.id}" />
            <h4>${service.name}</h4>
            <span>${formattedPrice}</span>
            <span>${formattedDuration}</span>
          `;

            popupServicesContainer.appendChild(serviceElement);
          });
        })
        .catch((error) => console.error('Ошибка:', error));
    });
  });
});
