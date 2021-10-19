function errController(err, req, res, next) {
    console.log(err);

    let code;
    let msg;

    if (err.name === "ReferenceError") {
        code = 400;
        msg = err.message;
    }

    if (err.name === "SequelizeValidationError") {
        code = 400;
        msg = err.errors[0]?.message;
    }

    if (err.name === "SequelizeUniqueConstraintError") {
        code = 400;
        msg = err.errors[0]?.message;
    }

    res.status(code || err.code || 500).send({ msg: msg || err.message });
}

module.exports = errController;
