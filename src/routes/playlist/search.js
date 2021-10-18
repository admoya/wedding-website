export async function get({ query }) {
    console.log(JSON.stringify(query.get('test')));
    return { body: {} };
};
