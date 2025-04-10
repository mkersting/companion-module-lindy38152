const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		ChannelState: {
			name: 'ChannelSwitchState',
			type: 'boolean',
			label: 'ChannelSwitchState',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'fb_channelswitch',
					type: 'number',
					label: 'FB_Channel',
					default: 1,
					min: 0,
					max: 4,
				},
			],
			callback: (feedback) => {
				//console.log('Feedback called With Number.', feedback.options.fb_channelswitch)
				console.log('Feedback Log Selected Input: ', this.selectedInput)
				console.log('Feedback Log Routed Input to Selected Output: ', this.selectedOutput)

				// Check if Device has answered and return true or false
				if (this.selectedInput == this.selectedOutput) {
					
					return true
				} else {

					return false
				}
			},
		},
	})
}
