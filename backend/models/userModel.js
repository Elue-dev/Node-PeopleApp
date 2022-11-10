const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is a required field"],
    },
    email: {
      type: String,
      required: [true, "email is a required field"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "password is a required field"],
      minLength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      select: false,
      validate: {
        validator: function (value) {
          // only works on SAVE or CREATE
          return value === this.password;
        },
        message: `Passwords do not match`,
      },
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  this.confirmPassword = undefined;

  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  //expires after 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  //return plain text token that we would send as an email (unencrypted). So we send the user the unencrypted one and we have the encrypted one in our database.
  return resetToken;
};

// for the reset password
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  //remember we checked if the user has changed its password in the controller, so we minus 1second, because sometimes it happend that the token is created some seconds before the changed password timestamp has been created, so it would put the passwordChangedAt 1 second in the past and that's not a problem
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
