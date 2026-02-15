import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppDataSource } from "../data-source";
import { UserNotification } from "../entities/UserNotification";
import { User } from "../entities/User";

export class UserNotificationController {
    static async getMyNotifications(req: AuthRequest, res: Response) {
        const username = req.user?.username;
        const userRepository = AppDataSource.getRepository(User);
        const notificationRepository = AppDataSource.getRepository(UserNotification);

        const user = await userRepository.findOneBy({ username });
        if (!user) throw new Error("User not found");

        const notifications = await notificationRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: "DESC" }
        });

        return res.json(notifications);
    }

    static async markAsRead(req: AuthRequest, res: Response) {
        const id = parseInt(req.params.id as string);
        const notificationRepository = AppDataSource.getRepository(UserNotification);

        const notification = await notificationRepository.findOneBy({ id });
        if (notification) {
            notification.read = true;
            await notificationRepository.save(notification);
        }

        return res.json({ message: "Marked as read" });
    }
}
