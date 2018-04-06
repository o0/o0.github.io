'use strict';

(() => {
  const createCanvas = (container, {width, height}) => {
    const canvasEl = document.createElement(`canvas`);
    canvasEl.setAttribute(`width`, width);
    canvasEl.setAttribute(`height`, height);
    return canvasEl;
  };


  const decorateContainer = (container, options) => {
    container.insertAdjacentElement(`afterbegin`, createCanvas(container, options));
    container.insertAdjacentHTML(`afterbegin`, `<div class="video-controls">
      <div class="video-controls__separator"></div>
    </div>`);
    return container;
  };


  const updateSeparatorPosition = (element, position) => {
    element.style.left = `${position}%`;
  };


  const clamp = (val, min, max) => Math.max(Math.min(max, val), min);


  const initDND = (element, container, updateFn) => {
    const containerOffset = container.offsetLeft;
    const containerWidth = container.offsetWidth;

    const onMouseMove = (evt) => {
      updateFn(clamp((evt.clientX - containerOffset) / containerWidth, 0, 1));
    };

    const onMouseUp = () => {
      document.body.removeEventListener(`mousemove`, onMouseMove);
      document.body.removeEventListener(`mouseup`, onMouseUp);
    };

    element.onmousedown = () => {
      document.body.addEventListener(`mousemove`, onMouseMove);
      document.body.addEventListener(`mouseup`, onMouseUp);
    };

    return () => {
      element.onmousedown = null;
    };
  };


  const createVideoElement = (src, autoplay = true) => {
    const videoElement = document.createElement(`video`);

    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.src = src;

    if (autoplay) {
      videoElement.play();
    }

    return videoElement;
  };


  const getAnimationStepFn = (ctx, videoLeft, videoRight, options) => {
    return () => {
      ctx.clearRect(0, 0, options.width * options.seprator, options.height);

      ctx.fillStyle = `#fff`;
      ctx.fillRect(0, 0, options.width, options.height);

      ctx.drawImage(videoLeft,
          0, 0, options.width * options.separator, options.height,
          0, 0, options.width * options.separator, options.height);

      ctx.drawImage(videoRight,
          options.width * options.separator, 0, options.width * 1 - options.separator, options.height,
          options.width * options.separator, 0, options.width * 1 - options.separator, options.height);
    };
  };


  const initAnimationLoop = (ctx, animationFrame) => {
    let frameID;

    const loop = (fn) => {
      frameID = requestAnimationFrame(fn);
    };

    const frameFn = () => {
      animationFrame();
      loop(frameFn);
    };

    frameFn();

    return () => {
      window.cancelAnimationFrame(frameID);
    };
  };


  const getUpdateStateFn = (pin, ctx, videoLeft, videoRight) => {
    let stopLoopFn;

    return (options) => {
      if (typeof stopLoopFn === `function`) {
        stopLoopFn();
      }

      updateSeparatorPosition(pin, options.separator.toFixed(4) * 100);
      stopLoopFn = initAnimationLoop(ctx, getAnimationStepFn(ctx, videoLeft, videoRight, options));
    };
  };


  const init = (container, videoLeftSrc, videoRightSrc, options) => {
    options = Object.assign({}, options, {
      separator: 0.5
    });

    const decoratedContainer = decorateContainer(container, options);
    const pin = decoratedContainer.querySelector(`.video-controls__separator`);

    const videoLeft = createVideoElement(videoLeftSrc, true);
    const videoRight = createVideoElement(videoRightSrc, true);

    const updateStateFn = getUpdateStateFn(
        pin,
        decoratedContainer.querySelector(`canvas`).getContext(`2d`),
        videoLeft, videoRight, options);

    updateStateFn(options);

    initDND(pin, container, (pos) => updateStateFn(Object.assign({}, options, {
      separator: pos
    })));
  };


  init(
      document.querySelector(`.layout`),
      `./video-1.mp4`,
      `./video-2.mp4`,
      {width: 640, height: 320});
})();
