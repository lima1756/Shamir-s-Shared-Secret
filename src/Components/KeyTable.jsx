import React from 'react';

export default class KeyTable extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
        <div className="panel">
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
                        { this.props.keys.map((key, index)=>{
                            return(
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{key.x}</td>
                                    <td>{key.fx}</td>
                                </tr>
                            )
                        }) }
                    </tbody>
                </table>
            </div>
        </div>
        
    );
  }
}
