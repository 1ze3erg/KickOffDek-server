require("dotenv").config();
require("./config/passport");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const socketio = require("socket.io");
const schedule = require("node-schedule");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const shippingAddressRoute = require("./routes/shippingAddressRoute");
const paymentRoute = require("./routes/paymentRoute");
const projectRoute = require("./routes/projectRoute");
const categoryRoute = require("./routes/categoryRoute");
const typeRoute = require("./routes/typeRoute");
const currencyRoute = require("./routes/currencyRoute");
const rewardRoute = require("./routes/rewardRoute");
const commentRoute = require("./routes/commentRoute");
const updateRoute = require("./routes/updateRoute");
const faqRoute = require("./routes/faqRoute");
const shippingRoute = require("./routes/shippingRoute");
const pledgeRoute = require("./routes/pledgeRoute");
const savedProjectRoute = require("./routes/savedProjectRoute");
const uploadRoute = require("./routes/uploadRoute");
const errController = require("./controllers/errController");
const port = process.env.PORT || 8888;

const { Project, Pledge, Reward } = require("./models");
const { checkTotalPledgeAmount } = require("./events/pledgeEvent");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/public", express.static("public"));

//path
app.use("/admins", adminRoute);
app.use("/users", userRoute);
app.use("/shipping-addresses", shippingAddressRoute);
app.use("/payments", paymentRoute);
app.use("/projects", projectRoute);
app.use("/categories", categoryRoute);
app.use("/types", typeRoute);
app.use("/currencies", currencyRoute);
app.use("/rewards", rewardRoute);
app.use("/comments", commentRoute);
app.use("/updates", updateRoute);
app.use("/faqs", faqRoute);
app.use("/shippings", shippingRoute);
app.use("/pledges", pledgeRoute);
app.use("/savedProjects", savedProjectRoute);
app.use("/uploads", uploadRoute);

// 404 not found
app.use((req, res, next) => {
    res.status(404).send({ msg: "resource not found on this server" });
});

// err handling
app.use(errController);

const server = app.listen(port, () => {
    console.log(`server is running on port ${port}...`);
});

const io = socketio(server, {
    cors: {
        origin: "*",
    },
});

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

io.of("/users").use(wrap(passport.initialize()));
io.of("/users").use(wrap(passport.authenticate("jwt-user", { session: false })));

io.of("/users").on("connection", (socket) => {
    console.log(`${socket.request.user.email} connect socket success`);

    socket.on("check-total-pledge-amount", async (pledgeObj, projectId) => {
        const newTotalPledgeAmount = await checkTotalPledgeAmount(socket, pledgeObj, projectId);
        socket.emit("return-pledge-amount", newTotalPledgeAmount);
    });

    socket.on("unmount", () => {
        socket.disconnect(true);
    });

    socket.on("disconnect", () => {
        console.log("user is disconnected");
    });
});

const job = schedule.scheduleJob("*/10 * * * * *", async () => {
    console.log("check project end date");
    const projects = await Project.findAll({ where: { status: "live" } });
    projects.forEach(async (elem, idx) => {
        const pledges = await Pledge.findAll({ include: { model: Reward, where: { projectId: elem.id } } });
        const pledgeAmount = pledges.reduce((total, elem) => total + +elem.amount, 0);
        console.log(
            `Project ${elem.id}, endDate = ${new Date(elem.endDate).toLocaleString()}, target = ${
                elem.target
            }, pledge amount = ${pledgeAmount}`
        );
        if (new Date() >= elem.endDate) {
            if (pledgeAmount >= elem.target) {
                console.log(`Project ${elem.id} success`);
                await Project.update({ status: "successful" }, { where: { id: elem.id } })
            } else {
                console.log(`Project ${elem.id} fail`);
                await Project.update({ status: "failed" }, { where: { id: elem.id } })
            }
        }
        console.log("----------------------------------");
        if (projects.length - 1 === idx) {
            console.log("--- checked ---");
        }
    });
});
