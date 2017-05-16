import React, {Component} from "react";
import {PropTypes} from "prop-types";
import { Meteor } from "meteor/meteor";
import { createContainer} from "meteor/react-meteor-data";
import numeric from 'numeric';
const expectation_maximization = require('expectation-maximization');


export default class Overlay extends Component {
    constructor(props) {
        super(props);
        this.canvas = null;
    }

    componentDidMount() {
        console.log("Ha!");
        console.log(this.props.tweets);
    }

    componentWillUpdate() {
        // let expectation_maximization = require('expectation_maximization');
        let ctx = this.canvas.getContext('2d');
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log("What Am I doing?");
        ctx.restore();
        // console.log(this.props.mapstat.zoom);
        // ctx.translate(this.canvas.width/2, this.canvas.height/2);
        // ctx.scale(this.props.mapstat.zoom, this.props.mapstat.zoom);
        // ctx.translate(-this.props.mapstat.dx, -this.props.mapstat.dy);
        // console.log(this.props.tweets);
        // console.log(this.props.getProjection());
        let transform = this.props.tweets.map((tweet) => {
            var t = this.paintPoint(tweet);
            // console.log(t);
            return t;
        });
        console.log(transform);

        // this.props.tweets.map(function(t) => {
        //     return t.
        // })

        // console.log(real_coor);

        // Fits a Gaussian Mixture Model
        try {
            console.log(this.props.ngauss);
            var groups = expectation_maximization(transform, this.props.ngauss());
            console.log(groups);
            groups.map((g) => {
                let center = g.mu;
                let cov = g.sigma;
                let eig = numeric.eig(cov);
                // console.log(eig);
                // console.log(2*Math.sqrt(Math.abs(eig.lambda.x[0])*5.997));
                var maj_axis = 2*Math.sqrt(Math.abs(eig.lambda.x[0])*0.211);
                var min_axis = 2*Math.sqrt(Math.abs(eig.lambda.x[1])*0.211);
                var vect = eig.lambda[0] > eig.lambda[1] ? eig.E.x[0] : eig.E.x[1];
                var angle = Math.atan2(vect[1], vect[0]);
                // console.log(maj_axis);
                // console.log(min_axis);
                // console.log(angle);
                // console.log(center);

                let ctx = this.canvas.getContext('2d');
                ctx.beginPath();
                ctx.ellipse(center[0], center[1], maj_axis, min_axis, angle, 0, 2*Math.PI);
                ctx.stroke();

            });
        }
        catch(err)
        {
            console.log(err);
        }

    }

    paintPoint(tweet) {
        let ctx = this.canvas.getContext('2d');
        let coor = tweet.coordinates.coordinates;
        let projFunc = this.props.getProjection();
        let transform = projFunc(coor);
        // console.log(transform);
        ctx.beginPath();
        ctx.arc(transform[0], transform[1], 3, 0, Math.PI*2, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        return transform;
    }

    render() {
        return (
            <canvas
            ref={(canvas) => {this.canvas = canvas}}
            width="600" height="600"></canvas>
        );
    }
}