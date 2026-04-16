var curSkill = 0;
var posterNameOverlap = document.querySelector('.poster-name-overlap');
var posterDarkSections = document.querySelectorAll('.s-black, .about-section, .footer');

function goSkill(n) {
  n = Math.max(0, Math.min(2, n));
  curSkill = n;
  var cols = document.querySelectorAll('.skills-col');
  var w = cols[0].offsetWidth;
  document.getElementById('skillsTrack').style.transform = 'translateX(-' + (n * w) + 'px)';
  document.querySelectorAll('#skillDots .skills-dot').forEach(function(d, i) {
    d.classList.toggle('act', i === n);
  });
}

function tog(id) {
  var d = document.getElementById('d' + id);
  var open = d.classList.contains('open');
  document.querySelectorAll('.detail-panel').forEach(function(p) { p.classList.remove('open'); });
  if (!open) d.classList.add('open');
}

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
  goSkill(curSkill);
  updateActiveSidebarLink();
  updatePosterNameContrast();
});

updateActiveSidebarLink();
updatePosterNameContrast();
