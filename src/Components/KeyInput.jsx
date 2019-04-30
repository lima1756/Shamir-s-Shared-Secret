import React, { Component } from 'react';
import {FunctionValue} from '../Shamir'

class KeyInput extends Component {

    constructor(props) {
        super(props);
        this.updateInput = this.updateInput.bind(this);
    }

    updateInput(id){
        return (event)=>{
            let copy = JSON.parse(JSON.stringify(this.props.keyValue));
            if(id===0){
                if(event.target.value==='-'){
                    copy.x = -1;
                }
                else{
                    copy.x = parseInt(event.target.value);
                }
                
            }
            else if(id===1){
                if(event.target.value==='-'){
                    copy.fx = -1;
                }
                else{
                    copy.fx = parseInt(event.target.value);
                }
            }
            let allKeys = [...this.props.allKeys]
            allKeys.splice(this.props.id, 1, copy);
            this.props.onChange(allKeys);
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.id+1}</td>
                <td><input className="form-input" type="number" id="x" placeholder="x" value={this.props.keyValue.x} onChange={this.updateInput(0)}/></td>
                <td><input className="form-input" type="number" id="fx" placeholder="f(x)" value={this.props.keyValue.fx} onChange={this.updateInput(1)}/></td>
            </tr>
        );
    }
}

export default KeyInput;