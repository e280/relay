
import {Base64, Id} from "../common/types.js"

export type ClientApi = ReturnType<typeof makeClientApi>

export const makeClientApi = () => ({
	async message(from: Id, message: Base64) {
		// TODO:
		void from
		void message
	}
})

