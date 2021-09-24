<script>
    import { Input, Label, Form } from 'sveltestrap/src';
    let password;
</script>

<h1>Admin Authorization</h1>
<Form action="/guests/authorize" method="POST">
    <Label for="passwordInput">Enter an admin password:</Label>
    <Input type="password" id="passwordInput" name="password" />
</Form>
