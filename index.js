const makeWASocket = require("@adiwajshing/baileys").default
const qrcode = require("qrcode-terminal")
const { delay , useSingleFileAuthState } = require("@adiwajshing/baileys")
const { state, saveState } = useSingleFileAuthState('./family-session.json')

function qr() {
	let conn = makeWASocket({
		auth: state,
		printQRInTerminal: true,
	})
	conn.ev.on("connection.update", async (s) => {
		const { connection, lastDisconnect } = s
		if (connection == "open") {
			await delay(1000 * 10)
			process.exit(0)
		}
		if (
			connection === "close" &&
			lastDisconnect &&
			lastDisconnect.error &&
			lastDisconnect.error.output.statusCode != 401
			) {
			qr()
		}
	})
	conn.ev.on('creds.update', saveState)
	conn.ev.on('messages.upsert', () => { })
}
qr()
