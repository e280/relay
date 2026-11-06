
import {asFns} from "@e280/renraku"
import {got, guarantee, subby} from "@e280/stz"
import {Base64, Id} from "../common/types.js"
import {Agent, App, Member} from "./types.js"
import {verifyAccessToken} from "./utils/verify-access-token.js"

export type ServerApi = ReturnType<typeof makeServerApi>

export const makeServerApi = (app: App, agent: Agent) => asFns({
	async connect(token: string) {
		const {id} = await verifyAccessToken(token)
		agent.id = id
		const member = guarantee(app.members, id, () => (<Member>{id, onMessage: subby()}))
		agent.dispose.schedule(
			member.onMessage(agent.sendToClientside)
		)
	},

	async send(to: Id, message: Base64) {
		const from = got(agent.id)
		const recipient = app.members.get(to)
		if (recipient)
			recipient.onMessage.publish(from, message)
	},
})

