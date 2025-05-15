document.addEventListener('DOMContentLoaded', function() {
    const segments = document.querySelectorAll('.text-content span');
    let currentAudio = null;

    segments.forEach(segment => {
        segment.addEventListener('click', function() {
            // Stop previously playing audio
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Remove active class from all segments
            segments.forEach(s => s.classList.remove('active'));

            // Add active class to current segment
            segment.classList.add('active');

            // Play the audio related to the clicked segment
            const audioSrc = segment.getAttribute('data-audio');
            currentAudio = new Audio(audioSrc);
            currentAudio.play();

            // Remove active state when audio ends
            currentAudio.onended = () => {
                segment.classList.remove('active');
            };
        });
    });
});
