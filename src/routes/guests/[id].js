export async function get({ params: { id } }) {
    const res = await fetch(`https://moya-wedding-default-rtdb.firebaseio.com/guests/${id}.json`);
    const guest = await res.json();
    return { body: guest };
}

export async function put({ params: { id }, body }) {
    const res = await fetch(
        `https://moya-wedding-default-rtdb.firebaseio.com/guests/${id}.json`,
        {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": 'application/json',
            }
        }
    );
    return { status: res.status };
}