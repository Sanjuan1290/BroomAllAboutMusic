import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export default async function fetchPackages() {
  const snapshot = await getDocs(collection(db, "packages"))
  const data = snapshot.docs.map(doc => {
    const pkg = doc.data()
    return {
      id: doc.id,
      ...pkg,
      power: typeof pkg.power === "number" ? pkg.power : Number(pkg.power), // ensure number
    }
  })
  return data
}
