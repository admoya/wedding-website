<script context="module">
    export async function load({ fetch }) {
        const guestsObj = await (await fetch('/guests')).json();
        const guestArr = Object.entries(guestsObj).reduce((acc, [id, val]) => {
            return [...acc, { id, ...val}]
        }, []);
        return { props: { guests: guestArr } };
    }
</script>

<script>
    export let guests;
    import { Input, Label, ListGroup, ListGroupItem } from 'sveltestrap';
    let search = '';
    $: matchedGuests = guests.filter(({id, name}) => {
        return id.includes(search) || name.toLowerCase().includes(search.toLowerCase());
    })
</script>

<svelte:head>
	<title>RSVP</title>
</svelte:head>

<h1>RSVP</h1>
<Label for="partySearch">Search for your party</Label>
<Input bind:value={search} autocomplete="off" id="partySearch" type="search" placeholder="Enter your name or RSVP code"/>
{#if search.length > 2}
    <ListGroup>
        {#each matchedGuests as guest}
            <ListGroupItem tag="a" href={`rsvp/${guest.id}`} action>{guest.name}</ListGroupItem>
        {/each}
    </ListGroup>
{/if}

