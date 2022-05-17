import { ref } from 'vue'
import { connection } from '@/libraries/mysql'
export const databases = ref()
export async function load(){
    connection.value.query('SHOW DATABASES', async (err: any, results: any, fields: any) => {
        databases.value = await Promise.all(results.map(async(item:any) => { return {
            database: item.Database,
            collapsed: true,
            tables: await new Promise((resolve, reject) => {
                connection.value.query(`SHOW TABLES FROM \`${item.Database}\``, (err: any, results: any, fields: any) => {
                    if(results)
                    {
                        resolve(results.map((table:any) => 
                            table[`Tables_in_${item.Database}`]
                        ))
                    }
                    resolve([])
                })
            })
        }}))
    });
}