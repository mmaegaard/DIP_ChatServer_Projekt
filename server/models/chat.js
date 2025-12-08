// models/Chat.js
export default class Chat {
  constructor(id, name, ownerId, createdAt) {
    this._id = Number(id);
    this._name = String(name);
    this._ownerId = Number(ownerId);
    this._createdAt = createdAt ?? new Date().toISOString();
    // Ingen indlejrede messages her – de ligger i messages.json
  }

  // Getters
  get id() { return this._id; }
  get name() { return this._name; }
  get ownerId() { return this._ownerId; }
  get createdAt() { return this._createdAt; }

  // Setters
  set name(newName) {
    if (!newName || !String(newName).trim()) throw new Error('Chat name is required');
    this._name = String(newName).trim();
  }

  // Serialization helpers
  static fromJSON(json) {
    if (!json) throw new Error('Invalid chat JSON');
    return new Chat(json.id, json.name, json.ownerId, json.createdAt);
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      ownerId: this._ownerId,
      createdAt: this._createdAt
    };
  }
}