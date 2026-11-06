
import {createServer} from "node:http"
import {disposer, pubby} from "@e280/stz"
import {websockets} from "@e280/renraku/node"
import {wire, connect, Messenger, makeEndpoint} from "@e280/renraku"

import {ClientApi} from "./lib/client/api.js"
import {makeServerApi} from "./lib/server/api.js"
import {Agent, App} from "./lib/server/types.js"
import {Base64, Id} from "./lib/common/types.js"

const app: App = {members: new Map()}

createServer().on("upgrade", websockets(async websocket => {
	const sendToClientside = pubby<[from: Id, message: Base64]>()
	const agent: Agent = {
		id: undefined,
		dispose: disposer(),
		sendToClientside,
	}

	const connection = await connect(websocket)
	const endpoint = makeEndpoint(makeServerApi(app, agent))
	const messenger = new Messenger<ClientApi>(endpoint)
	wire({connection, messenger})

	const stopRelaying = sendToClientside.on(
		(from, message) => messenger.remote.message(from, message)
	)

	connection.onClose(() => {
		stopRelaying()
		agent.dispose()
	})
})).listen(8080)

