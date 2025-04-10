// ws-helper.js

function sendWsCommand(self, commandObject) {
	if (self.ws && self.ws.readyState === self.ws.OPEN) {
		self.ws.send(JSON.stringify(commandObject))
		self.log('debug', `Sent WebSocket message: ${JSON.stringify(commandObject)}`)
	} else {
		self.log('warn', 'WebSocket not connected')
	}
}

module.exports = { sendWsCommand }