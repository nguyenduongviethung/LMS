import bcrypt from "bcrypt";

export const HashUtil = {
    hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    },
    compare(password: string, hashed: string) {
        return bcrypt.compare(password, hashed);
    }
};
