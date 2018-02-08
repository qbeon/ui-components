const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export default function randomString(len) {
	len = len ? len : 8
	let text = ''
	for (let index = 0; index < len; index++) {
		text += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return text
}
