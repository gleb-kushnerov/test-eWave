const DB_NAME = 'MOVIES';
const ITEMS_STORAGE_NAME = 'ITEMS';

export class MovieStorage {

    constructor() {
        this.db;
}

    init() {
        return new Promise((resolve, reject) => {
            let openRequest = indexedDB.open(DB_NAME, 1);
            openRequest.onerror = err => reject(err);
            openRequest.onsuccess = () => resolve(this.db = openRequest.result);
            openRequest.onupgradeneeded = event => {
                let db = event.target.result;
                db.createObjectStore(ITEMS_STORAGE_NAME, {
                    autoIncrement: false
                });
            };
        });
    }

    add(item, key) {
        return new Promise((resolve) => {
            let transaction = this.db.transaction([ITEMS_STORAGE_NAME], 'readwrite');
            let objectStore = transaction.objectStore(ITEMS_STORAGE_NAME);
            let request = objectStore.add(item, key);
            request.onsuccess = () => resolve(request.result);
        });
    }

    get(key) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([ITEMS_STORAGE_NAME], 'readonly');
            let storage = transaction.objectStore(ITEMS_STORAGE_NAME);
            let request = storage.get(key);
            request.onerror = err => reject(err);
            request.onsuccess = () => resolve(request.result);
        });
    }

    getAll () {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([ITEMS_STORAGE_NAME], 'readonly');
            let storage = transaction.objectStore(ITEMS_STORAGE_NAME);
            let request = storage.getAll();
            request.onerror = err => reject(err);
            request.onsuccess = () => resolve(request.result);
        });
    }

    change(id, rating) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([ITEMS_STORAGE_NAME], 'readwrite');
            let objectStore = transaction.objectStore(ITEMS_STORAGE_NAME);
            let request = objectStore.get(id);
            request.onerror = err => reject(err);
            request.onsuccess = () => {
                request.result.rating = rating;
                objectStore.put(request.result, id)
            };
        });
    }
}

