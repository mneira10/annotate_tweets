import React, { Component } from 'react';
import { Tweet } from 'react-twitter-widgets';
import axios from 'axios';
import qs from 'qs';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {tweetId: null,tweetStrId:null};

    this.handleNegative = this.handleNegative.bind(this);
    this.handleNeutral = this.handleNeutral.bind(this);
    this.handlePositive = this.handlePositive.bind(this);
    this.handleNA = this.handleNA.bind(this); 
    this.getTweetId = this.getTweetId.bind(this);
  }
  componentWillMount(){
    this.getTweetId();
  }

  updateTweet(annotStatus,callback){

    let myUrl = 'https://api.mlab.com/api/1/databases/big_data_twitter/collections/tweets2?apiKey=1EnhaMU6f8Ay6RRAe_zZKzMa5F0b9ZU9&q={"id_str":"'+this.state.tweetStrId + '"}';
    // let myUrl = 'https://api.mlab.com/api/1/databases/big_data_twitter/collections/tweets2/1111258998941061100?apiKey=1EnhaMU6f8Ay6RRAe_zZKzMa5F0b9ZU9';
    axios.put(myUrl, 
      { $set : { annotation : annotStatus } } )
      .then(function (response) {
        console.log('success!');
        console.log(response);
        callback();
      })
      .catch(function (error) {
        console.log(error);
        });
    

  }
  handleNA(){
    console.log(this.state.tweetId, 'is NA.')
    // let myurl = 'https://api.mlab.com/api/1/databases/big_data_twitter/collections/tweets2?q={%22annotation%22:{%22$exists%22:false}}&l=1&f={%22_id%22:1}&apiKey=1EnhaMU6f8Ay6RRAe_zZKzMa5F0b9ZU9'

    this.updateTweet(2,this.getTweetId);
        

  }
  handleNegative(e){
    console.log('negative');
    this.updateTweet(-1,this.getTweetId);
  }
  handleNeutral(e){
    console.log('neutral');
    this.updateTweet(0,this.getTweetId);
  }
  handlePositive(e){
    console.log('positive');
    this.updateTweet(1,this.getTweetId);
  }
  getTweetId(){
    console.log('getting tweet id...')
    let myurl = 'https://api.mlab.com/api/1/databases/big_data_twitter/collections/tweets2?q={%22annotation%22:{%22$exists%22:false}}&l=1&apiKey=1EnhaMU6f8Ay6RRAe_zZKzMa5F0b9ZU9'
    
    axios.get(myurl)
    .then(response => {
      console.log(response.data);
      let retreivedStrId = response.data[0].id_str;
      
      console.log('got id',String(retreivedStrId));
      this.setState({tweetStrId:String(retreivedStrId),tweetId:response.data[0]._id});
    });
  }
  
  render() {
    return (
      <div className="App">
      <p>
        <b>Tweet id:</b> {this.state.tweetStrId}
      </p>
      <div className="d-flex justify-content-center">
        <Tweet tweetId={this.state.tweetStrId}/>
      </div>
      <div className="buttons">

      <button type='button' className="btn btn-danger   boton" onClick={this.handleNegative}>Negativo</button>
      <button type='button' className="btn btn-dark     boton" onClick={this.handleNeutral}>Neutro</button>
      <button type='button' className="btn btn-success  boton" onClick={this.handlePositive}>Positivo</button>
      </div>
      <br/>
      <div>

        <button type='button' className="btn btn-warning  boton" onClick={this.handleNA}>No veo nada / No aplica</button>
        </div>
      
      </div>
    );
  }
}

export default App;
