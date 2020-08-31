const user= require('../../models/User');
const userSession= require('../../models/userSession');

app.post('api/account/signup', (req, res, next) =>{
  const{body} = req;
  const {
    firstName,
    lastName,
    password
  }= body;
  let{
    email
  }=body;
  if(!firstName){
    return res.send({
      success: false,
      message: 'Error: first name cannot be empty'
    });
}
if(!lastName){
  return res.send({
    success: false,
    message: 'Error: last name cannot be empty'
  });
  if(!email){
    return res.send({
      success: false,
      message: 'Error: email cannot be empty'
    });
    if(!password){
      return res.send({
        success: false,
        message: 'Error: passwrod cannot be empty'
      });
}
console.log('here');
email = email.toLowerCase();
User.find({email:email},(err, previousUsers)=>{
  if (err){
    return res.send({
      success: false,
      message: 'server error'
    });
  }
  else if (previousUsers.length>0) {
    return res.send({
      success:false,
      message: 'Error: user already exists.'
    });
  }
  const NewUser = new User();
  NewUser.email=email;
  NewUser.firstName=firstName;
  NewUser.lastName=lastName;
  NewUser.password=NewUser.generateHash(password);
  NewUser.save((err, user)=> {
    if(err){
  return res.send({
      success: false,
      message: 'server error'
    });
  }
  else{
    return res.send({
      success: true,
      message: 'signed up'
    });
    }
  });
});
});
app.post('api/account/signin', (req, res, next) =>{
  const{body} = req;
  const {
    password
  }= body;
  let{
    email
  }=body;

  if(!email){
    return res.send({
      success: false,
      message: 'Error: email cannot be empty'
    });
    if(!password){
      return res.send({
        success: false,
        message: 'Error: passwrod cannot be empty'
      });

  email = email.toLowerCase();

  User.find({
    email: email
  }, (err, users)=>{
    if(err){
      return res.send({
        success: false,
        message: 'Error: server Error'
      });
    }
    if(users.lenghth!=1){
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    }
    const user= users[0];
    if(!user.validPassword(password)){
      return res.send({
        success:false,
        message: 'Error: invalid password'
      });
    }
    const userSession=  new userSession();
    userSession.userId= user._id;
    userSession.save((err, doc)=>{
      if(err){
        return res.send({
          success: false,
          message: 'Error: server Error'
        });
      }
      return res.send({
        success: true,
        message: 'Valid signin',
        token: doc._id
      });
    });
  });
  app.get('api/account/verify', (req, res, next) =>{
    const {query} = req;
    const {token} = query;
    userSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions)=> {
      if (err){
        return res.send({
          success: false,
          message:'Error: iternal server error'
        });
      }
      if(sessions.length !=1){
        return res.send({
          success: false,
          message:'Error: iternal server error'
        });
      }else{
        return res.send({
          success: true,
          message:'Good to go'
        });
      }
    });
  });
  app.get('api/account/logout', (req, res, next) =>{
    const {query} = req;
    const {token} = query;
    userSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set: {
        isDeleted:true
      }
    }, null, (err, sessions)=> {
      if (err){
        return res.send({
          success: false,
          message:'Error: iternal server error'
        });
      }
  return res.send({
          success: true,
          message:'Good to go'
        });
    });
  });
};
