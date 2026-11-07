
import {Kv} from "@e280/kv"
import {createServer} from "node:http"
import {disposer, pubby} from "@e280/stz"
import {websockets} from "@e280/renraku/node"
import {wire, connect, Messenger, makeEndpoint} from "@e280/renraku"

import {makeData} from "./lib/server/data.js"
import {ClientApi} from "./lib/client/api.js"
import {makeServerApi} from "./lib/server/api.js"
import {Agent, App, Post} from "./lib/server/types.js"

const app: App = {
	subscriptions: new Map(),
	data: makeData(new Kv()),
}

createServer().on("upgrade", websockets(async websocket => {
	const sendToClient = pubby<[post: Post]>()
	const agent: Agent = {
		dispose: disposer(),
		sendToClient,
	}

	const connection = await connect(websocket)
	const endpoint = makeEndpoint(makeServerApi(app, agent))
	const messenger = new Messenger<ClientApi>(endpoint)
	wire({connection, messenger})

	const stopRelaying = sendToClient.on(
		post => messenger.remote.post(post)
	)

	connection.onClose(() => {
		stopRelaying()
		agent.dispose()
	})
})).listen(8080)

