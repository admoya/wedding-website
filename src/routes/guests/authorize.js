import { createHash } from 'crypto';
const nonce = import.meta.env.VITE_ADMIN_NONCE;
const correctHash = import.meta.env.VITE_ADMIN_HASH;

export async function get({ headers }) {
    if (!headers.cookie) return { status: 401 };
    const cookiePairs = headers.cookie.split(';');
    const cookies = cookiePairs.map(pair => {
        const [key, value] = pair.trim().split('=');
        return { key, value };
    });
    const correctHash = import.meta.env.VITE_ADMIN_HASH;
    const authCookie = cookies.find(({ key }) => key === 'authorization');
    return { status: authCookie?.value === correctHash ? 200 : 401 };
};

export async function post({ body }) {
    const password = body && body.get('password');
    if (password) {
        const hash = createHash('sha256').update(`${nonce}+${password}`).digest('hex');
        if (hash === correctHash) {
            return { status: 302, headers: { location: '/guests/edit', 'set-cookie': `authorization=${hash}` } }
        }
    }
    return { status: 401, body: 'Intruder!' };
};