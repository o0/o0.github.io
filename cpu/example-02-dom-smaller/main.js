'use strict';

(function() {
  const PICS_NUMBER = 381;
  const PAGE_SIZE = 100;

  const container = document.querySelector('.layout');
  const templateElement = document
    .querySelector('#tmpl')
    .content
    .querySelector('.pic');


  function* getPictureSwitcher(picsNumber) {
    let currentPic = 0;
    while (true) {
      yield `pics/images${currentPic === 0 ? `` : `(${currentPic})`}`;
      currentPic = currentPic === picsNumber ? 0 : currentPic + 1;
    }
  }


  function* getPageSwitcher(pictureSwitcher) {
    while (true) {
      yield function* (pageSize) {
        let i = pageSize;
        while (i--) {
          const el = templateElement.cloneNode(true);
          el.querySelector('.pic-thumb').src = pictureSwitcher.next().value;
          el.querySelector('.pic-like-counter').textContent = Math.floor(
              Math.random() * 90) + 10;

          yield el;
        }
      };
    }
  }


  const switchPage = (pageSwitcher, pageSize) => {
    const fragment = document.createDocumentFragment();
    for (const el of pageSwitcher.next().value(pageSize)) {
      el.addEventListener('keydown', evt => {
        evt.stopPropagation();
        console.log(el, Math.random());
      });

      fragment.appendChild(el);
    }

    container.appendChild(fragment);
  };


  const initialize = (pageSize) => {
    const SCROLL_GAP = 100;
    const THROTTLE_INTERVAL = 100;
    const pictureSwitcher = getPictureSwitcher(PICS_NUMBER);
    const pageSwitcher = getPageSwitcher(pictureSwitcher);

    window.onscroll = () => {
      if (document.body.scrollTop + window.innerHeight >=
          document.body.scrollHeight - SCROLL_GAP) {
        switchPage(pageSwitcher, PAGE_SIZE);
      }
    };

    switchPage(pageSwitcher, PAGE_SIZE);
  };

  initialize(PAGE_SIZE);
})();
