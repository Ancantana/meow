document.addEventListener('DOMContentLoaded', function() {
    const captureVideo = document.getElementById('captureVideo');
    const textInput = document.getElementById('textInput');
    const asciiArtContainer = document.getElementById('asciiArtContainer');
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    function startVideoStream() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                captureVideo.srcObject = stream;
                captureVideo.onloadedmetadata = function() {
                    canvas.width = captureVideo.videoWidth;
                    canvas.height = captureVideo.videoHeight;
                    captureVideo.play();
                };
            })
            .catch(function(error) {
                console.error("Error accessing the webcam: ", error);
            });
    }

    function captureAndConvertFrame() {
        context.drawImage(captureVideo, 0, 0, canvas.width, canvas.height);
        convertToAscii(context.getImageData(0, 0, canvas.width, canvas.height));
    }

    function convertToAscii(imageData) {
        asciiArtContainer.innerHTML = ''; // Clear existing content
        for (let i = 0; i < imageData.height; i += 10) {
            let line = '';
            for (let j = 0; j < imageData.width; j += 5) {
                const offset = (i * imageData.width + j) * 4;
                const red = imageData.data[offset];
                const green = imageData.data[offset + 1];
                const blue = imageData.data[offset + 2];
                const color = `rgb(${red},${green},${blue})`;
                const brightness = (0.3 * red + 0.59 * green + 0.11 * blue) / 255;
                const characters = "@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
                const charIndex = Math.floor(brightness * (characters.length - 1));
                const character = characters[charIndex];
                line += `<span style="color: ${color};">${character}</span>`;
            }
            asciiArtContainer.innerHTML += line + '<br>';
        }
    }

    textInput.addEventListener('input', function() {
        captureAndConvertFrame();
    });

    startVideoStream();
});


