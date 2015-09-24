'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  var reviewForm = document.forms[1];
  var reviewFields = document.getElementsByClassName('review-fields')[0];

  var reviewName = reviewForm['review-name'];
  var reviewNameLabel = document.getElementsByClassName('review-fields-name')[0];

  var reviewText = reviewForm['review-text'];
  var reviewTextLabel = document.getElementsByClassName('review-fields-text')[0];

  var reviewMark = reviewForm['review-mark'];

  // Отключение возможности отправить форму без заполненных полей.
  reviewName.required = true;
  reviewText.required = true;

  // Проверка, являются ли поля заполненными
  function checkValues() {
    // Заменяется на reviewNameLabel.classList.toggle('invisible', reviewName.value === '');
    // Такой вариант записи использован для простоты.
    if (reviewName.value !== '') {
      reviewNameLabel.classList.add('invisible');
    } else {
      reviewNameLabel.classList.remove('invisible');
    }

    if (reviewText.value !== '') {
      reviewTextLabel.classList.add('invisible');
    } else {
      reviewTextLabel.classList.remove('invisible');
    }

    if (reviewName.value !== '' && reviewText.value !== '') {
      reviewFields.classList.add('invisible');
    } else {
      reviewFields.classList.remove('invisible');
    }
  }

  reviewName.onchange = function() {
    checkValues();
  };

  reviewText.onchange = function() {
    checkValues();
  };

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  reviewForm.onsubmit = function(evt) {
    evt.preventDefault();
    // Запись оценки в cookies перед отправкой формы
    docCookies.setItem('review-mark', reviewMark.value);
    reviewForm.submit();
  };

  // Восстанавление сохраненной оценки из cookies
  if (docCookies.hasItem('review-mark')) {
    reviewMark.value = docCookies.getItem('review-mark');
  }

  checkValues();
})();
