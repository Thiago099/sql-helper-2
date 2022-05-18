import { connection } from '@/libraries/mysql'

export async function find_foreign_keys(table:string, database:string)
{
    return await new Promise((resolve) => {connection.value.query(`SELECT 
        KEY_COLUMN_USAGE.TABLE_NAME,
        KEY_COLUMN_USAGE.COLUMN_NAME,
        KEY_COLUMN_USAGE.REFERENCED_TABLE_NAME,
        KEY_COLUMN_USAGE.REFERENCED_COLUMN_NAME
        FROM information_schema.TABLE_CONSTRAINTS
        INNER JOIN information_schema.KEY_COLUMN_USAGE ON TABLE_CONSTRAINTS.CONSTRAINT_NAME = KEY_COLUMN_USAGE.CONSTRAINT_NAME
        WHERE TABLE_CONSTRAINTS.CONSTRAINT_TYPE = 'FOREIGN KEY'
        AND TABLE_CONSTRAINTS.TABLE_SCHEMA = '${database}'
        AND KEY_COLUMN_USAGE.TABLE_SCHEMA = '${database}'
        AND 
        (
            KEY_COLUMN_USAGE.TABLE_NAME = '${table}'
            OR KEY_COLUMN_USAGE.REFERENCED_TABLE_NAME = '${table}'
        )`,(err:any, rows:any)=>{
            rows.map((item:any)=>{item.child = item.TABLE_NAME == table ? true : false})
            resolve(rows)
        })
    })
}