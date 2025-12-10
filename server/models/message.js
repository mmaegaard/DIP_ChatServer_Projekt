
export default class Message {
  constructor(messageId, chatId, messageText, ownerId, creationDate) {
    this._messageId = Number(messageId);
    // Måske skal chatId slettes fra Message klassen. Er usikker.
    // this._chatId = Number(chatId);
    this._messageText = String(messageText);
    this._ownerId = Number(ownerId);
    this._creationDate = creationDate ?? new Date().toISOString();
  }

    // Getters
  get messageId() { return this._messageId; }
  // get chatId() { return this._chatId; }
  get messageText() { return this._messageText; }
  get ownerId() { return this._ownerId; }
  get creationDate() { return this._creationDate; }

  // Setters
  set messageText(newMessageText) {
    const t = (newMessageText ?? '').trim();
    if (!t) throw new Error('Message messageText cannot be empty');
    this._messageText = t;
  }

  // Serialization helpers
  static fromJSON(json) {
    if (!json) throw new Error('Invalid message JSON');
    return new Message(json.messageId, json.messageText, json.ownerId, json.creationDate);
  }

  toJSON() {
    return {
      messageId: this._messageId,
      // chatId: this._chatId,
      messageText: this._messageText,
      ownerId: this._ownerId,
      creationDate: this._creationDate
    };
  }
}