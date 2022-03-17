import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import {upload} from "./upload";

const firebaseConfig = {
    //**** config for firebase *****//
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);



upload('#file',{
    multi:true,
    accept:['.png','.jpg','jpeg','.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const storageRef = ref(storage,`images/${file.name}`)
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                    const block = blocks[index].querySelector('.preview-info-progress')
                    block.textContent = percentage
                    block.style.width = percentage
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log(error)
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                    });
                }
            );
        })
    }
});