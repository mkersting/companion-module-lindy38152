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
					default: 7,
					min: 0,
					max: 10,
				},
			],
			callback: (feedback) => {
				console.log('Feedback called With Number.', feedback.options.num)
				// Check if Device has answered and return true or false
				if (2< feedback.options.num) {
					feedback.options.label= feedback.options.num
					return true
				} else {

					return false
				}
			},
		},
	})
}
