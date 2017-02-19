var express = require("express");

var router = express.Router();

var db = require("../models");

router.get("/", function(req, res) {
    res.redirect("/burgers");
});

router.get("/burgers", function(req, res) {
    db.burgers.findAll({}).then(function(burgers) {
        console.log(burgers);
        res.render("index", { burgers: burgers });
    });
});

// router.post("/burgers/create", function(req, res) {
//     console.log(req.body);

//     db.burgers.create({ burger_name: req.body.burger_name }).then(function(burger) {

//         res.redirect("/");
//     });

// });

// router.put("/burgers/update/:id", function(req, res) {
//     var id = req.params.id;
//     db.burgers.update(req.body, {
//             where: {
//                 id: id
//             }
//         })
//         .then(function(dbBurger) {
//             res.redirect("/burgers");
//         });

// });

module.exports = router;