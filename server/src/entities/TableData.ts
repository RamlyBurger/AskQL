import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Table } from "./Table";

@Entity()
export class TableData {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Table, { onDelete: 'CASCADE' })
    table: Table;

    @Column()
    table_id: number;

    @Column({ type: 'jsonb' })
    row_data: Record<string, any>;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 