<script>
    import { Input, Label, ListGroup, ListGroupItem } from 'sveltestrap';
    const guests = [
        {
            id: '1234',
            name: 'The Moya Family',
        },
        {
            id: '2345',
            name: 'The Hernandez Family',
        },
        {
            id: '3456',
            name: 'The Other Family',
        },
    ];
    let search = '';
    $: matchedGuests = guests.filter(({id, name}) => {
        return id.includes(search) || name.toLowerCase().includes(search.toLowerCase());
    })
</script>

<h1>RSVP</h1>
<Label for="partySearch">Search for your party</Label>
<Input bind:value={search} autocomplete="off" id="partySearch" type="search" placeholder="Enter Your Name or RSVP Code"/>
{#if search.length > 2}
    <ListGroup>
        {#each matchedGuests as guest}
            <ListGroupItem tag="a" href={`rsvp/${guest.id}`} action>{guest.name}</ListGroupItem>
        {/each}
    </ListGroup>
{/if}

