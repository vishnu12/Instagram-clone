import React,{useState} from 'react'
import { Button } from '@material-ui/core'
import {storage,db} from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'
const ImageUpload = ({username}) => {
    const [image,setImage]=useState(null)
    const [caption,setCaption]=useState('')
    const [progress,setProgress]=useState(0)


    const handleChange=e=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload=()=>{
    const uploadTask=storage.ref(`images/${image?.name}`).put(image);
    
    uploadTask.on(
        'state_changed',
        (snapshot)=>{
            const uploadProgress=Math.round(
                (snapshot.bytesTransferred/snapshot.totalBytes)*100
            );
            setProgress(uploadProgress);
        },
        (error)=>{
            ///error
            alert(error.message)
        },
        ()=>{
            storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then(url=>{
                //post image inside db
                db.collection('instagram').add({
                    timeStamp:firebase.firestore.FieldValue.serverTimestamp(),
                    caption:caption,
                    imgUrl:url,
                    username:username
                })

                setProgress(0);
                setCaption('')
                setImage('')
            })
        }
    )

    }

  return (
    <div className='imageupload'>
    <progress className='imageupload__progress' value={progress} max='100'/>
    <input type='text' placeholder='Enter a caption...' value={caption} onChange={e=>setCaption(e.target.value)}/>
    <input type='file' onChange={handleChange}/>
    <Button className='imageUploadButton'
    onClick={handleUpload}>
     Upload
    </Button>
    </div>
  )
}

export default ImageUpload
