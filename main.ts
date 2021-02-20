IP_NETWORK.ontarget(function (text, number) {
    IP_NETWORK.sendmvalue(1, "a", 170)
    IP_NETWORK.sendmessege(1, "Hello!")
})
IP_NETWORK.onreceived(function (receivedtext) {
	
})
IP_NETWORK.oninit(1, 1)
