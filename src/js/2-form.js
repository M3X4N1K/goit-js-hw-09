const form = document.querySelector('.feedback-form');
const STORAGE_KEY = 'feedback-form-state';

let formData = {
  email: '',
  message: '',
};

// --- helpers ---
const debounce = (fn, delay = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};

// --- restore state from localStorage ---
function restoreFormState() {
  const raw = safeGet(STORAGE_KEY);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    if (typeof data === 'object' && data) {
      formData.email = typeof data.email === 'string' ? data.email : '';
      formData.message = typeof data.message === 'string' ? data.message : '';

      form.elements.email.value = formData.email;
      form.elements.message.value = formData.message;
    }
  } catch {
    safeRemove(STORAGE_KEY);
  }
}

// --- save state (debounced) ---
const saveStateDebounced = debounce(() => {
  safeSet(STORAGE_KEY, JSON.stringify(formData));
}, 300);

// --- bind events ---
if (form) {
  restoreFormState();

  form.addEventListener('input', (e) => {
    const { name, value } = e.target;
    if (!(name in formData)) return;

    formData[name] = value.trim();
    saveStateDebounced();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!formData.email || !formData.message) {
      alert('Fill please all fields');
      return;
    }

    // ✅ Виводимо саме глобальний formData
    console.log(formData);

    // очищення
    form.reset();
    safeRemove(STORAGE_KEY);
    formData.email = '';
    formData.message = '';
  });

  form.addEventListener('reset', () => {
    safeRemove(STORAGE_KEY);
    formData.email = '';
    formData.message = '';
  });
}