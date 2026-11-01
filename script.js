// Data de hoje na barra de urgência (puxa o dia em que a pessoa abre a página)
(function(){
  var el=document.getElementById('hojeData');
  if(!el)return;
  var d=new Date();
  var dd=String(d.getDate()).padStart(2,'0');
  var mm=String(d.getMonth()+1).padStart(2,'0');
  el.textContent=dd+'/'+mm+'/'+d.getFullYear();
})();

// Carousel dots + click-to-zoom lightbox
(function(){
  var carousel=document.getElementById('carousel');
  var dotsWrap=document.getElementById('dots');
  var slides=carousel?Array.prototype.slice.call(carousel.querySelectorAll('.slide')):[];
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lbImg'),lbClose=document.getElementById('lbClose');
  // build dots
  slides.forEach(function(s,i){
    var b=document.createElement('button');
    b.setAttribute('aria-label','Ir para receita '+(i+1));
    if(i===0)b.classList.add('active');
    b.addEventListener('click',function(){goTo(i);});
    dotsWrap.appendChild(b);
    // click slide -> open lightbox
    s.addEventListener('click',function(){
      var img=s.querySelector('img');
      lbImg.src=img.src;lbImg.alt=img.alt;lb.classList.add('open');
      document.body.style.overflow='hidden';
    });
  });
  // sync active dot on scroll + arrow nav
  var dots=dotsWrap?Array.prototype.slice.call(dotsWrap.children):[];
  var current=0;
  var prev=document.getElementById('navPrev'),next=document.getElementById('navNext');
  function updateArrows(){
    if(prev)prev.disabled=(current<=0);
    if(next)next.disabled=(current>=slides.length-1);
  }
  function goTo(i){
    i=Math.max(0,Math.min(slides.length-1,i));
    current=i;
    slides[i].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
    dots.forEach(function(d,k){d.classList.toggle('active',k===i);});
    updateArrows();
  }
  if(prev)prev.addEventListener('click',function(){goTo(current-1);});
  if(next)next.addEventListener('click',function(){goTo(current+1);});
  if(carousel){
    var tick;
    carousel.addEventListener('scroll',function(){
      clearTimeout(tick);
      tick=setTimeout(function(){
        var c=carousel.getBoundingClientRect(),mid=c.left+c.width/2,best=0,bestD=1e9;
        slides.forEach(function(s,i){var r=s.getBoundingClientRect();var d=Math.abs(r.left+r.width/2-mid);if(d<bestD){bestD=d;best=i;}});
        current=best;
        dots.forEach(function(d,i){d.classList.toggle('active',i===best);});
        updateArrows();
      },60);
    },{passive:true});
  }
  updateArrows();
  function closeLb(){lb.classList.remove('open');document.body.style.overflow='';}
  if(lbClose)lbClose.addEventListener('click',closeLb);
  if(lb)lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLb();});
})();

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(function(b){
  b.addEventListener('click',function(){
    var item=b.parentElement;
    var a=item.querySelector('.faq-a');
    var open=item.classList.toggle('open');
    a.style.maxHeight=open?a.scrollHeight+'px':'0';
  });
});
// Smooth slide to plans section on CTA click
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('a[href="#planos"]').forEach(function(a){
  a.addEventListener('click',function(ev){
    var target=document.getElementById('planos');
    if(!target)return;
    ev.preventDefault();
    target.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
    // quick flash to draw the eye to the premium plan
    var premium=document.querySelector('.plan.premium');
    if(premium&&!reduce){
      setTimeout(function(){
        premium.animate([
          {boxShadow:'0 20px 50px rgba(224,26,119,.22)'},
          {boxShadow:'0 0 0 5px rgba(255,61,148,.55), 0 20px 50px rgba(224,26,119,.45)'},
          {boxShadow:'0 20px 50px rgba(224,26,119,.22)'}
        ],{duration:900,iterations:2});
      },600);
    }
  });
});
// Scroll reveal
var io=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
