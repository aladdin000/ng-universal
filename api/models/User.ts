import * as crypto from 'crypto';
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  name: String,
  email: String,
  username: {
      type: String,
      unique: true
  },
  hashed_password: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  linkedin: {},

});

/**
 * Virtual attributes
 */
UserSchema.virtual("password")
  .set((password: string) => {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
  }).get(() => {
      return this._password;
  });

/**
 * Validations
 */
const validatePresenceOf = (value: any) => {
  return value && value.length;
};

// The below 4 validations only apply if you are signing up traditionally
UserSchema.path("name")
  .validate((name: string) => {

    // if you are authenticating by any of the oauth strategies, don't validate
    if (!this.provider) {
      return true;
    }

    return (typeof name === "string" && name.length > 0);
  }, "Name cannot be blank");

UserSchema.path("email")
  .validate((email: string) => {

      // if you are authenticating by any of the oauth strategies, don't validate
      if (!this.provider) {
        return true;
      }

      return (typeof email === "string" && email.length > 0);
  }, "Email cannot be blank");

UserSchema.path("username")
  .validate((username: string) => {

      // if you are authenticating by any of the oauth strategies, don't validate
      if (!this.provider) {
        return true;
      }

      return (typeof username === "string" && username.length > 0);
  }, "Username cannot be blank");

UserSchema.path("hashed_password")
  .validate((hashed_password: string) => {

      // if you are authenticating by any of the oauth strategies, don't validate
      if (!this.provider) {
        return true;
      }

      return (typeof hashed_password === "string" && hashed_password.length > 0);
  }, "Password cannot be blank");


/**
 * Pre-save hook
 */
UserSchema.pre("save", (next: any) => {
    if (!this.isNew) {
      return next();
    }

    if (!validatePresenceOf(this.password) && !this.provider) {
      next(new Error("Invalid password"));
    }

    next();
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param plainText string
   * @returns boolean
   * @api public
   */
  authenticate: (plainText: string) => {
      return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @returns string
   * @api public
   */
  makeSalt: () => {
      return crypto.randomBytes(16).toString("base64");
  },

  /**
   * Encrypt password
   *
   * @param password string
   * @return string
   * @api public
   */
  encryptPassword: (password: string) => {

    if (!password || !this.salt) {
      return "";
    }

    const salt = new Buffer(this.salt, "base64");

    return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");
  }
};

export const User = mongoose.model("User", UserSchema);
