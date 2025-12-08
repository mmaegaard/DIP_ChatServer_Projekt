// models/Chat.js
export default class Chat {
  constructor(chatId, chatName, ownerId, creationDate) {
    this._chatId = Number(chatId);
    this._chatName = String(chatName);
    this._ownerId = Number(ownerId);
    this._creationDate = creationDate ?? new Date().toISOString();
    this._messages = [];
  }

    // Getters
  get chatId() { return this._chatId; }
  get chatName() { return this._chatName; }
  get ownerId() { return this._ownerId; }
  get creationDate() { return this._creationDate; }
  get _messages() { return this._messages; }

  // Setters
  set chatName(newChatName) {
    if (!newChatName || !String(newChatName).trim()) throw new Error('Chat name is required');
    this._chatName = String(newChatName).trim();
  }

    // Serialization helpers
  static fromJSON(json) {
    if (!json) throw new Error('Invalid chat JSON');
    return new Chat(json.chatId, json.chatName, json.ownerId, json.creationDate);
  }

  toJSON() {
    return {
      chatId: this._chatId,
      chatName: this._chatName,
      ownerId: this._ownerId,
      creationDate: this._creationDate
    };
  }

}