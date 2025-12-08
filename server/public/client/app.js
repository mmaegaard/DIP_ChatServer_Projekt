// public/client/app.js
import { fetchChats, createChat, fetchMessages, createMessage, editMessage, deleteMessage } from './api.js';

let CURRENT_CHAT_ID = null;
const USER = window.USER || null;

document.addEventListener('DOMContentLoaded', async () => {
  const chatListEl = document.getElementById('chat-list');
  const chatFormEl = document.getElementById('chat-form');
  const chatNameInput = document.getElementById('chat-name');

  const messageListEl = document.getElementById('message-list');
  const messageFormEl = document.getElementById('message-form');
  const messageInputEl = document.getElementById('message-input');
  const currentChatTitleEl = document.getElementById('current-chat-title');

  // Hent og vis chats
  await loadChats(chatListEl);

    // Klik på en chat i venstre liste (event delegation)
  if (chatListEl) {
    chatListEl.addEventListener('click', (e) => {
      const a = e.target.closest('a.chat-link');
      if (!a) return;
      e.preventDefault();
      const chatId = a.dataset.chatId;
      const chatName = a.textContent.trim();
      setActiveChat(chatId, chatName);
    });
  }

  // Eventlistener til opret-chat
  if (chatFormEl) {
    chatFormEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = chatNameInput.value.trim();
      if (!name) return;

      try {
        const newChat = await createChat(name);
        console.log('Ny chat oprettet:', newChat);
        chatNameInput.value = '';
        await loadChats(chatListEl);
      } catch (err) {
        console.error('Fejl ved oprettelse:', err);
        alert(err.message);
      }
    });
  }

  // ----- MESSAGES -----

  // Send besked
  if (messageFormEl) {
    messageFormEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!CURRENT_CHAT_ID) return alert('Vælg en chat først.');
      const text = (messageInputEl?.value || '').trim();
      if (!text) return;

      try {
        const newMsg = await createMessage(CURRENT_CHAT_ID, text);
        appendMessage(messageListEl, newMsg);
        if (messageInputEl) messageInputEl.value = '';
      } catch (err) {
        console.error(err);
        alert(err.message || 'Kunne ikke sende besked');
      }
    });
  }
  
  // Rediger/Slet message via event delegation
  if (messageListEl) {
    messageListEl.addEventListener('click', async (e) => {
      const btnEdit = e.target.closest('.btn-edit');
      const btnDelete = e.target.closest('.btn-delete');
      const li = e.target.closest('li[data-message-id]');
      if (!li) return;
      const messageId = li.dataset.messageId;

      // Rediger message
      if (btnEdit) {
        const currentText = li.querySelector('.msg-text')?.textContent || '';
        const newText = prompt('Ny tekst:', currentText);
        if (newText == null) return; // cancel
        const trimmed = newText.trim();
        if (!trimmed || trimmed === currentText) return;

        try {
          const updated = await editMessage(CURRENT_CHAT_ID, messageId, trimmed);
          li.querySelector('.msg-text').textContent = updated.text;
        } catch (err) {
          console.error(err);
          alert(err.message || 'Kunne ikke redigere besked');
        }
      }

      // Slet message
      if (btnDelete) {
        if (!confirm('Slet denne besked?')) return;
        try {
          await deleteMessage(CURRENT_CHAT_ID, messageId);
          li.remove();
        } catch (err) {
          console.error(err);
          alert(err.message || 'Kunne ikke slette besked');
        }
      }
    });
  }
  
  // Vælg første chat automatisk (hvis nogen)
  autoSelectFirstChat(chatListEl);

  // ---- Helpers (inde i DOMContentLoaded, så de kan bruge elementer ovenfor) ----

  async function loadChats(container) {
    if (!container) return;
    try {
      const chats = await fetchChats();
      renderChatList(chats, container);
    } catch (err) {
      container.innerHTML = `<p class="error">Fejl: ${err.message}</p>`;
    }
  }

  function renderChatList(chats, container) {
    container.innerHTML = '';
    if (!chats || chats.length === 0) {
      container.innerHTML = '<p>Ingen chats endnu.</p>';
      return;
    }
    const ul = document.createElement('ul');
    chats.forEach(chat => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `/messages/${chat.id}/messages`;
      a.textContent = chat.name;
      a.className = 'chat-link';
      a.dataset.chatId = chat.id;
      li.appendChild(a);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function autoSelectFirstChat(container) {
    if (!container) return;
    const first = container.querySelector('a.chat-link');
    if (first) {
      const chatId = first.dataset.chatId;
      const chatName = first.textContent.trim();
      setActiveChat(chatId, chatName);
    }
  }

  async function setActiveChat(chatId, chatName = '') {
    CURRENT_CHAT_ID = chatId;
    if (currentChatTitleEl) {
      currentChatTitleEl.textContent = chatName ? `Chat: ${chatName}` : 'Chat';
    }
    await loadMessages(chatId);
  }

  async function loadMessages(chatId) {
    if (!messageListEl) return;
    messageListEl.innerHTML = '<li>Henter beskeder...</li>';
    try {
      const msgs = await fetchMessages(chatId); // <-- BRUGER den importerede funktion
      renderMessages(msgs, messageListEl);
    } catch (err) {
      console.error('Kunne ikke hente beskeder', err);
      messageListEl.innerHTML = '<li class="error">Kunne ikke hente beskeder</li>';
    }
  }

  function renderMessages(messages, container) {
    container.innerHTML = '';
    if (!messages || messages.length === 0) {
      container.innerHTML = '<li>Ingen beskeder endnu.</li>';
      return;
    }
    messages.forEach(m => appendMessage(container, m));
  }

  function appendMessage(container, m) {
    const li = document.createElement('li');
    li.dataset.messageId = m.id;

    const text = document.createElement('span');
    text.className = 'msg-text';
    text.textContent = m.text;

    const meta = document.createElement('small');
    meta.className = 'msg-meta';
    meta.textContent = ` • ${formatTime(m.createdAt)} • owner #${m.ownerId}`;

    li.appendChild(text);
    li.appendChild(meta);

    // Viser rediger/slet hvis bruger er owner eller admin
    const canEdit = USER && (Number(USER.accessLevel) === 3 || Number(USER.id) === Number(m.ownerId));

    if (canEdit) {
      const actions = document.createElement('span');
      actions.className = 'msg-actions';

      const btnEdit = document.createElement('button');
      btnEdit.type = 'button';
      btnEdit.className = 'btn-edit';
      btnEdit.textContent = 'Rediger';

      const btnDelete = document.createElement('button');
      btnDelete.type = 'button';
      btnDelete.className = 'btn-delete';
      btnDelete.textContent = 'Slet';

      actions.appendChild(btnEdit);
      actions.appendChild(btnDelete);
      li.appendChild(actions);
    }

    container.appendChild(li);
    // Scroll til bund
    container.parentElement?.scrollTo?.(0, container.parentElement.scrollHeight);
  }

  function formatTime(iso) {
    try { return new Date(iso).toLocaleString(); } catch { return iso || ''; }
  }
});