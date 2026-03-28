"use strict";

document.addEventListener('DOMContentLoaded', () => {
  const catalog = document.getElementById('catalog');
  const template = catalog.querySelector('.phone-card');
  if (!template) return;

  const cartProductCounter = document.getElementById('cart-product-counter');
  let order = {};
  const stored = localStorage.getItem('order');
  if (stored) {
    try { order = JSON.parse(stored); } catch(e) { order = {}; }
  }
  const totalCount = Object.values(order).reduce((s, v) => s + (Number(v) || 0), 0);
  if (cartProductCounter) cartProductCounter.innerText = String(totalCount);

  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      const cards = catalog.querySelectorAll('.phone-card');
      cards.forEach(card => {
        const title = (card.querySelector('h4')?.innerText || '').toLowerCase();
        card.style.display = q === '' || title.includes(q) ? '' : 'none';
      });
    });
  }

  fetch('./product.json')
    .then(res => res.json())
    .then(data => {
      // remove template from DOM and use it as a cloning template
      template.remove();

      for (const productName in data) {
        if (!Object.prototype.hasOwnProperty.call(data, productName)) continue;
        const product = data[productName];
        const clone = template.cloneNode(true);

        const titleEl = clone.querySelector('h4');
        const imgEl = clone.querySelector('img');
        const psAll = clone.querySelectorAll('p');

        titleEl.innerText = productName;
        // replace single <img> with slider if there are multiple images
        if (product.images && product.images.length) {
          const slider = createSlider(product.images);
          imgEl.replaceWith(slider);
        }

        const mapping = [
          ['model', 'Модель: '],
          ['article', 'Артикул на WB: '],
          ['color', 'Цвет: '],
          ['sim', 'SIM-карта: '],
          ['operatingsystem', 'Операционная система: '],
          ['operatingsystemversion', 'Версия операционной системы: '],
          ['warrantyperiod', 'Гарантийный срок: '],
          ['displayscreentype', 'Тип дисплея/экрана: '],
          ['screendiagonal', 'Диагональ экрана: '],
          ['screenresolution', 'Разрешение экрана: '],
          ['ramcapacity', 'Объем оперативной памяти: '],
          ['memorycardtype', 'Тип карты памяти: '],
          ['maincamera', 'Основная камера: '],
          ['frontcamera', 'Фронтальная камера: '],
          ['additionalcameraoptions', 'Доп. опции камеры: '],
          ['numberofsimcards', 'Количество SIM карт: '],
          ['communicationstandard', 'Стандарт связи: '],
          ['wirelessinterfaces', 'Беспроводные интерфейсы: '],
          ['satellitenavigation', 'Спутниковая навигация: '],
          ['connectortype', 'Вид разъема: '],
          ['equipment', 'Комплектация: '],
          ['countryoforigin', 'Страна производства: '],
          ['weightofproductwithpackaging', 'Вес товара с упаковкой: '],
          ['lengthofpackaging', 'Длина упаковки: '],
          ['packagingheight', 'Высота упаковки: '],
          ['packagingwidth', 'Ширина упаковки: ']
        ];

        mapping.forEach((pair, idx) => {
          const key = pair[0];
          const label = pair[1];
          const value = product[key] !== undefined ? product[key] : '';
          if (psAll[idx]) psAll[idx].innerText = label + value;
        });

        // add order button
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        const orderBtn = document.createElement('button');
        orderBtn.innerText = 'В КОРЗИНУ';
        orderBtn.className = 'to-cart-btn';
        const countSpan = document.createElement('span');
        countSpan.className = 'order-counter';
        const currentCount = order[productName] ? Number(order[productName]) : 0;
        countSpan.innerText = String(currentCount);
        countSpan.style.marginLeft = '8px';

        orderBtn.addEventListener('click', () => {
          const newCount = orderAdd(productName);
          countSpan.innerText = String(newCount);
        });

        orderDiv.appendChild(orderBtn);
        orderDiv.appendChild(countSpan);
        clone.appendChild(orderDiv);

        catalog.appendChild(clone);
      }
    })
    .catch(err => console.error('Ошибка загрузки product.json:', err));
});

function createSlider(images) {
  const wrapper = document.createElement('div');
  wrapper.className = 'slider';

  images.forEach((src, i) => {
    const img = document.createElement('img');
    img.className = 'slide-image' + (i === 0 ? ' visible' : '');
    img.src = src;
    wrapper.appendChild(img);
  });

  const back = document.createElement('button');
  back.className = 'arrow-btn arrow-back';
  const backImg = document.createElement('img');
  backImg.src = './arrow_back.png';
  back.appendChild(backImg);
  back.onclick = () => moveSlide(wrapper, -1);
  wrapper.appendChild(back);

  const forward = document.createElement('button');
  forward.className = 'arrow-btn arrow-forward';
  const fwdImg = document.createElement('img');
  fwdImg.src = './arrow_forward.png';
  forward.appendChild(fwdImg);
  forward.onclick = () => moveSlide(wrapper, 1);
  wrapper.appendChild(forward);

  wrapper.dataset.index = '0';
  return wrapper;
}

function moveSlide(slider, delta) {
  const images = slider.querySelectorAll('.slide-image');
  if (!images.length) return;
  let idx = parseInt(slider.dataset.index || '0', 10);
  images[idx].classList.remove('visible');
  idx = (idx + delta + images.length) % images.length;
  images[idx].classList.add('visible');
  slider.dataset.index = String(idx);
}

// --- cart helpers ---
function readOrder() {
  const s = localStorage.getItem('order');
  if (!s) return {};
  try { return JSON.parse(s); } catch(e) { return {}; }
}

function saveOrder(o) {
  try { localStorage.setItem('order', JSON.stringify(o)); } catch(e) { /* ignore */ }
}

function updateCartCounterUI() {
  const el = document.getElementById('cart-product-counter');
  if (!el) return;
  const o = readOrder();
  const total = Object.values(o).reduce((s, v) => s + (Number(v) || 0), 0);
  el.innerText = String(total);
}

function orderAdd(productKey) {
  const o = readOrder();
  if (productKey in o) o[productKey] = Number(o[productKey]) + 1;
  else o[productKey] = 1;
  saveOrder(o);
  updateCartCounterUI();
  return o[productKey];
}
