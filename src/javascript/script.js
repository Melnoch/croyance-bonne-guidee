document.addEventListener('DOMContentLoaded', function() {
    const repeatBtn = document.getElementById('repeatToggle');
    let repeatActive = false;

    repeatBtn.addEventListener('click', function() {
        repeatActive = !repeatActive;
        repeatBtn.classList.toggle('active', repeatActive);

        if (currentAudio) {
            currentAudio.loop = repeatActive;
        }
    });

    const segments = document.querySelectorAll('.text-content span');
    let currentAudio = null;

    segments.forEach(segment => {
        segment.addEventListener('click', function() {
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            segments.forEach(s => s.classList.remove('active'));
            segment.classList.add('active');

            const audioSrc = segment.getAttribute('data-audio');
            currentAudio = new Audio(audioSrc);
            currentAudio.loop = repeatActive; // respects repeat button state
            currentAudio.play();

            currentAudio.onended = () => segment.classList.remove('active');
        });
    });
});
