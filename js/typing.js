/* =============================================
   TYPING.JS — Custom typewriter effect
   ============================================= */

(function () {
  'use strict';

  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Python Developer',
    'C# Developer',
    'Problem Solver',
    'Software Engineering Student',
    'Future Cybersecurity Professional',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPE_SPEED   = 80;   // ms per character typed
  const DELETE_SPEED = 45;   // ms per character deleted
  const PAUSE_AFTER  = 1800; // ms pause at full phrase
  const PAUSE_BEFORE = 300;  // ms pause before typing next

  function type() {
    if (isPaused) return;

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        isPaused = true;
        setTimeout(() => {
          isPaused  = false;
          isDeleting = true;
          scheduleNext();
        }, PAUSE_AFTER);
        return;
      }
    } else {
      el.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          scheduleNext();
        }, PAUSE_BEFORE);
        return;
      }
    }

    scheduleNext();
  }

  function scheduleNext() {
    setTimeout(type, isDeleting ? DELETE_SPEED : TYPE_SPEED);
  }

  // Start after loading screen clears
  setTimeout(scheduleNext, 2400);
}());
