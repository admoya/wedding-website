<script context="module">
    export async function load({ page: {params: { id }} }) {
        const guests = [
            {
                id: '1234',
                name: 'The Moya Family',
                seats: [
                    {
                        name: 'Migdy Moya'
                    },
                    {
                        name: 'Henry Moya'
                    },
                    {
                        name: ''
                    }
                ]
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
        const guestGroup = guests.find((g) => id === g.id) || {};
        return { props: { guestGroup } };
    }
</script>

<script>
    import { Form, Label, Container, Col, Row, ButtonGroup, Button, Input, Alert } from 'sveltestrap';
    export let guestGroup = {};
    const { name, seats } = guestGroup;
    let error = '';
    const onFormSubmit = (e) => {
        e.preventDefault();
        if (guestGroup.attending) {
                if (seats.find((seat) => !seat.name)) {
                error = 'Please enter a name for all your guests';
                return;
            };
            if (seats.find((seat) => !seat.food)) {
                error = 'Please enter a food preference for all your guests';
                return;
            };
        };
        error = '';
        console.log(JSON.stringify(guestGroup, null, 4))
    };
    const onGroupAttending = () =>{
        guestGroup.attending = true;
        seats.forEach(seat => {
            if (seat.attending === undefined) {
                seat.attending = true;
            };
        });
    };
    const onGroupNotAttending = () => {
        guestGroup.attending = false;
        seats.forEach(seat => {
            seat.attending = false;
        });
    };
</script>

<style>
    .rsvp-form {
        text-align: center
    }
</style>

<h1>RSVP</h1>
<div class="rsvp-form">
    <h2>{name}</h2>
    <Form on:submit={onFormSubmit}>
        <Container>
            <Row class="mb-1">
                <Col md={{ size: 6, offset: 3}}>
                    <Label for="groupAttendanceBtnGroup">Will you be able to attend?</Label>
                    <ButtonGroup id="groupAttendanceBtnGroup" role="group" class="w-100">
                        <Button type="button" active={guestGroup.attending} outline color="primary" on:click={onGroupAttending}>Yes</Button>
                        <Button type="button" active={guestGroup.attending === false} outline color="secondary" on:click={onGroupNotAttending}>No</Button>
                    </ButtonGroup>
                </Col>
            </Row>
            {#if guestGroup.attending !== undefined}
                <br>
                {#if guestGroup.attending }
                <Row>
                    <p>Geat! Please tell us a bit about each guest:</p>
                </Row>
                {#if error}
                    <Row>
                        <Col size={12}>
                            <Alert color="danger"><p class="m-0">{error}</p></Alert>
                        </Col>
                    </Row>
                {/if}
                {#each seats as seat, i}
                    <Row>
                        <Col>
                            <Label>Guest Name:
                                <Input invalid={error && !seat.name} feedback="Please enter this guest's name" bind:value={seat.name} placeholder={`Guest #${i+1}`}/>
                            </Label>
                        </Col>
                        <Col>
                            <Label for="guestAttendanceBtnGroup">Attending?</Label>
                            <ButtonGroup id="guestAttendanceBtnGroup" role="group" class="w-100">
                                <Button type="button" outline active={seat.attending} color="primary" on:click={() => (seat.attending = true)}>Yes</Button>
                                <Button type="button" outline active={seat.attending === false} color="secondary" on:click={() => (seat.attending = false)}>No</Button>
                            </ButtonGroup>
                        </Col>
                        <Col>
                            <Label for="foodPreferenceBtnGroup">Food Preference:</Label>
                            <ButtonGroup id="foodPreferenceBtnGroup" role="group" class="w-100">
                                <Button type="button" disabled={!seat.attending} outline active={seat.food === 'Beef'} color={error && !seat.food ? 'danger' : 'dark'} on:click={() => (seat.food = 'Beef')}>Beef</Button>
                                <Button type="button" disabled={!seat.attending} outline active={seat.food === 'Chicken'} color={error && !seat.food ? 'danger' : 'dark'} on:click={() => (seat.food = 'Chicken')}>Chicken</Button>
                                <Button type="button" disabled={!seat.attending} outline active={seat.food === 'Vegitarian'} color={error && !seat.food ? 'danger' : 'dark'} on:click={() => (seat.food = 'Vegitarian')}>Vegitarian</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                {/each}
                {:else}
                    <Row>
                        <p>We're sorry to hear that! Click the button below to let us know.</p>
                    </Row>
                {/if}
                <Button color="light" class="mt-1">Submit</Button>
            {/if}


        </Container>
    </Form>
</div>
