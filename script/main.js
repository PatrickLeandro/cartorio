// script/main.js
(function(){
  const bar = document.getElementById("stickyBar");
  const btn = document.getElementById("closeSticky");
  if(!bar || !btn) return;

  const KEY = "pk_cartorio_sticky_closed_at";
  const saved = Number(localStorage.getItem(KEY) || 0);
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  if(saved && (Date.now() - saved) < sevenDays){
    bar.style.display = "none";
    return;
  }

  btn.addEventListener("click", function(){
    bar.style.display = "none";
    localStorage.setItem(KEY, String(Date.now()));
  });
})();

(function(){
  const gallery = document.getElementById("gallery");
  const btnMore = document.getElementById("loadMorePhotos");

  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCaption = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbBackdrop = document.getElementById("lbBackdrop");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  if(!gallery || !lb || !lbImg || !lbCaption || !lbClose || !lbBackdrop || !lbPrev || !lbNext) return;

  function getAllItems(){
    return Array.from(gallery.querySelectorAll(".gallery-item"));
  }
  function getVisibleItems(){
    return getAllItems().filter(el => !el.classList.contains("is-hidden"));
  }

  function shuffleHidden(){
    const all = getAllItems();
    const visible = all.filter(el => !el.classList.contains("is-hidden"));
    const hidden = all.filter(el => el.classList.contains("is-hidden"));

    for(let i = hidden.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = hidden[i];
      hidden[i] = hidden[j];
      hidden[j] = tmp;
    }

    visible.forEach(el => gallery.appendChild(el));
    hidden.forEach(el => gallery.appendChild(el));
  }

  shuffleHidden();

  let idx = 0;

  function setIndex(newIndex){
    const items = getVisibleItems();
    if(items.length === 0) return;

    idx = (newIndex + items.length) % items.length;

    const el = items[idx];
    const imgEl = el.querySelector("img");
    const src = imgEl ? imgEl.getAttribute("src") : "";
    const alt = imgEl ? imgEl.getAttribute("alt") : "Foto ampliada";

    lbImg.src = src;
    lbImg.alt = alt;

    const left = document.createElement("strong");
    left.textContent = alt;

    const right = document.createElement("span");
    right.textContent = (idx + 1) + " de " + items.length;

    lbCaption.innerHTML = "";
    lbCaption.appendChild(left);
    lbCaption.appendChild(right);
  }

  function openAt(index){
    setIndex(index);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }

  function close(){
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  gallery.addEventListener("click", function(e){
    const btn = e.target && e.target.closest ? e.target.closest(".gallery-item") : null;
    if(!btn) return;
    if(btn.classList.contains("is-hidden")) return;

    const visible = getVisibleItems();
    const index = visible.indexOf(btn);
    if(index >= 0) openAt(index);
  });

  lbClose.addEventListener("click", close);
  lbBackdrop.addEventListener("click", close);
  lbPrev.addEventListener("click", function(){ setIndex(idx - 1); });
  lbNext.addEventListener("click", function(){ setIndex(idx + 1); });

  document.addEventListener("keydown", function(e){
    if(!lb.classList.contains("open")) return;
    if(e.key === "Escape") close();
    if(e.key === "ArrowLeft") setIndex(idx - 1);
    if(e.key === "ArrowRight") setIndex(idx + 1);
  });

  function revealBatch(){
    const hidden = Array.from(gallery.querySelectorAll(".gallery-item.is-hidden"));
    const batch = 8;

    if(hidden.length === 0){
      btnMore.textContent = "Você já viu tudo";
      btnMore.disabled = true;
      btnMore.style.opacity = ".6";
      return;
    }

    const showNow = hidden.slice(0, batch);
    showNow.forEach(el => {
      el.classList.remove("is-hidden");
      el.classList.add("is-revealing");
      setTimeout(() => el.classList.remove("is-revealing"), 450);
    });

    const left = Array.from(gallery.querySelectorAll(".gallery-item.is-hidden")).length;
    if(left === 0){
      btnMore.textContent = "Você já viu tudo";
      btnMore.disabled = true;
      btnMore.style.opacity = ".6";
    }else{
      btnMore.textContent = "Ver mais fotos";
    }
  }

  if(btnMore){
    btnMore.addEventListener("click", revealBatch);
  }
})();
