<script>
    import { Label, Col, Row, ButtonGroup, Button, Card, CardHeader, CardTitle, CardBody, Input } from 'sveltestrap';
    export let seat;
    export let error;
    export let index;

    let editingName = false;
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


<Row class="mb-3">
    <Card class="p-0">
        <CardHeader>
            <CardTitle>
                {#if editingName}
                    <Input
                        class="border-top-0 border-start-0 border-end-0 d-inline w-auto"
                        type="text"
                        bind:value={seat.name}
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
                    {seat.name || `Guest #${index+1}`}
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
        </CardHeader>
        <CardBody>
            <Row>
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
                        <Button type="button" disabled={!seat.attending} outline active={seat.food === 'Beef'} color={seat.attending && error && !seat.food ? 'danger' : 'dark'} on:click={() => (seat.food = 'Beef')}>Beef</Button>
                        <Button type="button" disabled={!seat.attending} outline active={seat.food === 'Chicken'} color={seat.attending && error && !seat.food ? 'danger' : 'dark'} on:click={() => (seat.food = 'Chicken')}>Chicken</Button>
                        <Button type="button" disabled={!seat.attending} outline active={seat.food === 'Vegitarian'} color={seat.attending && error && !seat.food ? 'danger' : 'dark'} on:click={() => (seat.food = 'Vegitarian')}>Vegitarian</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </CardBody>
    </Card>
</Row>