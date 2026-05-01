export function generateOutTradeNo(): string {
  const now = new Date();
  const dateStr = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const random = Math.random().toString(36).substring(2, 8);
  return `${dateStr}${random}`;
}

export function generateSign(params: Record<string, string>, key: string): string {
  const sortedKeys = Object.keys(params).sort();
  const signStr = sortedKeys
    .filter(k => params[k] && k !== 'sign' && k !== 'sign_type')
    .map(k => `${k}=${params[k]}`)
    .join('&');
  const md5 = require('crypto').createHash('md5');
  md5.update(signStr + key);
  return md5.digest('hex');
}