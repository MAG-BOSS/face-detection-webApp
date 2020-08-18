import React, {Component} from "react";
import Clarifai from "clarifai";
import './App.css';
import ImageSearchForm from "./Components/ImageSearchForm/ImageSearchForm.js";
import FaceDetect from "./Components/FaceDetect/FaceDetect";
const app=new Clarifai.App(
  {apiKey: "1e8dcae33bb84884b9ae442a26ed0bce"}
);

class App extends Component{
  constructor(){
    super();
    this.state={
      input:"",
      imageUrl:"",
      box:{}
    };
  }
  calculateFacelocation= (data)=>{
    const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById("inputimage");
    const width=Number(image.width);
    const height =Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width- clarifaiFace.right_col *width,
      bottomRow: height- clarifaiFace.bottom_row*height
    };
  };
  displayFaceBox=(box)=>{
    this.setState({box:box});
  };

  onInputChange=(event)=>{
    this.setState({input:event.target.value});
  };
  onSubmit=()=>{
    this.setState({imageUrl:this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input).then(
      function(response){
        console.log(response);
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      },
      function(err){

      }
    );

  };
  render(){
    return(
      <div className="App">
        <ImageSearchForm
        onInputChange={this.onInputChange}
        onSubmit={this.onSubmit}
        />
        <FaceDetect box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
