import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token:'',
      signUpError:'',
      signInError:'',
      signInEmail:'',
      signInPassword:'',
      signUpfirstname:'',
      signUplastname:'',
      signUpemail:'',
      signUppassword:''
    };
    this.onTextboxChangesignInEmail= this.onTextboxChangesignInEmail.bind(this);
    this.onTextboxChangesignInPassword= this.onTextboxChangesignInPassword.bind(this);
    this.onTextboxChangesignUpEmail= this.onTextboxChangesignUpEmail.bind(this);
    this.onTextboxChangesignUpPassword= this.onTextboxChangesignUpPassword.bind(this);
    this.onTextboxChangesignUpfirstname= this.onTextboxChangesignUpfirstname.bind(this);
    this.onTextboxChangesignUplastname= this.onTextboxChangesignUplastname.bind(this);
    this.onSignIn= this.onSignIn.bind(this);
    this.onSignUp= this.onSignUp.bind(this);
    this.logout= this.logout.bind(this);

  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token){
      const {token}= obj;
      fetch('/api/account/verify?token=' + token)
      .then(res=>res.json())
      .then(json=> {
        if(json.success){
          this.setState({
            token,
            isLoading:false
          });
        }
        else{
          this.setState({isLoading:false});
        }
      });

    }
    else{
      this.setState({
        isLoading: false,
      });
    }
  }
  onTextboxChangesignInEmail(event){
    this.setState({
      signInEmail: event.target.value,
    });
  }
  onTextboxChangesignInPassword(event){
    this.setState({
      signInPassword: event.target.value,
    });
  }
  onTextboxChangesignUpEmail(event){
    this.setState({
      signUpemail: event.target.value,
    });
  }
  onTextboxChangesignUpPassword(event){
    this.setState({
      signUppassword: event.target.value,
    });
  }
  onTextboxChangesignUpfirstname(event){
    this.setState({
      signUpfirstname: event.target.value,
    });
  }  onTextboxChangesignUplastname(event){
      this.setState({
        signUplastname: event.target.value,
      });
    }
    onSignIn(){
      const{
        signInEmailemail,
        signInPasswordpassword,
      }= this.setState;
      this.setState({
        isLoading:true,
      })
      fetch('api/account/signin', {
        method : 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          email:signInEmail,
          password: signInPassword,
        }),
      })
      .then(res=> res.json())
      .then(json=>{
        if(json.success){
          this.setState({
            setInStorage('the_main_app', {token: json.token});
            signInError: json.message,
            isLoading: false,
            signUppassword:'',
            signUpemail:'',
            token :json.token,
          });
        }else{
          this.setState({
            signInError:json.message,
            isLoading: false
          });
      });
    }
    onSignUp(){
      const{
        signUpemail,
        signUppassword,
        signUplastname,
        signUpfirstname
      }= this.setState;
      this.setState({
        isLoading:true,
      })
      fetch('api/account/signup', {
        method : 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          firstName: signUpfirstname,
          lastName: signUplastname,
          email:signUpemail,
          password: signUppassword,
        }),
      })
      .then(res=> res.json())
      .then(json=>{
        if(json.success){
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpfirstname:'',
            signUplastname:'',
            signUppassword:'',
            signUpemail:'',
          });
        }else{
          this.setState({
            signUpError:json.message,
            isLoading: false
          });
        }
      });
    }
    logout(){
      this.setState({
        isLoading:true
      });
      const obj = getFromStorage('the_main_app');
      if (obj && obj.token){
        const {token}= obj;
        fetch('/api/account/logout?token=' + token)
        .then(res=>res.json())
        .then(json=> {
          if(json.success){
            this.setState({
              token: '',
              isLoading:false
            });
          }
          else{
            this.setState({isLoading:false});
          }
        });
    }

  render() {
    const{
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signInPassword,
      signUpfirstname,
      signUplastname,
      signUpemail
      signUppassword,
    }= this.state;

    if(isLoading){
      return (<div><p> Loading....</p></div>);
    }
    if(!token){
      return (
        <div>
        <div>
        {
          (signInError) ? (
            <p>{signInError}</p>
          ): null
        }
        <p> sign in </p>
        <input
         type="email"
         placeholder="Email"
         value ={signInEmail}
         onchange ={onTextboxChangesignInEmail}
         />
         <br />
        <input
         type="password"
         placeholder="Password"
        value={signInPassword}
        onchange ={onTextboxChangesignInPassword}
        />
        <br />
        <button onClick= {this.onSignIn}> sign in</button>
        </div>
        <br />
        <br />
        <div>
        <p> sign up </p>
        <input type="text" placeholder="First name" value ={signUpfirstname} onchange ={onTextboxChangesignUpEmail}/>
        <input type="text" placeholder="Last name" value = {signUplastname} onchange ={onTextboxChangesignUpPassword}/>
        <input type="email" placeholder="Email" value= {signUpemail} onchange ={onTextboxChangesignUpfirstname}/>
        <input type="password" placeholder="Password" value ={signUppassword} onchange ={onTextboxChangesignUplastname}/>
        <button onClick= {this.onSignUp}> sign up</button>
        </div>
        </div>
      );
    }
    return (<div><p> Account </p>
      <button onClick={this.logout}>logout</button>
      </div>);
  }
}

export default Home;
