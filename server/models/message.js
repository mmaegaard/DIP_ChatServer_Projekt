// models/Message.js
export default class Message {
  constructor(id, chatId, text, ownerId, createdAt) {
    this._id = Number(id);
    this._chatId = Number(chatId);
    this._text = String(text);
    this._ownerId = Number(ownerId);
    this._createdAt = createdAt ?? new Date().toISOString();
  }

  // Getters
  get id() { return this._id; }
  get chatId() { return this._chatId; }
  get text() { return this._text; }
  get ownerId() { return this._ownerId; }
  get createdAt() { return this._createdAt; }

  // Setters
  set text(newText) {
    const t = (newText ?? '').trim();
    if (!t) throw new Error('Message text cannot be empty');
    this._text = t;
  }

  // Serialization helpers
  static fromJSON(json) {
    if (!json) throw new Error('Invalid message JSON');
    return new Message(json.id, json.chatId, json.text, json.ownerId, json.createdAt);
  }

  toJSON() {
    return {
      id: this._id,
      chatId: this._chatId,
      text: this._text,
      ownerId: this._ownerId,
      createdAt: this._createdAt
    };
  }
}
