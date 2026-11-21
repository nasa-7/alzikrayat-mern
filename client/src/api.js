// Thin fetch wrapper for the REST API. Adds the X-User-Id header for write routes
// and turns non-2xx responses into Errors carrying the server's messages.

const USER_KEY = 'alzikrayat_user';

function currentUserId() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))?._id;
  } catch {
    return undefined;
  }
}

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const userId = currentUserId();
  if (userId) headers['X-User-Id'] = userId;

  const options = { method, headers };
  if (form) {
    options.body = form; // FormData: browser sets the multipart boundary
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(path, options);
  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON body */
  }
  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.errors = data?.errors || [err.message];
    err.status = res.status;
    throw err;
  }
  return data;
}

export const imageUrl = (fileName) => `/uploads/${fileName}`;
export const authorName = (u) => (u ? `${u.firstName} ${u.lastName}` : 'Unknown');
export const initials = (u) => (u ? `${u.firstName[0]}${u.lastName[0]}`.toUpperCase() : '?');
export const formatDate = (d) => new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
