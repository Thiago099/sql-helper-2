import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export const sqlite = open({
    filename: './connections.db',
    mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    driver: sqlite3.Database
})