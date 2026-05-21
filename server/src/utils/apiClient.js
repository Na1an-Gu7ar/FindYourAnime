import { AppError } from './AppError.js';

export async function getJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 12000);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new AppError(data?.message || `External API request failed: ${response.status}`, 502);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new AppError('External anime API timed out', 504);
    }
    if (error instanceof AppError) throw error;
    throw new AppError('Unable to reach anime data provider', 502);
  } finally {
    clearTimeout(timeout);
  }
}

export async function postJson(url, body, options = {}) {
  return getJson(url, {
    ...options,
    body: JSON.stringify(body),
    method: 'POST'
  });
}
