import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export default async function fetchPackages() {
  const snapshot = await getDocs(collection(db, "packages"))
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return data
}
