<script context="module">
    import { getFullGuestList } from '../../utils';
    export async function load({ fetch }) {
        try {
            const authorized = await fetch("/guests/authorize");
            if (authorized.status !== 200) {
                return { status: 302, redirect: "/guests/adminAuth" };
            }
            return { props: { guests: await getFullGuestList({fetch}) } }
        } catch (ex) {
            return { error: ex };
        }

    }
</script>

<script>
    export let guests;
    let remoteGuests = cloneDeep(guests);
    import { cloneDeep } from 'lodash-es';
    import GuestCard from './_guestCard.svelte';
    const refreshRemote = async () => {
        remoteGuests = await getFullGuestList({fetch});
    };
    const refreshAll = async () => {
        guests = await getFullGuestList({fetch});
        remoteGuests = cloneDeep(guests);
    }
    $: respondedGuests = guests.filter(g => g.attending !== undefined);
    $: nonRespondedGuests = guests.filter(g => g.attending === undefined);
</script>


<h1>Edit Guest Data</h1>
<button on:click={refreshAll}>Refresh</button>
<button on:click={() => {
    console.log(JSON.stringify(guests, null, 4));
    console.log(JSON.stringify(remoteGuests, null, 4));
}}>Debug</button>
<h3>Responded:</h3>
{#each respondedGuests as guest, index}
    <GuestCard {guest} {index} {refreshRemote} {remoteGuests} />
{/each}
<h3 class="mt-4">Not Responded:</h3>
{#each nonRespondedGuests as guest, index}
    <GuestCard {guest} {index} {refreshRemote} {remoteGuests} />
{/each}