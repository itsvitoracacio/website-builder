export class HttpReqs {
	constructor() {
		this.endpoint = ''
	}

	async sendGetRequest() {
		return await this.sendHttpRequest('GET')
	}

	async sendPostRequest(whatToPost) {
		return await this.sendHttpRequest('POST', whatToPost)
	}

	async sendPutRequest(whatToUpdate, newContent) {
		return await this.sendHttpRequest('PUT', { whatToUpdate, newContent })
	}

	async sendDeleteRequest(whatToDelete) {
		return await this.sendHttpRequest('DELETE', whatToDelete)
	}

	async sendHttpRequest(httpMethod, reqBody) {
		try {
			const res = await fetch(
				this.endpoint,
				httpMethod === 'GET'
					? {
							method: 'GET',
							headers: { 'Content-Type': 'application/json' },
					  }
					: {
							method: httpMethod,
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(reqBody),
					  }
			)
			const data = await res.json()
			return data
		} catch (err) {
			console.log(err)
		}
	}
}
