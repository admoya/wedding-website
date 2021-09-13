import posts from './_posts.js';

const contents = JSON.stringify(posts.map(post => {
	return {
		title: post.title,
		slug: post.slug
	};
}));

export function get() {
	return {
		headers: {
			'Content-Type': 'application/json'
		},
		body: contents
	}
}