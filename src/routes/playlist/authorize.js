import { parseCookies } from './_utils';
import FormData from 'form-data'
export async function get({ headers }) {
    const { spotifyAccessToken, spotifyRefreshToken } = parseCookies(headers);
    if (!spotifyAccessToken) {
        if (!spotifyRefreshToken) return { status: 401 };
        const res = await fetch(
            'https://accounts.spotify.com/api/token',
            {
                method: 'POST',
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: spotifyRefreshToken,
                }),
                headers: {
                    Authorization: `Basic YWM1NWRkMjY4NWQzNDRmMTlhNDIxNGZkMmNkNGU4MzY6ZWRiOWFkNTNmOTljNDg5ZmIwN2U4NmJkODc4Y2I0MzQ=`,
                }
            }
        );
        if (res.status !== 200) return { status: 401 };
        const { access_token, refresh_token, expires_in } = await res.json();
        const authCookieExpirationDate = new Date();
        authCookieExpirationDate.setSeconds(authCookieExpirationDate.getSeconds() + expires_in - 10);
        const refreshCookieExpirationDate = new Date();
        refreshCookieExpirationDate.setFullYear(refreshCookieExpirationDate.getFullYear() + 1);
        return {
            status: 200,
            headers: {
                'set-cookie': [
                    `spotifyAccessToken=${access_token} HttpOnly; SameSite=Strict; Expires=${authCookieExpirationDate.toUTCString()}`,
                    `spotifyRefreshToken=${refresh_token} HttpOnly; SameSite=Strict; Expires=${refreshCookieExpirationDate.toUTCString()}`],
            }
        }
    }
    return { status: 200 }
}

export async function post({ body: { code, redirectUri } }) {
    if (!code || typeof code !== 'string') return { status: 400, body: 'Invalid input, requires a spotify access code'};
    const res = await fetch(
        'https://accounts.spotify.com/api/token',
        {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
            headers: {
                Authorization: `Basic YWM1NWRkMjY4NWQzNDRmMTlhNDIxNGZkMmNkNGU4MzY6ZWRiOWFkNTNmOTljNDg5ZmIwN2U4NmJkODc4Y2I0MzQ=`,
            }
        }
    );
    if (res.status !== 200) return { status: 401 };
    const { access_token, refresh_token, expires_in } = await res.json();
    const authCookieExpirationDate = new Date();
    authCookieExpirationDate.setSeconds(authCookieExpirationDate.getSeconds() + expires_in - 10);
    const refreshCookieExpirationDate = new Date();
    refreshCookieExpirationDate.setFullYear(refreshCookieExpirationDate.getFullYear() + 1);
    return {
        status: 201,
        headers: {
            'set-cookie': [
                `spotifyAccessToken=${access_token} HttpOnly; SameSite=Strict; Expires=${authCookieExpirationDate.toUTCString()}`,
                `spotifyRefreshToken=${refresh_token} HttpOnly; SameSite=Strict; Expires=${refreshCookieExpirationDate.toUTCString()}`],
        }
    }
}