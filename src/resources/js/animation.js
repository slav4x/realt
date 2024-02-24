// function createScrollTrigger(triggerElement, timeline) {
//   ScrollTrigger.create({
//     trigger: triggerElement,
//     start: 'top bottom',
//     onLeaveBack: () => {
//       timeline.progress(0);
//       timeline.pause();
//     },
//   });
//   ScrollTrigger.create({
//     trigger: triggerElement,
//     start: 'top 60%',
//     onEnter: () => timeline.play(),
//   });
// }

function createIdleAndHover(el) {
  const num = el.textContent;
  const numArr = [...num];

  el.innerHTML = '<span class="idle"></span><span class="hover"></span>';

  el.querySelector('.idle').innerHTML = numArr.map((e) => `<span class="char">${e}</span>`).join('');
  el.querySelector('.hover').innerHTML = numArr.map((e) => `<span class="char">${e}</span>`).join('');
}

function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    const el = entry.target.querySelector('[data-counter]');

    if (entry.isIntersecting && entry.intersectionRatio >= 1 && !el.classList.contains('is-inview')) {
      el.classList.add('is-inview');
      observer.unobserve(entry.target);

      const allElementsInView = document.querySelectorAll('.stats-item:not(.is-inview)').length === 0;
      if (allElementsInView) {
        window.removeEventListener('scroll', scrollHandler);
      }
    }
  });
}

if (window.innerWidth > 768) {
  const observer = new IntersectionObserver(handleIntersection, { threshold: 1 });
  document.querySelectorAll('.stats-item:not(.is-inview)').forEach((item) => {
    if (observer) {
      createIdleAndHover(item.querySelector('[data-counter]'));
      observer.observe(item);
    }
  });

  // document.querySelectorAll('[animate-text]').forEach(function (element) {
  //   const typeSplit = new SplitType(element, {
  //     types: 'words',
  //     tagName: 'el',
  //   });

  //   const tl = gsap.timeline({ paused: true });
  //   tl.from(element.querySelectorAll('.word'), { opacity: 0, y: '1em', duration: 0.6, ease: 'power2.out', stagger: { amount: 0.2 } });
  //   createScrollTrigger(element, tl);
  // });
}
