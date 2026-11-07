
import {Post} from "../server/types.js"

export type ClientApi = ReturnType<typeof makeClientApi>

export const makeClientApi = () => ({
	async post(post: Post) {
		// TODO:
		void post
	}
})

