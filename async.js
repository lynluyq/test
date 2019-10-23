const async = require('async')

const listings = [1, 2, 3, 4, 5]
let tasks = []
listings.forEach(l => {
	tasks.push(callback => {
		callback(null, l+1)
	})
})
async.parallelLimit(tasks, 3, (err, listings) => {
	if (err) {
		console.log(err)
	} else {
		console.log(listings)
	}
})