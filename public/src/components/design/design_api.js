import { HttpReqs } from '../api/httpReq'

export class PieceTypeCrud extends HttpReqs {
	constructor(pieceType) {
		super()
		this.endpoint = `/api/pieces/elements/${pieceType.toLowerCase()}`
	}

	async readPiecesOfType() {
		return await this.sendGetRequest(this.endpoint)
	}
}

export class PieceCrud extends HttpReqs {
	constructor({ pieceType, pieceName }) {
		super()
		this.endpoint = `/api/pieces/elements/${pieceType.toLowerCase()}/${pieceName}`
	}

	async readVariantsOfPiece() {
		return await this.sendGetRequest()
	}
}

export class VariantCrud extends HttpReqs {
	constructor({ pieceType, pieceName }) {
		super()
		this.endpoint = `/api/pieces/elements/${pieceType.toLowerCase()}/${pieceName}`
	}

	async createVariant(newVariantName) {
		return await this.sendPostRequest({ newVariantName })
	}

	async readDeclarationBlockOfVariant(variantToRead) {
		const res = await this.sendGetRequest()
		return res[variantToRead]
	}

	async updateVariantName(currentVariantName, newVariantName) {
		return await this.sendPutRequest(/* something here */)
	}

	async updateVariantDeclarationBlock(variantToUpdate, newDeclarationBlock) {
		return await this.sendPutRequest({ variantToUpdate, newDeclarationBlock })
	}

	async deleteVariant(variantToDelete) {
		return await this.sendDeleteRequest({ variantToDelete })
	}
}
