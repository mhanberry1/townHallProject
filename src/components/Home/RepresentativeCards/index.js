import React, { Component } from 'react';
import classNames from 'classnames';

import MoC from '../../../scripts/models/MemberOfCongress';
import RepresentativeCard from '../../RepresentativeCard';
import TownHall from '../../../scripts/models/TownHall';

// import './style.scss';

class RepresentativeCards extends Component {
  constructor(props) {
    super(props)
    this.lookupReps = this.lookupReps.bind(this);
    this.state = {
      reps: []
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.zip !== this.props.zip) {
      this.lookupReps();
    }
    if (!this.props.zip) {
      this.setState({
        reps: []
      })
    }
  }

  lookupReps() {
    TownHall.lookupReps('zip', this.props.zip).then((reps) => {
      this.setState({
        reps
      })
    })
  }

  render() {
    const {
      reps
    } = this.state;
    return (
      <div id="representativeCards">
        <section className={classNames("container", "container-fluid")}>
          {
            reps.map((rep) => {
              if (!rep) { return null }
              const newRep = new MoC(rep);
              newRep.format();
              return (
                <RepresentativeCard rep={newRep} />
              );
            })
          }
        </section>
      </div>
    );
  }
}

export default RepresentativeCards;