<script context="module">
    export async function load({ page: {params: { id }}, fetch }) {
        const guestGroup = await (await fetch(`/guests/${id}`)).json();
        return { props: { guestGroup } };
    }
</script>

<script>
    import { Form, Label, Container, Col, Row, ButtonGroup, Button, Input, Alert, Card, CardHeader, CardTitle, CardBody } from 'sveltestrap/src';
    import { page } from '$app/stores';
    import GuestCard from './_guestCard.svelte';
    import { submitGuestChanges } from '../../utils';
    import { fade } from 'svelte/transition';

    export let guestGroup = {};
    const { id } = $page.params;
    const { name, seats } = guestGroup;
    let errors = [];
    let loading = false;
    const onFormSubmit = async (e) => {
        e.preventDefault();
        errors = [];
        if (guestGroup.attending) {
            if (seats.find((seat) => !seat.name)) {
                errors.push('Please enter a name for all your guests');
            };
            if (seats.find((seat) => seat.attending && !seat.food)) {
                errors.push('Please enter a food preference for attending guests');
            };
            if (errors.length) {
                document.getElementById('errorAlertAnchor').scrollIntoView({ behavior: 'smooth'});
                return
            };
        };
        loading = true;
        try {
            await submitGuestChanges({...guestGroup, id });
            window.location.href = `/rsvp/confirmation${guestGroup.attending ? '?attending' : ''}`;
        } catch (ex) {
            console.error(ex);
            errors.push('Sorry, something went wrong. Please try again later.');
            loading = false;
        }
    };
    const onGroupAttending = () =>{
        guestGroup.attending = true;
        seats.forEach(seat => {
            seat.attending = true;
        });
    };
    const onGroupNotAttending = () => {
        guestGroup.attending = false;
        seats.forEach(seat => {
            seat.attending = false;
            seat.food = undefined;
        });
    };
</script>

<style>
    .rsvp-form {
        text-align: center;
    }
    :global(.btn.btn-primary) {
        border-color: midnightblue !important;
        background-color: midnightblue !important;
    }
    :global(.btn.btn-primary:hover) {
        background-color: rgb(22, 22, 97) !important;
    }
    :global(.btn.btn-primary:focus) {
        box-shadow: 0 0 0 0.25rem rgba(25, 25, 112, 25%);
    }
    :global(.alert-info) {
        background-color: mistyrose !important;
    }
</style>

<svelte:head>
	<title>RSVP</title>
</svelte:head>

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
                    <div in:fade>
                        <Row>
                            <p>Great! Please tell us a bit about each guest.</p>
                        </Row>
                        <div id="errorAlertAnchor">
                            {#each errors as error}
                                <Row>
                                    <Col size={12}>
                                        <Alert id='errorAlert' color="danger"><p class="m-0">{error}</p></Alert>
                                    </Col>
                                </Row>
                            {/each}
                        </div>
                        <Row>
                            <Alert color="info" dismissible>
                                <p class="m-0">Guests must provide a negative COVID test. For more information, click <a target="_blank" href="/updates/a-note-about-covid">here</a>.</p>
                            </Alert>
                        </Row>
                        {#each seats as seat, i}
                            <GuestCard bind:seat error={errors.length} index={i} />
                        {/each}
                        <Row class="mb-3">
                            <Card class="p-0">
                                <CardHeader><CardTitle>Contact Info</CardTitle></CardHeader>
                                <CardBody>
                                    <Label for="emailInput">Please provide an email address that we can use to contact you for any important updates.</Label>
                                    <Input id="emailInput" required autocomplete="email" type="email" placeholder="someone@example.com" bind:value={guestGroup.email}/>
                                </CardBody>
                            </Card>
                        </Row>
                        <Row class="mb-3">
                            <Card class="p-0">
                                <CardHeader><CardTitle>Comments or Requests</CardTitle></CardHeader>
                                <CardBody>
                                    <Label for="notesInput">Any comments you'd like to pass along to us?</Label>
                                    <Input id="notesInput" type="textarea" placeholder="Dietary restrictions, special requests, and so on." bind:value={guestGroup.notes}/>
                                </CardBody>
                            </Card>
                        </Row>
                        <Row>
                            <Button disabled={loading} color="primary">Submit</Button>
                        </Row>
                    </div>
                {:else}
                    <div in:fade>
                        <Row>
                            <p>We're sorry to hear that! Click the button below to let us know.</p>
                        </Row>
                        <Row>
                            <Col md={{size: 4, offset: 4}}>
                                <Button class="w-100" disabled={loading} color="primary">Submit</Button>
                            </Col>
                        </Row>
                    </div>
                {/if}
            {/if}


        </Container>
    </Form>
</div>
