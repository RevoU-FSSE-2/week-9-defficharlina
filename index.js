const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
//const redis = require('ioredis')
//require('dotenv').config()

const app = express()

const commonResponse = function (data, error) {
    if (error) {
        return {
            success: false,
            error: error
        }
    }

    return {
        success: true,
        data: data
    }
}

/*const redisCon = new redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})*/

const mysqlCon = mysql.createConnection({
//setelah deploy host: 'localhost' diganti ips private saat proses deploy ke fly.io
    host: 'fdaa:2:cafd:a7b:80:292d:8642:2', 
    port: '3306',
    user: 'root',
    password: '1234',
    database: 'mbanking'
})

const query = (query, values) => {
    return new Promise((resolve, reject) => {
        mysqlCon.query(query, values, (err, result, fields) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

mysqlCon.connect((err) => {
    if (err) throw err

    console.log("mysql successfully connected")
})

app.use(bodyParser.json())

app.get('/user', (request, response) => {
    mysqlCon.query("select * from mbanking.user", (err, result, fields) => {
        if (err) {
            console.error(err)
            response.status(500).json(commonResponse(null, "server error"))
            response.end()
            return
        }

        response.status(200).json(commonResponse(result, null))
        response.end()
    })
})

app.get('/user/:id', async (request, response) => {
    try {
        const id = request.params.id
        /*const userKey = "user:" + id
        const cacheData = await redisCon.hgetall(userKey)

        if (Object.keys(cacheData).length !== 0) {
            console.log("get data from cache")
            response.status(200).json(commonResponse(cacheData, null))
            response.end()
            return
        }*/

        const dbData = await query(`select
        u.id,
        u.name, 
        u.adress,  
        sum(case when t.type = 'income' then t.amount else 0 end) as total_income,
        sum(case when t.type = 'expense' then t.amount else 0 end) as total_expense
    from 
        mbanking.user as u
        left join mbanking.transaction as t
        on u.id = t.user_id
    where 
        u.id = ?
    group by 
        u.id`, id)

        const userBalance = dbData[0].total_income - dbData[0].total_expense
        dbData[0].balance = userBalance

        /*await redisCon.hset(userKey, dbData[0])
        await redisCon.expire(userKey, 20);*/

        response.status(200).json(commonResponse(dbData[0], null))
        response.end()
    } catch (err) {
        console.error(err)
        response.status(500).json(commonResponse(null, "server error"))
        response.end()
        return
    }

})

app.post('/user', (request, response) => {

})

app.post('/transaction', async (request, response) => {
    try {
        const body = request.body

        const dbData = await query(`insert into
            mbanking.transaction (type, amount, user_id)
        values
        (?, ?, ?)`, [body.type, body.amount, body.user_id])

        const userId = body.user_id
        /*const userKey = "user:" + userId
        await redisCon.del(userKey)*/

        response.status(200).json(commonResponse({
            id: dbData.insertId
        }, null))
        response.end()

    } catch (err) {
        console.error(err)
        response.status(500).json(commonResponse(null, "server error"))
        response.end()
        return
    }
})

app.put('/transaction/:id', async (req, res) => {
    const id = req.params.id
    const { type, amount } = req.body

    try {
        await query(`
            update mbanking.transaction
            set type = ?, amount = ?
            where id = ?
        `, [type, amount, id])

        res.status(200).json(commonResponse({ id }, null))
    } catch (err) {
        console.log(err)
        res.status(500).json(commonResponse(null, "server error"))
    }
})


app.delete('/transaction/:id', async (request, response) => {
    try {
        const id = request.params.id
        const data = await query("delete from mbanking.transaction where id = ?", id)
        if (Object.keys(data).length === 0) {
            response.status(404).json(commonResponse(null, "data not found"))
            response.end()
            return
        }
        /*const personId = data[0].person_id
        const userKey = "user:" + personId
        await query("delete from revou.order where id = ?", id)
        await redisCon.del(userKey)*/

        response.status(200).json(commonResponse({
            id: id
        }))

        response.end()

    } catch (err) {
        console.error(err)
        response.status(500).json(commonResponse(null, "server error"))
        response.end()
        return
    }
})


app.listen(3000, () => {
    console.log("running in 3000")
})