// 비밀번호 유효성 검사 함수
function validatePassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const isValidLength = password.length >= 8 && password.length <= 16;
    return hasLetter && hasNumber && hasSpecial && isValidLength;
}

// 이메일 유효성 검사 함수
function validateEmail() {
    const id = document.getElementById('emailId').value;
    const domain = document.getElementById('emailDomain').value;
    const directDomain = document.getElementById('emailDomainDirect').value;
    const finalDomain = domain === 'direct' ? directDomain : domain;
    
    const isValidId = /^[a-zA-Z0-9._-]+$/.test(id);
    const isValidDomain = finalDomain && finalDomain !== 'direct' && /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(finalDomain);
    
    return isValidId && isValidDomain;
}

// 휴대폰 번호 유효성 검사 함수
function validatePhone() {
    const phone1 = document.getElementById('phone1').value;
    const phone2 = document.getElementById('phone2').value;
    const phone3 = document.getElementById('phone3').value;
    
    const phone1Valid = /^01[016789]$/.test(phone1);
    const phone2Valid = /^\d{3,4}$/.test(phone2);
    const phone3Valid = /^\d{4}$/.test(phone3);
    
    return phone1Valid && phone2Valid && phone3Valid;
}

// 이메일 도메인 직접입력
document.getElementById('emailDomain').addEventListener('change', function() {
    const directInput = document.getElementById('emailDomainDirect');
    if (this.value === 'direct') {
        directInput.style.display = 'inline-block';
        directInput.required = true;
    } else {
        directInput.style.display = 'none';
        directInput.required = false;
        directInput.value = '';
    }
});

// 휴대폰 번호 자동 포커스
const phoneInputs = [
    document.getElementById('phone1'),
    document.getElementById('phone2'),
    document.getElementById('phone3')
];

phoneInputs.forEach((input, index) => {
    input.addEventListener('input', function() {
        if (this.value.length >= this.maxLength && index < 2) {
            phoneInputs[index + 1].focus();
        }
    });
});

// 전체 동의 체크박스
document.querySelector('.agreement-all input[type="checkbox"]').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.agreement-items input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});

// 개별 체크박스 변경 시 전체 동의 체크박스 상태 업데이트
const checkboxes = document.querySelectorAll('.agreement-items input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        document.querySelector('.agreement-all input[type="checkbox"]').checked = allChecked;
    });
});

// 아이디 중복확인 버튼 클릭 이벤트
document.querySelector('.check-button').addEventListener('click', function() {
    const userId = document.getElementById('userId').value;
    
    if (userId.length === 0) {
        alert('아이디를 입력해주세요.');
        document.getElementById('userId').focus();
        return;
    }
    
    // 여기에 실제 서버 통신 로직 추가
    alert('사용 가능한 아이디입니다.');
});

// 폼 제출 시 유효성 검사
document.querySelector('.register-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // 비밀번호 검사
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!validatePassword(password)) {
        alert('비밀번호는 영문, 숫자, 특수문자(!@#$%^&*)를 포함한 8-16자여야 합니다.');
        document.getElementById('password').focus();
        return;
    }

    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        document.getElementById('confirmPassword').focus();
        return;
    }

    // 이름 검사
    const name = document.querySelector('input[pattern="[가-힣]+"]').value;
    if (!/^[가-힣]+$/.test(name)) {
        alert('이름은 한글만 입력 가능합니다.');
        document.querySelector('input[pattern="[가-힣]+"]').focus();
        return;
    }

    // 이메일 검사
    if (!validateEmail()) {
        alert('올바른 이메일 형식이 아닙니다.');
        document.getElementById('emailId').focus();
        return;
    }

    // 휴대폰 번호 검사
    if (!validatePhone()) {
        alert('올바른 휴대폰 번호 형식이 아닙니다.');
        document.getElementById('phone1').focus();
        return;
    }

    // 필수 약관 동의 검사
    const requiredCheckboxes = document.querySelectorAll('.agreement-items input[required]');
    const allChecked = Array.from(requiredCheckboxes).every(checkbox => checkbox.checked);
    
    if (!allChecked) {
        alert('필수 약관에 동의해주세요.');
        requiredCheckboxes[0].focus();
        return;
    }

    // 모든 검사 통과
    alert('회원가입이 완료되었습니다!');
    // this.submit(); // 실제 서버로 데이터를 전송할 때 주석 해제
});