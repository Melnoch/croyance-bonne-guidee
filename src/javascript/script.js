document.addEventListener('DOMContentLoaded', function () {
    const repeatBtn = document.getElementById('repeatToggle');
    const playRangeBtn = document.getElementById('playRangeBtn');
    const stopBtn = document.getElementById('stopBtn');
    const startInput = document.getElementById('startPart');
    const endInput = document.getElementById('endPart');
    const segments = document.querySelectorAll('.text-content span');

    let repeatActive = false;
    let currentAudio = null;
    let playingRange = false;
    let current = null;

    // === Toggle repeat ===
    repeatBtn.addEventListener('click', () => {
        repeatActive = !repeatActive;
        repeatBtn.classList.toggle('active', repeatActive);
    });

    // === Handle phrase click ===
    segments.forEach(segment => {
        segment.addEventListener('click', () => {
            playingRange = false;
            playRangeBtn.classList.remove('active');

            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            segments.forEach(s => s.classList.remove('active'));
            segment.classList.add('active');

            const audioSrc = segment.getAttribute('data-audio');
            currentAudio = new Audio(audioSrc);
            currentAudio.loop = repeatActive;
            currentAudio.play();

            currentAudio.onended = () => segment.classList.remove('active');

            const id = segment.id;
            if (id) {
                startInput.value = id;
                endInput.value = id;
            }
        });
    });

    // === Play range ===
    playRangeBtn.addEventListener('click', () => {
        const start = parseInt(startInput.value, 10);
        const end = parseInt(endInput.value, 10);
        if (isNaN(start) || isNaN(end) || start > end) return;

        playingRange = true;
        playRangeBtn.classList.add('active');
        current = start;

        const playNext = () => {
            const updatedStart = parseInt(startInput.value, 10);
            const updatedEnd = parseInt(endInput.value, 10);
            if (isNaN(updatedStart) || isNaN(updatedEnd) || updatedStart > updatedEnd) {
                playingRange = false;
                playRangeBtn.classList.remove('active');
                return;
            }

            // If we've reached the end, repeat or stop
            if (current == null || current > updatedEnd) {
                if (repeatActive) {
                    current = updatedStart;
                } else {
                    playingRange = false;
                    playRangeBtn.classList.remove('active');
                    return;
                }
            }

            const span = document.getElementById(current.toString());
            if (!span) {
                current++;
                playNext(); // Skip missing span
                return;
            }

            segments.forEach(s => s.classList.remove('active'));
            span.classList.add('active');

            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
            }

            currentAudio = new Audio(span.getAttribute('data-audio'));
            currentAudio.loop = false;
            currentAudio.play();

            currentAudio.onended = () => {
                span.classList.remove('active');
                current++;
                if (playingRange) {
                    playNext();
                }
            };
        };


        playNext();
    });

    // === Stop playback ===
    stopBtn.addEventListener('click', () => {
        playingRange = false;
        playRangeBtn.classList.remove('active');

        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        segments.forEach(s => s.classList.remove('active'));
    });

    startInput.addEventListener('blur', () => {
        const start = parseInt(startInput.value, 10);
        const end = parseInt(endInput.value, 10);
        if (!isNaN(start) && !isNaN(end) && start > end) {
            endInput.value = start;
        }
    });

    endInput.addEventListener('blur', () => {
        const start = parseInt(startInput.value, 10);
        const end = parseInt(endInput.value, 10);
        if (!isNaN(start) && !isNaN(end) && end < start) {
            startInput.value = end;
        }
    });

    startInput.addEventListener('change', () => {
        const start = parseInt(startInput.value, 10);
        const end = parseInt(endInput.value, 10);
        if (!isNaN(start) && !isNaN(end) && start > end) {
            endInput.value = start;
        }
    });

    endInput.addEventListener('change', () => {
        const start = parseInt(startInput.value, 10);
        const end = parseInt(endInput.value, 10);
        if (!isNaN(start) && !isNaN(end) && end < start) {
            startInput.value = end;
        }
    });
});
