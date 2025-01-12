let db;
const request = indexedDB.open("messagesDB", 1);

// Tangani error saat membuka IndexedDB
request.onerror = function (event) {
    console.error("Database error:", event.target.errorCode);
};

// Ketika IndexedDB berhasil dibuka
request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database initialized");

    const kirimButton = document.querySelector('button[name="button"]');
    if (kirimButton) {
        kirimButton.addEventListener("click", () => {
            const inputNama = document.querySelector('input[name="your_name"]').value;
            const inputPesan = document.querySelector('textarea[name="message"]').value;

            if (inputNama && inputPesan) {
                saveMessagesToIndexedDB(inputNama, inputPesan);
            } else {
                alert("Nama dan Pesan harus diisi!");
            }
        });
    } else {
        console.error("Tombol kirim tidak ditemukan!");
    }
};

// Tangani saat database di-upgrade
request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("nama", "nama", { unique: false });
    objectStore.createIndex("pesan", "pesan", { unique: false });
    console.log("Object Store created");
};

function requestNotificationPermission() {
    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted");
            }
        });
    }
}

function showNotification() {
    if (Notification.permission === "granted") {
        try {
            new Notification("Pesan Baru", {
                body: "Data berhasil disimpan di IndexedDB",
                icon: "/images/logos.png",
                vibrate: [200, 100, 200],
            });
        } catch (error) {
            console.error("Gagal menampilkan notifikasi:", error);
        }
    } else {
        console.log("Permission not granted for Notification");
    }
}

function saveMessagesToIndexedDB(nama, pesan) {
    const tx = db.transaction(["messages"], "readwrite");
    const objectStore = tx.objectStore("messages");

    const contactData = { nama, pesan };
    const request = objectStore.add(contactData);

    request.onsuccess = function() {
        console.log("Data berhasil disimpan");
        alert("Pesan anda telah terkirim");
        showNotification();
    };

    request.onerror = function(event) {
        console.error("Error saat menyimpan data:", event.target.errorCode);
    };
}

document.addEventListener("DOMContentLoaded", () => {
    requestNotificationPermission();
});
