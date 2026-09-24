import env from '../../config/env';
const getResponse = (req, res) => {
    return res.status(200).json({
        message: "Node.ts Standard Template with Express running perfectly inside Docker!",
        status: "online",
        environment: env.nodeEnv
    });
};
export default {
    getResponse
};
//# sourceMappingURL=controller.js.map