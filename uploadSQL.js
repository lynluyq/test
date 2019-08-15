const mysqlConfig = require('./config/mysql')
const mysqlConnect = mysqlConfig.mysqlMultiConnect

// listingData - object
function uploadListing(listingData, table, action, where, callback) {
    // obtain all the columns
    let columnNames = []
    let sqlColumn = `SHOW COLUMNS FROM ${table}`
    mysqlConnect.query(sqlColumn, (err, columns) => { 
        if (err) {
			return callback({'message': err})
        }
        else {
            for (let k in columns) {
                columnNames.push(columns[k].Field)
            }
            let keys = Object.keys(listingData)
            if (keys.length === 0) {
                return callback({'message': 'no value to act on'})
            }

            let whereKeys = []
            let whereValues = []
            if (where) {
                for (let k in where) {
                    if (!(k in columnNames)) {
                        return callback({'message': 'restricting wrong column' + k})
                    }
                    whereKeys.push(k + ' = ? ')
                    whereValues.push(where[k])
                }
            }

            let updateKeys = []
            let values = []
            for (let k in listingData) {
                if (!(k in columnNames)) {
                    return callback({'message': 'wrong column' + k})
                }
                updateKeys.push(k + ' = ? ')
                values.push(listingData[k])
            }

            if (action.toLowerCase() == 'insert') {
                const sql = `INSERT INTO ${table} (${keys}) VALUES ?`
                mysqlConnect.query(sql, values, (err, result) => {
                    if (err) {
                        return callback({'message': err})
                    }
                    else {
                        return callback(null, null)
                    }
                })

            }
            else if (action.toLowerCase() == 'select') {
                const sql = `SELECT ${keys} FROM ${table} WHERE ` + whereKeys.join(' AND ')
                mysqlConnect.query(sql, [whereValues], (err, result) => {
                    if (err) {
                        return callback({'message': err})
                    }
                    else if (result.affectedRows === 0) {
                        return callback({'message': 'no row matched'})
                    }
                    else {
                        return callback(null, null)
                    }
                })
            }
            else if (action.toLowerCase() == 'update') {
                const sql = `UPDATE ${table} SET ` + updateKeys.join(', ') + ' WHERE ' + whereKeys.join(' AND ')
                // values.append(whereValues)
                mysqlConnect.query(sql, [values, whereValues], (err, result) => {
                    if (err) {
                        return callback({'message': err})
                    }
                    else if (result.affectedRows === 0) {
                        return callback({'message': 'user not matched'})
                    }
                    else {
                        return callback(null, null)
                    }
                })
            }
            else {
                return callback({ 'message': 'wrong action'})
            }
        }
    });


}

// valueList -- nested array
function insertIntoSameTable(table, columns, valueList, callback) {
    const sql = `INSERT INTO ${table} (${columns}) VALUES ?`
    mysqlConnect.query(sql, [valueList], (err, res) => {
        if (err) {
            return callback(err)
        }
        else {
            return callback(null, null)
        }
    })
}

function insertLineByLine(tablesList, columnsList, valueList, callback) {
    let queries = []
    for (let k in columnsList) {
        const sql = `INSERT INTO ${tablesList[k]} (${columnsList[k]}) VALUES (${valueList[k]})`
        queries.push(sql)
    }
    mysqlMultiConnect.query(queries.join(';'), [], (err, res) => {
        if (err) {
            return callback(err)
        }
        else {
            return callback(null, null)
        }
    })
}