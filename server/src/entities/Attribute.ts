import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Table } from "./Table";

@Entity()
export class Attribute {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text' })
    data_type: string;

    @Column({ default: true })
    is_nullable: boolean;

    @Column({ default: false })
    is_primary_key: boolean;

    @Column({ default: false })
    is_foreign_key: boolean;

    @ManyToOne(() => Table, table => table.attributes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'table_id' })
    table: Table;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 