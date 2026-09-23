const SB_URL_V30 = "https://imwzcdobpvuuwfadaxbb.supabase.co";
const SB_KEY_V30 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltd3pjZG9icHZ1dXdmYWRheGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDc5MTMsImV4cCI6MjEwNDU4MzkxM30.sN4jiyBUMfbLDrwsO0w3XDIgwn-LzLd25L8R_yIV10E";
async function saveLeadV30(p) {
  const r = await fetch(SB_URL_V30 + "/rest/v1/pioneer_leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": SB_KEY_V30, "Authorization": "Bearer " + SB_KEY_V30, "Prefer": "return=minimal" },
    body: JSON.stringify(p)
  });
  if (!r.ok) {
    console.error('Supabase pioneer lead POST failed:', r.status, await r.text());
    throw new Error('Không thể tạo bản ghi Pioneer');
  }
  return true;
}
document.addEventListener('DOMContentLoaded', () => {
  let cur = 'sinh_vien';
  const config = {
    sinh_vien: { labelName: 'Họ tên *', phName: 'VD: Nguyễn Văn Aaaaa', labelContent: 'Nhu cầu chỗ ở / Ngành học quan tâm *', phContent: 'VD: Cần phòng 2 người gần ĐH Phenikaa, kỳ 2026...', btn: 'Giữ suất Pioneer miễn phí →', desc: 'Để lại thông tin, đội ngũ Xanh24 Smart Campus sẽ gọi tư vấn trong 15 phút.<br>Ưu tiên 500 suất Pioneer đầu tiên.' },
    nha_truong: { labelName: 'Họ tên / Tên trường *', phName: 'VD: PGS. Nguyễn Văn A - ĐH Bách Khoa Hà Nội', labelContent: 'Nhu cầu hợp tác / Số lượng sinh viên *', phContent: 'VD: Trường cần 500 chỗ cho sinh viên năm 1, muốn hợp tác dài hạn...', btn: 'Gửi yêu cầu hợp tác →', desc: 'Kết nối hợp tác cùng Xanh24 Smart Campus.<br>Giải pháp chỗ ở All-in-One cho sinh viên trường bạn.' },
    doi_tac: { labelName: 'Họ tên / Tên đơn vị *', phName: 'VD: MB Bank / Coca Cola / VNPT', labelContent: 'Lĩnh vực hợp tác / Nội dung đề xuất *', phContent: 'VD: Coca Cola muốn tài trợ, quảng cáo tại ký túc xá...', btn: 'Gửi đề xuất hợp tác →', desc: 'Hợp tác chiến lược cùng Xanh24 Smart Campus.<br>Đối tác MB Bank, VNPT, Futech đã tham gia.' }
  };
  const form = document.getElementById('v30-lead-form');
  const submitButton = document.getElementById('v30-submit');
  const message = document.getElementById('v30-msg');
  const fieldKeys = ['name', 'city', 'phone', 'email', 'content'];
  const fields = Object.fromEntries(fieldKeys.map(key => [key, document.getElementById(`v30-${key}`)]));
  let hasSubmitted = false;
  let isSubmitting = false;

  function setFieldError(key, error) {
    const field = fields[key];
    const errorElement = document.getElementById(`v30-${key}-error`);
    field.style.borderColor = error ? '#dc2626' : '#d1d5db';
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    field.setAttribute('aria-describedby', error ? errorElement.id : '');
    errorElement.textContent = error;
    errorElement.style.display = error ? 'block' : 'none';
  }

  function validateField(key) {
    const value = fields[key].value.trim();
    let error = '';
    if (key === 'name') {
      if (!value) error = 'Vui lòng nhập họ tên.';
      else if (value.length > 100) error = 'Họ tên không được vượt quá 100 ký tự.';
    } else if (key === 'city' && !value) {
      error = 'Vui lòng chọn thành phố.';
    } else if (key === 'phone') {
      if (!value) error = 'Vui lòng nhập số điện thoại.';
      else if (!/^[0-9+\s]{9,15}$/.test(value)) error = 'Số điện thoại không hợp lệ.';
    } else if (key === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Email không hợp lệ.';
    } else if (key === 'content' && !value) {
      error = 'Vui lòng nhập nhu cầu hoặc nội dung đề xuất.';
    }
    setFieldError(key, error);
    return !error;
  }

  function validateForm() {
    let isValid = true;
    fieldKeys.forEach(key => { if (!validateField(key)) isValid = false; });
    return isValid;
  }

  fieldKeys.forEach(key => {
    ['input', 'change'].forEach(eventName => fields[key].addEventListener(eventName, () => {
      if (hasSubmitted) validateField(key);
    }));
  });

  function showFormMessage(text, success) {
    message.textContent = text;
    message.style.display = 'block';
    message.style.background = success ? '#e6ffed' : '#fef2f2';
    message.style.borderColor = success ? '#a7f3d0' : '#fecaca';
    message.style.color = success ? '#065f46' : '#b91c1c';
  }

  function updateFormV30(type) {
    const cfg = config[type];
    document.getElementById('v30-label-name').textContent = cfg.labelName;
    document.getElementById('v30-name').placeholder = cfg.phName;
    document.getElementById('v30-label-content').textContent = cfg.labelContent;
    document.getElementById('v30-content').placeholder = cfg.phContent;
    if (!isSubmitting) submitButton.textContent = cfg.btn;
    document.getElementById('v30-desc').innerHTML = cfg.desc;
  }
  document.querySelectorAll('.v30-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.v30-tab').forEach(x => { x.style.background = 'transparent'; x.style.color = '#374151'; });
      btn.style.background = '#0a2a6b'; btn.style.color = 'white';
      cur = btn.dataset.type;
      updateFormV30(cur);
    });
  });
  updateFormV30('sinh_vien');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (isSubmitting) return;
    hasSubmitted = true;
    message.style.display = 'none';
    if (!validateForm()) {
      const firstInvalid = fieldKeys.find(key => fields[key].getAttribute('aria-invalid') === 'true');
      fields[firstInvalid]?.focus();
      return;
    }
    const name = fields.name.value.trim();
    const city = fields.city.value;
    const phone = fields.phone.value.trim();
    const email = fields.email.value.trim();
    const content = fields.content.value.trim();
    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Đang gửi...';
    try {
      await saveLeadV30({ full_name: name, phone: phone, school: `[${cur}] ${content}`.slice(0, 200), email: email || null, city: city, customer_type: cur, work_content: content, utm_source: 'v30-real-video' });
      submitButton.textContent = '✓ Đã gửi thành công!';
      showFormMessage(`✓ Cảm ơn ${name}! Đã lưu (${cur} - ${city}). Xanh24 sẽ gọi ${phone} trong 15p.`, true);
      fields.name.value = ''; fields.phone.value = ''; fields.email.value = ''; fields.content.value = '';
      hasSubmitted = false;
      setTimeout(() => { submitButton.disabled = false; submitButton.textContent = config[cur].btn; }, 3000);
    } catch (e) {
      console.error('Không thể gửi thông tin Pioneer:', e);
      showFormMessage('Chưa thể gửi thông tin lúc này. Vui lòng thử lại.', false);
      submitButton.disabled = false;
      submitButton.textContent = config[cur].btn;
    } finally {
      isSubmitting = false;
    }
  });

  // Video popup real
  const popupReal = document.getElementById('xanh24-live-popup-real');
  const modalReal = document.getElementById('xanh24-video-modal-real');
  const realVideo = document.getElementById('xanh24-real-video');
  if (popupReal && modalReal) {
    popupReal.addEventListener('click', () => {
      modalReal.classList.add('active');
      if (realVideo) realVideo.play().catch(() => { });
    });
  }
  if (modalReal) {
    modalReal.addEventListener('click', (e) => {
      if (e.target === modalReal) {
        modalReal.classList.remove('active');
        realVideo?.pause();
      }
    });
  }
});
