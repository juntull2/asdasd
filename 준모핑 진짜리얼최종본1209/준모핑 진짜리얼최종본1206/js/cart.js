document.addEventListener('DOMContentLoaded', function() {
    // 장바구니 아이템 데이터 (실제로는 서버나 로컬 스토리지에서 가져올 데이터)
    let cartItems = [
        {
            id: 1,
            name: '핑크 테디베어 인형',
            option: '대형 / 라이트 핑크',
            price: 50000,
            quantity: 1,
            image: '../images/product-sample.jpg',
            selected: true
        },
        {
            id: 2,
            name: '핑크 토끼 인형',
            option: '중형 / 딥 핑크',
            price: 35000,
            quantity: 2,
            image: '../images/product-sample2.jpg',
            selected: true
        }
    ];

    // 전체 선택 체크박스 처리
    const selectAllCheckbox = document.getElementById('select-all-items');
    const itemCheckboxes = document.querySelectorAll('.item-select');

    selectAllCheckbox.addEventListener('change', function() {
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
            const itemId = parseInt(checkbox.closest('.cart-item').dataset.itemId);
            updateItemSelection(itemId, this.checked);
        });
        updateOrderSummary();
    });

    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(itemCheckboxes).every(cb => cb.checked);
            selectAllCheckbox.checked = allChecked;
            
            const itemId = parseInt(this.closest('.cart-item').dataset.itemId);
            updateItemSelection(itemId, this.checked);
            updateOrderSummary();
        });
    });

    // 수량 조절 버튼 처리
    const quantityControls = document.querySelectorAll('.quantity-control');
    quantityControls.forEach(control => {
        const decreaseBtn = control.querySelector('.btn-decrease');
        const increaseBtn = control.querySelector('.btn-increase');
        const quantityInput = control.querySelector('.quantity-input');
        const itemId = parseInt(control.closest('.cart-item').dataset.itemId);

        decreaseBtn.addEventListener('click', () => {
            if (quantityInput.value > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
                updateItemQuantity(itemId, parseInt(quantityInput.value));
            }
        });

        increaseBtn.addEventListener('click', () => {
            if (quantityInput.value < 99) {
                quantityInput.value = parseInt(quantityInput.value) + 1;
                updateItemQuantity(itemId, parseInt(quantityInput.value));
            }
        });

        quantityInput.addEventListener('change', () => {
            let value = parseInt(quantityInput.value);
            if (isNaN(value) || value < 1) value = 1;
            if (value > 99) value = 99;
            quantityInput.value = value;
            updateItemQuantity(itemId, value);
        });
    });

    // 삭제 버튼 처리
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const itemId = parseInt(cartItem.dataset.itemId);
            const productName = cartItem.querySelector('.product-name').textContent;
            
            if (confirm(`'${productName}' 상품을 장바구니에서 삭제하시겠습니까?`)) {
                // DOM에서 요소 제거
                cartItem.remove();
                
                // cartItems 배열에서도 제거
                cartItems = cartItems.filter(item => item.id !== itemId);
                
                // 장바구니가 비었는지 확인
                const remainingItems = document.querySelectorAll('.cart-item');
                if (remainingItems.length === 0) {
                    const itemList = document.querySelector('.item-list');
                    itemList.innerHTML = `
                        <div class="empty-cart">
                            <p>장바구니가 비어있습니다.</p>
                        </div>
                    `;
                }
                
                // 주문 요약 정보 업데이트
                updateOrderSummary();
            }
        });
    });

    // 선택 삭제 버튼 처리
    const deleteSelectedBtn = document.querySelector('.btn-delete-selected');
    deleteSelectedBtn.addEventListener('click', function() {
        const selectedItems = Array.from(itemCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => parseInt(checkbox.closest('.cart-item').dataset.itemId));
        
        if (selectedItems.length === 0) {
            alert('삭제할 상품을 선택해주세요.');
            return;
        }

        if (confirm('선택한 상품을 삭제하시겠습니까?')) {
            selectedItems.forEach(itemId => removeCartItem(itemId));
        }
    });

    // 주문하기 버튼 처리
    const orderButton = document.querySelector('.btn-order');
    orderButton.addEventListener('click', function() {
        const selectedItems = cartItems.filter(item => item.selected);
        
        if (selectedItems.length === 0) {
            alert('주문할 상품을 선택해주세요.');
            return;
        }

        // 선택된 상품 정보를 URL 파라미터로 전달
        const orderData = encodeURIComponent(JSON.stringify(selectedItems));
        window.location.href = `payment.html?items=${orderData}`;
    });

    // 아이템 선택 상태 업데이트
    function updateItemSelection(itemId, selected) {
        const item = cartItems.find(item => item.id === itemId);
        if (item) {
            item.selected = selected;
        }
    }

    // 아이템 수량 업데이트
    function updateItemQuantity(itemId, quantity) {
        const item = cartItems.find(item => item.id === itemId);
        if (item) {
            item.quantity = quantity;
            updateOrderSummary();
        }
    }

    // 장바구니 아이템 삭제
    function removeCartItem(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        const itemElement = document.querySelector(`.cart-item[data-item-id="${itemId}"]`);
        if (itemElement) {
            itemElement.remove();
            
            // 장바구니가 비었을 때 메시지 표시
            if (cartItems.length === 0) {
                const itemList = document.querySelector('.item-list');
                itemList.innerHTML = `
                    <div class="empty-cart">
                        <p>장바구니가 비어있습니다.</p>
                    </div>
                `;
            }
        }
        updateOrderSummary();
    }

    // 주문 요약 정보 업데이트
    function updateOrderSummary() {
        const selectedItems = cartItems.filter(item => item.selected);
        const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = calculateDiscount(subtotal); // 할인 계산 함수 (실제로는 서버에서 계산)
        const total = subtotal - discount;

        document.querySelector('.subtotal').textContent = formatPrice(subtotal) + '원';
        document.querySelector('.discount').textContent = '-' + formatPrice(discount) + '원';
        document.querySelector('.total-price').textContent = formatPrice(total) + '원';
        document.querySelector('.selected-count').textContent = selectedItems.length;
        document.querySelector('.earning-points').textContent = Math.floor(total * 0.01).toLocaleString();
    }

    // 할인 계산 함수 (예시)
    function calculateDiscount(subtotal) {
        return Math.floor(subtotal * 0.05); // 5% 할인
    }

    // 가격 포맷팅
    function formatPrice(price) {
        return price.toLocaleString();
    }

    // 초기 주문 요약 업데이트
    updateOrderSummary();

    // 추천 상품 장바구니 담기 버튼 처리
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            alert(`${productName}이(가) 장바구니에 담겼습니다.`);
        });
    });
});
