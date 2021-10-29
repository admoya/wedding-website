import { getTokenData, parseCookies } from './_utils';
export async function get({ headers, query }) {
    const name = query.get('name');
    if (!name) return { body: {}, status: 400 };
    const cookies = parseCookies(headers);
    const authCookie = cookies.trackSearchAuth;
    const token = authCookie || await getTokenData();
    console.log(token);
    const searchRequest = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=track`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );
    const searchResults = await searchRequest.json();
    const results = searchResults.tracks.items.map(({artists, name, id}) => ({
        artist: artists.reduce((acc, artist) => (acc + (acc.length > 0 ? ', ' : '') + artist.name), ''),
        name,
        id
    }));
    const cookieExpirationDate = new Date();
    cookieExpirationDate.setMinutes(cookieExpirationDate.getMinutes() + 45);
    return {
        body: results,
        headers: {
            'set-cookie': !cookies.trackSearchAuth ? `trackSearchAuth=${token}; HttpOnly; SameSite=Strict; Expires=${cookieExpirationDate.toUTCString()}` : '',
        }
    };
};
