const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		PortStatus: {
			name: 'Port Connection Status',
			type: 'boolean',
			label: 'Status of a specific input/output port',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0), // Red when disconnected
				color: combineRgb(255, 255, 255),
			},
			style: {
				bgcolor: combineRgb(0, 255, 0), // Green when connected
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'portType',
					type: 'dropdown',
					label: 'Port Type',
					default: 'input',
					choices: [
						{ id: 'input', label: 'Input' },
						{ id: 'output', label: 'Output' },
					],
				},
				{
					id: 'port',
					type: 'number',
					label: 'Port Number',
					min: 1,
					max: 4,
					default: 1,
				},
			],
			callback: (feedback) => {

				console.log('Feedback Called!')
				const { portType, port } = feedback.options
				const status = self.portStatus?.[portType]?.[port]
				
				console.log(`Feedback check: ${portType} ${port} → ${status}`)

				return status === true
			},
		},
	})
}
