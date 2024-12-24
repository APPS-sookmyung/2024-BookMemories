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

  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement('div');
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= lastDateOfMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('calendar-day');
    dayElement.textContent = day;

    const dateKey = `${year}-${month + 1}-${day}`;

    if (readingEntries[dateKey]) {
      const imgElement = document.createElement('img');
      imgElement.src = readingEntries[dateKey].image || '';
      imgElement.classList.add('calendar-img');
      dayElement.appendChild(imgElement);

      if (readingEntries[dateKey].memo) {
        const memoIcon = document.createElement('i');
        memoIcon.classList.add('fas', 'fa-sticky-note');
        memoIcon.classList.add('memo-icon');
        dayElement.appendChild(memoIcon);

        dayElement.title = readingEntries[dateKey].memo;
      }
    }

    dayElement.addEventListener('click', () => {
      openModal(dateKey);
    });

    calendarGrid.appendChild(dayElement);
  }
}

saveEntryBtn.addEventListener('click', () => {
  const book = bookInput.value || '';
  const memo = memoInput.value || '';
  const imageFile = imageInput.files[0];

  if (selectedDate) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;

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
      readingEntries[selectedDate] = {
        book: book,
        memo: memo,
        image: readingEntries[selectedDate]?.image || ''
      };
      localStorage.setItem('readingEntries', JSON.stringify(readingEntries));
      closeModalFunction();
      renderCalendar();
    }
  } 
 });

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

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
