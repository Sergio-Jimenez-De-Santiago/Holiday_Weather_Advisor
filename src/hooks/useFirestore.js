import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreReducer = (state, action) => {
    switch(action.type){
        case 'IS_PENDING':
            return { isPending: true, document: null, success: false, error: null }
        case 'ADDED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'DELETED_DOCUMENT':
            return { isPending: false, document: null, success: true, error: null }
        case 'ERROR':
            return { isPending: false, document: null, success: false, error: action.payload } 
        default: 
            return state
    }
}

export const useFirestore = (collection) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    const ref = projectFirestore.collection(collection);

    const dispatchIfNotCancelled = (action) => {
        if(!isCancelled){
            dispatch(action)
        }
    }

    const addDocument = async (doc) => {
        dispatch({ type: 'IS_PENDING'})
        try {
            const createdAt = timestamp.fromDate(new Date());
            const addedDocument = await ref.add({ ...doc, createdAt });
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument });
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
        }
    }

    // update document (if no document exists for uid, add one)
    const updateDocument = async (doc) => {
        dispatch({ type: 'IS_PENDING' })
        try {
            const { uid } = doc
            const querySnapshot = await ref.where("uid", "==", uid).get()
            const timeNow = timestamp.fromDate(new Date())
            if (querySnapshot.empty) {
                // No document exists, so add one
                const addedDocument = await ref.add({ ...doc, createdAt: timeNow })
                dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
            } else {
                // Document exists, so update the first one found (there's only one per user)
                const documentId = querySnapshot.docs[0].id
                await ref.doc(documentId).update({ ...doc, updatedAt: timeNow })
                dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: { id: documentId, ...doc, updatedAt: timeNow } })
            }
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
        }
    }

    const deleteDocument = async (id) => {
        dispatch({ type: 'IS_PENDING' })
        try {
            await ref.doc(id).delete()
            dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' })
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { addDocument, updateDocument, deleteDocument, response}
}