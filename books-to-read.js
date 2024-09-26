//파일 업로드 버튼 클릭
document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

//파일 선택 시 이미지 업로드
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;

            const imageItem = document.createElement('div');
            imageItem.classList.add('imageItem');
            imageItem.appendChild(imgElement);

            let clickTimeout;
            
            imageItem.addEventListener('click', function() {
                clearTimeout(clickTimeout);
                clickTimeout = setTimeout(() => {
                    document.getElementById('formContainer').style.display = 'block';
                    loadFormData(imageItem);
                    document.getElementById('saveButton').onclick = () => saveContent(imageItem);
                    document.getElementById('deleteButton').onclick = () => deleteContent(imageItem);
                }, 200);
                });//이미지 1번 클릭 시 formcontainer 나타남

            imageItem.addEventListener('dblclick', function() {
                clearTimeout(clickTimeout);
                showSavedContent(this);
            });
            
            //이미지 배치 최대 5개까지로 일단 함
            let shelves = document.getElementsByClassName('shelf');
            for (let shelf of shelves) {
                if (shelf.children.length < 5) {
                    shelf.appendChild(imageItem);
                    break;
                }
            }
        };
        reader.readAsDataURL(file);
    }
});


//데이터 저장, imageId 생성해 로컬 저장, 폼 입력 필드 초기화
function saveContent(imageItem) {
    const bookTitle = document.getElementById('bookTitle').value;
    const pageCount = document.getElementById('pageCount').value;
    const author = document.getElementById('author').value;
    const publisher = document.getElementById('publisher').value;
    const date = document.getElementById('addDate').value;

    const savedContent = {
        bookTitle: bookTitle,
        pageCount: pageCount,
        author: author,
        publisher: publisher,
        date: date
    };

    const imageId = `image-${Date.now()}`;
    localStorage.setItem(imageId, JSON.stringify(savedContent));

    imageItem.dataset.savedContentId = imageId;

    resetForm();
    document.getElementById('formContainer').style.display = 'none';
}
function resetForm(){
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('bookTitle').value = '';
    document.getElementById('pageCount').value = '';
    document.getElementById('author').value = '';
    document.getElementById('publisher').value = '';
    document.getElementById('addDate').value = '';
}

//저장된 데이터 및 이미지 삭제
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
            document.getElementById('author').value = savedContent.author;
            document.getElementById('publisher').value = savedContent.publisher;
            document.getElementById('addDate').value = savedContent.date;
        }
    }
}

//저장된 내용 표시
function displaySavedContent(content) {
    const savedContentContainer = document.getElementById('savedContentContainer');
    savedContentContainer.innerHTML = `
        <div class="saved-content">
        <div>책 제목: <span>${content.bookTitle}</span></div>
        <div>페이지 수: <span>${content.pageCount}</span></div>
        <div>저자: <span>${content.author}</span></div>
        <div>출판사: <span>${content.publisher}</span></div>
        <div>추가된 날짜: <span>${content.date}</span></div>
    </div>
    `;
    savedContentContainer.style.display = 'block';
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
    dropdownMenu.classList.toggle('active'); // 'active' 클래스를 토글하여 메뉴 열기/닫기
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

// 닫기 버튼
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

// ////////////////////////
// const loadedImages = new Set(); 

// // 페이지 로드 시 로컬 스토리지에서 이미지와 저장된 데이터를 불러오기
// window.addEventListener('load', function() {
//     for (let i = 0; i < localStorage.length; i++) {
//         const imageId = localStorage.key(i);

//         // 중복 방지를 위해 로드된 이미지를 체크
//         if (loadedImages.has(imageId)) continue;
//         loadedImages.add(imageId);

//         if (key.startsWith('toRead-')) {
//             const savedContent = JSON.parse(localStorage.getItem(key));

//             if (savedContent) {
//                 displayBook(savedContent, key, 'toReadShelf');
//             }
//         }

//         const savedContent = JSON.parse(localStorage.getItem(imageId));

//         if (savedContent && savedContent.imageSrc) {
//             const imgElement = document.createElement('img');
//             imgElement.src = savedContent.imageSrc;

//             const imageItem = document.createElement('div');
//             imageItem.classList.add('imageItem');
//             imageItem.appendChild(imgElement);
//             imageItem.dataset.savedContentId = imageId;

//             // 클릭 및 더블 클릭 이벤트
//             imageItem.addEventListener('click', function() {
//                 document.getElementById('formContainer').style.display = 'block';
//                 loadFormData(imageItem);  // 클릭하면 폼에 데이터 로드
//                 document.getElementById('saveButton').onclick = () => saveContent(imageItem); 
//                 document.getElementById('deleteButton').onclick = () => deleteContent(imageItem);
//             });

//             imageItem.addEventListener('dblclick', function() {
//                 showSavedContent(this);  // 더블 클릭 시 저장된 내용 표시
//             });

//             // 이미지 배치
//             let shelves = document.getElementsByClassName('shelf');
//             for (let shelf of shelves) {
//                 if (shelf.children.length < 5) {
//                     shelf.appendChild(imageItem);
//                     break;
//                 }
//             }
//         }
//     }
// });

// // 파일 선택 시 이미지 업로드 및 저장
// document.getElementById('fileInput').addEventListener('change', function(event) {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             const imageId = `toRead-${Date.now()}`; // 새 이미지 아이디 생성
//             if (loadedImages.has(imageId)) return; // 중복 방지

//             const imgElement = document.createElement('img');
//             imgElement.src = e.target.result;

//             const imageItem = document.createElement('div');
//             imageItem.classList.add('imageItem');
//             imageItem.appendChild(imgElement);
//             imageItem.dataset.savedContentId = imageId;

//             imageItem.addEventListener('click', function() {
//                 document.getElementById('formContainer').style.display = 'block';
//                 loadFormData(imageItem);
//                 document.getElementById('saveButton').onclick = () => saveContent(imageItem); 
//                 document.getElementById('deleteButton').onclick = () => deleteContent(imageItem); 
//             });

//             imageItem.addEventListener('dblclick', function() {
//                 showSavedContent(this); // 저장된 내용을 표시
//             });

//             // 이미지 배치
//             let shelves = document.getElementsByClassName('shelf');
//             for (let shelf of shelves) {
//                 if (shelf.children.length < 5) {
//                     shelf.appendChild(imageItem);
//                     break;
//                 }
//             }

//             // 이미지와 기본 데이터를 로컬 스토리지에 저장
//             const savedContent = {
//                 imageSrc: e.target.result, // Base64로 저장된 이미지
//                 bookTitle: '',  // 폼에서 입력할 책 제목
//                 pageCount: '',  // 폼에서 입력할 페이지 수
//                 author: '',  // 폼에서 입력할 시작 날짜
//                 publisher: '',  // 폼에서 입력할 끝 날짜
//                 date: '',  // 폼에서 입력할 인상 깊은 구절
//             };
//             localStorage.setItem(imageId, JSON.stringify(savedContent)); // 로컬 스토리지에 저장
//             loadedImages.add(imageId); // 중복 방지를 위해 저장
//         };
//         reader.readAsDataURL(file); 
//     }
// });

// // 저장된 데이터 폼에 불러오기
// function loadFormData(imageItem) {
//     const imageId = imageItem.dataset.savedContentId;
//     if (imageId) {
//         const savedContent = JSON.parse(localStorage.getItem(imageId));
//         if (savedContent) {
//             document.getElementById('bookTitle').value = savedContent.bookTitle;
//             document.getElementById('pageCount').value = savedContent.pageCount;
//             document.getElementById('author').value = savedContent.author;
//             document.getElementById('publisher').value = savedContent.publisher;
//             document.getElementById('date').value = savedContent.date;
//         }
//     }
// }

// // 폼 데이터 저장 (기존 데이터 덮어쓰기)
// function saveContent(imageItem) {
//     const bookTitle = document.getElementById('bookTitle').value;
//     const pageCount = document.getElementById('pageCount').value;
//     const author = document.getElementById('author').value;
//     const publisher = document.getElementById('publisher').value;
//     const date = document.getElementById('date').value;

//     const imageId = imageItem.dataset.savedContentId; // 기존 데이터의 ID를 사용
//     const savedContent = JSON.parse(localStorage.getItem(imageId)); // 기존 데이터 불러오기
//     savedContent.bookTitle = bookTitle;
//     savedContent.pageCount = pageCount;
//     savedContent.author = author;
//     savedContent.publisher = publisher;
//     savedContent.date = date;

//     localStorage.setItem(imageId, JSON.stringify(savedContent)); // 수정된 데이터 저장

//     resetForm();
//     document.getElementById('formContainer').style.display = 'none';
// }

// // 폼 리셋 함수
// function resetForm() {
//     document.getElementById('bookTitle').value = '';
//     document.getElementById('pageCount').value = '';
//     document.getElementById('author').value = '';
//     document.getElementById('publisher').value = '';
//     document.getElementById('date').value = '';
// }
/////////////////////////////////////////////////////////



// // 책을 화면에 표시하는 함수
// function displayBook(imageId, content) {
//     const imgElement = document.createElement('img');
//     imgElement.src = 'path_to_image'; // 이미지 소스 설정

//     const imageItem = document.createElement('div');
//     imageItem.classList.add('imageItem');
//     imageItem.appendChild(imgElement);
//     imageItem.dataset.savedContentId = imageId;

//     // 클릭 및 더블 클릭 이벤트 추가
//     imageItem.addEventListener('click', function() {
//         document.getElementById('formContainer').style.display = 'block';
//         loadFormData(imageItem, 'toRead');
//         document.getElementById('saveButton').onclick = () => saveContent(imageItem, 'toRead');
//         document.getElementById('deleteButton').onclick = () => deleteContent(imageItem);
//     });

//     imageItem.addEventListener('dblclick', function() {
//         showSavedContent(this);
//     });

//     let shelves = document.getElementsByClassName('shelf');
//     for (let shelf of shelves) {
//         if (shelf.children.length < 5) {
//             shelf.appendChild(imageItem);
//             break;
//         }
//     }
// }