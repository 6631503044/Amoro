import {db , auth} from '../firebaseConfig'
import {doc, setDoc, collection, deleteDoc, deleteField} from 'firebase/firestore'


interface TaskDetails {
    title: string;
    description: string;
    date: string;
    location: string;
    startTime: string;
    endTime: string;
    withPartner: boolean;
}

const Savetask = async ({title, description, date, location, startTime, endTime, withPartner}: TaskDetails) => {
    if(auth.currentUser){
        try{
            const taskDocRef = doc(collection(db, 'tasks', auth.currentUser.uid, date));
            await setDoc(taskDocRef, {});
            await setDoc(doc(taskDocRef, 'taskDetail', title), {
                title: title,
                description: description,
                location: location,
                startTime: startTime,
                endTime: endTime,
                withPartner: withPartner,
                createdAt: new Date(),
            });
            
            console.log('Document written with ID: ', taskDocRef.id);
            return true;
        }catch (error: any) {
            console.error('save failed:', error);
        }
    } else {
        console.log('Error: No logged in user' );
            return false;
    }
  };

  const Deletetask = async ({title}: TaskDetails) =>{
    if(auth.currentUser){
         try {
            await deleteDoc(doc(db,'tasks',auth.currentUser.uid,title,'taskDetail'));
            await deleteDoc(doc(db,'tasks',auth.currentUser.uid,title,'Review'));
            console.log("Document Deleted");
            return true;
            
        } catch (error:any) {
            console.log('Error: '+ error );
            return false;
        }
    }
  }

export { Savetask };
export { Deletetask };