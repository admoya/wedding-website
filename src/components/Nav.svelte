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
    const routes = ['event', 'gallery', 'updates', 'playlist', 'rsvp'];
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
        min-height: 57px;
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

<Navbar class="navContainer" color="white" light expand="lg">
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="lg" on:update={handleUpdate}>
        <Nav navbar>
            <NavItem><NavLink on:click={() => isOpen = false} active={isActivePage()} aria-current="{isActivePage() ? 'page' : undefined}" href="/">home</NavLink></NavItem>
            {#each routes as route }
                <NavItem>
                    <NavLink on:click={() => isOpen = false} active={isActivePage(`/${route}`)} aria-current="{isActivePage(`/${route}`) ? 'page' : undefined}" href={`/${route}`}>{route}</NavLink>
                </NavItem>
            {/each}
        </Nav>
    </Collapse>
    <NavbarBrand href="/"><div class="headerMessage p-2">{`${names} · 11.13.21`}</div></NavbarBrand>
</Navbar>