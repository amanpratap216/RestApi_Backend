import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken } from "../../models";
import refreshToken from "../../models/refreshToken";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";
import { User } from "../../models";
const refreshController = {
  async refresh(req, res, next) {
    // validate request
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { err } = refreshSchema.validate(req.body);

    if (err) {
      return next(err);
    }

    //check in database
    let refreshtoken;
    try {
      refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!refreshtoken) {
        return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
      }
      let userId;
      try {
        const { _id } = await JwtService.verify(
          refreshtoken.token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (err) {
        return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
      }

      const user = User.findOne({ _id: userId });
      if (!user) {
        return next(CustomErrorHandler.unAuthorized("No USer FOund"));
      }
      //tokens
      const access_token = JwtService.sign({
        _id: user._id,
        role: user.role,
      });
      const refresh_token = JwtService.sign(
        {
          _id: user._id,
          role: user.role,
        },
        "1y",
        REFRESH_SECRET
      );
      //database whitelist
      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token: access_token, refresh_token });
    } catch (err) {
      return next(new Error("something went wrong" + err.message));
    }
  },
};

export default refreshController;
