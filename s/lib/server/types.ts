
import {Disposer, Subby} from "@e280/stz"
import {Base64, Id} from "../common/types.js"

export type Member = {
	id: Id
	onMessage: Subby<[from: Id, message: Base64]>
}

export type App = {
	members: Map<Id, Member>
}

export type Agent = {
	dispose: Disposer
	id: Id | undefined
	sendToClientside: (from: Id, message: Base64) => void
}

