import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Database } from '../entities/Database';
import { PostgresError } from '../types/errors';

export class DatabaseController {
    private databaseRepository = AppDataSource.getRepository(Database);

    // Get all databases
    async getAllDatabases(req: Request, res: Response) {
        try {
            const databases = await this.databaseRepository.find({
                relations: ['tables', 'tables.attributes'],
                order: { created_at: 'DESC' }
            });

            return res.json({
                success: true,
                data: databases
            });
        } catch (error) {
            console.error('Error fetching databases:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching databases'
            });
        }
    }

    // Create new database
    async createDatabase(req: Request, res: Response) {
        try {
            const { name, description, database_type } = req.body;

            // Validate required fields
            if (!name || !database_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and database_type are required'
                });
            }

            const database = this.databaseRepository.create({
                name,
                description,
                database_type
            });

            await this.databaseRepository.save(database);

            return res.status(201).json({
                success: true,
                data: database
            });
        } catch (error) {
            console.error('Error creating database:', error);
            
            // Check for unique constraint violation
            if ((error as PostgresError).code === '23505') {
                return res.status(400).json({
                    success: false,
                    message: 'A database with this name already exists'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error creating database'
            });
        }
    }

    // Get single database by ID
    async getDatabaseById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const database = await this.databaseRepository.findOne({
                where: { id: parseInt(id) },
                relations: ['tables', 'tables.attributes']
            });

            if (!database) {
                return res.status(404).json({
                    success: false,
                    message: 'Database not found'
                });
            }

            return res.json({
                success: true,
                data: database
            });
        } catch (error) {
            console.error('Error fetching database:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching database'
            });
        }
    }

    // Update database
    async updateDatabase(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description, database_type } = req.body;

            const database = await this.databaseRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!database) {
                return res.status(404).json({
                    success: false,
                    message: 'Database not found'
                });
            }

            // Update fields
            database.name = name || database.name;
            database.description = description || database.description;
            database.database_type = database_type || database.database_type;

            await this.databaseRepository.save(database);

            return res.json({
                success: true,
                data: database
            });
        } catch (error) {
            console.error('Error updating database:', error);
            
            // Check for unique constraint violation
            if ((error as PostgresError).code === '23505') {
                return res.status(400).json({
                    success: false,
                    message: 'A database with this name already exists'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error updating database'
            });
        }
    }

    // Delete database
    async deleteDatabase(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const database = await this.databaseRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!database) {
                return res.status(404).json({
                    success: false,
                    message: 'Database not found'
                });
            }

            await this.databaseRepository.remove(database);

            return res.json({
                success: true,
                message: 'Database deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting database:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting database'
            });
        }
    }
} 