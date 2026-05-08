import { Connection, Request } from 'tedious'

// We define a local interface for the config to stop the redlining 
// while keeping the structure SQL Server needs.
interface SqlConfig {
    server: string
    authentication: {
        type: string
        options: {
            userName?: string
            password?: string
        }
    }
    options: {
        database: string
        port: number
        trustServerCertificate: boolean
        encrypt: boolean
        rowCollectionOnRequestCompletion: boolean
    }
}

export const queryDatabase = async (sql: string): Promise<any[]> => {
    const config: SqlConfig = {
        server: process.env.DB_SERVER || 'localhost',
        authentication: {
            type: 'default',
            options: {
                userName: process.env.DB_USER || 'sa',
                password: process.env.DB_PASSWORD || 'LocalSqlServer@123',
            }
        },
        options: {
            database: process.env.DB_NAME || 'Generator',
            port: 1433,
            trustServerCertificate: true,
            encrypt: true,
            rowCollectionOnRequestCompletion: true
        }
    }

    return new Promise((resolve, reject) => {
        const connection = new Connection(config as any)

        connection.on('connect', (err) => {
            if (err) return reject(err)

            const request = new Request(sql, (err, rowCount, rows) => {
                if (err) {
                    reject(err)
                } else if (rows) {
                    // Format the rows into a clean Javascript object
                    const formattedRows = rows.map((row: any[]) => {
                        const obj: Record<string, any> = {}
                        row.forEach((col: any) => {
                            obj[col.metadata.colName] = col.value
                        })
                        return obj
                    })
                    resolve(formattedRows)
                } else {
                    resolve([])
                }
                connection.close()
            })

            connection.execSql(request)
        })

        connection.connect()
    })
}