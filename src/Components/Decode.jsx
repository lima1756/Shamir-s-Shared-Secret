import React from 'react';
import  fileDialog from 'file-dialog';
import {Shamir, FunctionValue} from '../Shamir';
import KeyInput from './KeyInput';

export default class Encode extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            total: 2,
            keys: [],
            file: {name:""},
            newFile: ""
        }
        this.handleTotalChange = this.handleTotalChange.bind(this);
        this.selectFile = this.selectFile.bind(this);
        this.updateKeys = this.updateKeys.bind(this);
        this.renderInputs = this.renderInputs.bind(this);
        this.execute = this.execute.bind(this);

        let keys = [];
        for(let i = 0; i<2; i++){
            keys.push(new FunctionValue(0,0))
        }

        this.state.keys = keys;
    }

    handleTotalChange(event){
        const val = parseInt(event.target.value);
        if(val >= 2 && val <= 400){
            if(val>this.state.total){
                let keys = [...this.state.keys]
                for(let i = keys.length; i<val; i++){
                    keys.push(new FunctionValue(0,0));
                }
                this.setState({
                    keys: keys,
                    total:val
                });
                
            }
            else{
                let dif = val - this.state.total;
                this.setState({
                    keys: this.state.keys.slice(0,dif),
                    total:val
                })
            }
        }
    }

    execute(){
        Shamir.decypher(this.state.total, this.state.keys, this.state.file, this.state.newFile, ()=>{alert("Your file is ready");}, (err)=>{console.log(err);alert("There was an error, please check that you entered all the requried correct keys")})
    }

    selectFile(){
        fileDialog({ multiple: false })
        .then(file =>{
            this.setState({file:file[0]});
        })
    }

    updateKeys(newKeys){
        this.setState({
            keys: newKeys
        })
    }

    renderInputs(){
        let keys = [];
        for(let i = 0; i < this.state.total; i++){
            keys.push(<KeyInput key={i} id={i} allKeys={this.state.keys} keyValue={this.state.keys[i]} onChange={this.updateKeys}/>);
        }
        return keys;
    }

    render() {
        return (
            <div className="form-group">
                
                <div className="form-group">
                    <label className="form-label" htmlFor="total">Number of participants</label>
                    <input className="form-input" type="number" id="total" placeholder="Total keys" value={this.state.total} onChange={this.handleTotalChange}/>
                </div>
                <div className=" form-group input-group">
                    <span className="input-group-addon">File</span>
                    <input type="text" className="form-input" placeholder="..." id="file" value={this.state.file.name} disabled/>
                    <button className="btn btn-primary input-group-btn" onClick={this.selectFile}>Select File</button>
                </div>   
                <div className="form-group">
                    <label className="form-label" htmlFor="newFileName">New file name</label>
                    <input className="form-input" type="text" id="newFileName" placeholder="New file name. If empty it will leave the name the same as the original." value={this.state.newFile} onChange={event=>{this.setState({newFile:event.target.value})}}/>
                </div>
                <div className="panel-body">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Participant no.</th>
                                <th>x</th>
                                <th>f(x)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderInputs()}
                        </tbody>
                    </table>
                </div>
                <div className="form-group">
                    <button className="btn" onClick={this.execute}>Generate</button>
                </div>
                
            </div>
        );
    }
}