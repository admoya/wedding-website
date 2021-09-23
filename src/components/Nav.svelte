<script>
    export let path;
    import {
        Collapse,
        Navbar,
        NavbarToggler,
        NavbarBrand,
        Nav,
        NavItem,
        NavLink,
    } from 'sveltestrap/src';
    import { browser } from '$app/env';
    let isOpen = false;

    function handleUpdate(event) {
        isOpen = event.detail.isOpen;
    }

    $: isActivePage = (segment) => segment ? path.includes(segment) : path === '/';

    let width;
    $: names = (width < 350) ? 'A + J' : 'Adrian + Jenny';
</script>

<svelte:window bind:innerWidth={width}/>

<style>
    :global([aria-current]) {
        position: relative;
        display: inline-block;
    }
    :global([aria-current]::after) {
        position: absolute;
        content: '';
        width: calc(100% - 1em);
        height: 2px;
        background-color: rgb(255,62,0);
        display: block;
        bottom: -1px;
    }
    :global(.navContainer) {
        border-bottom: 1px solid rgba(255,62,0,0.1);
    }
    :global(.nav-item) {
        width: fit-content;
    }
    .headerMessage {
        font-family: "Brush Script MT", cursive;
        font-size: 1.5rem;
        color: black;
    }
    :global(.navbar-brand)
        {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 0;
        }
</style>

<Navbar class="navContainer" color="white" light expand="md">
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
        <Nav navbar>
            <NavItem><NavLink on:click={() => isOpen = false} active={isActivePage()} aria-current="{isActivePage() ? 'page' : undefined}" href="/">home</NavLink></NavItem>
            <NavItem><NavLink on:click={() => isOpen = false} active={isActivePage('/event')} aria-current="{isActivePage('/event') ? 'page' : undefined}" href="/event">event</NavLink></NavItem>
            <NavItem><NavLink on:click={() => isOpen = false} active={isActivePage('/gallery')} aria-current="{isActivePage('/gallery') ? 'page' : undefined}" href="/gallery">gallery</NavLink></NavItem>
            <NavItem><NavLink on:click={() => isOpen = false} active={isActivePage('/updates')} rel=prefetch aria-current="{isActivePage('/updates') ? 'page' : undefined}" href="/updates">updates</NavLink></NavItem>
            <NavItem><NavLink on:click={() => isOpen = false} active={isActivePage('/rsvp')} aria-current="{isActivePage('/rsvp') ? 'page' : undefined}" href="/rsvp">rsvp</NavLink></NavItem>
        </Nav>
    </Collapse>
    <NavbarBrand href="/"><div class="headerMessage p-2">{`${names} · 11.13.21`}</div></NavbarBrand>
</Navbar>