// src/components/pages/admin/AdminPackages.jsx
import { useState, useEffect } from "react";
import { db, auth } from "../../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

const ADMIN_EMAIL = "robertrenbysanjuan@gmail.com";
const ITEMS_PER_PAGE = 10;

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newPackage, setNewPackage] = useState({
    name: "",
    capacity: "",
    price: "",
    power: "",
    speakers: "",
    addOns: "",
    inclusion: "",
    duration: "",
    recommendedEvent: "",
    image: "", // will store the Cloudinary URL after upload
    colorFrom: "#6366f1",
    colorTo: "#8b5cf6",
  });

  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreviewLocal, setImagePreviewLocal] = useState(null); // temporary local preview

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  // Fetch packages
  const fetchPackages = async () => {
    try {
      const q = query(collection(db, "packages"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPackages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching packages:", err);
      alert("Error fetching packages: " + (err?.message || err));
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Image upload handler (Cloudinary unsigned)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreviewLocal(URL.createObjectURL(file));
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "BroomAllAboutMusic"); // 👈 put uploads into this folder

      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Cloudinary error:", data);
        alert("Image upload failed. See console for details.");
        setUploadingImage(false);
        return;
      }

      setNewPackage((prev) => ({ ...prev, image: data.secure_url }));
      setImagePreviewLocal(data.secure_url);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Check console.");
    } finally {
      setUploadingImage(false);
    }
  };


  // Add or update package
  const handleSave = async () => {
    if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) {
      return alert("You must be logged in as admin to manage packages.");
    }

    // Basic validation
    if (!newPackage.name || !newPackage.price) {
      return alert("Please provide at least package name and price.");
    }

    setLoading(true);
    try {
      const pkgToSave = {
        name: newPackage.name,
        capacity: Number(newPackage.capacity) || 0,
        price: Number(newPackage.price) || 0,
        power: Number(newPackage.power) || 0,
        speakers: newPackage.speakers || "",
        addOns: newPackage.addOns || "",
        inclusion: newPackage.inclusion || "",
        duration: Number(newPackage.duration) || 0,
        recommendedEvent: newPackage.recommendedEvent || "",
        image: newPackage.image || "",
        colorFrom: newPackage.colorFrom || "#6366f1",
        colorTo: newPackage.colorTo || "#8b5cf6",
        updatedAt: new Date(),
      };

      if (editId) {
        await updateDoc(doc(db, "packages", editId), pkgToSave);
        setEditId(null);
      } else {
        await addDoc(collection(db, "packages"), {
          ...pkgToSave,
          createdAt: new Date(),
        });
      }

      setNewPackage({
        name: "",
        capacity: "",
        price: "",
        power: "",
        speakers: "",
        addOns: "",
        inclusion: "",
        duration: "",
        recommendedEvent: "",
        image: "",
        colorFrom: "#6366f1",
        colorTo: "#8b5cf6",
      });
      setImagePreviewLocal(null);
      setCurrentPage(1); // reset to first page after save
      await fetchPackages();
    } catch (err) {
      console.error("Error saving package:", err);
      alert("Error saving package: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Delete package
  const handleDelete = async (id) => {
    if (!confirm("Delete this package?")) return;
    try {
      await deleteDoc(doc(db, "packages", id));
      setPackages((p) => p.filter((x) => x.id !== id));
      setCurrentPage(1); // reset to first page after delete
    } catch (err) {
      console.error("Error deleting package:", err);
      alert("Error deleting package: " + (err?.message || err));
    }
  };

  // Edit package
  const handleEdit = (pkg) => {
    setNewPackage({
      ...pkg,
      addOns: pkg.addOns || "",
      inclusion: pkg.inclusion || "",
      recommendedEvent: pkg.recommendedEvent || "",
    });
    setEditId(pkg.id);
    setImagePreviewLocal(pkg.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isAdmin = auth.currentUser && auth.currentUser.email === ADMIN_EMAIL;

  // Pagination logic
  const totalPages = Math.ceil(packages.length / ITEMS_PER_PAGE);
  const paginatedPackages = packages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Packages</h1>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Signed in as:{" "}
          <span className="font-medium">
            {auth.currentUser ? auth.currentUser.email : "Not signed in"}
          </span>
        </p>
        {!isAdmin && (
          <p className="text-yellow-600 text-sm">
            You must login with admin email to manage packages.
          </p>
        )}
      </div>

      {/* Add/Edit Package Form */}
      <div className="space-y-3 bg-white p-4 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Package Name</label>
          <input
            type="text"
            value={newPackage.name}
            onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="e.g. Basic Sound System"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              value={newPackage.capacity}
              onChange={(e) => setNewPackage({ ...newPackage, capacity: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="e.g. 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₱)</label>
            <input
              type="number"
              value={newPackage.price}
              onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="e.g. 5000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Power (Watts)</label>
          <input
            type="number"
            value={newPackage.power}
            onChange={(e) => setNewPackage({ ...newPackage, power: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="e.g. 500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Speakers</label>
          <input
            type="text"
            value={newPackage.speakers}
            onChange={(e) => setNewPackage({ ...newPackage, speakers: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="e.g. JBL 2pcs"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            AddOns <span className="text-gray-500">(comma separated)</span>
          </label>
          <input
            type="text"
            value={newPackage.addOns}
            onChange={(e) => setNewPackage({ ...newPackage, addOns: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="e.g. Microphone, Mixer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Inclusions <span className="text-gray-500">(comma separated)</span>
          </label>
          <input
            type="text"
            value={newPackage.inclusion}
            onChange={(e) => setNewPackage({ ...newPackage, inclusion: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="e.g. Free delivery, Setup"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Recommended Events <span className="text-gray-500">(comma separated)</span>
          </label>
          <input
            type="text"
            value={newPackage.recommendedEvent}
            onChange={(e) => setNewPackage({ ...newPackage, recommendedEvent: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="e.g. Birthday, Wedding"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <input
            type="number"
            value={newPackage.duration}
            onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="e.g. 120"
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 rounded w-full"
            disabled={uploadingImage}
          />
          {uploadingImage && <p className="text-sm text-gray-600 mt-2">Uploading image...</p>}

          {imagePreviewLocal && (
            <img
              src={imagePreviewLocal}
              alt="Preview"
              className="mt-2 h-32 object-contain rounded border"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={loading || !isAdmin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : editId ? "Update Package" : "Add Package"}
          </button>

          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setNewPackage({
                  name: "",
                  capacity: "",
                  price: "",
                  power: "",
                  speakers: "",
                  addOns: "",
                  inclusion: "",
                  duration: "",
                  recommendedEvent: "",
                  image: "",
                  colorFrom: "#6366f1",
                  colorTo: "#8b5cf6",
                });
                setImagePreviewLocal(null);
              }}
              className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Packages List */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {paginatedPackages.map((pkg) => (
          <div key={pkg.id} className="p-4 bg-white rounded-lg shadow flex flex-col justify-between">
            <div>
              {pkg.image && (
                <img src={pkg.image} alt={pkg.name} className="h-40 w-full object-contain rounded" />
              )}
              <h2 className="text-xl font-bold mt-2">{pkg.name}</h2>
              <p>Capacity: {pkg.capacity}</p>
              <p>Price: ₱{pkg.price?.toLocaleString()}</p>
              <p>Power: {pkg.power}W</p>
              <p>Speakers: {pkg.speakers}</p>
              <p>AddOns: {pkg.addOns || "-"}</p>
              <p>Inclusion: {pkg.inclusion || "-"}</p>
              <p>Recommended: {pkg.recommendedEvent || "-"}</p>
              <p>Duration: {pkg.duration} mins</p>
            </div>

            {isAdmin && (
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(pkg)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                  Edit
                </button>
                <button onClick={() => handleDelete(pkg.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
