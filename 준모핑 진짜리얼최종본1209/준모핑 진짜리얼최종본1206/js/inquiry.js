// 문의 데이터 (실제로는 서버에서 가져올 데이터)
const mockInquiries = [
    {
        id: 1,
        category: '상품 문의',
        title: '상품 사이즈 문의드립니다',
        content: '3살 아이가 가지고 놀기에 적당한 크기인가요?',
        date: '2024-01-15',
        status: 'completed',
        answer: '안녕하세요. 해당 상품은 3세 이상 아동이 사용하기에 적합한 크기로 제작되었습니다.',
        answerDate: '2024-01-16',
        isPrivate: false
    },
    {
        id: 2,
        category: '배송 문의',
        title: '배송 지연 문의',
        content: '언제쯤 받을 수 있을까요?',
        date: '2024-01-16',
        status: 'waiting',
        isPrivate: true
    },
    // 더미 데이터 추가
];

// 현재 페이지 상태
let currentTab = 'list';
let currentPage = 1;
let itemsPerPage = 10;
let currentCategory = 'all';
let currentStatus = 'all';

// DOM 요소 가져오기
document.addEventListener('DOMContentLoaded', () => {
    // 탭 전환
    const tabs = document.querySelectorAll('.inquiry-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            switchTab(targetTab);
        });
    });

    // 필터 이벤트
    const categoryFilter = document.getElementById('inquiry-category');
    const statusFilter = document.getElementById('inquiry-status');

    categoryFilter.addEventListener('change', () => {
        currentCategory = categoryFilter.value;
        renderInquiries();
    });

    statusFilter.addEventListener('change', () => {
        currentStatus = statusFilter.value;
        renderInquiries();
    });

    // 문의 작성 폼 제출
    const inquiryForm = document.getElementById('inquiry-form');
    inquiryForm.addEventListener('submit', handleInquirySubmit);

    // 이미지 업로드 버튼
    const uploadButton = document.querySelector('.upload-button');
    const fileInput = document.getElementById('inquiry-image');
    
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', handleImageUpload);

    // 초기 렌더링
    renderInquiries();
});

// 탭 전환 함수
function switchTab(tab) {
    currentTab = tab;
    
    // 탭 버튼 활성화 상태 변경
    document.querySelectorAll('.inquiry-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });

    // 탭 컨텐츠 표시/숨김
    document.querySelector('.inquiry-list').classList.toggle('active', tab === 'list');
    document.querySelector('.inquiry-write').classList.toggle('active', tab === 'write');
}

// 문의 목록 렌더링
function renderInquiries() {
    const inquiryItems = document.querySelector('.inquiry-items');
    const filteredInquiries = mockInquiries.filter(inquiry => {
        const categoryMatch = currentCategory === 'all' || inquiry.category === currentCategory;
        const statusMatch = currentStatus === 'all' || inquiry.status === currentStatus;
        return categoryMatch && statusMatch;
    });

    // 페이지네이션 계산
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageInquiries = filteredInquiries.slice(startIndex, endIndex);

    // 문의 아이템 HTML 생성
    inquiryItems.innerHTML = pageInquiries.map(inquiry => `
        <div class="inquiry-item" onclick="showInquiryDetail(${inquiry.id})">
            <div class="inquiry-item-header">
                <span class="inquiry-category">${inquiry.category}</span>
                <span class="inquiry-date">${inquiry.date}</span>
            </div>
            <div class="inquiry-title">
                ${inquiry.isPrivate ? '🔒 ' : ''}${inquiry.title}
            </div>
            <span class="inquiry-status ${inquiry.status === 'waiting' ? 'status-waiting' : 'status-completed'}">
                ${inquiry.status === 'waiting' ? '답변 대기' : '답변 완료'}
            </span>
        </div>
    `).join('');

    // 페이지네이션 업데이트
    updatePagination(filteredInquiries.length);
}

// 페이지네이션 업데이트
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    const pageNumbers = document.querySelector('.page-numbers');

    // 페이지 번호 버튼 생성
    pageNumbers.innerHTML = Array.from({length: totalPages}, (_, i) => i + 1)
        .map(page => `
            <button class="${page === currentPage ? 'active' : ''}" 
                    onclick="changePage(${page})">${page}</button>
        `).join('');

    // 이전/다음 버튼 상태 업데이트
    const prevButton = pagination.querySelector('.prev-page');
    const nextButton = pagination.querySelector('.next-page');
    
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// 페이지 변경
function changePage(page) {
    currentPage = page;
    renderInquiries();
}

// 문의 상세 보기
function showInquiryDetail(id) {
    const inquiry = mockInquiries.find(item => item.id === id);
    const modal = document.querySelector('.inquiry-modal');
    const modalContent = modal.querySelector('.inquiry-detail');

    modalContent.innerHTML = `
        <h2>${inquiry.title}</h2>
        <div class="inquiry-info">
            <span class="inquiry-category">${inquiry.category}</span>
            <span class="inquiry-date">${inquiry.date}</span>
        </div>
        <div class="inquiry-content">
            <p>${inquiry.content}</p>
        </div>
        ${inquiry.status === 'completed' ? `
            <div class="inquiry-answer">
                <h3>답변</h3>
                <div class="answer-info">
                    <span class="answer-date">${inquiry.answerDate}</span>
                </div>
                <p>${inquiry.answer}</p>
            </div>
        ` : ''}
    `;

    modal.style.display = 'flex';

    // 모달 닫기 버튼
    const closeButton = modal.querySelector('.close-modal');
    closeButton.onclick = () => {
        modal.style.display = 'none';
    };

    // 모달 외부 클릭 시 닫기
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// 문의 작성 폼 제출 처리
function handleInquirySubmit(e) {
    e.preventDefault();

    // 폼 데이터 수집
    const type = document.getElementById('inquiry-type').value;
    const title = document.getElementById('inquiry-title').value;
    const content = document.getElementById('inquiry-content').value;
    const isPrivate = document.getElementById('private-inquiry').checked;

    // 실제로는 서버로 데이터를 전송
    console.log('문의 제출:', { type, title, content, isPrivate });

    // 폼 초기화
    e.target.reset();
    
    // 목록 탭으로 전환
    switchTab('list');

    // 성공 메시지 표시
    alert('문의가 성공적으로 등록되었습니다.');
}

// 이미지 업로드 처리
function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    const preview = document.querySelector('.image-preview');
    
    // 최대 3개까지만 허용
    if (files.length > 3) {
        alert('이미지는 최대 3개까지만 업로드 가능합니다.');
        return;
    }

    // 파일 크기 체크 (5MB)
    const maxSize = 5 * 1024 * 1024;
    const invalidFiles = files.filter(file => file.size > maxSize);
    if (invalidFiles.length > 0) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
    }

    // 미리보기 생성
    preview.innerHTML = files.map(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        return `
            <div class="preview-item">
                <img src="${URL.createObjectURL(file)}" alt="Preview">
                <button class="remove-image" onclick="removeImage(this)">×</button>
            </div>
        `;
    }).join('');
}

// 이미지 제거
function removeImage(button) {
    const previewItem = button.parentElement;
    previewItem.remove();
    
    // 파일 입력 초기화
    const fileInput = document.getElementById('inquiry-image');
    fileInput.value = '';
}
