import React, {Component} from "react";
import {PropTypes} from "prop-types";
import { Meteor } from "meteor/meteor";
import { createContainer} from "meteor/react-meteor-data";

import TweetsResults from "./TweetsResults.jsx";
import {Tweets} from "../api/Tweets.js";
import ColombiaMap from './ColombiaMap.jsx';
import Overlay from './Overlay.jsx';
import ReactSlider from 'react-slider';
// import ReactBootstrapSlider from 'react-bootstrap-slider';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        projection: null,
        mapstat: {
          dx: 0,
          dy: 0,
          zoom: 1
        },
        ngauss: 1
    }

  }

  changeQuery(evt) {
    if (evt.key !== "Enter") {
      return;
    }
    // "this" will change in the method call, so I need to save it
    let component = this;

    console.log(evt.target.value);
    Meteor.call("twitter.stream", evt.target.value);

  }

  setProjection(prj) {
    this.setState({'projection': prj});
  }

  getProjection() {
    return this.state.projection;
  }

  notifyZoom(x, y, k) {
    console.log("Zoom!");
    console.log(k);
    this.setState({
      'mapstat': {
        'zoom': k,
        'dx': x,
        'dy': y
      },
      'currentValue': 3,
      'step': 1,
      'max': 100,
      'min': 1
    });
  }

  changeValue(val) {
    console.log(val);
    this.setState({'ngauss': val});
  }

  getValue() {
    return this.state.ngauss;
  }

  render() {
    console.log("render!");
    return (
      <div className='row'>
      <div className='col-md-6'>
        <input type="text" onKeyPress={this.changeQuery.bind(this)} placeholder="Query"/>
        { this.props && this.props.err ?
          <div>Error: {this.props.err}</div> :
          <span></span>
        }
        <div>
          <h2>Group geographically close tweets</h2>
          <p>This app allows to display the geographical position of each tweet whose origin lies on Colombia (And neighbors)</p>
          <p>It groups them using a Generative Gaussian Mixture Model</p>
          <label>Number of Gaussian Components to fit: &nbsp;
          <input onChange={(evt) => {this.changeValue(evt.target.value)}} type="number" name="quantity" min="1" max="100"></input>
          </label>
          {this.props && this.props.tweets ?
          <div className='map-container'>
          <Overlay tweets={this.props.tweets}
                   getProjection={this.getProjection.bind(this)}
                   zoom={this.props.zoom}
                   ngauss={this.getValue.bind(this)}></Overlay>
          <ColombiaMap
            width="600"
            height="600"
            data={{RISARALDA:10, CALDAS:12}}
            setProjection={this.setProjection.bind(this)}
            notifyZoom={this.notifyZoom.bind(this)}
            mapstat={this.state.mapstat}></ColombiaMap>
          </div> : <p>Waiting for tweets...</p>
          }
        </div>
      </div>
        <div className='col-md-6'>
        <h2>Results:</h2>
        {this.props && this.props.tweets ?
          <TweetsResults tweets={this.props.tweets}/> :
          <p>Enter a query</p>
        }
        </div>
        </div>
    );
  }
}

App.propTypes = {
  tweets : PropTypes.array.isRequired
};

export default AppContainer = createContainer(() => {
  Meteor.subscribe("tweets");


  return {
    tweets: Tweets.find({}).fetch()
  };
}, App);