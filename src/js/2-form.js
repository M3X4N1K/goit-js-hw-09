console.log('Form');

const form = document.querySelector('.feedback-form');
const STORAGE_KEY = 'feedback-form-state';

let formData = {
  email: '',
  message: '',
};


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
  } catch {
    
  }
};

const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

const isValidEmail = (email) => {
  
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


function restoreFormState() {
  const raw = safeGet(STORAGE_KEY);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    if (typeof data === 'object' && data) {
      formData.email = typeof data.email === 'string' ? data.email : '';
      formData.message = typeof data.message === 'string' ? data.message : '';

      const emailInput = form.querySelector('input[name="email"]');
      const messageTextarea = form.querySelector('textarea[name="message"]');

      if (emailInput) emailInput.value = formData.email;
      if (messageTextarea) messageTextarea.value = formData.message;
    }
  } catch {
   
    safeRemove(STORAGE_KEY);
  }
}


const saveStateDebounced = debounce(() => {
  safeSet(STORAGE_KEY, JSON.stringify(formData));
}, 300);


if (form) {
  restoreFormState();

  form.addEventListener('input', (e) => {
    const target = e.target;
    if (!target || !target.name) return;

    if (target.name in formData) {
      formData[target.name] = target.value;
      saveStateDebounced();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = form.querySelector('input[name="email"]');
    const messageTextarea = form.querySelector('textarea[name="message"]');

    const email = (emailInput?.value || '').trim();
    const message = (messageTextarea?.value || '').trim();

    if (!email || !message) {
      alert('Будь ласка, заповніть і Email, і Message.');
      if (!email) emailInput?.focus();
      else messageTextarea?.focus();
      return;
    }

    if (!isValidEmail(email)) {
      alert('Будь ласка, вкажіть коректний email.');
      emailInput?.focus();
      return;
    }

   
    console.log('Submitted data:', { email, message });

 
    form.reset();
    safeRemove(STORAGE_KEY);
    formData = { email: '', message: '' };
  });


  form.addEventListener('reset', () => {
    safeRemove(STORAGE_KEY);
    formData = { email: '', message: '' };
  });
}