const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')

const WebSocket = require('ws')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.ws = null
		this.config = {}

		this.portStatus = {
			input: {1: false, 2: false, 3: false, 4: false},   // { 1: true/false, 2: true/false, ... }
			output: {1: false, 2: false, 3: false, 4: false},
		}
	}



	async init(config) {
		this.config = config

		this.setupWebSocket()

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions




	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config

		if (this.socket) {
			this.socket.close()
		}

		this.setupWebSocket()
	}

	setupWebSocket() {
		// INITIALIZE WEBSOCKET CONNECTION
		if (this.ws) {
			this.ws.close()
			this.ws = null
		}

		const { host, port } = this.config
		const url = `ws://${host}:${port}`
		this.log('info', `Connecting to WebSocket server at ${url}`)

		// TODO CHANGE localhost to IP adress of Configuration
		// TODO CHANGE 15809 to Port of Configuration
		//this.ws = new WebSocket('ws://localhost:15809') // Or your Raspberry Pi's IP later
		try {
			this.ws = new WebSocket(url)

			this.ws.on('open', () => {
				this.log('info', 'WebSocket connection established')
				// Reset reconnect attempts after successful connection
				this.reconnectAttempts = 0
			})

			this.ws.on('message', (data) => {
				this.log('debug', `Received from server: ${data}`)
				// TODO: Handle message from server
				// HANDLE MESSAGE
				//const parsed = parser.parseStatusMessage(data)
				//
				//if (parsed && parsed.command === 'status_reply') {
				//	self.portStatus[parsed.type][parsed.port] = parsed.connected
				//	self.checkFeedbacksById('PortStatus')
				//}

				//console.log('TRY parse Data')
				try {
					const msg = JSON.parse(data)
					//console.log('parse Data')
					if (msg.feedback === 'PortStatus') {
						this.portStatus[msg.type][msg.port] = msg.connected
						// Delay feedback check to give Companion time to update internal state
						setTimeout(() => {
							this.checkFeedbacks()
						}, 50) // small delay (50ms)

						//console.log('SUCESS parse Data')
					}
				} catch (err) {
					this.log('error', `Failed to parse WS message: ${err.message}`)
				}

				//==============================
			})

			this.ws.on('error', (err) => {
				this.log('error', `WebSocket error: ${err.message}`)
			})

			this.ws.on('close', () => {
				this.log('warn', 'WebSocket connection closed')
				this.log("Trying to Reconnect...")

				if (this.config.enableReconnect) {
					this.scheduleReconnect()
				}
			})
		} catch (err) {
			this.log('error', `Failed to connect: ${err.message}`)
		}

		//END INITIALIZE WEBSOCKET CONNECTION
	}

	scheduleReconnect() {
		if (!this.reconnectAttempts) {
			this.reconnectAttempts = 0
		}

		const maxAttempts = parseInt(this.config.numberofreconnects) || 5

		if (this.reconnectAttempts < maxAttempts) {
			this.reconnectAttempts++
			this.log('info', `Reconnecting attempt ${this.reconnectAttempts} of ${maxAttempts}...`)

			setTimeout(() => {
				this.setupWebSocket()
			}, 2000) // try again in 2 seconds
		} else {
			this.log('error', `Max reconnect attempts (${maxAttempts}) reached.`)
		}
	}


	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
				default: "127.0.0.1",
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				regex: Regex.PORT,
				default: "1580",
			},
			{
				type: 'checkbox',
				id: 'enableReconnect',
				label: 'Automatically reconnect WebSocket if connection drops',
				default: true,
			},
			{
				type: 'number',
				id: 'numberofreconnects',
				label: 'Trys to reconnect',
				min: 1,
				max: 10,
				default: 5,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
