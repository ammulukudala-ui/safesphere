import { db } from "./firebase.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Create map
const map = L.map('map').setView([17.3850, 78.4867], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Load markers
async function loadIncidents() {
  const snapshot = await getDocs(collection(db, "incidents"));
  const data = snapshot.docs.map(doc => doc.data());

  data.forEach(item => {
    L.marker([item.lat, item.lng]).addTo(map)
      .bindPopup(item.type);
  });
}

loadIncidents();

// Add new incident
window.reportIncident = async function () {
  const lat = 17.3850;
  const lng = 78.4867;

  await addDoc(collection(db, "incidents"), {
    lat,
    lng,
    type: "danger",
    time: new Date()
  });

  alert("Incident reported!");
  location.reload();
};