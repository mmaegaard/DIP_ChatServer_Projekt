// public/client/api.js

// CHATS
export async function fetchChats() {
  const res = await fetch('/chats');
  if (!res.ok) throw new Error(await res.text() || 'Kunne ikke hente chats');
  return res.json();
}

export async function createChat(name) {
  const res = await fetch('/chats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error(await res.text() || 'Kunne ikke oprette chat');
  return res.json();
}

// MESSAGES
export async function fetchMessages(chatId) {
  const res = await fetch(`/messages/${chatId}/messages`);
  if (!res.ok) throw new Error(await res.text() || 'Kunne ikke hente beskeder');
  return res.json();
}

export async function createMessage(chatId, text) {
  const res = await fetch(`/messages/${chatId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error(await res.text() || 'Kunne ikke sende besked');
  return res.json();
}

export async function editMessage(chatId, messageId, text) {
  const res = await fetch(`/messages/${chatId}/messages/${messageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error(await res.text() || 'Kunne ikke redigere besked');
  return res.json();
}

export async function deleteMessage(chatId, messageId) {
  const res = await fetch(`/messages/${chatId}/messages/${messageId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(await res.text() || 'Kunne ikke slette besked');
  return true;
}