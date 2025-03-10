'use strict';

const formElement     = document.getElementById('form');
const inputElement    = document.getElementById('text-subject');
const emailElement    = document.getElementById('email');
const textareaElement = document.getElementById('textarea-body');
const buttonElement   = document.getElementById('submit-button');

const spanElementForSubject = document.getElementById('number-of-subject-chars');
const spanElementForBody    = document.getElementById('number-of-body-chars');

const spanElementForElapsedDaysFrom20150322 = document.getElementById('elapsed-days-from-2015/03/22');
const spanElementForCurrentYear = document.getElementById('current-year');

const anchorElementToYouTube = document.querySelector('a[href="https://www.youtube.com/@rilakkuma3xjapan/videos"]');

const escapeHTML = (html) => {
  return html
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
};

inputElement.addEventListener('input', (event) => {
  const divElement = document.getElementById('result');

  if (divElement) {
    formElement.removeChild(divElement);
  }

  const numberOfChars = event.currentTarget.value.trim().length;

  spanElementForSubject.textContent = numberOfChars;

  if (numberOfChars > 50) {
    spanElementForSubject.classList.add('type-over');
  } else {
    spanElementForSubject.classList.remove('type-over');
  }
});

emailElement.addEventListener('input', (event) => {
  const divElement = document.getElementById('result');

  if (divElement) {
    formElement.removeChild(divElement);
  }
});

textareaElement.addEventListener('input', (event) => {
  const divElement = document.getElementById('result');

  if (divElement) {
    formElement.removeChild(divElement);
  }

  const numberOfChars = event.currentTarget.value.trim().length;

  spanElementForBody.textContent = numberOfChars;

  if (numberOfChars > 1000) {
    spanElementForBody.classList.add('type-over');
  } else {
    spanElementForBody.classList.remove('type-over');
  }
});

formElement.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (formElement.lastElementChild.getAttribute('id') === 'result') {
    formElement.removeChild(formElement.lastElementChild);
  }

  const subject = escapeHTML(inputElement.value.trim());
  const email   = escapeHTML(emailElement.value.trim());
  const body    = escapeHTML(textareaElement.value.trim());

  const errors = [];

  if (subject.length === 0) {
    errors.push('メール件名を入力してください.');
  } else if (subject.length > 50) {
    errors.push('メール件名は 50 文字以内で入力してください.');
  }

  if (body.length === 0) {
    errors.push('メール本文を入力してください.');
  } else if (body.length > 1000) {
    errors.push('メール本文は 1000 文字以内で入力してください.');
  }

  const divElement = document.createElement('div');

  divElement.setAttribute('id', 'result');

  formElement.appendChild(divElement);

  if (errors.length > 0) {
    divElement.textContent = '';

    const ul = document.createElement('ul');

    errors.forEach((error) => {
      const li = document.createElement('li');

      li.textContent = error;

      ul.appendChild(li);
    });

    divElement.appendChild(ul);

    return;
  }

  const params = new URLSearchParams();

  params.append('subject', subject);
  params.append('body', `${body}\n\nEmail: ${email}`);

  buttonElement.setAttribute('disabled', 'disabled');

  const response = await fetch('https://weblike-curtaincall.ssl-lolipop.jp/php/contact.php', { method: 'POST', body: params, mode: 'cors' });

  divElement.textContent = '';

  if (response.ok) {
    const text = document.createTextNode('メール送信が完了しました. メッセージを送ってくださり, ありがとうございます.');

    divElement.appendChild(text);

    inputElement.value    = '';
    emailElement.value    = '';
    textareaElement.value = '';

    spanElementForSubject.textContent = '0';
    spanElementForBody.textContent    = '0';
  } else {
    const text = document.createTextNode('メール送信に失敗しました. お手数ですが, 時間をおいて再度ご連絡ください.');

    divElement.appendChild(text);
  }

  buttonElement.removeAttribute('disabled');
});

if (window.matchMedia('(max-width: 480px)').matches) {
  anchorElementToYouTube.setAttribute('href', 'https://m.youtube.com/@rilakkuma3xjapan/videos');
}

const renderElapsedDays = () => {
  const dateNow = new Date();
  const date20150322 = new Date('2015/03/22');

  spanElementForElapsedDaysFrom20150322.textContent = Math.trunc((dateNow.getTime() - date20150322.getTime()) / (24 * 60 * 60 * 1000));
  spanElementForCurrentYear.textContent = dateNow.getFullYear();
};

renderElapsedDays();

window.setInterval(renderElapsedDays, (60 * 1000));
