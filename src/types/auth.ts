export type TokenPair = {
    accessToken: string;
    refreshToken: string
};

export type registerResponse = {
    userId: string;
    username: string;
    email: string;
    passwordHash: string;
    avatarURL: string;
    createdAt: string;
    deletedAt: string;
};
