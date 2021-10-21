require("dotenv").config();
require("./config/passport");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const userRoute = require("./routes/userRoute");
const shippingAddressRoute = require("./routes/shippingAddressRoute");
const projectRoute = require("./routes/projectRoute");
const categoryRoute = require("./routes/categoryRoute");
const typeRoute = require("./routes/typeRoute");
const errController = require("./controllers/errController");
const port = process.env.PORT || 8888;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/public", express.static("public"));

//path
app.use("/users", userRoute);
app.use("/shipping-addresses", shippingAddressRoute);
app.use("/projects", projectRoute);
app.use("/categories", categoryRoute);
app.use("/types", typeRoute);

// 404 not found
app.use((req, res, next) => {
    res.status(404).send({ msg: "resource not found on this server" });
});

// err handling
app.use(errController);

app.listen(port, () => {
    console.log(`server is running on port ${port}...`);
});
