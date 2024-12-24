document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

const pageId = 'bookMemories-toRead'; 
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
        date: date,
        imageSrc: imageItem.querySelector('img').src
    };

    const imageId = imageItem.dataset.savedContentId || `${pageId}-${Date.now()}`;
    localStorage.setItem(imageId, JSON.stringify(savedContent));

    imageItem.dataset.savedContentId = imageId;

    console.log(`저장된 데이터: ${localStorage.getItem(imageId)}`);

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
            document.getElementById('author').value = savedContent.author;
            document.getElementById('publisher').value = savedContent.publisher;
            document.getElementById('addDate').value = savedContent.date;
        }
    }
}

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
        const savedContent = JSON.parse(localStorage.getItem(imageId));
        
        if (!savedContent || !imageId.startsWith(pageId)) continue;  
        if (loadedImages.has(imageId)) continue; 

        loadedImages.add(imageId);

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
                author: '',  
                publisher: '',  
                date: '',  
                
            };
            localStorage.setItem(imageId, JSON.stringify(savedContent)); 
            loadedImages.add(imageId);
        };
        reader.readAsDataURL(file); 
    }
});