document.addEventListener('DOMContentLoaded', () => {
    const layers = document.querySelectorAll('.layer'); 
    const bookWidth = 150; 
    const speed = 0.1; 
    const booksPerSet = 20; 

    layers.forEach((layer, index) => {
        let position = 0; 
        const books = Array.from(layer.children);
        const totalBooks = books.length;
        const layerWidth = totalBooks * bookWidth; 

        if (index % 2 !== 0) {
            position = -(layerWidth*7.876) ; 
        }

        for (let i = 0; i < booksPerSet; i++) {
            books.forEach(book => {
                const clone = book.cloneNode(true);
                layer.appendChild(clone);
            });
        }

        function moveBooks() {
            position += (index % 2 === 0 ? -speed : speed);
            if (index % 2 === 0) {
                position -= speed;
            } else {
                position += speed;
            }

            layer.style.transform = `translateX(${position}px)`;

            if (index % 2 === 0 && Math.abs(position) >= layerWidth) {
                position = 0; 
            } else if (index % 2 !== 0 && position >= layerWidth) {
                position = -layerWidth / 2; 
            }

            requestAnimationFrame(moveBooks);
        }

        moveBooks(); 
    });
});

