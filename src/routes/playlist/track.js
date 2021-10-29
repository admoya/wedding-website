import { getTokenData, parseCookies, playlistId } from './_utils';

export async function post({ headers, body}) {
    const { id } = body;
    const cookies = parseCookies(headers);
    const authCookie = cookies.trackSearchAuth;
    const token = authCookie || await getTokenData();
    const request = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?position=0`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                uris: [`spotify:track:${id}`],
            })
        }
    );
    const response = await request.json();
    return { body: response };
}