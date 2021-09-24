export const getFullGuestList = async ({ fetch }) => {
    const guestsObj = await (await fetch('/guests')).json();
    const guestArr = Object.entries(guestsObj).reduce((acc, [id, val]) => {
        return [...acc, { id, ...val}]
    }, []);

    return guestArr.map(g => !g.seats ? { ...g, seats: []} : g).sort((a, b) => a.name.localeCompare(b.name));
}

export const submitGuestChanges = async (guest) => {
    await fetch(
        `/guests/${guest.id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...guest, id: undefined})
        }
    );
};
