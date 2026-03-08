declare const _default: () => {
    port: number;
    nodeEnv: string;
    database: {
        host: string;
        port: number;
        name: string;
        user: string;
        password: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    s3: {
        endpoint: string | undefined;
        bucket: string;
        accessKey: string | undefined;
        secretKey: string | undefined;
        region: string;
    };
    redis: {
        host: string;
        port: number;
    };
};
export default _default;
