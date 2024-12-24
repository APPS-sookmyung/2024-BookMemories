const pageId = 'bookMemories-read'
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
        emoji: selectedEmoji,
        imageSrc: imageItem.querySelector('img').src
    };

    const imageId = imageItem.dataset.savedContentId || `${pageId}-${Date.now()}`;
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

function deleteContent(imageItem) {
    const imageId = imageItem.dataset.savedContentId;
    if (imageId) {
        localStorage.removeItem(imageId);
        imageItem.remove();
        document.getElementById('formContainer').style.display = 'none';
        alert('데이터가 삭제되었습니다.');
    }
}

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

menuButton.addEventListener('click', function(event) {
    dropdownMenu.classList.toggle('active');
});

document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', function(event) {
        dropdownMenu.classList.remove('active');
    });
});

document.addEventListener('click', function(event) {
    if (!dropdownMenu.contains(event.target) && !menuButton.contains(event.target)) {
        dropdownMenu.classList.remove('active');
    }
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('formContainer').style.display = 'none';
    resetForm();
});

window.onclick = function(event) {
    const formContainer = document.getElementById('formContainer');
    if (event.target == formContainer) {
        formContainer.style.display = 'none';
        resetForm();
    }
};

const loadedImages = new Set();

window.addEventListener('load', function() {
    for (let i = 0; i < localStorage.length; i++) {
        const imageId = localStorage.key(i);

        if (!imageId.startsWith(pageId)) continue;

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

            imageItem.addEventListener('click', function() {
                document.getElementById('formContainer').style.display = 'block';
                loadFormData(imageItem); 
                document.getElementById('saveButton').onclick = () => saveContent(imageItem);
                document.getElementById('deleteButton').onclick = () => deleteContent(imageItem);
            });

            imageItem.addEventListener('dblclick', function() {
                showSavedContent(this); 
            });

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

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageId = `${pageId}-${Date.now()}`; 
            if (loadedImages.has(imageId)) return;

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
                showSavedContent(this); 
            });

            let shelves = document.getElementsByClassName('shelf');
            for (let shelf of shelves) {
                if (shelf.children.length < 5) {
                    shelf.appendChild(imageItem);
                    break;
                }
            }

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
            loadedImages.add(imageId); 
        };
        reader.readAsDataURL(file); 
    }
});

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

function saveContent(imageItem) {
    const bookTitle = document.getElementById('bookTitle').value;
    const pageCount = document.getElementById('pageCount').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const quote = document.getElementById('quote').value;
    const selectedEmoji = document.querySelector('.emoji.selected') ? document.querySelector('.emoji.selected').textContent : '';

    const imageId = imageItem.dataset.savedContentId; 
    const savedContent = JSON.parse(localStorage.getItem(imageId)); 
    savedContent.bookTitle = bookTitle;
    savedContent.pageCount = pageCount;
    savedContent.startDate = startDate;
    savedContent.endDate = endDate;
    savedContent.quote = quote;
    savedContent.emoji = selectedEmoji;

    localStorage.setItem(imageId, JSON.stringify(savedContent)); 

    resetForm();
    document.getElementById('formContainer').style.display = 'none';
}

function resetForm() {
    document.getElementById('bookTitle').value = '';
    document.getElementById('pageCount').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('quote').value = '';
    document.querySelectorAll('.emoji').forEach(e => e.classList.remove('selected'));
}
