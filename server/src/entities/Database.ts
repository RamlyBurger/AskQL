import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Table } from "./Table";

export enum DatabaseType {
    POSTGRESQL = "postgresql",
    MYSQL = "mysql",
    MSSQL = "mssql",
    ORACLE = "oracle"
}

@Entity()
export class Database {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @Column()
    database_type: string;

    @OneToMany(() => Table, table => table.database, { cascade: true })
    tables: Table[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 