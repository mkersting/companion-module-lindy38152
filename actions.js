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
				
				//Websocket Send

				sendWsCommand(self, {
					msgtype: 'companion',
					command: 'switch',
					input: event.options.input,
					output: event.options.output,
				})


			},
		},
		request_status: {
			name: 'Request Status of Port',
			options: [
				{
					type: 'dropdown',
					id: 'portType',
					label: 'Port Type',
					default: 'input',
					choices: [
						{ id: 'input', label: 'Input' },
						{ id: 'output', label: 'Output' },
					],
				},
				{
					type: 'number',
					id: 'statusport',
					label: 'Port Number',
					min: 1,
					max: 4,
					default: 1,
				},
			],
			callback: async ({ options }) => {

				sendWsCommand(self, {
					msgtype: 'companion',
					command: 'status',
					direction: options.portType, // 'input' or 'output'
					port: parseInt(options.statusport),
				})
				
			},
		},
	})
}
