// models/User.js
export default class User {
  constructor(userId, userName, password, creationDate, accessLevel = 1) {
    this._userId = Number(userId);
    this._userName = String(userName);
    this._password = String(password); // i produktion: opbevar hash
    this._creationDate = creationDate ?? new Date().toISOString();
    this._accessLevel = Number(accessLevel) || 1;
  }

  // Getters
  get userId() { return this._userId; }
  get userName() { return this._userName; }
  get password() { return this._password; }
  get creationDate() { return this._creationDate; }
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
    return new User(json.userId, json.userName, json.password, json.creationDate, json.accessLevel);
  }

  toJSON() {
    return {
      userId: this._userId,
      userName: this._userName,
      password: this._password,
      creationDate: this._creationDate,
      accessLevel: this._accessLevel
    };
  }
}