//파일 업로드 버튼 클릭
document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

let selectedEmoji = '';
document.querySelectorAll('.emoji').forEach(emoji => {
    emoji.addEventListener('click', function() {
        document.querySelectorAll('.emoji').forEach(e => e.classList.remove('selected'));
        this.classList.add('selected');
        selectedEmoji = this.textContent;
    });
});

//데이터 저장, imageId 생성해 로컬 저장, 폼 입력 필드 초기화
function saveContent(imageItem) {
    const bookTitle = document.getElementById('bookTitle').value;
    const pageCount = document.getElementById('pageCount').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const quote = document.getElementById('quote').value;

    const savedContent = {
        bookTitle: bookTitle,
        pageCount: pageCount,
        startDate: startDate,
        endDate: endDate,
        quote: quote,
        emoji: selectedEmoji
    };

    const imageId = `image-${Date.now()}`;
    localStorage.setItem(imageId, JSON.stringify(savedContent));

    imageItem.dataset.savedContentId = imageId;

    resetForm();
    document.getElementById('formContainer').style.display = 'none';
}

function resetForm(){
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('quote').value = '';
    document.querySelectorAll('.emoji').forEach(e => e.classList.remove('selected'));
    selectedEmoji = '';
}

//저장된 데이터 및 이미지 삭제... 다시 해야 함 이 부분
function deleteContent(imageItem) {
    const imageId = imageItem.dataset.savedContentId;
    if (imageId) {
        localStorage.removeItem(imageId);
        imageItem.remove();
        document.getElementById('formContainer').style.display = 'none';
        alert('데이터가 삭제되었습니다.');
    }
}

//저장된 데이터 불러와 다시 폼에 표시
function loadFormData(imageItem) {
    const imageId = imageItem.dataset.savedContentId;
    if (imageId) {
        const savedContent = JSON.parse(localStorage.getItem(imageId));
        if (savedContent) {
            document.getElementById('bookTitle').value = savedContent.bookTitle;
            document.getElementById('pageCount').value = savedContent.pageCount;
            document.getElementById('startDate').value = savedContent.startDate;
            document.getElementById('endDate').value = savedContent.endDate;
            document.getElementById('quote').value = savedContent.quote;
            document.querySelectorAll('.emoji').forEach(emoji => {
                emoji.classList.toggle('selected', emoji.textContent === savedContent.emoji);
            });
            selectedEmoji = savedContent.emoji;
        }
    }
}

function resetForm() {
    document.getElementById('bookTitle').value = '';
    document.getElementById('pageCount').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('quote').value = '';
    document.querySelectorAll('.emoji').forEach(e => e.classList.remove('selected'));
    selectedEmoji = '';
}

//저장된 내용 표시
function displaySavedContent(content) {
    const savedContentContainer = document.getElementById('savedContentContainer');
    savedContentContainer.innerHTML = `
        <div class="saved-content">
            <div class="title">
                <div>책 제목: <span>${content.bookTitle}</span></div>
                <div>페이지 수: <span>${content.pageCount}</span></div>
            <div class="dates">
                <div>읽기 시작한 날짜: <span>${content.startDate}</span></div>
                <div>읽은 마지막 날짜: <span>${content.endDate}</span></div>
            </div>
            <div class="quote">
                <div class="emoji">${content.emoji}</div>
                <div class="quote-text">${content.quote}</div>
            </div>
        </div>
    `;
    savedContentContainer.style.display = 'block';

    // 중앙에 위치시키기
    savedContentContainer.style.position = 'fixed';
    savedContentContainer.style.left = '50%';
    savedContentContainer.style.top = '50%';
    savedContentContainer.style.transform = 'translate(-50%, -50%)';
    
    setTimeout(() => {
        savedContentContainer.style.display = 'none';
    }, 5000);
}

function showSavedContent(imageItem) {
    const imageId = imageItem.dataset.savedContentId;
    const savedContent = JSON.parse(localStorage.getItem(imageId));
    
    if (savedContent) {
        displaySavedContent(savedContent);
    } else {
        alert('저장된 내용이 없습니다.');
    }
}


const menuButton = document.querySelector('.menu-icon');
const dropdownMenu = document.querySelector('.dropdown-menu');

// 메뉴 버튼 클릭 시 드롭다운 메뉴 표시/숨김
menuButton.addEventListener('click', function(event) {
    dropdownMenu.classList.toggle('active');
});

// 메뉴 내 링크 클릭 시 페이지 이동 허용 (따로 처리할 필요 없이 기본 동작)
document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', function(event) {
        dropdownMenu.classList.remove('active');
    });
});

// 페이지 외부 클릭 시 메뉴 닫기
document.addEventListener('click', function(event) {
    if (!dropdownMenu.contains(event.target) && !menuButton.contains(event.target)) {
        dropdownMenu.classList.remove('active');
    }
});

// 닫기 버튼 기능
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('formContainer').style.display = 'none';
    resetForm();
});

// 폼 바깥 클릭 시 닫기
window.onclick = function(event) {
    const formContainer = document.getElementById('formContainer');
    if (event.target == formContainer) {
        formContainer.style.display = 'none';
        resetForm();
    }
};

const loadedImages = new Set(); // 이미 로드된 이미지 아이디를 저장

// 페이지 로드 시 로컬 스토리지에서 이미지와 저장된 데이터를 불러오기
window.addEventListener('load', function() {
    for (let i = 0; i < localStorage.length; i++) {
        const imageId = localStorage.key(i);

        // 중복 방지를 위해 로드된 이미지를 체크
        if (loadedImages.has(imageId)) continue;
        loadedImages.add(imageId);

        const savedContent = JSON.parse(localStorage.getItem(imageId));

        if (savedContent && savedContent.imageSrc) {
            const imgElement = document.createElement('img');
            imgElement.src = savedContent.imageSrc;

            const imageItem = document.createElement('div');
            imageItem.classList.add('imageItem');
            imageItem.appendChild(imgElement);
            imageItem.dataset.savedContentId = imageId;

            // 클릭 및 더블 클릭 이벤트 추가
            imageItem.addEventListener('click', function() {
                document.getElementById('formContainer').style.display = 'block';
                loadFormData(imageItem); 
                document.getElementById('saveButton').onclick = () => saveContent(imageItem);
                document.getElementById('deleteButton').onclick = () => deleteContent(imageItem);
            });

            imageItem.addEventListener('dblclick', function() {
                showSavedContent(this);  // 더블 클릭 시 저장된 내용 표시
            });

            // 이미지 배치
            let shelves = document.getElementsByClassName('shelf');
            for (let shelf of shelves) {
                if (shelf.children.length < 5) {
                    shelf.appendChild(imageItem);
                    break;
                }
            }
        }
    }
});

// 파일 선택 시 이미지 업로드 및 저장
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageId = `image-${Date.now()}`; // 새 이미지 아이디 생성
            if (loadedImages.has(imageId)) return; // 중복 방지

            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;

            const imageItem = document.createElement('div');
            imageItem.classList.add('imageItem');
            imageItem.appendChild(imgElement);
            imageItem.dataset.savedContentId = imageId;

            imageItem.addEventListener('click', function() {
                document.getElementById('formContainer').style.display = 'block';
                loadFormData(imageItem); 
                document.getElementById('saveButton').onclick = () => saveContent(imageItem); 
                document.getElementById('deleteButton').onclick = () => deleteContent(imageItem); 
            });

            imageItem.addEventListener('dblclick', function() {
                showSavedContent(this); // 저장된 내용을 표시
            });

            // 이미지 배치
            let shelves = document.getElementsByClassName('shelf');
            for (let shelf of shelves) {
                if (shelf.children.length < 5) {
                    shelf.appendChild(imageItem);
                    break;
                }
            }

            // 이미지와 기본 데이터를 로컬 스토리지에 저장
            const savedContent = {
                imageSrc: e.target.result, 
                bookTitle: '', 
                pageCount: '', 
                startDate: '',  
                endDate: '', 
                quote: '',  
                emoji: ''  
            };
            localStorage.setItem(imageId, JSON.stringify(savedContent)); 
            loadedImages.add(imageId); // 중복 방지를 위해 저장
        };
        reader.readAsDataURL(file); 
    }
});

// 저장된 데이터 폼에 불러오기
function loadFormData(imageItem) {
    const imageId = imageItem.dataset.savedContentId;
    if (imageId) {
        const savedContent = JSON.parse(localStorage.getItem(imageId));
        if (savedContent) {
            document.getElementById('bookTitle').value = savedContent.bookTitle;
            document.getElementById('pageCount').value = savedContent.pageCount;
            document.getElementById('startDate').value = savedContent.startDate;
            document.getElementById('endDate').value = savedContent.endDate;
            document.getElementById('quote').value = savedContent.quote;
            document.querySelectorAll('.emoji').forEach(emoji => {
                emoji.classList.toggle('selected', emoji.textContent === savedContent.emoji);
            });
        }
    }
}

// 폼 데이터 저장 (기존 데이터 덮어쓰기)
function saveContent(imageItem) {
    const bookTitle = document.getElementById('bookTitle').value;
    const pageCount = document.getElementById('pageCount').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const quote = document.getElementById('quote').value;
    const selectedEmoji = document.querySelector('.emoji.selected') ? document.querySelector('.emoji.selected').textContent : '';

    const imageId = imageItem.dataset.savedContentId; // 기존 데이터의 ID를 사용
    const savedContent = JSON.parse(localStorage.getItem(imageId)); // 기존 데이터 불러오기
    savedContent.bookTitle = bookTitle;
    savedContent.pageCount = pageCount;
    savedContent.startDate = startDate;
    savedContent.endDate = endDate;
    savedContent.quote = quote;
    savedContent.emoji = selectedEmoji;

    localStorage.setItem(imageId, JSON.stringify(savedContent)); // 수정된 데이터 저장

    resetForm();
    document.getElementById('formContainer').style.display = 'none';
}

// 폼 리셋 함수
function resetForm() {
    document.getElementById('bookTitle').value = '';
    document.getElementById('pageCount').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('quote').value = '';
    document.querySelectorAll('.emoji').forEach(e => e.classList.remove('selected'));
}
