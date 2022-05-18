import { ref } from 'vue'
import { connection } from '@/libraries/mysql'
export const databases = ref()
export async function load(){
    connection.value.query('SHOW DATABASES', async (err: any, results: any, fields: any) => {
        databases.value = await Promise.all(results.map(async(item:any) => { 
            const current_database =  databases.value?.find((database:any) => database.database === item.Database) 
            return {
            database: item.Database,
            collapsed: current_database?.collapsed ?? true,
            tables: await new Promise((resolve, reject) => {
                connection.value.query(`SHOW TABLES FROM \`${item.Database}\``, (err: any, results: any, fields: any) => {
                    if(results)
                    {
                        resolve(results.map((table:any) => 
                        {
                                const current_table = current_database?.tables.find((selected:any) => selected.table === table[`Tables_in_${item.Database}`]) 
                                if(current_table)
                                console.log(current_table)
                                return {
                                table:table[`Tables_in_${item.Database}`],
                                selected:current_table?.selected ?? false
                            }}
                        ))
                    }
                    resolve([])
                })
            })
        }}))
    });
}