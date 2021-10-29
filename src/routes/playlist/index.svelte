<script context="module">
    export const ssr = false;
    export async function load({ page: {query, host, path}, fetch }) {
        const redirectUri = `${host.includes('localhost') ? 'http' : 'https'}://${host}${path}`;
        // const redirectUri = `https://example.com`;
        let authRes;
        if (query.has('code')) {
            authRes = await fetch(
                '/playlist/authorize',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        code: query.get('code'),
                        redirectUri
                    }),
                    headers: {
                        'content-type': 'application/json',
                    }
                }
            );
            return { status: 301, redirect: '/playlist' };
        }
        else {
            authRes = await fetch('/playlist/authorize');
        }
        return { props: { authorized: authRes.status === 200, redirectUri } };
    }
</script>

<script>
    export let authorized;
    export let redirectUri;
    import { Input, Label, ListGroup, ListGroupItem } from 'sveltestrap/src';
    import { debounce } from 'lodash-es';
    import { slide } from 'svelte/transition';
    let searchText = '';
    let loading = false;
    let results = [];
    const clearResults = () => {
        loading = false;
        results = [];
    }
    const getResults = debounce(async (name) => {
        loading = true;
        const res = await fetch(`/playlist/search?name=${encodeURIComponent(name)}`);
        results = await res.json();
        loading = false;
    }, 1000);
    const handleSongClick = async (id) => {
        searchText = '';
        const res = await fetch(
            `/playlist/track`,
            {
                method: 'POST',
                body: JSON.stringify({ id })
            }
        );
    };
    $: searchText ? getResults(searchText) : clearResults();
</script>

<h1>Reception Playlist</h1>
<p>This is the playlist that we will give to the DJ for the reception! We want everyone to add songs, so think of this as a jukebox.</p>
{#if !authorized}
    <p>To add songs, you must <a href={`https://accounts.spotify.com/authorize?client_id=ac55dd2685d344f19a4214fd2cd4e836&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=playlist-modify-public`}>log into Spotify</a></p>
{/if}
<Label for="songSearch">Add Songs</Label>
<Input type='search' name='songSearch' id='songSearch' placeholder='Type the name of a song' bind:value={searchText} />
{#if !loading && results.length }
    <div in:slide out:slide>
        <ListGroup>
            {#each results as result}
                <ListGroupItem tag="button" action on:click={() => handleSongClick(result.id)}>{`Artist: ${result.artist}, Song: ${result.name}`}</ListGroupItem>
            {/each}
        </ListGroup>
    </div>
{/if}
<br>
<iframe title="Moya Wedding Playlist" src="https://open.spotify.com/embed/playlist/6XM5M0UDaEl9yAQGYybKUE?theme=0" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>