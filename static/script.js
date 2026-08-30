(function () {
  "use strict";

  const form = document.getElementById("postForm");
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const formStatus = document.getElementById("formStatus");
  const previewHint = document.getElementById("previewHint");
  const postCard = document.getElementById("postCard");

  const fields = {
    propertyType: {
      input: document.getElementById("propertyType"),
      error: document.getElementById("err-propertyType"),
      message: "Please enter the property & type.",
    },
    location: {
      input: document.getElementById("location"),
      error: document.getElementById("err-location"),
      message: "Please enter the location.",
    },
    price: {
      input: document.getElementById("price"),
      error: document.getElementById("err-price"),
      message: "Please enter the price.",
    },
    highlights: {
      input: document.getElementById("highlights"),
      error: document.getElementById("err-highlights"),
      message: "Please add at least one highlight.",
    },
  };

  const outType = document.getElementById("outType");
  const outLocation = document.getElementById("outLocation");
  const outPrice = document.getElementById("outPrice");
  const outHighlights = document.getElementById("outHighlights");

  let hasGeneratedOnce = false;

  function clearFieldError(key) {
    const f = fields[key];
    f.input.classList.remove("field--invalid");
    f.error.textContent = "";
  }

  function setFieldError(key) {
    const f = fields[key];
    f.input.classList.add("field--invalid");
    f.error.textContent = f.message;
  }

  function validateAll() {
    let isValid = true;
    let firstInvalid = null;

    Object.keys(fields).forEach((key) => {
      const value = fields[key].input.value.trim();
      if (!value) {
        setFieldError(key);
        isValid = false;
        if (!firstInvalid) firstInvalid = fields[key].input;
      } else {
        clearFieldError(key);
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return isValid;
  }

  // Clear a field's error as soon as the user starts fixing it.
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener("input", () => {
      if (fields[key].input.value.trim()) clearFieldError(key);
    });
  });

  function splitHighlights(raw) {
    return raw
      .split(/[•,|]/)
      .map((piece) => piece.trim())
      .filter(Boolean);
  }

  function escapeText(str) {
    // textContent assignment already escapes HTML, this just normalises whitespace
    return str.replace(/\s+/g, " ").trim();
  }

  function renderCard() {
    const type = escapeText(fields.propertyType.input.value);
    const location = escapeText(fields.location.input.value);
    const price = escapeText(fields.price.input.value);
    const highlightItems = splitHighlights(fields.highlights.input.value);

    outType.textContent = type;
    outLocation.innerHTML = "";
    const pin = document.createElement("span");
    pin.className = "pin";
    pin.setAttribute("aria-hidden", "true");
    pin.textContent = "◎";
    outLocation.appendChild(pin);
    outLocation.appendChild(document.createTextNode(" " + location));

    outPrice.textContent = price;

    outHighlights.innerHTML = "";
    highlightItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      outHighlights.appendChild(li);
    });

    // Re-trigger the reveal animation.
    postCard.classList.remove("is-fresh");
    // Force reflow so the animation restarts even on repeat generations.
    void postCard.offsetWidth;
    postCard.classList.add("is-fresh");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateAll()) {
      formStatus.textContent = "Please fill in all four fields to generate your post.";
      formStatus.classList.remove("is-success");
      return;
    }

    renderCard();
    hasGeneratedOnce = true;
    downloadBtn.disabled = false;
    previewHint.textContent = "Looking good — download it and share on WhatsApp, Instagram or LinkedIn.";
    formStatus.textContent = "Post generated. Scroll to the preview to download it.";
    formStatus.classList.add("is-success");
  });

  downloadBtn.addEventListener("click", async function () {
    if (!hasGeneratedOnce || typeof html2canvas === "undefined") return;

    const originalLabel = downloadBtn.innerHTML;
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<span class="btn__icon" aria-hidden="true">⋯</span> Preparing image…';

    // html2canvas mis-renders this card unless two quirks are worked around
    // first (both confirmed by testing, otherwise the background comes out
    // almost fully transparent):
    // 1) CSS `aspect-ratio` combined with `border-radius` + `overflow: hidden`
    //    breaks its rounded-corner clip math, so we freeze the current
    //    on-screen height as a fixed pixel value for the capture.
    // 2) A finished CSS animation (our reveal effect) leaves the element in a
    //    state html2canvas paints incorrectly, so we cancel/clear it first.
    postCard.getAnimations().forEach((anim) => anim.cancel());
    postCard.classList.remove("is-fresh");

    const frozenHeight = postCard.getBoundingClientRect().height;
    postCard.style.height = `${frozenHeight}px`;
    postCard.style.aspectRatio = "unset";

    try {
      const canvas = await html2canvas(postCard, {
        backgroundColor: null,
        scale: Math.max(2, window.devicePixelRatio || 1),
        useCORS: true,
        ignoreElements: (el) => el.classList && el.classList.contains("grid-backdrop"),
      });

      const link = document.createElement("a");
      const fileNameBase = (fields.propertyType.input.value || "property-post")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      link.download = `${fileNameBase || "property-post"}-kavva-harini.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      previewHint.textContent = "Couldn't create the image. Please try again.";
      // eslint-disable-next-line no-console
      console.error("PNG export failed:", err);
    } finally {
      postCard.style.removeProperty("height");
      postCard.style.removeProperty("aspect-ratio");
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = originalLabel;
    }
  });
})();
