import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SystemConfig } from "../entities/SystemConfig";

export class SystemConfigController {
    static async getConfig(req: Request, res: Response) {
        const configRepository = AppDataSource.getRepository(SystemConfig);
        let config = await configRepository.findOne({ where: {} });

        if (!config) {
            config = configRepository.create({
                fineRate: 1.0,
                gracePeriod: 0,
                autoApproveMembers: false,
                librarianRequestApprovalRequired: true,
                defaultMemberBorrowingLimit: 3,
                defaultLibrarianBorrowingLimit: 10
            });
        }

        return res.json(config);
    }

    static async updateConfig(req: Request, res: Response) {
        const configData = req.body;
        const configRepository = AppDataSource.getRepository(SystemConfig);

        let config = await configRepository.findOne({ where: {} });
        if (!config) {
            config = configRepository.create(configData as any) as any as SystemConfig;
        } else {
            configRepository.merge(config, configData as any);
        }

        if (config) {
            await configRepository.save(config);
        }
        return res.json({ message: "Configuration updated successfully" });
    }
}
