import React from 'react';
import Encode from './Encode';
import Decode from './Decode';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      tab:0
    }
  }
  render() {
    return (
      <div>
        <div>
          <ul className="tab tab-block">
            <li className={this.state.tab===0?"tab-item active":"tab-item"}>
              <a href="#" onClick={()=>this.setState({tab:0})}>Encode</a></li>
            <li className={this.state.tab===1?"tab-item active":"tab-item"}>
              <a href="#" onClick={()=>this.setState({tab:1})}>Decode</a>
            </li>
          </ul>
        </div>
        <div className="container">
          {this.state.tab===0 && <Encode/>}
          {this.state.tab===1 && <Decode/>}
        </div>
      </div>
    );
  }
}
