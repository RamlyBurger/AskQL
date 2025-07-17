import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Attribute } from '../entities/Attribute';
import { Table } from '../entities/Table';

export class AttributeController {
    private attributeRepository = AppDataSource.getRepository(Attribute);
    private tableRepository = AppDataSource.getRepository(Table);

    async getAttributesByTableId(req: Request, res: Response) {
        try {
            const { tableId } = req.params;
            const attributes = await this.attributeRepository.find({
                where: { table: { id: parseInt(tableId) } },
                order: { id: 'ASC' }
            });

            return res.json({
                success: true,
                data: attributes
            });
        } catch (error) {
            console.error('Error fetching attributes:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching attributes'
            });
        }
    }

    async createAttribute(req: Request, res: Response) {
        try {
            const { tableId } = req.params;
            const table = await this.tableRepository.findOne({
                where: { id: parseInt(tableId) }
            });

            if (!table) {
                return res.status(404).json({
                    success: false,
                    message: 'Table not found'
                });
            }

            const attribute = this.attributeRepository.create({
                ...req.body,
                table
            });

            await this.attributeRepository.save(attribute);

            return res.status(201).json({
                success: true,
                data: attribute
            });
        } catch (error) {
            console.error('Error creating attribute:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating attribute'
            });
        }
    }

    async updateAttribute(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const attribute = await this.attributeRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!attribute) {
                return res.status(404).json({
                    success: false,
                    message: 'Attribute not found'
                });
            }

            this.attributeRepository.merge(attribute, req.body);
            await this.attributeRepository.save(attribute);

            return res.json({
                success: true,
                data: attribute
            });
        } catch (error) {
            console.error('Error updating attribute:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating attribute'
            });
        }
    }

    async deleteAttribute(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const attribute = await this.attributeRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!attribute) {
                return res.status(404).json({
                    success: false,
                    message: 'Attribute not found'
                });
            }

            await this.attributeRepository.remove(attribute);

            return res.json({
                success: true,
                message: 'Attribute deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting attribute:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting attribute'
            });
        }
    }
} 