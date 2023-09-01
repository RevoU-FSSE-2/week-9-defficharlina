# Week 9 Assignment
Create an API for a simple [MBanking App](https://solitary-glitter-8817.fly.dev/) and connect NodeJS with MySQL RDBMS to perform CRUD operations. We will use database MySQL and use SQL query to create the table for API endpoints / contract

The requirements:
1. Each user will have only 1 account
2. Show the user's balance = total income - total expense
3. Add income / expense transaction
4. Update income / expense transaction
5. Delete income / expense transaction

API endpoints:
1. Get user data by id
2. Post transaction data
3. Put transaction data by id
4. Delete transaction data by id

## Programming Language
1. JavaScript

    JavaScript is a lightweight, cross-platform, single-threaded, and interpreted compiled programming language

## Dev Environment Setup
1. GitHub

    Create GitHub Account, please visit [GitHub](https://github.com/)

2. Power Shell

    For installation, please visit [Power Shell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.3#install-powershell-using-winget-recommended)

3. Visual Studio Code

    For installation, please visit [Visual Studio Code](https://code.visualstudio.com/)

4. Fly.io

   Create Fly.io Account, please visit [Fly.io](https://fly.io/)

5. Docker

    Install Docker, please visit [Docker](https://www.docker.com/)

6.  Node.js

    Node.js is a cross-platform, open-source server environment that can run on Windows, Linux, Unix, macOS, and more.

7. Thunder Client

    Install Thunder Client, please visit [Thunder Client](https://www.thunderclient.com/)

8. MySQL

    MySQL is a relational database management system (RDBMS) developed by Oracle that is based on structured query language (SQL). We can install MySQL on docker

9. Express.js

    Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications

10. Dbeaver

    DBeaver Community is a free cross-platform database tool for developers, database administrators, analysts, and everyone working with data. Install Dbeaver, please visit [Dbeaver](https://dbeaver.io/)

## Development Process
1. Setup project with express js application, and we will use JavaScript 
2. Create connection with MySQL and create database mbanking, table user, table transaction

#### Create connection

```const mysqlCon = mysql.createConnection({
//setelah deploy host: 'localhost' diganti ips private saat proses deploy ke fly.io
    host: 'fdaa:2:cafd:a7b:80:292d:8642:2', 
    port: '3306',
    user: 'root',
    password: '1234',
    database: 'mbanking'
})
```

  <p align="center">
    <img src="images/connect mysql.JPG" width="600">
  </p>

#### Create user table and transaction table in DBeaver
 
  <p align="center">
    <img src="images/struktur tabel user.JPG" width="600">
  </p>

  <p align="center">
    <img src="images/struktur tabel transaction.JPG" width="600">
  </p>

#### Create SQL Query

    ```const dbData = await query(`select
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
        ```

#### GET /user/:id

  <p align="center">
    <img src="images/get user id.JPG" width="600">
  </p>

#### POST/transaction

  <p align="center">
    <img src="images/post transaction.JPG" width="600">
  </p>

#### PUT /transaction/:id

  <p align="center">
    <img src="images/put transaction id.JPG" width="600">
  </p>

#### DELETE /transaction/:id

  <p align="center">
    <img src="images/delete transaction id.JPG" width="600">
  </p>

3. Deploy project with fly.io
4. After deploy node js, we need to update host in index.js file with ips private
5. After deploy MySQL, we need to update connection MySQL with port 13306 and the same password like as deploy until have some_db database
6. Next create database and table for test the deployment

