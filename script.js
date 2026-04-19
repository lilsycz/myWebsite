// Lightbox
var lbGroups = {};
var lbCurrent = { group: null, index: 0 };

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.portfolio-page[data-group]').forEach(function(img) {
    var g = img.dataset.group;
    if (!lbGroups[g]) lbGroups[g] = [];
    lbGroups[g][parseInt(img.dataset.index)] = img.src;
  });

  document.querySelectorAll('.detail-title').forEach(function(title) {
    title.style.cursor = 'pointer';
    title.addEventListener('click', function() {
      var panel = title.closest('.detail-panel');
      if (panel) panel.classList.remove('open');
    });
  });
});

function openLightbox(img) {
  var group = img.dataset.group;
  var index = parseInt(img.dataset.index);
  lbCurrent = { group: group, index: index };
  lbShow();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function lbShow() {
  var imgs = lbGroups[lbCurrent.group];
  var idx = lbCurrent.index;
  document.getElementById('lb-img').src = imgs[idx];
  document.getElementById('lb-counter').textContent = (idx + 1) + ' / ' + imgs.length;
  document.querySelector('.lb-prev').classList.toggle('hidden', idx === 0);
  document.querySelector('.lb-next').classList.toggle('hidden', idx === imgs.length - 1);
}

function lbNav(dir) {
  var imgs = lbGroups[lbCurrent.group];
  var next = lbCurrent.index + dir;
  if (next < 0 || next >= imgs.length) return;
  lbCurrent.index = next;
  lbShow();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightboxOnBackdrop(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

document.addEventListener('keydown', function(e) {
  var lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight') lbNav(1);
  else if (e.key === 'ArrowLeft') lbNav(-1);
  else if (e.key === 'Escape') closeLightbox();
});

var posterNameOverlap = document.querySelector('.poster-name-overlap');
var posterDarkSections = document.querySelectorAll('.s-black, .about-section, .footer');

function tog(id) {
  var d = document.getElementById('d' + id);
  var open = d.classList.contains('open');
  document.querySelectorAll('.detail-panel').forEach(function(p) { p.classList.remove('open'); });
  if (!open) {
    d.classList.add('open');
    requestAnimationFrame(function() {
      var rect = d.getBoundingClientRect();
      var targetScrollY = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    });
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && !document.getElementById('lightbox').classList.contains('open')) {
    document.querySelectorAll('.detail-panel').forEach(function(p) { p.classList.remove('open'); });
  }
});

function updatePosterNameContrast() {
  if (!posterNameOverlap) return;

  var segments = [];
  posterDarkSections.forEach(function(section) {
    var rect = section.getBoundingClientRect();
    var top = Math.max(0, rect.top);
    var bottom = Math.min(window.innerHeight, rect.bottom);
    if (bottom > top) {
      segments.push({ top: top, bottom: bottom });
    }
  });

  posterNameOverlap.innerHTML = '';

  if (!segments.length) {
    return;
  }

  segments.sort(function(a, b) { return a.top - b.top; });

  var merged = [];
  segments.forEach(function(segment) {
    var last = merged[merged.length - 1];
    if (last && segment.top <= last.bottom) {
      last.bottom = Math.max(last.bottom, segment.bottom);
      return;
    }
    merged.push({ top: segment.top, bottom: segment.bottom });
  });

  merged.forEach(function(segment) {
    var clip = document.createElement('div');
    clip.className = 'poster-name-clip';
    clip.style.clipPath = 'inset(' + segment.top + 'px ' + 'var(--sidebar-w) ' + (window.innerHeight - segment.bottom) + 'px ' + 'var(--left-rail-w))';
    clip.style.webkitClipPath = 'inset(' + segment.top + 'px ' + 'var(--sidebar-w) ' + (window.innerHeight - segment.bottom) + 'px ' + 'var(--left-rail-w))';
    clip.innerHTML = '<div class="poster-name-layer poster-name-invert"><span>JADE</span><span>CHEN</span></div>';
    posterNameOverlap.appendChild(clip);
  });
}

var sections = ['projects', 'experience', 'about', 'contact'];
var links = document.querySelectorAll('.sidebar-link');

function updateActiveSidebarLink() {
  var scrollY = window.scrollY + 120;
  var current = 'projects';
  sections.forEach(function(id) {
    var el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });
  var contactSection = document.getElementById('contact');
  if (contactSection) {
    var contactTop = contactSection.getBoundingClientRect().top;
    if (contactTop <= window.innerHeight) current = 'contact';
  }
  links.forEach(function(l) {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', function() {
  updateActiveSidebarLink();
  updatePosterNameContrast();
});

window.addEventListener('resize', function() {
  updateActiveSidebarLink();
  updatePosterNameContrast();
});

updateActiveSidebarLink();
updatePosterNameContrast();
