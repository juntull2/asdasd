document.addEventListener('DOMContentLoaded', function() {
    // 전체 상품 카드 요소들을 가져옴
    const productCards = document.querySelectorAll('.product-card');
    totalItems = productCards.length;

    // 필터 관련 요소들
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterPanel = document.getElementById('filterPanel');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    
    // 필터 패널 토글
    if (filterToggleBtn && filterPanel) {
        filterToggleBtn.addEventListener('click', function(e) {
            e.preventDefault(); // 기본 동작 방지
            e.stopPropagation(); // 이벤트 버블링 방지
            filterPanel.classList.toggle('show');
            console.log('Filter button clicked'); // 디버깅용
        });
    }

    // 닫기 버튼
    if (closeFilterBtn) {
        closeFilterBtn.addEventListener('click', function() {
            filterPanel.classList.remove('show');
        });
    }

    // 외부 클릭 시 패널 닫기
    document.addEventListener('click', function(e) {
        if (filterPanel && !filterPanel.contains(e.target) && !filterToggleBtn.contains(e.target)) {
            filterPanel.classList.remove('show');
        }
    });

    // 필터 패널 내부 클릭 시 이벤트 전파 중단
    if (filterPanel) {
        filterPanel.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 페이지네이션 버튼 이벤트 리스너
    document.querySelectorAll('.page-button').forEach(button => {
        button.addEventListener('click', function() {
            currentPage = parseInt(this.textContent);
            updatePage();
        });
    });

    // 초기 페이지 설정
    updatePage();

    // 가격 필터 적용 버튼 이벤트
    const applyPriceBtn = document.getElementById('applyPrice');
    applyPriceBtn.addEventListener('click', () => {
        const minPrice = parseInt(minPriceInput.value.replace(/[^0-9]/g, '')) || 0;
        const maxPrice = parseInt(maxPriceInput.value.replace(/[^0-9]/g, '')) || Infinity;

        // 최소 가격이 3,000원 미만인 경우
        if (minPrice < MIN_PRICE) {
            alert('최소 금액은 3,000원 이상이어야 합니다. 다시 입력해주세요.');
            minPriceInput.focus();
            return;
        }

        // 최대 가격이 150,000원을 초과하는 경우
        if (maxPrice > MAX_PRICE) {
            alert('최대 금액은 150,000원 이하여야 합니다. 다시 입력해주세요.');
            maxPriceInput.focus();
            return;
        }

        // 최소 가격이 최대 가격보다 큰 경우
        if (maxPrice < minPrice) {
            alert('최대 금액은 최소 금액보다 커야 합니다.');
            maxPriceInput.focus();
            return;
        }

        // 여기에 필터 적용 로직 구현
        updateFilteredCount();
    });

    formatNumber(minPriceInput);
    formatNumber(maxPriceInput);

    // 필터 옵션 버튼 클릭 이벤트 처리
    const tagButtons = document.querySelectorAll('.tag-btn');
    tagButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // 가격 입력 필드 숫자 포맷팅
    const priceInputs = document.querySelectorAll('.price-inputs input');
    priceInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });

    // 초기화 버튼
    const resetBtn = document.getElementById('resetAllFilters');
    resetBtn.addEventListener('click', function() {
        tagButtons.forEach(btn => btn.classList.remove('active'));
        priceInputs.forEach(input => input.value = '');
    });
});
