// models/User.js
export default class User {
  constructor(id, username, password, createdAt, accessLevel = 1) {
    this._id = Number(id);
    this._username = String(username);
    this._password = String(password); // i produktion: opbevar hash
    this._createdAt = createdAt ?? new Date().toISOString();
    this._accessLevel = Number(accessLevel) || 1;
  }

  // Getters
  get id() { return this._id; }
  get username() { return this._username; }
  get password() { return this._password; }
  get createdAt() { return this._createdAt; }
  get accessLevel() { return this._accessLevel; }

  // Setters
  set accessLevel(newAccessLevel) {
    const lvl = Number(newAccessLevel);
    if (![1, 2, 3].includes(lvl)) throw new Error('Access level must be 1, 2, or 3');
    this._accessLevel = lvl;
  }

  // Serialization helpers
  static fromJSON(json) {
    if (!json) throw new Error('Invalid user JSON');
    return new User(json.id, json.username, json.password, json.createdAt, json.accessLevel);
  }

  toJSON() {
    return {
      id: this._id,
      username: this._username,
      password: this._password,
      createdAt: this._createdAt,
      accessLevel: this._accessLevel
    };
  }
}
