import React from 'react';
import  fileDialog from 'file-dialog';
import {Shamir} from '../Shamir';
import KeyTable from './KeyTable';

export default class Encode extends React.Component{

    static get STATE_HIDDEN(){return 0};
    static get STATE_LOADING(){return 1};
    static get STATE_LOADED(){return 2};

    constructor(props){
        super(props);
        this.state = {
            total: 2,
            required: 2,
            status: Encode.STATE_HIDDEN,
            keys: [],
            file: {name:""}
        }
        this.handleRequiredChange = this.handleRequiredChange.bind(this);
        this.handleTotalChange = this.handleTotalChange.bind(this);
        this.execute = this.execute.bind(this);
        this.selectFile = this.selectFile.bind(this);
    }

    handleTotalChange(event){
        const val = parseInt(event.target.value);
        if(val >= 2 && val <= 50){
            this.setState({total:val})
            if(val< this.state.required){
                this.setState({required:val})
            }
        }
    }

    handleRequiredChange(event){
        const val = parseInt(event.target.value);
        if(val >= 2 && val<=this.state.total && val<=9){
            this.setState({required:val})
        }
    }

    loadTable(){
        switch(this.state.status){
            case Encode.STATE_HIDDEN:
                return (<div></div>)
            case Encode.STATE_LOADING:
                return (
                    <div className="empty">
                        <div className="empty-icon">
                            <div className="loading loading-lg"></div>
                        </div>
                    </div>
                )
            case Encode.STATE_LOADED:
                return (
                    <KeyTable keys={this.state.keys}/>
                )
        }
    }

    execute(){
        if(this.state.file.name===''){
            alert("Please select a file to encrypt");
            return;
        }
        this.setState({status:Encode.STATE_LOADING});
        let keys = Shamir.cypher(this.state.total, this.state.required, this.state.file, ()=>{alert("File encrypted!")});
        this.setState({
            keys: keys,
            status: Encode.STATE_LOADED
        })
        //console.log(Shamir.obtainKeys(9, [keys[0], keys[1], keys[2], keys[3], keys[9], keys[12], keys[10], keys[4], keys[5], keys[6], keys[7]]))
    }

    selectFile(){
        fileDialog({ multiple: false })
        .then(file =>{
            this.setState({file:file[0]});
        })
    }

    render() {
        return (
            <div className="form-group">
                
                <div className="form-group">
                    <label className="form-label" htmlFor="input-example-1">Total keys</label>
                    <input className="form-input" type="number" id="total" placeholder="Total keys" value={this.state.total} onChange={this.handleTotalChange}/>
                    <label className="form-label" htmlFor="input-example-1">Required keys</label>
                    <input className="form-input" type="number" id="required" placeholder="Required keys" value={this.state.required} onChange={this.handleRequiredChange}/>                 
                </div>
                <div className=" form-group input-group">
                    <span className="input-group-addon">File</span>
                    <input type="text" className="form-input" placeholder="..." id="file" value={this.state.file.name} disabled/>
                    <button className="btn btn-primary input-group-btn" onClick={this.selectFile}>Select File</button>
                </div>   
                <div className="form-group">
                    <button className="btn" onClick={this.execute}>Generate</button>
                </div>
                <div>
                    {this.loadTable()}
                </div>
                
            </div>
        );
    }
}