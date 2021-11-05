<style>
    h3 {
        text-align: center;
    }
</style>
<script>
    import { page } from '$app/stores'
    const isAttending = $page.query.has('attending');
</script>
<h1>Thank You!</h1>
<h3>We have received your RSVP.</h3>
{#if isAttending}
    <p>We look forward to seeing you at the event!</p>
    <p>For information about the venue, including how to book a room for the weekend, check out our <a href="/event">event page</a>.</p>
    <p>You can find our registry information <a href="/updates/gifts">here</a>.</p>
    <p>We will be posting updates leading up to event on this website. Check them out <a href="/updates">here</a>.</p>
{:else}
    <p>We'll miss you at the event, but we'll make sure to take lots of pictures!</p>
{/if}