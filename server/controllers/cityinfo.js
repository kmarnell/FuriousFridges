'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const request = require('request');
const models = require('../../db/models');


module.exports.getAll = (req, res) => {
  models.Stats.fetchAll()
  .then(data => {
    if (data.length === 0) {
      request.get('https://api.teleport.org/api/urban_areas/teleport:9q8yy/scores/',
        (error, response, body) => {
          if (error) {
            console.error(err);
          }
          var stats = JSON.parse(body);
          models.Stats.forge({ city: 'San Francisco', city_stats: stats })
            .save()
            .then(data => {
              res.status(201).send(data);
            })
            .catch(err => {
              res.status(500).send(err);
            });
        })
        .catch(err => {
          res.status(500).send(err);
        });
    } else {
      res.status(200).send(data);
    }

  })
  .catch(err => {
    res.status(503).send(err);
  });
};
