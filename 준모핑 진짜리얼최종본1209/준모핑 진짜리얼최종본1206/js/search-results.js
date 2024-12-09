// 페이지네이션 관련 변수
const ITEMS_PER_PAGE = 20;
let currentPage = 1;
let totalProducts = 0;

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 전체 상품 카드 요소들을 가져옴
    const productCards = document.querySelectorAll('.product-card');
    totalProducts = productCards.length;
    
    // 페이지네이션 초기화
    initPagination();
    
    // 필터 관련 초기화
    initializeFilters();
});

// 페이지네이션 초기화 함수
function initPagination() {
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    const pageNumbers = document.querySelector('.page-numbers');
    pageNumbers.innerHTML = '';
    
    // 페이지 번호 버튼 생성
    for(let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = `page-number ${i === 1 ? 'active' : ''}`;
        button.textContent = i;
        button.addEventListener('click', () => goToPage(i));
        pageNumbers.appendChild(button);
    }
    
    // 이전/다음 버튼 이벤트 리스너
    document.querySelector('.prev-page').addEventListener('click', () => {
        if(currentPage > 1) goToPage(currentPage - 1);
    });
    
    document.querySelector('.next-page').addEventListener('click', () => {
        if(currentPage < totalPages) goToPage(currentPage + 1);
    });
    
    // 첫 페이지 표시
    showPage(1);
}

// 필터 초기화 함수
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const filterPanel = document.getElementById('filterPanel');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            filterPanel.classList.toggle('show');
            
            if (filterPanel.classList.contains('show')) {
                const buttonRect = button.getBoundingClientRect();
                filterPanel.style.top = `${buttonRect.bottom + window.scrollY}px`;
                filterPanel.style.left = `${buttonRect.left}px`;
            }
        });
    });
    
    // 필터 패널 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        if (!filterPanel.contains(e.target) && !e.target.closest('.filter-button')) {
            filterPanel.classList.remove('show');
        }
    });
}

// 페이지 표시 함수
function showPage(pageNum) {
    const productCards = document.querySelectorAll('.product-card');
    const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, productCards.length);
    
    productCards.forEach((card, index) => {
        card.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
    });
    
    updateNavigationButtons();
    scrollToTop();
}

// 페이지 이동 함수
function goToPage(pageNum) {
    currentPage = pageNum;
    showPage(currentPage);
    
    // 활성 페이지 버튼 표시
    document.querySelectorAll('.page-number').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.textContent) === currentPage);
    });
}

// 네비게이션 버튼 상태 업데이트
function updateNavigationButtons() {
    const prevButton = document.querySelector('.prev-page');
    const nextButton = document.querySelector('.next-page');
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    
    if (prevButton && nextButton) {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }
}

// 페이지 상단으로 스크롤
function scrollToTop() {
    window.scrollTo({
        top: document.querySelector('.search-results').offsetTop - 100,
        behavior: 'smooth'
    });
}