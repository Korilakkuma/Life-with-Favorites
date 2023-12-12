'use strict';

const formElement     = document.getElementById('form');
const inputElement    = document.getElementById('text-subject');
const textareaElement = document.getElementById('textarea-body');
const buttonElement   = document.getElementById('submit-button');
const divElement      = document.getElementById('result');

const spanElementForSubject = document.getElementById('number-of-subject-chars');
const spanElementForBody    = document.getElementById('number-of-body-chars');

inputElement.addEventListener('input', (event) => {
  const numberOfChars = event.currentTarget.value.trim().length;

  spanElementForSubject.textContent = numberOfChars;

  if (numberOfChars > 50) {
    spanElementForSubject.classList.add('type-over');
  } else {
    spanElementForSubject.classList.remove('type-over');
  }
});

textareaElement.addEventListener('input', (event) => {
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

  const subject = inputElement.value.trim();
  const body    = textareaElement.value.trim();

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
  params.append('body', body);

  buttonElement.setAttribute('disabled', 'disabled');

  const response = await fetch('https://weblike-curtaincall.ssl-lolipop.jp/php/bootstrap.php?mode=contact', { method: 'POST', body: params });

  divElement.textContent = '';

  if (response.ok) {
    const text = document.createTextNode('メール送信が完了しました. メッセージを送ってくださり, ありがとうございます.');

    divElement.appendChild(text);

    inputElement.value    = '';
    textareaElement.value = '';

    spanElementForSubject.textContent = '0';
    spanElementForBody.textContent    = '0';
  } else {
    const text = document.createTextNode('メール送信に失敗しました. お手数ですが, 時間をおいて再度ご連絡ください.');

    divElement.appendChild(text);
  }

  buttonElement.removeAttribute('disabled');
});
