export async function get() {
    const res = await fetch('https://moya-wedding-default-rtdb.firebaseio.com/guests.json');
    const guests = await res.json();
    return { body: guests };
};