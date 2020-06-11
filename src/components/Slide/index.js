import React, { useRef, useEffect, cloneElement, Children } from 'react';

import { ContainerEl, WrapperEl } from './styles';

export default function Slide({ children, navigation }) {
  const slide = useRef(null);
  const wrapper = useRef(null);
  const dist = { finalPosition: 0, startX: 0, movement: 0 };
  const classes = {
    containerClass: 'truth-container',
    wrapperClass: 'truth-wrapper',
    activeClass: 'active-slide',
    prevClass: 'prev-slide',
    nextClass: 'next-slide',
  };
  const changeEvent = new Event('changeEvent');
  let current = {};
  let slideArray = [];

  const renderContent = (e) => {
    const slideClassNames = ['truth-slide', e.props.className || ''];
    return cloneElement(e, {
      ...e.props,
      className: slideClassNames.join(' ').trim(),
    });
  };

  const transition = (active) => {
    slide.current.style.transition = active ? 'transform .3s' : '';
  };

  const moveSlide = (distX) => {
    dist.movePosition = distX;
    slide.current.style.transform = `translate3d(${distX}px, 0, 0)`;
  };

  const updatePosition = (clientX) => {
    dist.movement = (dist.startX - clientX) * 1.6;
    return dist.finalPosition - dist.movement;
  };

  const onMove = (event) => {
    const pointerPosition =
      event.type === 'mousemove'
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = updatePosition(pointerPosition);
    moveSlide(finalPosition);
  };

  const onStart = (event) => {
    let movetype;
    if (event.type === 'mousedown') {
      event.preventDefault();
      dist.startX = event.clientX;
      movetype = 'mousemove';
    } else {
      dist.startX = event.changedTouches[0].clientX;
      movetype = 'touchmove';
    }
    wrapper.current.addEventListener(movetype, onMove);
    transition(false);
  };

  const slidesIndexNav = (index) => {
    const last = slideArray.length - 1;
    current = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  };

  const addClass = (option, classesOption) => {
    const slideEl = slideArray[option];

    if (slideEl) {
      slideEl.element.classList.add(classesOption);

      const isActiveSlide = slideEl.element.classList.contains(
        classes.activeClass
      );

      if (!isActiveSlide) {
        const distTransform = (slideEl.element.offsetWidth / 2) * 1.2;

        const distValue =
          option > (!current.prev ? 0 : current.prev)
            ? `-${distTransform}`
            : distTransform;
        slideEl.element.style.transform = `translate3d(${distValue}px, 0px, 0px) scale(0.8)`;
      }
    }
  };

  const changeActiveClass = () => {
    slideArray.forEach((item, index) => {
      slideArray[index].element.style.cssText = '';
      item.element.classList.remove(
        classes.activeClass,
        classes.prevClass,
        classes.nextClass
      );
    });

    addClass(current.active, classes.activeClass);
    addClass(current.prev, classes.prevClass);
    addClass(current.next, classes.nextClass);
  };

  const changeSlide = (index) => {
    const activeSlide = slideArray[index];
    moveSlide(activeSlide.position);
    slidesIndexNav(index);
    dist.finalPosition = activeSlide.position;
    changeActiveClass();
    wrapper.current.dispatchEvent(changeEvent);
  };

  const activePrevSlide = () => {
    if (current.prev !== undefined) changeSlide(current.prev);
  };

  const activeNextSlide = () => {
    if (current.next !== undefined) changeSlide(current.next);
  };

  const changeSlideOnEnd = () => {
    if (dist.movement > 120 && current.next !== undefined) {
      activeNextSlide();
    } else if (dist.movement < -120 && current.prev !== undefined) {
      activePrevSlide();
    } else {
      changeSlide(current.active);
    }
  };

  const onEnd = (event) => {
    const movetype = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
    wrapper.current.removeEventListener(movetype, onMove);
    dist.finalPosition = dist.movePosition;
    transition(true);
    changeSlideOnEnd();
  };

  const slidePosition = (currentSlide) => {
    const margin = (wrapper.current.offsetWidth - currentSlide.offsetWidth) / 2;
    return -(currentSlide.offsetLeft - margin);
  };

  const slidesConfig = () => {
    slideArray = [...slide.current.children].map((element) => {
      const position = slidePosition(element);
      return { position, element };
    });
  };

  const onResize = () => {
    setTimeout(() => {
      slidesConfig();
      changeSlide(current.active);
    }, 1000);
  };

  const addResizeEvent = () => {
    window.addEventListener('resize', onResize);
  };

  const init = () => {
    transition(true);
    slidesConfig();
    addResizeEvent();
    changeSlide(1);
  };

  useEffect(() => {
    if (slide && wrapper) {
      init();
    }
  }, [slide, wrapper]);

  return (
    <ContainerEl
      className={classes.containerClass}
      ref={wrapper}
      onMouseDown={onStart}
      onTouchStart={onStart}
      onMouseUp={onEnd}
      onTouchEnd={onEnd}
    >
      <WrapperEl className={classes.wrapperClass} ref={slide}>
        {Children.map(children, renderContent)}
      </WrapperEl>
      <br />
      {navigation && (
        <>
          <button type="button" onClick={activePrevSlide}>
            Anterior
          </button>
          <button type="button" onClick={activeNextSlide}>
            Proximo
          </button>
        </>
      )}
    </ContainerEl>
  );
}
