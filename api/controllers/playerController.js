'use strict';

var mongoose = require('mongoose'),
    Player = mongoose.model('Players');

exports.getPlayer = function (req, res) {
    const playerId = req.params.playerId;
    Player.find({playerId: playerId}).exec((err, player) => {
        if (err) {
            throw err;
        }
        res.json(player)
    });
}

exports.createPlayer = function (req, res) {
    const playerId = req.body.playerId;
    const player = new Player();
    player.playerId = playerId;
    // remove old entity
    Player.remove(
        {playerId: playerId},
        function(err) {
            if (err) {
                throw err;
            }
        }
    );
    // create new entity
    player.save((saveErr, savedPlayer) => {
        if (saveErr) {
            throw saveErr;
        }
        res.json(savedPlayer);
    });
};
