export async function get() {
    const url = import.meta.env.VITE_TIME_API;
    const res = await fetch(url);
    const time = await res.json();
    return { body: time };
};