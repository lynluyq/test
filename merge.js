const async = require('async')
let taskList = []
let conversations = [1, 2, 3]
conversations.forEach(conversation => {
	taskList.push(callback => {
		return callback(null, [{test: conversation, type: 1}])
	})
})

conversations.forEach(conversation => {
	taskList.push(callback => {
		let validConversations = conversations.map(c => {
			return {test: c, type: 2}
		})
		return callback(null, validConversations)
	})
})

async.parallelLimit(taskList, 3, (err, itemList) => {
	if (err) {
		console.log(err)
	} else {
		function merge(array) {
			let res = []
			array.forEach(a => {
				a.forEach(e => {
					res.push(e)
				})
			})
			return res
		}
		console.log(merge(itemList))
	}
})