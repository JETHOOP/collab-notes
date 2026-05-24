const express = require("express");
const protect = require("../middleware/protect");

const router = express.Router();

router.get(
    "/me",
    protect,
    async (req, res) => {

        res.status(200).json({

            message: "Protected route working",

            user: req.user

        });

    }
);

module.exports = router;
