const bookList = document.getElementById('bookList');
        const bookWidth = 160; // 각 책의 너비 + 여백 (150px + 10px)
        const totalBooks = 10; // 총 10권의 책
        let position = 0;

        // 책 목록을 자동으로 왼쪽으로 이동시키는 함수
        function moveBooks() {
            position -= 1; // 왼쪽으로 1px씩 이동

            // 마지막 책이 등장하기 시작하면 위치를 조정하여 처음 책이 자연스럽게 이어지게 함
            if (position <= -(bookWidth * totalBooks)) {
                position = 0; // 처음으로 리셋 (처음 책이 다시 등장)
            }

            bookList.style.left = position + 'px'; // 위치 변경
        }

        // 20ms마다 moveBooks 함수 호출하여 책 목록 이동
        setInterval(moveBooks, 20);