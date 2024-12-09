document.addEventListener('DOMContentLoaded', function() {
    // 주문자 정보와 동일 체크박스 처리
    const sameAsOrdererCheckbox = document.getElementById('same-as-orderer');
    const ordererName = document.querySelector('input[name="orderer-name"]');
    const ordererPhone = document.querySelector('input[name="orderer-phone"]');
    const receiverName = document.querySelector('input[name="receiver-name"]');
    const receiverPhone = document.querySelector('input[name="receiver-phone"]');

    if (sameAsOrdererCheckbox) {
        sameAsOrdererCheckbox.addEventListener('change', function() {
            if (this.checked) {
                receiverName.value = ordererName.value;
                receiverPhone.value = ordererPhone.value;
                receiverName.disabled = true;
                receiverPhone.disabled = true;
            } else {
                receiverName.value = '';
                receiverPhone.value = '';
                receiverName.disabled = false;
                receiverPhone.disabled = false;
            }
        });
    }

    // 배송 요청사항 선택 처리
    const deliveryRequest = document.getElementById('delivery-request');
    const customRequest = document.querySelector('.custom-request');

    if (deliveryRequest) {
        deliveryRequest.addEventListener('change', function() {
            if (this.value === 'custom') {
                customRequest.classList.remove('hidden');
            } else {
                customRequest.classList.add('hidden');
            }
        });
    }

    // 결제 수단 선택 시 카드 결제 폼 표시/숨김
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    paymentOptions.forEach(radio => {
        radio.addEventListener('change', function() {
            const cardPayment = document.getElementById('cardPayment');
            cardPayment.style.display = this.value === 'card' ? 'block' : 'none';
        });
    });

    // 페이지 로드 시 신용카드가 선택되어 있으므로 카드 결제 폼 표시
    const cardPayment = document.getElementById('cardPayment');
    if (cardPayment) {
        cardPayment.style.display = 'block';
    }

    // 포인트 입력 이벤트
    const pointInput = document.querySelector('input[name="use-points"]');
    if (pointInput) {
        pointInput.addEventListener('input', updateTotalAmount);
    }

    // 쿠폰 선택 이벤트
    const couponSelect = document.querySelector('select[name="coupon"]');
    if (couponSelect) {
        couponSelect.addEventListener('change', updateTotalAmount);
    }

    // 초기 총 결제 금액 계산
    updateTotalAmount();
});

// 결제 처리 함수
function processPayment() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (selectedMethod === 'bank') {
        // 무통장입금 모달 표시
        const modal = new bootstrap.Modal(document.getElementById('virtualAccountModal'));
        modal.show();
    } else {
        // 카드 결제 처리
        alert('카드 결제가 완료되었습니다.');
        window.location.href = 'payment-complete.html';
    }
}

// 계좌번호 복사 함수
function copyAccountNumber() {
    const accountNumber = '110-123-456789';
    navigator.clipboard.writeText(accountNumber).then(() => {
        alert('계좌번호가 복사되었습니다.');
    });
}

// 포인트 전체 사용 함수
function useAllPoints() {
    const availablePoints = 5000; // 실제로는 서버에서 가져올 값
    const pointInput = document.querySelector('input[name="use-points"]');
    pointInput.value = availablePoints;
    updateTotalAmount();
}

// 총 결제 금액 업데이트 함수
function updateTotalAmount() {
    const originalPrice = 36000;
    const pointsUsed = parseInt(document.querySelector('input[name="use-points"]')?.value) || 0;
    const selectedCoupon = document.querySelector('select[name="coupon"]')?.value;
    
    let couponDiscount = 0;
    if (selectedCoupon === 'welcome') couponDiscount = 3000;
    if (selectedCoupon === 'special') couponDiscount = 5000;
    
    const totalAmount = originalPrice - pointsUsed - couponDiscount;
    
    // 금액 표시 업데이트
    document.querySelector('.amount-row.total span:last-child').textContent = 
        `${totalAmount.toLocaleString()}원`;
    document.querySelector('.btn-payment').textContent = 
        `${totalAmount.toLocaleString()}원 결제하기`;
}

// 무통장입금 완료 처리 함수
function confirmTransfer() {
    window.location.href = 'payment-complete.html';
}

// 가격 포맷팅 함수
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
