document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let hamsterX = canvas.width / 2;
    let hamsterY = canvas.height / 2;
    let speed = 5;

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            hamsterX -= speed;
        } else if (event.key === 'ArrowRight') {
            hamsterX += speed;
        } else if (event.key === 'ArrowUp') {
            hamsterY -= speed;
        } else if (event.key === 'ArrowDown') {
            hamsterY += speed;
        }
    });

    function drawHamster() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the hamster (simple rectangle for now)
        ctx.fillStyle = 'brown';
        ctx.fillRect(hamsterX, hamsterY, 50, 30);

        // Draw hamster ears
        ctx.beginPath();
        ctx.arc(hamsterX + 10, hamsterY, 10, 0, Math.PI * 2, true);
        ctx.arc(hamsterX + 40, hamsterY, 10, 0, Math.PI * 2, true);
        ctx.fillStyle = 'brown';
        ctx.fill();

        // Draw hamster eyes
        ctx.beginPath();
        ctx.arc(hamsterX + 15, hamsterY + 10, 5, 0, Math.PI * 2, true);
        ctx.arc(hamsterX + 35, hamsterY + 10, 5, 0, Math.PI * 2, true);
        ctx.fillStyle = 'black';
        ctx.fill();

        // Request the next frame
        requestAnimationFrame(drawHamster);
    }

    // Start the drawing loop
    drawHamster();
});

// Start the drawing loop
drawHamster();
