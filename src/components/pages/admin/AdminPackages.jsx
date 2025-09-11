// src/components/pages/admin/AdminPackages.jsx
import { useState, useEffect } from "react";
import { db, auth } from "../../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const ADMIN_EMAIL = "robertrenbysanjuan@gmail.com"; // your admin email

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
    image: "", // <-- now just a URL
    colorFrom: "#6366f1",
    colorTo: "#8b5cf6",
  });

  // Fetch packages from Firestore
  const fetchPackages = async () => {
    try {
      const snap = await getDocs(collection(db, "packages"));
      setPackages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching packages:", err);
      alert("Error fetching packages: " + err.message);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Add package (Firestore only)
  const handleAdd = async () => {
    if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) {
      return alert("You must be logged in as admin to add packages.");
    }

    setLoading(true);
    try {
      const pkgToSave = {
        name: newPackage.name,
        capacity: Number(newPackage.capacity) || 0,
        price: Number(newPackage.price) || 0,
        power: Number(newPackage.power) || 0,
        speakers: newPackage.speakers || "",
        addOns: newPackage.addOns
          ? newPackage.addOns.split(",").map((s) => s.trim())
          : [],
        inclusion: newPackage.inclusion
          ? newPackage.inclusion.split(",").map((s) => s.trim())
          : [],
        duration: Number(newPackage.duration) || 0,
        recommendedEvent: newPackage.recommendedEvent
          ? newPackage.recommendedEvent.split(",").map((s) => s.trim())
          : [],
        image: newPackage.image, // <-- directly save the URL
        colorFrom: newPackage.colorFrom || "#6366f1",
        colorTo: newPackage.colorTo || "#8b5cf6",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "packages"), pkgToSave);

      // reset form
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

      await fetchPackages();
    } catch (err) {
      console.error("Error adding package:", err);
      alert("Error adding package: " + err.message);
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
    } catch (err) {
      console.error("Error deleting package:", err);
      alert("Error deleting package: " + err.message);
    }
  };

  const isAdmin = auth.currentUser && auth.currentUser.email === ADMIN_EMAIL;

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

      {/* Add Package Form */}
      <div className="space-y-3 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Package Name"
          value={newPackage.name}
          onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Capacity"
            value={newPackage.capacity}
            onChange={(e) =>
              setNewPackage({ ...newPackage, capacity: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Price"
            value={newPackage.price}
            onChange={(e) =>
              setNewPackage({ ...newPackage, price: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
        </div>

        <input
          type="number"
          placeholder="Power (W)"
          value={newPackage.power}
          onChange={(e) =>
            setNewPackage({ ...newPackage, power: e.target.value })
          }
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Speakers"
          value={newPackage.speakers}
          onChange={(e) =>
            setNewPackage({ ...newPackage, speakers: e.target.value })
          }
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="AddOns (comma separated)"
          value={newPackage.addOns}
          onChange={(e) =>
            setNewPackage({ ...newPackage, addOns: e.target.value })
          }
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Inclusion (comma separated)"
          value={newPackage.inclusion}
          onChange={(e) =>
            setNewPackage({ ...newPackage, inclusion: e.target.value })
          }
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Recommended Events (comma separated)"
          value={newPackage.recommendedEvent}
          onChange={(e) =>
            setNewPackage({
              ...newPackage,
              recommendedEvent: e.target.value,
            })
          }
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={newPackage.duration}
          onChange={(e) =>
            setNewPackage({ ...newPackage, duration: e.target.value })
          }
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={newPackage.image}
          onChange={(e) =>
            setNewPackage({ ...newPackage, image: e.target.value })
          }
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleAdd}
          disabled={loading || !isAdmin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Package"}
        </button>
      </div>

      {/* Packages List */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="p-4 bg-white rounded-lg shadow flex flex-col justify-between"
          >
            <div>
              {pkg.image && (
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="h-40 w-full object-cover rounded"
                />
              )}
              <h2 className="text-xl font-bold mt-2">{pkg.name}</h2>
              <p>Capacity: {pkg.capacity}</p>
              <p>Price: ₱{pkg.price?.toLocaleString()}</p>
              <p>Power: {pkg.power}W</p>
              <p>Speakers: {pkg.speakers}</p>
              <p>AddOns: {(pkg.addOns || []).join(", ")}</p>
              <p>Inclusion: {(pkg.inclusion || []).join(", ")}</p>
              <p>Recommended: {(pkg.recommendedEvent || []).join(", ")}</p>
              <p>Duration: {pkg.duration} mins</p>
            </div>

            {isAdmin && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
