(function () {
  var dialog = document.createElement("dialog");
  dialog.className = "slide-zoom";

  var toolbar = document.createElement("div");
  toolbar.className = "slide-zoom-toolbar";
  var close = document.createElement("button");
  close.type = "button";
  close.textContent = "닫기";
  close.setAttribute("aria-label", "슬라이드 확대 닫기");
  var minus = document.createElement("button");
  minus.type = "button";
  minus.textContent = "−";
  minus.setAttribute("aria-label", "축소");
  var scaleLabel = document.createElement("span");
  scaleLabel.className = "slide-zoom-scale";
  scaleLabel.setAttribute("aria-live", "polite");
  var reset = document.createElement("button");
  reset.type = "button";
  reset.textContent = "화면 맞춤";
  var plus = document.createElement("button");
  plus.type = "button";
  plus.textContent = "+";
  plus.setAttribute("aria-label", "확대");
  toolbar.appendChild(close);
  toolbar.appendChild(minus);
  toolbar.appendChild(scaleLabel);
  toolbar.appendChild(reset);
  toolbar.appendChild(plus);

  var viewport = document.createElement("div");
  viewport.className = "slide-zoom-viewport";
  var zoomImage = document.createElement("img");
  zoomImage.className = "slide-zoom-image";
  viewport.appendChild(zoomImage);
  dialog.appendChild(toolbar);
  dialog.appendChild(viewport);
  document.body.appendChild(dialog);

  var scale = 1;
  var fitScale = 1;
  function setScale(value) {
    scale = Math.max(0.25, Math.min(4, value));
    zoomImage.style.width = Math.round(zoomImage.naturalWidth * scale) + "px";
    scaleLabel.textContent = Math.round(scale * 100) + "%";
  }
  function fitToView() {
    if (!zoomImage.naturalWidth || !zoomImage.naturalHeight) return;
    fitScale = Math.min(
      1,
      (viewport.clientWidth - 24) / zoomImage.naturalWidth,
      (viewport.clientHeight - 24) / zoomImage.naturalHeight
    );
    setScale(Math.max(0.25, fitScale));
    viewport.scrollTo(0, 0);
  }
  function openSlide(image) {
    if (!dialog.open) dialog.showModal();
    zoomImage.onload = fitToView;
    zoomImage.alt = image.alt || "확대된 강의 슬라이드";
    zoomImage.src = image.currentSrc || image.src;
    if (zoomImage.complete && zoomImage.naturalWidth) fitToView();
  }

  document.querySelectorAll(".slide.shot .frame").forEach(function (frame) {
    var image = frame.querySelector("img");
    if (!image) return;
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", (image.alt || "슬라이드") + " 확대");
    var button = document.createElement("button");
    button.type = "button";
    button.className = "slide-zoom-trigger";
    button.textContent = "확대";
    button.setAttribute("aria-label", (image.alt || "슬라이드") + " 확대 보기");
    button.addEventListener("click", function () { openSlide(image); });
    frame.appendChild(button);
  });

  document.addEventListener("click", function (event) {
    var image = event.target.closest(".slide.shot .frame img");
    if (!image) return;
    event.preventDefault();
    event.stopPropagation();
    openSlide(image);
  }, true);
  document.addEventListener("keydown", function (event) {
    if ((event.key !== "Enter" && event.key !== " ") || !event.target.matches(".slide.shot .frame img")) return;
    event.preventDefault();
    openSlide(event.target);
  });
  close.addEventListener("click", function () { dialog.close(); });
  minus.addEventListener("click", function () { setScale(scale / 1.25); });
  plus.addEventListener("click", function () { setScale(scale * 1.25); });
  reset.addEventListener("click", fitToView);
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });
})();
