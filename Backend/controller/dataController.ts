import {db , auth} from '../../Backend/firebaseConfig';
import {doc, setDoc, collection, deleteDoc, deleteField, query, where, getDocs, getDoc } from 'firebase/firestore'


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

  const Deletetask = async ({ title, date }: { title: string; date: string }) => {
    if (auth.currentUser) {
      try {
        const taskDetailRef = doc(db, 'tasks', auth.currentUser.uid, date, 'taskDetail', title);
        await deleteDoc(taskDetailRef);
        console.log('Task Deleted:', title);
        return true;
      } catch (error: any) {
        console.error('Error:', error);
        return false;
      }
    } else {
      console.log('Error: No logged-in user');
      return false;
    }
  };
  
const FetchtaskforDate = async ({date}: {date: string}) => {
    console.log('[DEBUG] Starting fetch for date:', date);
    const currentUser = auth.currentUser;
    console.log('[DEBUG] Current user UID:', currentUser.uid || 'No user');
    
    try {
      const tasksRef = collection(db, 'tasks', currentUser.uid, date);
      console.log('[DEBUG] Tasks collection path:', tasksRef.path);
      
      const querySnapshot = await getDocs(tasksRef);
      console.log('[DEBUG] Found tasks:', querySnapshot.docs.map(d => d.id));
  
      const tasks = await Promise.all(querySnapshot.docs.map(async docSnapshot => {
        const taskId = docSnapshot.id;
        const taskDetailCollectionRef = collection(db, 'tasks', currentUser.uid, date, taskId, 'taskDetail');
        console.log('Fetching task detail collection for:', taskDetailCollectionRef.path);
        const taskDetailSnapshot = await getDocs(taskDetailCollectionRef);
        
        const taskDetails = taskDetailSnapshot.docs.map(detailDoc => detailDoc.data());
        
        console.log('fetch success');
        
        return {
          id: taskId,
          ...docSnapshot.data(),
          taskDetail: taskDetails[0] || {}, // Take the first document if exists
        };
      }));
  
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  };



export { FetchtaskforDate };
export { Savetask };
export { Deletetask };