import React, {Component} from "react";
import {PropTypes} from "prop-types";
import { Meteor } from "meteor/meteor";
import { createContainer} from "meteor/react-meteor-data"


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
        console.log("What Am I doing?");
        // console.log(this.props.tweets);
        // console.log(this.props.getProjection());
        this.props.tweets.map((tweet) => {
            this.paintPoint(tweet);
        })

    }

    paintPoint(tweet) {
        let ctx = this.canvas.getContext('2d');
        let coor = tweet.coordinates.coordinates;
        let projFunc = this.props.getProjection();
        let transform = projFunc(coor);
        console.log(transform);
        ctx.beginPath();
        ctx.arc(transform[0], transform[1], 3, 0, Math.PI*2, false);
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    render() {
        return (
            <canvas
            ref={(canvas) => {this.canvas = canvas}}
            width="600" height="600"></canvas>
        );
    }
}