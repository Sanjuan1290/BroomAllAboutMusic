import { collection, setDoc, doc } from "firebase/firestore"
import { db } from "../firebase"
import packages from "../data/packagesData"

function UploadPackages() {
  const handleUpload = async () => {
    try {
      for (const pkg of packages) {
        await setDoc(doc(collection(db, "packages"), String(pkg.id)), pkg)
        console.log(`✅ Uploaded package: ${pkg.name}`)
      }
      alert("Packages uploaded successfully!")
    } catch (error) {
      console.error("❌ Error uploading packages:", error)
      alert("Error uploading packages, check console.")
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Upload Packages
      </button>
    </div>
  )
}

export default UploadPackages
