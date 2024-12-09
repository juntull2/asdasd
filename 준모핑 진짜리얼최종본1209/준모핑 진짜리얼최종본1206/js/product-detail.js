document.addEventListener('DOMContentLoaded', function() {
    // 요소 존재 여부 확인 후 이벤트 리스너 추가
    const mainImage = document.querySelector('.main-image');
    const lens = document.querySelector('.magnifier-lens');
    const magnifiedView = document.querySelector('.magnified-view');
    const magnifiedImg = document.querySelector('#magnifiedImage');
    const mainImageImg = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const quantityInput = document.querySelector('.quantity-control input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const totalPriceElement = document.querySelector('.total-price .total');
    const finalPriceElement = document.querySelector('.final-price');

    // 돋보기 효과 관련 코드
    if (mainImage && lens && magnifiedView && magnifiedImg) {
        const magnificationRatio = 2.5;

        function updateMagnification(e) {
            const mainRect = mainImage.getBoundingClientRect();
            const x = e.clientX - mainRect.left;
            const y = e.clientY - mainRect.top;

            // 마우스 위치를 퍼센트로 계산
            const mouseX = Math.min(Math.max(0, x / mainRect.width), 1);
            const mouseY = Math.min(Math.max(0, y / mainRect.height), 1);

            // 확대된 뷰의 위치를 마우스 커서 위치로 업데이트
            const viewHalfWidth = magnifiedView.offsetWidth / 2;
            const viewHalfHeight = magnifiedView.offsetHeight / 2;
            
            magnifiedView.style.left = `${x - viewHalfWidth}px`;
            magnifiedView.style.top = `${y - viewHalfHeight}px`;

            // 확대된 이미지 위치 업데이트
            const magnifiedWidth = mainRect.width * magnificationRatio;
            const magnifiedHeight = mainRect.height * magnificationRatio;

            magnifiedImg.style.width = `${magnifiedWidth}px`;
            magnifiedImg.style.height = `${magnifiedHeight}px`;
            
            // 마우스 위치에 따라 확대된 이미지 위치 조정
            magnifiedImg.style.left = `-${(magnifiedWidth - magnifiedView.offsetWidth) * mouseX}px`;
            magnifiedImg.style.top = `-${(magnifiedHeight - magnifiedView.offsetHeight) * mouseY}px`;
        }

        mainImage.addEventListener('mouseenter', function() {
            magnifiedView.style.display = 'block';
        });

        mainImage.addEventListener('mouseleave', function() {
            magnifiedView.style.display = 'none';
        });

        mainImage.addEventListener('mousemove', updateMagnification);
    }

    // 썸네일 이미지 변경 관련 코드
    if (thumbnails.length > 0 && mainImageImg) {
        window.changeImage = function(thumbnail) {
            const mainImg = document.getElementById('mainImage');
            const magnifiedImg = document.getElementById('magnifiedImage');
            const newSrc = thumbnail.src;
            
            mainImg.src = newSrc;
            magnifiedImg.src = newSrc;

            // 썸네일 활성화 상태 업데이트
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            thumbnail.classList.add('active');
        };

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                mainImageImg.src = this.src;
            });
        });
    }

    // 수량 조절 관련 코드
    if (quantityInput && minusBtn && plusBtn && totalPriceElement && finalPriceElement) {
        const finalPrice = parseInt(finalPriceElement.textContent.replace(/[^0-9]/g, ''));

        function updateTotalPrice() {
            const quantity = parseInt(quantityInput.value);
            const total = finalPrice * quantity;
            totalPriceElement.textContent = total.toLocaleString() + '원';
        }

        minusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateTotalPrice();
            }
        });

        plusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 99) {
                quantityInput.value = currentValue + 1;
                updateTotalPrice();
            }
        });

        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) value = 1;
            if (value > 99) value = 99;
            this.value = value;
            updateTotalPrice();
        });
    }

    // 탭 전환 기능 구현
    function initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-buttons .tab-button');
        const tabContents = document.querySelectorAll('.tab-contents .tab-content');

        if (tabButtons.length === 0 || tabContents.length === 0) {
            console.log('Tabs not found in the document');
            return;
        }

        function showTab(tabId) {
            // 모든 탭 컨텐츠 숨기기
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });

            // 모든 탭 버튼 비활성화
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            // 선택된 탭 컨텐츠 표시
            const selectedContent = document.getElementById(tabId);
            if (selectedContent) {
                selectedContent.style.display = 'block';
                selectedContent.classList.add('active');
            }

            // 선택된 탭 버튼 활성화
            const selectedButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
            if (selectedButton) {
                selectedButton.classList.add('active');
            }
        }

        // 각 탭 버튼에 클릭 이벤트 추가
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                showTab(tabId);
            });
        });

        // 초기 탭 설정 (첫 번째 탭 활성화)
        const firstTabId = tabButtons[0].getAttribute('data-tab');
        showTab(firstTabId);
    }

    // 탭 초기화 함수 실행
    initializeTabs();
});