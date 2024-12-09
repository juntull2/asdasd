document.addEventListener('DOMContentLoaded', function() {
    // 탭 메뉴 요소들
    const tabLinks = document.querySelectorAll('.mypage-nav a');
    const contentSections = document.querySelectorAll('.content-section');

    // 초기 상태 설정 - 첫 번째 탭 활성화
    const initialHash = window.location.hash || '#orders';
    showSection(initialHash);

    // 탭 클릭 이벤트 처리
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            showSection(targetId);
            
            // URL 해시 업데이트
            window.location.hash = targetId;
        });
    });

    // 섹션 표시 함수
    function showSection(sectionId) {
        // 모든 섹션 숨기기
        contentSections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // 모든 탭 비활성화
        tabLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        // 선택된 섹션 보이기
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        // 선택된 탭 활성화
        const activeTab = document.querySelector(`.mypage-nav a[href="${sectionId}"]`);
        if (activeTab) {
            activeTab.parentElement.classList.add('active');
        }
    }

    // 장바구니 총 금액 계산 함수
    function updateTotalPrice() {
        const cartItems = document.querySelectorAll('.cart-item');
        let total = 0;

        cartItems.forEach(item => {
            const checkbox = item.querySelector('.cart-checkbox');
            // 체크된 항목만 계산에 포함
            if (checkbox && checkbox.checked) {
                const priceElement = item.querySelector('.price');
                const basePrice = parseInt(priceElement.getAttribute('data-price'));
                const quantity = parseInt(item.querySelector('.quantity-input').value);
                total += basePrice * quantity;
            }
        });

        document.querySelector('.total-amount').textContent = total.toLocaleString() + '원';
    }

    // 수량 조절 관련 기능
    const quantityControls = document.querySelectorAll('.quantity-control');
    quantityControls.forEach(control => {
        const decreaseBtn = control.querySelector('.btn-decrease');
        const increaseBtn = control.querySelector('.btn-increase');
        const quantityInput = control.querySelector('.quantity-input');
        const priceElement = control.closest('.item-content').querySelector('.price');
        const basePrice = parseInt(priceElement.getAttribute('data-price'));

        function updateItemPrice() {
            const quantity = parseInt(quantityInput.value);
            const totalPrice = basePrice * quantity;
            priceElement.textContent = `${totalPrice.toLocaleString()}원`;
            updateTotalPrice(); // 총 금액 업데이트
        }

        decreaseBtn.addEventListener('click', () => {
            if (quantityInput.value > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
                updateItemPrice();
            }
        });

        increaseBtn.addEventListener('click', () => {
            if (quantityInput.value < 99) {
                quantityInput.value = parseInt(quantityInput.value) + 1;
                updateItemPrice();
            }
        });

        quantityInput.addEventListener('change', () => {
            let value = parseInt(quantityInput.value);
            if (isNaN(value) || value < 1) value = 1;
            if (value > 99) value = 99;
            quantityInput.value = value;
            updateItemPrice();
        });
    });

    // 장바구니 삭제 기능
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('해당 상품을 장바구니에서 삭제하시겠습니까?')) {
                this.closest('.cart-item').remove();
                updateTotalPrice();
                checkEmptyCart();
            }
        });
    });

    // 초기 총 금액 계산
    updateTotalPrice();

    // 장바구니 체크박스 처리
    const selectAllCheckbox = document.getElementById('selectAll');
    const itemCheckboxes = document.querySelectorAll('.cart-item .cart-checkbox');

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            itemCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateTotalPrice(); // 체크박스 변경 시 총액 업데이트
        });

        itemCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const allChecked = Array.from(itemCheckboxes)
                    .every(item => item.checked);
                selectAllCheckbox.checked = allChecked;
                updateTotalPrice(); // 개별 체크박스 변경 시 총액 업데이트
            });
        });
    }

    // 찜 목록 관련 기능
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.item-content');
            const productName = item.querySelector('h4').textContent;
            
            // 장바구니에 추가 알림
            alert(`${productName}이(가) 장바구니에 추가되었습니다.`);
        });
    });

    document.querySelectorAll('.btn-remove-wish').forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.wishlist-item');
            const productName = item.querySelector('h4').textContent;
            
            if (confirm(`${productName}을(를) 찜 목록에서 삭제하시겠습니까?`)) {
                item.remove();
                
                // 찜 목록이 비어있는 경우 메시지 표시
                const wishlist = document.querySelector('.wishlist-list');
                if (!wishlist.children.length) {
                    wishlist.innerHTML = '<p class="empty-list">찜한 상품이 없습니다.</p>';
                }
            }
        });
    });

    // 장바구니 비어있음 체크 함수
    function checkEmptyCart() {
        const cartItems = document.querySelectorAll('.cart-item');
        const emptyCartMessage = document.querySelector('.empty-cart');
        const cartHeader = document.querySelector('.cart-header');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (cartItems.length === 0) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'flex';
            }
            if (cartHeader) {
                cartHeader.style.display = 'none';
            }
            if (cartSummary) {
                cartSummary.style.display = 'none';
            }
        } else {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'none';
            }
            if (cartHeader) {
                cartHeader.style.display = 'flex';
            }
            if (cartSummary) {
                cartSummary.style.display = 'block';
            }
        }
    }

    // 초기 장바구니 상태 체크
    checkEmptyCart();

    // 선택 삭제 버튼 처리 수정
    const deleteSelectedBtn = document.querySelector('.btn-delete-selected');
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', function() {
            const selectedItems = document.querySelectorAll('.cart-item .cart-checkbox:checked');
            
            if (selectedItems.length === 0) {
                alert('삭제할 상품을 선택해주세요.');
                return;
            }

            if (confirm('선택한 상품을 삭제하시겠습니까?')) {
                selectedItems.forEach(checkbox => {
                    const cartItem = checkbox.closest('.cart-item');
                    cartItem.remove();
                });
                
                updateTotalPrice();
                checkEmptyCart();
            }
        });
    }

    // FAQ 아코디언 기능
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 다른 모든 FAQ 항목 닫기
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 클릭한 항목 토글
            item.classList.toggle('active');
        });
    });

    // 프로필 수정 폼 유효성 검사
    document.querySelector('.profile-form').addEventListener('submit', function(e) {
        e.preventDefault();

        // 비밀번호 검사
        const password = document.querySelector('input[type="password"]').value;
        const confirmPassword = document.querySelectorAll('input[type="password"]')[1].value;
        
        if (password && !validatePassword(password)) {
            alert('비밀번호는 영문, 숫자, 특수문자(!@#$%^&*)를 포함한 8-16자여야 합니다.');
            document.querySelector('input[type="password"]').focus();
            return;
        }

        if (password && password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            document.querySelectorAll('input[type="password"]')[1].focus();
            return;
        }

        // 이름 검사
        const name = document.querySelector('input[placeholder="홍길동"]').value;
        if (!/^[가-힣]+$/.test(name)) {
            alert('이름은 한글만 입력 가능합니다.');
            document.querySelector('input[placeholder="홍길동"]').focus();
            return;
        }

        // 이메일 검사
        const email = document.querySelector('input[type="email"]').value;
        if (!validateEmail(email)) {
            alert('올바른 이메일 형식이 아닙니다.');
            document.querySelector('input[type="email"]').focus();
            return;
        }

        // 휴대폰 번호 검사
        const phone = document.querySelector('input[type="tel"]').value;
        if (!validatePhone(phone)) {
            alert('올바른 휴대폰 번호 형식이 아닙니다.');
            document.querySelector('input[type="tel"]').focus();
            return;
        }

        // 모든 검사 통과
        alert('회원정보가 수정되었습니다!');
        // this.submit(); // 실제 서버로 데이터를 전송할 때 주석 해제
    });

    // 유효성 검사 함수들
    function validatePassword(password) {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);
        const isValidLength = password.length >= 8 && password.length <= 16;
        return hasLetter && hasNumber && hasSpecial && isValidLength;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    // 휴대폰 번호 자동 하이픈 추가
    document.querySelector('input[type="tel"]').addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        if (value.length > 3) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }
        if (value.length > 8) {
            value = value.slice(0, 8) + '-' + value.slice(8);
        }
        if (value.length > 13) {
            value = value.slice(0, 13);
        }
        
        e.target.value = value;
    });
});
