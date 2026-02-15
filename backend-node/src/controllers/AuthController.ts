import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User, UserRole, UserStatus } from "../entities/User";
import { PasswordResetToken } from "../entities/PasswordResetToken";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRATION_MS = parseInt(process.env.JWT_EXPIRATION_MS || "86400000");

export class AuthController {
    static async signin(req: Request, res: Response) {
        const { username, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Error: Invalid username or password!" });
        }

        const token = jwt.sign(
            { sub: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION_MS / 1000 }
        );

        return res.json({
            token,
            id: Number(user.id),
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            registrationDate: user.registrationDate
        });
    }

    static async signup(req: Request, res: Response) {
        const { username, email, password, role, fullName, phoneNumber, address } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        if (await userRepository.findOne({ where: { username } })) {
            return res.status(400).json({ message: "Error: Username is already taken!" });
        }

        if (await userRepository.findOne({ where: { email } })) {
            return res.status(400).json({ message: "Error: Email is already in use!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            username,
            email,
            password: hashedPassword,
            role: (role as UserRole) || UserRole.ROLE_MEMBER,
            fullName,
            phoneNumber,
            address,
            status: UserStatus.ACTIVE,
            registrationDate: new Date()
        });

        await userRepository.save(user);

        return res.json({ message: "User registered successfully!" });
    }

    static async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        const tokenRepository = AppDataSource.getRepository(PasswordResetToken);

        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return res.json({ message: "If the email exists, a password reset link has been sent." });
        }

        await tokenRepository.delete({ user: { id: user.id } });

        const token = uuidv4();
        const resetToken = tokenRepository.create({
            token,
            user,
            expiryDate: new Date(Date.now() + 3600000), // 1 hour
            used: false
        });

        await tokenRepository.save(resetToken);

        console.log(`[Development] Password reset token for ${email}: ${token}`);

        return res.json({ message: "If the email exists, a password reset link has been sent." });
    }

    static async resetPassword(req: Request, res: Response) {
        const { token, newPassword } = req.body;
        const tokenRepository = AppDataSource.getRepository(PasswordResetToken);
        const userRepository = AppDataSource.getRepository(User);

        const resetToken = await tokenRepository.findOne({
            where: { token },
            relations: ["user"]
        });

        if (!resetToken || resetToken.used || resetToken.expiryDate < new Date()) {
            return res.status(400).json({ message: "Invalid or expired reset token." });
        }

        const user = resetToken.user;
        user.password = await bcrypt.hash(newPassword, 10);
        await userRepository.save(user);

        resetToken.used = true;
        await tokenRepository.save(resetToken);

        return res.json({ message: "Password has been reset successfully!" });
    }

    static async googleLogin(req: Request, res: Response) {
        // Placeholder implementation matching Spring Boot
        const email = "google.user@example.com";
        const username = `google_${uuidv4().substring(0, 8)}`;

        const userRepository = AppDataSource.getRepository(User);
        let user = await userRepository.findOne({ where: { email } });

        if (!user) {
            user = userRepository.create({
                username,
                email,
                password: await bcrypt.hash(uuidv4(), 10),
                role: UserRole.ROLE_MEMBER,
                status: UserStatus.ACTIVE,
                registrationDate: new Date()
            });
            await userRepository.save(user);
        }

        const token = jwt.sign(
            { sub: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION_MS / 1000 }
        );

        return res.json({
            token,
            id: Number(user.id),
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            registrationDate: user.registrationDate
        });
    }
}
