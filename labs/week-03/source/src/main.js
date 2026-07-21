import './style.css';

const form = document.querySelector('#request-form');

// TODO 1: query preview/status/list elements
const status = document.querySelector('#form-status');
const requestList = document.querySelector('#request-list');

const preview = {
  requesterName: document.querySelector('#preview-name'),
  requestType: document.querySelector('#preview-type'),
  details: document.querySelector('#preview-details'),
};

// TODO 2: readForm()
function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

// TODO 3: renderPreview(data)
function renderPreview(data) {
  preview.requesterName.textContent = data.requesterName.trim() || 'ยังไม่ระบุชื่อ';
  preview.requestType.textContent = data.requestType || 'ยังไม่เลือกประเภท';
  preview.details.textContent = data.details.trim() || 'ยังไม่มีรายละเอียด';
}

// TODO 4: validate(data)
function validate(data) {
  const errors = {};

  if (data.requesterName.trim().length < 2) {
    errors.requesterName = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร';
  }

  if (!data.requestType) {
    errors.requestType = 'กรุณาเลือกประเภทคำร้อง';
  }

  if (data.details.trim().length < 10) {
    errors.details = 'กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร';
  }

  return errors;
}

// TODO 5: renderErrors(errors)
function renderErrors(errors) {
  for (const name of ['requesterName', 'requestType', 'details']) {
    const field = form.elements[name];
    const output = document.querySelector(`#${name}-error`);
    const message = errors[name] ?? '';

    output.textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
  }
}

function renderStatus(state, message) {
  status.dataset.state = state;
  status.textContent = message;
}

function addRequestToList(data) {
  const item = document.createElement('li');
  item.textContent = `${data.requesterName} — ${data.requestType}: ${data.details}`;
  requestList.appendChild(item);
}

// TODO 6: input and submit listeners
form.addEventListener('input', () => {
  const data = readForm();
  renderPreview(data);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = readForm();
  const errors = validate(data);
  renderErrors(errors);

  if (Object.keys(errors).length > 0) {
    renderStatus('invalid', 'ยังบันทึกไม่ได้ กรุณาตรวจสอบข้อมูล');
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  addRequestToList(data);
  renderStatus('success', 'บันทึกคำร้องเรียบร้อยแล้ว');
  form.reset();
});

form.addEventListener('reset', () => {
  queueMicrotask(() => {
    renderErrors({});
    renderPreview(readForm());
    renderStatus('idle', 'พร้อมเริ่มกรอกข้อมูลใหม่');
  });
});

console.log('LAB 3 starter ready', form);

renderPreview(readForm());
renderStatus('idle', 'เริ่มพิมพ์เพื่อทดลอง Event และ Live Preview');