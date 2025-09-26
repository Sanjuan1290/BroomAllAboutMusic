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
    image: "",
    colorFrom: "#6366f1",
    colorTo: "#8b5cf6",
  });

  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch packages
  const fetchPackages = async () => {
    try {
      const q = query(
        collection(db, "packages"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setPackages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching packages:", err);
      alert("Error fetching packages: " + err.message);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Add or update package
  const handleSave = async () => {
    if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) {
      return alert("You must be logged in as admin to manage packages.");
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
        image: newPackage.image,
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

      setCurrentPage(1); // reset to first page after save
      await fetchPackages();
    } catch (err) {
      console.error("Error saving package:", err);
      alert("Error saving package: " + err.message);
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
      alert("Error deleting package: " + err.message);
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
            onChange={(e) =>
              setNewPackage({ ...newPackage, name: e.target.value })
            }
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
              onChange={(e) =>
                setNewPackage({ ...newPackage, capacity: e.target.value })
              }
              className="border p-2 rounded w-full"
              placeholder="e.g. 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₱)</label>
            <input
              type="number"
              value={newPackage.price}
              onChange={(e) =>
                setNewPackage({ ...newPackage, price: e.target.value })
              }
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
            onChange={(e) =>
              setNewPackage({ ...newPackage, power: e.target.value })
            }
            className="border p-2 rounded w-full"
            placeholder="e.g. 500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Speakers</label>
          <input
            type="text"
            value={newPackage.speakers}
            onChange={(e) =>
              setNewPackage({ ...newPackage, speakers: e.target.value })
            }
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
            onChange={(e) =>
              setNewPackage({ ...newPackage, addOns: e.target.value })
            }
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
            onChange={(e) =>
              setNewPackage({ ...newPackage, inclusion: e.target.value })
            }
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
            onChange={(e) =>
              setNewPackage({ ...newPackage, recommendedEvent: e.target.value })
            }
            className="border p-2 rounded w-full"
            placeholder="e.g. Birthday, Wedding"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={newPackage.duration}
            onChange={(e) =>
              setNewPackage({ ...newPackage, duration: e.target.value })
            }
            className="border p-2 rounded w-full"
            placeholder="e.g. 120"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Image URL
            <span className="block text-xs text-gray-500 mt-1">
              Upload your image on{" "}
              <a
                href="https://imgur.com/upload"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Imgur
              </a>
              . After upload, right-click the image → <b>Copy Image Address</b>{" "}
              and paste it here. The link must end in <code>.jpg</code>,{" "}
              <code>.png</code>, or <code>.gif</code>.
            </span>
          </label>
          <input
            type="text"
            value={newPackage.image}
            onChange={(e) =>
              setNewPackage({ ...newPackage, image: e.target.value })
            }
            className="border p-2 rounded w-full"
            placeholder="https://i.imgur.com/xxxxxxx.jpg"
          />
          {newPackage.image && (
            <img
              src={newPackage.image}
              alt="Preview"
              className="mt-2 h-32 object-contain rounded border"
            />
          )}
        </div>

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
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Packages List */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {paginatedPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="p-4 bg-white rounded-lg shadow flex flex-col justify-between"
          >
            <div>
              {pkg.image && (
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="h-40 w-full object-contain rounded"
                />
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
                <button
                  onClick={() => handleEdit(pkg)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
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
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
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
