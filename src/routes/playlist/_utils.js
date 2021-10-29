export const getTokenData = async () => {
    const req = await fetch(
        'https://accounts.spotify.com/api/token',
        {
            method: 'POST',
            headers: {
                Authorization: `Basic YWM1NWRkMjY4NWQzNDRmMTlhNDIxNGZkMmNkNGU4MzY6ZWRiOWFkNTNmOTljNDg5ZmIwN2U4NmJkODc4Y2I0MzQ=`,
                "Content-Type": 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials'
            })
        }
    );
    return (await req.json()).access_token;
}

export const parseCookies = (headers) => {
    const cookiePairs = headers.cookie?.split(';') || [];
    return cookiePairs.reduce((acc, pair) => {
            const [key, value] = pair.trim().split('=');
            return { ...acc, [key]: value };
        }, {});
};

export const playlistId = '6XM5M0UDaEl9yAQGYybKUE';