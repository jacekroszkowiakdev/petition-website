// Controllers handle the logic and responses for different routes.

// import { Request, Response } from "express";
// import { getErrorMessage } from "../utils/errors.handler";
// import * as userServices from "../services/user.service";

// export const loginUser = async (req: Request, res: Response) => {
//     try {
//         console.log("user req.body", req.body);
//         const foundUser = await userServices.login(req.body);
//         console.log("found user", foundUser.token);
//         res.status(200).send(foundUser);
//     } catch (error) {
//         return res.status(500).send(getErrorMessage(error));
//     }
// };
