
import {asFns} from "@e280/renraku"
import {AccessToken, Agent, App, ChannelId, PostId, PostParams} from "./types.js"

export type ServerApi = ReturnType<typeof makeServerApi>

export const makeServerApi = (app: App, agent: Agent) => asFns({

	/** post a message to a channel. */
	async publish(post: PostParams) {},

	/** fetch posts for a channel. */
	async getPosts(accessToken: AccessToken, query: {channelId: ChannelId, cursor?: PostId}) {},

	/** listen for new messages on a channel. */
	async subscribe(channelId: ChannelId) {},

	/** stop listening. */
	async unsubscribe(channelId: ChannelId) {},
})

