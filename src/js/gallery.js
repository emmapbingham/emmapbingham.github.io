/* Image galleries (.pf-gallery) and the shared lightbox.
   Used on the Projects and Portfolio pages. */
(function () {
  /* ── Gallery widget ── */
  /* Builds a quiet "← 1 / n →" row under any gallery with 2+ images */
  document.querySelectorAll('.pf-gallery').forEach(function (gallery) {
    var imgs    = Array.from(gallery.querySelectorAll('.pf-gallery__img'));
    var current = 0;

    if (imgs.length < 2) return; // single image — nothing to wire

    var controls = document.createElement('div');
    controls.className = 'pf-gallery__controls';
    controls.innerHTML =
      '<button type="button" class="pf-gallery__btn" aria-label="Previous image">&#8592;</button>' +
      '<span class="pf-gallery__count" aria-live="polite"></span>' +
      '<button type="button" class="pf-gallery__btn" aria-label="Next image">&#8594;</button>';
    gallery.appendChild(controls);

    var count   = controls.querySelector('.pf-gallery__count');
    var buttons = controls.querySelectorAll('.pf-gallery__btn');

    function go(n) {
      imgs[current].classList.remove('active');
      current = (n + imgs.length) % imgs.length;
      imgs[current].classList.add('active');
      count.textContent = (current + 1) + ' / ' + imgs.length;
    }

    go(0);
    buttons[0].addEventListener('click', function () { go(current - 1); });
    buttons[1].addEventListener('click', function () { go(current + 1); });
  });

  /* ── Lightbox ── */
  var lightbox   = document.getElementById('pf-lightbox');
  var lbImg      = lightbox.querySelector('.pf-lightbox__img');
  var lbPrev     = lightbox.querySelector('.pf-lightbox__prev');
  var lbNext     = lightbox.querySelector('.pf-lightbox__next');
  var lbClose    = lightbox.querySelector('.pf-lightbox__close');
  var lbImages   = [];
  var lbCurrent  = 0;

  function openLightbox(imgs, startIndex) {
    lbImages  = imgs;
    lbCurrent = startIndex;
    lbImg.src = imgs[startIndex].src;
    lbImg.alt = imgs[startIndex].alt;
    lbPrev.style.display = imgs.length > 1 ? '' : 'none';
    lbNext.style.display = imgs.length > 1 ? '' : 'none';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lbImages  = [];
    lbCurrent = 0;
  }

  function lbGo(n) {
    lbCurrent = (n + lbImages.length) % lbImages.length;
    lbImg.src = lbImages[lbCurrent].src;
    lbImg.alt = lbImages[lbCurrent].alt;
  }

  /* wire each gallery's stage to open lightbox on the active image */
  document.querySelectorAll('.pf-gallery').forEach(function (gallery) {
    var stage = gallery.querySelector('.pf-gallery__stage');
    var imgs  = Array.from(gallery.querySelectorAll('.pf-gallery__img'));
    stage.style.cursor = 'zoom-in';
    stage.addEventListener('click', function (e) {
      var activeIndex = imgs.findIndex(function (img) { return img.classList.contains('active'); });
      openLightbox(imgs, activeIndex);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  function () { lbGo(lbCurrent - 1); });
  lbNext.addEventListener('click',  function () { lbGo(lbCurrent + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lbGo(lbCurrent - 1);
    if (e.key === 'ArrowRight') lbGo(lbCurrent + 1);
  });
})();
