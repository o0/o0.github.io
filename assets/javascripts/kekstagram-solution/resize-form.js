'use strict';

(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  var displacementX = resizeForm['resize-x'];
  var displacementY = resizeForm['resize-y'];
  var side = resizeForm['resize-size'];

  // Начальные значения полей. Существует вероятность, что поле side будет
  // больше положеного. Это не страшно, потому что существует второй этап
  // валидации: по отправке формы.
  displacementX.value = 0;
  displacementY.value = 0;
  side.value = 100;

  // Минимальные значения: смещение не меньше 0, размер стороны квадрата
  // не меньше 1.
  displacementX.min = 0;
  displacementY.min = 0;
  side.min = 1;

  // Установка максимального значения смещений и, одновременно, подгонка под
  // эти значения. Если размеры не совпадают с требуемыми, изменяем значение
  // поля
  function setDisplacement() {
    displacementX.max = Math.max(previewImage.naturalWidth - side.value, 0);
    displacementY.max = Math.max(previewImage.naturalHeight - side.value, 0);

    if (displacementX.value > displacementX.max) {
      displacementX.value = displacementX.max;
    }

    if (displacementY.value > displacementY.max) {
      displacementY.value = displacementY.max;
    }
  }

  // Проверка, валидны ли значения смешений.
  function displacementIsValid() {
    if (!displacementX.max || !displacementY.max) {
      setDisplacement();
    }

    return displacementX.value <= displacementX.max && displacementY.value <= displacementY.max;
  }

  // Установка максимального значения стороны. Размер картинки минус смещение.
  // Одновременная подгонка размера стороны под максимальное значение.
  function setSide() {
    side.max = Math.min(
        previewImage.naturalWidth - displacementX.value,
        previewImage.naturalHeight - displacementY.value);

    if (side.value > side.max) {
      side.value = side.max;
    }
  }

  // Проверка, валиден ли размер стороны
  function sideIsValid() {
    if (!side.max) {
      setSide();
    }

    return side.value <= side.max;
  }

  // Обработчик изменения смещения по Х, устанавливает максимальное
  // значение стороны.
  displacementX.onchange = function() {
    if (!displacementX.max) {
      setDisplacement();
    }

    setSide();
  };

  // Обработчик изменения смещения по Y, устанавливает максимальное
  // значение стороны.
  displacementY.onchange = function() {
    if (!displacementY.max) {
      setDisplacement();
    }

    setSide();
  };

  // Обработчик изменения стороны, устанавливает максимумы для смещений.
  side.onchange = function() {
    if (!side.max) {
      setSide();
    }

    setDisplacement();
  };

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    // Переход к следующей форме происходит только, если значения этой проходят
    // валидацию (перестраховка)
    if (sideIsValid() && displacementIsValid()) {
      filterForm.elements['filter-image-src'] = previewImage.src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  };
})();
