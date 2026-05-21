import * as authService from '../services/authService.js';
import { catchAsync } from '../utils/catchAsync.js';

export const register = catchAsync(async (req, res) => {
  const session = await authService.registerUser(req.body);
  res.status(201).json(session);
});

export const login = catchAsync(async (req, res) => {
  const session = await authService.loginUser(req.body);
  res.json(session);
});

export const me = catchAsync(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

export const updateMe = catchAsync(async (req, res) => {
  const allowedUpdates = {
    avatarUrl: req.body.avatarUrl,
    username: req.body.username
  };

  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] === undefined) delete allowedUpdates[key];
  });

  req.user.set(allowedUpdates);
  await req.user.save({ validateModifiedOnly: true });

  res.json({ user: req.user.toSafeObject() });
});
