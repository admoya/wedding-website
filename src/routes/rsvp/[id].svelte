<script context="module">
    export async function load({ page: {params: { id }}, fetch }) {
        const guestGroup = await (await fetch(`/guests/${id}`)).json();
        return { props: { guestGroup } };
    }
</script>

<script>
    import { Form, Label, Container, Col, Row, ButtonGroup, Button, Input, Alert, Card, CardHeader, CardTitle, CardBody } from 'sveltestrap';
    import { page } from '$app/stores';
    import GuestCard from './_guestCard.svelte';
    import { submitGuestChanges } from '../../utils';
    export let guestGroup = {};
    const { id } = $page.params;
    const { name, seats } = guestGroup;
    let error = '';
    let loading = false;
    const onFormSubmit = async (e) => {
        e.preventDefault();
        if (guestGroup.attending) {
                if (seats.find((seat) => !seat.name)) {
                error = 'Please enter a name for all your guests';
                document.getElementById('errorAlertAnchor').scrollIntoView({ behavior: 'smooth'});
                return;
            };
            if (seats.find((seat) => seat.attending && !seat.food)) {
                document.getElementById('errorAlertAnchor').scrollIntoView({ behavior: 'smooth'});
                error = 'Please enter a food preference for attending guests';
                return;
            };
        };
        loading = true;
        error = '';
        try {
            await submitGuestChanges({...guestGroup, id });
            window.location.href = '/rsvp/confirmation';
        } catch (ex) {
            console.error(ex);
            error = 'Sorry, something went wrong. Please try again later.';
        }
        loading = false;

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
        text-align: center;
    }
    :global(#rsvpSubmitBtn) {
        background-color: mediumpurple !important;
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
                <div id="errorAlertAnchor">
                    {#if error}
                        <Row>
                            <Col size={12}>
                                <Alert id='errorAlert' color="danger"><p class="m-0">{error}</p></Alert>
                            </Col>
                        </Row>
                    {/if}
                </div>
                {#each seats as seat, i}
                    <GuestCard bind:seat {error} index={i} />
                {/each}
                {:else}
                    <Row>
                        <p>We're sorry to hear that! Click the button below to let us know.</p>
                    </Row>
                {/if}
                <Row>
                    <Button disabled={loading} id="rsvpSubmitBtn">Submit</Button>
                </Row>
            {/if}


        </Container>
    </Form>
</div>
