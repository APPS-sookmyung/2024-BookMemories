const calendarGrid = document.getElementById('calendar-grid');
const monthYearLabel = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const modal = document.getElementById('entry-modal');
const closeModal = document.querySelector('.close');
const saveEntryBtn = document.getElementById('save-entry');
const deleteEntryBtn = document.getElementById('delete-entry');
const bookInput = document.getElementById('book-input');
const memoInput = document.getElementById('memo-input');
const imageInput = document.getElementById('image-input');

let currentDate = new Date();
let selectedDate = null;
let readingEntries = JSON.parse(localStorage.getItem('readingEntries')) || {};

// 모달 열기
function openModal(dateKey) {
    selectedDate = dateKey;
    if (readingEntries[dateKey]) {
        bookInput.value = readingEntries[dateKey].book || '';
        memoInput.value = readingEntries[dateKey].memo || '';
    } else {
        bookInput.value = '';
        memoInput.value = '';
    }
    modal.style.display = 'block';
}

// 모달 닫기
function closeModalFunction() {
    modal.style.display = 'none';
    bookInput.value = '';
    memoInput.value = '';
    imageInput.value = '';
}

closeModal.onclick = function () {
    closeModalFunction();
}

window.onclick = function (event) {
    if (event.target == modal) {
        closeModalFunction();
    }
}

// 달력 렌더링
function renderCalendar() {
  calendarGrid.innerHTML = `
    <div class="day-header">일</div>
    <div class="day-header">월</div>
    <div class="day-header">화</div>
    <div class="day-header">수</div>
    <div class="day-header">목</div>
    <div class="day-header">금</div>
    <div class="day-header">토</div>
  `;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

  monthYearLabel.textContent = `${year}년 ${month + 1}월`;

  // 이전 달 빈 칸 채우기
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement('div');
    calendarGrid.appendChild(emptyCell);
  }

  // 현재 달 날짜 채우기
  for (let day = 1; day <= lastDateOfMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('calendar-day');
    dayElement.textContent = day;

    const dateKey = `${year}-${month + 1}-${day}`;

    // 이미지가 있으면 표시
    if (readingEntries[dateKey]) {
      const imgElement = document.createElement('img');
      imgElement.src = readingEntries[dateKey].image || '';
      imgElement.classList.add('calendar-img');
      dayElement.appendChild(imgElement);

      // 메모가 있으면 메모 아이콘 표시
      if (readingEntries[dateKey].memo) {
        const memoIcon = document.createElement('i');
        memoIcon.classList.add('fas', 'fa-sticky-note');
        memoIcon.classList.add('memo-icon');
        dayElement.appendChild(memoIcon);

        // 툴팁으로 메모 미리보기
        dayElement.title = readingEntries[dateKey].memo;
      }
    }

    // 날짜 클릭하면 모달 창 열기
    dayElement.addEventListener('click', () => {
      openModal(dateKey);
    });

    calendarGrid.appendChild(dayElement);
  }
}

// 독서 기록 저장
saveEntryBtn.addEventListener('click', () => {
  const book = bookInput.value;
  const memo = memoInput.value;
  const imageFile = imageInput.files[0];

  if (selectedDate && book && memo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;

      // 선택한 날짜에 기록 저장
      readingEntries[selectedDate] = {
        book: book,
        memo: memo,
        image: imageData || ''
      };
      localStorage.setItem('readingEntries', JSON.stringify(readingEntries));

      closeModalFunction();
      renderCalendar();
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    } else {
      // 이미지 파일이 없으면 이미지 없이 저장
      readingEntries[selectedDate] = {
        book: book,
        memo: memo,
        image: readingEntries[selectedDate]?.image || ''
      };
      localStorage.setItem('readingEntries', JSON.stringify(readingEntries));
      closeModalFunction();
      renderCalendar();
    }
  } else {
    alert('책 제목과 메모를 모두 입력해주세요.');
  }
});

// 삭제 기능
deleteEntryBtn.addEventListener('click', () => {
  if (selectedDate && readingEntries[selectedDate]) {
    delete readingEntries[selectedDate]; 
    localStorage.setItem('readingEntries', JSON.stringify(readingEntries)); 
    closeModalFunction(); 
    renderCalendar(); 
  } else {
    alert('삭제할 데이터가 없습니다.');
  }
});

// 달력 이전/다음 달로 이동
prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// 초기화
renderCalendar();
