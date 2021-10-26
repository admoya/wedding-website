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
    import { cloneDeep } from 'lodash-es';
    import GuestCard from './_guestCard.svelte';
    import { Card, CardHeader, CardBody, CardTitle, Container, Row, Col } from 'sveltestrap';

    let remoteGuests = cloneDeep(guests);
    const refreshRemote = async () => {
        remoteGuests = await getFullGuestList({fetch});
    };
    const refreshAll = async () => {
        guests = await getFullGuestList({fetch});
        remoteGuests = cloneDeep(guests);
    };
    let csv;
    $: {
        const rows = [['group name', 'group attending', 'email', 'notes', 'guest name', 'guest attending', 'food']];
        remoteGuests.forEach(({ attending: groupAttending, email, name: groupName, notes, seats}) => {
            seats.forEach(({ attending: guestAttending, food, name: guestName}) => {
                rows.push([ `"${groupName}"`, groupAttending, email, `"${notes}"`, guestName, guestAttending, food]);
            });
        });
        csv = `data:text/csv;charset=utf-8,${encodeURI(rows.map(r => r.join(',')).join('\n'))}`;
    }
    $: respondedGuests = guests.filter(g => g.attending !== undefined);
    $: nonRespondedGuests = guests.filter(g => g.attending === undefined);
    $: attendingCount = guests.filter(g => g.attending).map(g => g.seats.filter(s => s.attending).length).reduce((prev, curr) => prev + curr, 0);
    $: notAttendingCount = guests.filter(g => g.attending).map(g => g.seats.filter(s => s.attending === false).length).reduce((prev, curr) => prev + curr, 0);
    $: unansweredCount = guests.filter(g => g.attending == undefined).map(g => g.seats.length).reduce((prev, curr) => prev + curr, 0);
</script>


<h1>Edit Guest Data</h1>
<button on:click={refreshAll}>Refresh</button>
<button on:click={() => {
    console.log(JSON.stringify(guests, null, 4));
    console.log(JSON.stringify(remoteGuests, null, 4));
}}>Debug</button>
<a href={csv} download="RSVPs.csv">Export</a>
<Card>
    <CardHeader>
        <CardTitle>Stats</CardTitle>
    </CardHeader>
    <CardBody>
        <Container>
            <Row>
                <Col>
                    <h5>Attending</h5>
                    <p class="text-start">{attendingCount}</p>
                </Col>
                <Col>
                    <h5>Not Attending</h5>
                    <p class="text-start">{notAttendingCount}</p>
                </Col>
                <Col>
                    <h5>No Response</h5>
                    <p class="text-start">{unansweredCount}</p>
                </Col>
            </Row>
        </Container>
    </CardBody>
</Card>
<h3>Responded:</h3>
{#each respondedGuests as guest, index}
    <GuestCard {guest} {index} {refreshRemote} {remoteGuests} />
{/each}
<h3 class="mt-4">Not Responded:</h3>
{#each nonRespondedGuests as guest, index}
    <GuestCard {guest} {index} {refreshRemote} {remoteGuests} />
{/each}