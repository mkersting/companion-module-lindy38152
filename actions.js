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
				self.checkFeedbacks()
			},
		},
		get_status: {
			name: 'Get_Status',
			options: [
				{
					id: 'status',
					type: 'number',
					label: 'Status',
					default: 1,
					min: 1,
					max: 4,
				},
			],
			callback: async (event) => {
				console.log('Try to get Status of Device, Callback if Positive answer.', event.options.status)
			},
		},
	})
}
