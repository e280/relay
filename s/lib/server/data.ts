
import {Kv} from "@e280/kv"
import {collect, isHappy, lane} from "@e280/stz"

import {makeId} from "./utils/make-id.js"
import {ChannelId, Data, PostData, PostId, PostKey, postKey} from "./types.js"

export function makeData(root: Kv): Data {
	return {
		root,
		mutex: lane(),
		next: root.cell("next"),
		posts: root.scope<PostData>("posts"),
		indexPostKeysByIds: root.scope<PostKey>("postKeysByIds"),
		indexPostKeysByChannel: channelId => root.scope<true>("postKeysByChannel", channelId),
	}
}

export async function savePost(data: Data, postParams: Omit<PostData, "id">) {
	return await data.mutex(async() => {
		const postData: PostData = {...postParams, id: makeId()}
		const n = await data.next.get() ?? 0
		const key = postKey(n)
		await data.root.commit([
			data.next.op.set(n + 1),
			data.posts.op.set(key, postData),
			data.indexPostKeysByIds.op.set(postData.id, key),
			data.indexPostKeysByChannel(postData.channelId).op.set(key, true),
		])
		return postData.id
	})
}

export async function getPosts(data: Data, channelId: ChannelId, cursor?: PostId) {
	const start = cursor && await data.indexPostKeysByIds.get(cursor)
	const postKeys = await collect(data.indexPostKeysByChannel(channelId).keys({start}))
	const posts = await data.posts.getMany(postKeys)
	const removeTheCursorPost = (post: PostData) => cursor ? (post.id !== cursor) : true
	return posts
		.filter(isHappy)
		.filter(removeTheCursorPost)
}

