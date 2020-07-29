import React,{useState,useEffect} from 'react';
import './App.css';
import Post from './Post'
import {db} from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input, Divider } from '@material-ui/core';
import { auth } from './firebase';
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed';


function getModalStyled(){
  const top=50;
  const left=50;

  return{
    top:`${top}%`,
    left:`${left}%`,
    transform:`translate(-${top}%,-${left}%)`,
  }
}

const useStyles=makeStyles((theme)=>({
  paper:{
    position:'absolute',
    width:400,
    backgroundColor:theme.palette.background.paper,
    border:'2px solid #000',
    boxShadow:theme.shadows[5],
    padding:theme.spacing[2,4,3]
  }
}))


function App() {
  let imgUrl='data:image/png;base64,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';
 const classes=useStyles();
 const [modalStyle,setModelStyle]=useState(getModalStyled)
  const [post,setPost]=useState([]);
  const [open,setOpen]=useState(false);
  const [openSignIn,setOpenSignIn]=useState(false);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [username,setUsername]=useState('');
  const [user,setUser]=useState(null)
  useEffect(()=>{

    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        setUser(authUser)
      }else{
        setUser(null)
      }
    })

    return ()=>{
      unsubscribe();
    }
  },[user,username])

    useEffect(()=>{
      db.collection('instagram').orderBy('timeStamp','desc').onSnapshot(snaps=>{
        setPost(snaps.docs.map(doc=>({id:doc.id,item:doc.data()})));
      })
    },[])


    const signUp=(e)=>{
      e.preventDefault();
      auth.createUserWithEmailAndPassword(email,password)
      .then(authUser=>{
        return authUser.user.updateProfile({
          displayName:username

        })
      })
      .catch(err=>alert(err.message))
    }

    const signIn=e=>{
      e.preventDefault();
      auth.signInWithEmailAndPassword(email,password)
      .catch(err=>alert(err.message))

      setOpenSignIn(false)
    }

  return (
    <div className="app">
      
      
<Modal
  open={open}
  onClose={()=>setOpen(false)}
>
<div style={modalStyle} className={classes.paper}>
      <form onSubmit={signUp} className='app__signUp'>
        <center>
      <img className='app__headerImg' src='data:image/png;base64,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' alt='' />
      </center>
      <Input 
      placeholder='username'
      type='text'
      value={username}
      onChange={e=>setUsername(e.target.value)}/>
      
      <Input 
      placeholder='email'
      type='email'
      value={email}
      onChange={e=>setEmail(e.target.value)}/>
       <Input 
      placeholder='password'
      type='password'
      value={password}
      onChange={e=>setPassword(e.target.value)}/>
      <Button type='submit'>Sign Up</Button>
      </form>
    </div>
</Modal>

<Modal
  open={openSignIn}
  onClose={()=>setOpenSignIn(false)}
>
<div style={modalStyle} className={classes.paper}>
      <form onSubmit={signIn} className='app__signUp'>
        <center>
      <img className='app__headerImg' src='data:image/png;base64,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' alt='' />
      </center>
      <Input 
      placeholder='email'
      type='email'
      value={email}
      onChange={e=>setEmail(e.target.value)}/>
       <Input 
      placeholder='password'
      type='password'
      value={password}
      onChange={e=>setPassword(e.target.value)}/>
      <Button type='submit'>Sign In</Button>
      </form>
    </div>
</Modal>
      <div className='app__header'>
        <img className='app__headerImg' src='data:image/png;base64,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' alt='' />
      
        {
        user?(<Button onClick={()=>auth.signOut()}>Logout</Button>):
        (<div className='app__loginContainer'>
          <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={()=>setOpen(true)}>Sign Up</Button>
        </div>
        )
      }
      
      </div>

      <div className='app__posts'>
         <div className='app__postsLeft'>

         {
        post.map(({id,item})=>{
          return <Post key={id} user={user} postId={id} username={item.username} caption={item.caption} imgUrl={item.imgUrl}/>
        })
      }

         </div>


         <div className='app__postsRight'>
  <InstagramEmbed
  url='https://instagr.am/p/Zw9o4/'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
         </div>
     
      </div>
     

     {
        user?.displayName?(<ImageUpload username={user.displayName}/>):
        (<h3>Sorry you need to login to upload</h3>)
      }
    </div>
  );
}

export default App;
