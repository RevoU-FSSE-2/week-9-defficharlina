select
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
        u.id = 1
    group by 
        u.id