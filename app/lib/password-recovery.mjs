export function readAuthReturn(href) {
  const url = new URL(href);
  const params = new URLSearchParams(url.search);
  for (const [key, value] of new URLSearchParams(url.hash.slice(1))) params.set(key, value);
  const type = params.get('type');
  if (!['recovery', 'invite'].includes(type) && !['error', 'error_code', 'error_description', 'code', 'access_token', 'refresh_token', 'token_hash'].some(k => params.has(k))) return null;
  return Object.fromEntries(params);
}

export async function openPasswordRecovery(auth, params) {
  // An error or incomplete link must never reuse an unrelated logged-in session.
  if (params.error || params.error_code || params.error_description) throw new Error('invalid_link');
  let result;
  if (params.access_token && params.refresh_token) {
    result = await auth.setSession({ access_token: params.access_token, refresh_token: params.refresh_token });
  } else if (params.code) {
    result = await auth.exchangeCodeForSession(params.code);
  } else if (params.token_hash && ['recovery', 'invite'].includes(params.type)) {
    result = await auth.verifyOtp({ token_hash: params.token_hash, type: params.type });
  } else throw new Error('invalid_link');
  if (result.error || !result.data?.session) throw new Error('invalid_link');
  const verified = await auth.getUser();
  if (verified.error || !verified.data?.user?.id) throw new Error('invalid_link');
  return verified.data.user.id;
}
