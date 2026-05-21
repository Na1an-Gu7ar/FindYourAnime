import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/token.js';

function createSession(user) {
  return {
    token: signToken(user._id.toString()),
    user: user.toSafeObject()
  };
}

export async function registerUser({ email, password, username }) {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    throw new AppError('Email or username is already in use', 409);
  }

  const user = await User.create({ email, password, username });
  return createSession(user);
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  return createSession(user);
}
