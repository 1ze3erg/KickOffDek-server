const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");

const userStrategy = new JwtStrategy(
    { secretOrKey: process.env.TOKEN_KEY, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() },
    async (payload, done) => {
        try {
            const user = await User.findOne({ where: { id: payload.id } });
            if (!user) done(null, false);
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    }
);

const adminStrategy = new JwtStrategy(
    { secretOrKey: process.env.SECRET_KEY, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() },
    async (payload, done) => {
        try {
            const admin = await Admin.findOne({ where: { id: payload.id } });
            if (!admin) done(null, false);
            done(null, admin);
        } catch (err) {
            done(err, false);
        }
    }
);

passport.use("jwt-user", userStrategy);
passport.use("jwt-admin", adminStrategy);
