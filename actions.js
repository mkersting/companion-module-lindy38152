const { sendWsCommand } = require('./ws-helper')

module.exports = function (self) {
	self.setActionDefinitions({
		sample_action: {
			name: 'My First Action',
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Test',
					default: 5,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				console.log('Hello world!', event.options.num)
			},
		},
		switch_output: {
			name: 'Output Switch',
			options: [
				{
					id: 'input',
					type: 'number',
					label: 'Input-Channel',
					default: 1,
					min: 1,
					max: 4,
				},
				{
					id: 'output',
					type: 'number',
					label: 'Output-Channel',
					default: 1,
					min: 1,
					max: 4,
				},
			],
			callback: async (event) => {
				console.log('Switch Input To Output Channel: ', event.options.output)
				this.selectedInput = event.options.input
				this.selectedOutput = event.options.output
				// console.log('Selected Input: ', this.selectedInput)
				// console.log('Selected Output: ', this.selectedOutput)


				//====================
				//Websocket Send

				sendWsCommand(self, {
					command: 'switch',
					input: event.options.input,
					output: event.options.output,
				})


				//if (self.ws && self.ws.readyState === WebSocket.OPEN) {
				//	self.ws.send(JSON.stringify({
				//		command: 'switch',
				//		input: this.selectedInput,
				//		output: this.selectedOutput,
				//	}))
				//}
				//else {
				//	self.log('warn', 'WebSocket not connected')
				//}

				//====================



				self.checkFeedbacks()
			},
		},
		request_status: {
			name: 'Request Status of Iutput',
			options: [
				{
					type: 'number',
					id: 'sinput',
					label: 'Input Number',
					min: 1,
					max: 4,
					default: 1,
				},
			],
			callback: async ({ options }) => {

				sendWsCommand(self, {
					command: 'status',
					output: parseInt(options.sinput),
				})

				//const msg = {
				//	command: 'status',
				//	output: parseInt(options.output),
				//}

				//if (self.ws && self.ws.readyState === WebSocket.OPEN) {
				//	self.ws.send(JSON.stringify(msg))
				//	self.log('info', `Sent status request for output ${options.output}`)
				//} else {
				//	self.log('error', 'WebSocket not connected')
				//}
			},
		},
	})
}
