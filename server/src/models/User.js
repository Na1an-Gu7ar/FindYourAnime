import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    avatarUrl: {
      default: '',
      trim: true,
      type: String
    },
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true
    },
    password: {
      minlength: 8,
      required: true,
      select: false,
      type: String
    },
    username: {
      maxlength: 32,
      minlength: 3,
      required: true,
      trim: true,
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    avatarUrl: this.avatarUrl,
    createdAt: this.createdAt,
    email: this.email,
    username: this.username
  };
};

export const User = mongoose.model('User', userSchema);
