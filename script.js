// script.js

// Example: Dynamically load audio samples (this would require additional setup)
document.addEventListener("DOMContentLoaded", function() {
    const audioSamples = [
        { title: "Sample 1", src: "path/to/your/audio1.mp3" },
        { title: "Sample 2", src: "path/to/your/audio2.mp3" },
        // Add more samples as needed
    ];

    const container = document.getElementById('audio-container');
    audioSamples.forEach(sample => {
        const sampleDiv = document.createElement('div');
        sampleDiv.className = 'audio-sample';
        sampleDiv.innerHTML = `
            <p>${sample.title}</p>
            <audio controls>
                <source src="${sample.src}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        container.appendChild(sampleDiv);
    });
});
