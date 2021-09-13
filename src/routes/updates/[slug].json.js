import posts from './_posts.js';

const lookup = new Map();
posts.forEach(post => {
	lookup.set(post.slug, JSON.stringify(post));
});
console.log(lookup);


export function get({ params }) {
	const { slug } = params;

	if (lookup.has(slug)) {
		return {
			headers: {
				'Content-Type': 'application/json'
			},
			body: lookup.get(slug)
		}
	} else {
		return {
			status: 404,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: `Not found`
			})
		}
	}
}
