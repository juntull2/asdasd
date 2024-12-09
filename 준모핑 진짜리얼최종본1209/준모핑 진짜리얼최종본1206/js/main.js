// 카테고리 필터 기능
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성화된 버튼 스타일 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 선택된 카테고리 가져오기
            const category = this.dataset.category;
            
            // 여기에 실제 필터링 로직 추가
            // 예: API 호출 또는 상품 표시/숨김 처리
            console.log('Selected category:', category);
        });
    });
});

// 상품 카드 호버 효과
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.bestseller-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var swiper = new Swiper(".mainSwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // 선물 고민 해결 섹션 초기화
    const sections = [
        { id: 1, prefix: '[시즌한정팝업]', title: '무비 벌스 팝콘 프리실라 인형 미듐(M)' },
        { id: 2, prefix: '[시즌한정팝업]', title: '무비 벌스 팝콘 프리실라 인형 미듐(M)' },
        { id: 3, prefix: '[시즌한정팝업]', title: '무비 벌스 팝콘 프리실라 인형 미듐(M)' },
        { id: 4, prefix: '[시즌한정팝업]', title: '무비 벌스 팝콘 프리실라 인형 미듐(M)' },
        { id: 5, prefix: '[시즌한정팝업]', title: '무비 벌스 팝콘 프리실라 인형 미듐(M)' },
        { id: 6, prefix: '[시즌한정팝업]', title: '장아지와 고양이 필름 출력' },
        { id: 7, prefix: '[시즌한정팝업즈]', title: '무비 벌스 팝콘 프리실라 인형 미듐(M)'},
        { id: 8, prefix: '[보쉬토이_공식]', title: '보쉬 공구놀이 원톡세트' },
        { id: 9, prefix: '[시즌한정팝업]', title: '알파벳 샤르트퍼즐_NEW' },
        { id: 10, prefix: '[시즌한정팝업]', title: '곰 월드 스티커세트' }
    ];

    let currentPage = 1;
    let currentIndex = 0;
    const itemsPerPage = 5;
    let autoHighlightInterval;

    function createSectionItems() {
        const sectionList = document.getElementById('sectionList');
        const mainImage = document.querySelector('.section-image');
        const imageOverlay = document.querySelector('.image-overlay');
        
        sections.forEach((section, index) => {
            const li = document.createElement('li');
            li.className = 'section-item';
            if (Math.floor(index / itemsPerPage) + 1 === currentPage) {
                li.classList.add('visible');
            }
            
            let html = `
                <div>
                    <span class="section-number">${section.id}</span>
                    <span class="section-prefix">${section.prefix}</span>
                    <span>${section.title}</span>
                </div>
            `;

            if (section.hasImage) {
                html += `
                    <div class="product-info">
                        <div class="product-image-container">
                            <img src="images/products/product${section.id}.jpg" alt="${section.title}" class="product-image">
                            <div class="product-price">${section.price}</div>
                        </div>
                        <svg class="chevron-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                `;
            }

            li.innerHTML = html;
            
            // Add click event listener
            li.addEventListener('click', () => {
                highlightItem(index);
            });
            
            sectionList.appendChild(li);
        });

        // Add pagination controls
        document.getElementById('prevPage').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePageDisplay();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            if (currentPage < 2) {
                currentPage++;
                updatePageDisplay();
            }
        });

        // Start auto-highlighting
        startAutoHighlight();
    }

    function updatePageDisplay() {
        document.querySelectorAll('.section-item').forEach((item, index) => {
            const itemPage = Math.floor(index / itemsPerPage) + 1;
            item.classList.toggle('visible', itemPage === currentPage);
        });
        document.getElementById('pageIndicator').textContent = `${currentPage}/2`;
        
        // 페이지 변경 시 해당 페이지의 첫 번째 아이템 하이라이트
        const firstItemIndexInPage = (currentPage - 1) * itemsPerPage;
        highlightItem(firstItemIndexInPage);
    }

    function highlightItem(index) {
        const mainImage = document.querySelector('.section-image');
        const imageOverlay = document.querySelector('.image-overlay');
        const section = sections[index];
        
        // Update current index
        currentIndex = index;
        
        // Update page if necessary
        const itemPage = Math.floor(index / itemsPerPage) + 1;
        if (itemPage !== currentPage) {
            currentPage = itemPage;
            updatePageDisplay();
        }

        // Update image and overlay
        if (section.hasImage) {
            mainImage.src = `images/products/product${section.id}.jpg`;
            mainImage.alt = section.title;
            
            imageOverlay.innerHTML = `
                <h3>${section.title}</h3>
                <p>${section.price}</p>
                <button class="btn btn-primary">자세히 보기</button>
            `;
        }
        
        // Update active state
        document.querySelectorAll('.section-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.section-item')[index].classList.add('active');
    }

    function startAutoHighlight() {
        if (autoHighlightInterval) {
            clearInterval(autoHighlightInterval);
        }

        autoHighlightInterval = setInterval(() => {
            currentIndex++;
            if (currentIndex >= sections.length) {
                currentIndex = 0;
                currentPage = 1;
                updatePageDisplay();
            }
            highlightItem(currentIndex);
        }, 3000);
    }

    // Initialize the section items
    createSectionItems();
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    const searchDropdown = document.querySelector('.search-dropdown');
    const searchContainer = document.querySelector('.search-container');

    // 검색창 포커스 시 드롭다운 표시
    searchInput.addEventListener('focus', function() {
        searchDropdown.classList.add('show');
    });

    // 검색창 외부 클릭 시 드롭다운 숨기기
    document.addEventListener('click', function(event) {
        if (!searchContainer.contains(event.target)) {
            searchDropdown.classList.remove('show');
        }
    });

    // 검색어 입력 시 실시간 검색 결과 표시 (예시)
    searchInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            searchDropdown.classList.add('show');
        }
    });

    // 인기 검색어 클릭 시 검색창에 입력
    const searchTerms = document.querySelectorAll('.popular-searches a');
    searchTerms.forEach(term => {
        term.addEventListener('click', function(e) {
            e.preventDefault();
            const searchText = this.textContent.replace(/[0-9]/g, '').trim();
            searchInput.value = searchText;
            searchDropdown.classList.remove('show');
        });
    });
});
