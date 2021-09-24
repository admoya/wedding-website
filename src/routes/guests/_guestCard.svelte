
<script>
    import { isEqual } from 'lodash-es';
    import {
        Card,
        CardHeader,
        CardTitle,
        CardBody,
        Container,
        Row,
        Col,
        Form,
        Label,
        Input,
        ButtonGroup,
        Button,
    } from 'sveltestrap/src';
    import { submitGuestChanges } from '../../utils';

    export let guest = {};
    export let index;
    export let refreshRemote;
    export let remoteGuests;

    if (!guest.seats)
        guest.seats = [];

    let loading = false;
    const submitGuest = async (guest) => {
        loading = true;
        await submitGuestChanges(guest);
        await refreshRemote();
        loading = false;
    };
    let editingName = false;
    let seatsCollapsed = true;

    $: hasBeenChanged = !isEqual(guest, remoteGuests.find((rg) => rg.id === guest.id));

    const debug = () => {
        console.log(`hasBeenChanged: ${hasBeenChanged}`);
        console.log(`Local Guest: \n${JSON.stringify(guest, null, 2)}`);
        console.log(`Remote Guest: \n${JSON.stringify(remoteGuests.find((rg) => rg.id === guest.id), null, 2)}`);
    }
</script>

<style>
    .nameEditBtn {
        width: 2em;
        height: 2em;
        border: 0;
        background-color: transparent;
        margin-right: -2em;
    }
    .nameEditInput {
        border-top: 0;
        border-left: 0;
        border-right: 0;
    }
    .nameEditIcon {
        font-size: smaller;
        color: black;
    }
</style>



<Card class="mt-3">
    <CardHeader>
        <Container>
            <Row>
                <Col>
                    <CardTitle>
                        {#if editingName}
                            <Input
                                class="border-top-0 border-start-0 border-end-0 d-inline w-auto"
                                type="text"
                                bind:value={guest.name}
                                placeholder="Enter this guest's name"
                                on:keydown={({key}) => {
                                    if ( key === 'Enter' || key === 'Escape')
                                        editingName = false;
                                    return false;
                                }}
                                on:blur={() => editingName = false}
                                autofocus
                            />
                        {:else}
                            {guest.name || `Guest #${index+1}`}
                        {/if}
                        <button
                            type="button"
                            color="light"
                            class="nameEditBtn"
                            on:click={() => {
                                editingName = !editingName;
                                window.focus()
                            }}
                        >
                            <i class={`nameEditIcon fas ${editingName ? 'fa-check' : 'fa-edit'}`} />
                        </button>
                    </CardTitle>
                </Col>
                <Col class="d-flex justify-content-end">
                    <Button type="button" outline color="dark" size="sm" on:click={debug}><CardTitle class="text-end">{`ID: ${guest.id}`}</CardTitle></Button>
                </Col>
            </Row>
        </Container>
    </CardHeader>
    <CardBody>
        <Form on:submit={(e) => {e.preventDefault(); submitGuest(guest)}}>
            <Row>
                <Col size={2}>
                    <Label for={`guest-${index}-attendanceBtns`}>Attending:</Label>
                    <ButtonGroup id={`guest-${index}-attendanceBtns`} role="group">
                        <Button type="button" outline active={guest.attending} color="primary" on:click={() => (guest.attending = true)}>Yes</Button>
                        <Button type="button" outline active={guest.attending === false} color="secondary" on:click={() => (guest.attending = false)}>No</Button>
                        <Button type="button" outline active={guest.attending === undefined} color="secondary" on:click={() => (guest.attending = undefined)}>Unknown</Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <Row class="pt-1">
                <Col class="d-inline-flex">
                    <h4 class="mb-0">{`Seats (${guest.seats.length}): `}</h4>
                    <Button class="ms-2" type="button" size="sm" on:click={() => seatsCollapsed = !seatsCollapsed}>{seatsCollapsed ? 'Expand' : 'Collapse'}</Button>
                </Col>
            </Row>
            {#if !seatsCollapsed}
                {#each guest.seats as seat, i}
                    <Row class="mt-2">
                        <Col>
                            <Label>Guest Name:
                                <Input bind:value={seat.name} placeholder={`Guest #${i+1}`}/>
                            </Label>
                        </Col>
                        <Col>
                            <Label for={`guest#${index}-seat#${i}-attendance`}>Attending?</Label>
                            <ButtonGroup id={`guest#${index}-seat#${i}-attendance`} role="group" class="w-100">
                                <Button type="button" outline active={seat.attending} color="primary" on:click={() => (seat.attending = true)}>Yes</Button>
                                <Button type="button" outline active={seat.attending === false} color="secondary" on:click={() => {seat.attending = false; seat.food=undefined}}>No</Button>
                                <Button type="button" outline active={seat.attending === undefined} color="secondary" on:click={() => {seat.attending = undefined; }}>Unknown</Button>
                            </ButtonGroup>
                        </Col>
                        <Col>
                            <Label for={`guest#${index}-seat#${i}-food`}>Food Preference:</Label>
                            <ButtonGroup id={`guest#${index}-seat#${i}-food`} role="group" class="w-100">
                                <Button type="button" disabled={seat.attending === false} outline active={seat.food === 'Beef'} on:click={() => (seat.food = 'Beef')}>Beef</Button>
                                <Button type="button" disabled={seat.attending === false} outline active={seat.food === 'Chicken'} on:click={() => (seat.food = 'Chicken')}>Chicken</Button>
                                <Button type="button" disabled={seat.attending === false} outline active={seat.food === 'Vegetarian'} on:click={() => (seat.food = 'Vegetarian')}>Vegetarian</Button>
                            </ButtonGroup>
                        </Col>
                        <Col xs={{ size: 1 }}>
                            <Label for={`guest#${index}-seat#${i}-deleteBtn`}>Delete</Label>
                            <Button class="w-100" type="button" on:click={() => guest.seats = guest.seats.filter((s) => s !== seat)}><i class="fas fa-trash"></i></Button>
                        </Col>
                    </Row>
                {/each}
                <Row class="mt-2">
                    <Col xs={{ size: 8, offset: 2 }}>
                        <Button class="w-100" type="button" on:click={() => { guest.seats = [...guest.seats, { name: '' }]}}>Add Seat</Button>
                    </Col>
                </Row>
            {/if}
            <Row class="mt-3">
                <Col xs={{ size: 10, offset: 1 }}>
                    <Button class="w-100" disabled={loading || !hasBeenChanged }>Save</Button>
                </Col>
            </Row>
        </Form>
    </CardBody>
</Card>