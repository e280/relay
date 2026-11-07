
import {Cell, Kv} from "@e280/kv"
import {Disposer, Lane, Pubby} from "@e280/stz"

export type AccessToken = string

export type ChannelId = string
export type Message = string
export type PostId = string
export type PostKey = string

export type App = {
	subscriptions: Map<ChannelId, Pubby<[post: Post]>>
	data: Data
}

export type Agent = {
	sendToClient: (post: Post) => void
	dispose: Disposer
}

export const postKey = (n: number) => n.toString().padStart(16, "0")

export type PostParams = {
	channelId: ChannelId
	message: Message
	lifespan: number
}

export type Post = {
	id: PostId
	message: Message
}

export type PostData = {
	id: PostId
	channelId: ChannelId
	message: Message
	expiresAt: number
}

export type Data = {
	mutex: Lane
	root: Kv
	next: Cell<number>
	posts: Kv<PostData>
	indexPostKeysByIds: Kv<PostKey>
	indexPostKeysByChannel: (channelId: ChannelId) => Kv<true>
}

