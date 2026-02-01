(function () {
    const STORAGE_PREFIX = "vokabul_";
    const STORAGE_VERSION = 1;
    const VERSION_KEY = STORAGE_PREFIX + "version";

    const StorageKeys = {
        VERSION: VERSION_KEY,
        QUICK_GUESS: STORAGE_PREFIX + "quick_guess",
        ORD_GUESS_RECORD: STORAGE_PREFIX + "ordgjettespill_record",
        ORD_GUESS_TODAY: STORAGE_PREFIX + "ordgjettespill_stats_today",
        ORD_GUESS_ALLTIME: STORAGE_PREFIX + "ordgjettespill_stats_alltime",
        ORD_GUESS_ATTEMPTS: STORAGE_PREFIX + "ordgjettespill_attempts",
        VOKABULAR_STATS: STORAGE_PREFIX + "vokabularspill_stats",
        VOKABULAR_PRACTICE: STORAGE_PREFIX + "vokabularspill_practice",
        VOKABULAR_ATTEMPTS: STORAGE_PREFIX + "vokabularspill_attempts",
        LEGACY_STATE: STORAGE_PREFIX + "legacy_vokab_state",
        LEGACY_ATTEMPTS: STORAGE_PREFIX + "legacy_vokab_attempts",
        SYNONYM_STORE: STORAGE_PREFIX + "synonymspill_store",
        SYNONYM_ATTEMPTS: STORAGE_PREFIX + "synonymspill_attempts",
        KONTINUUM_STATS: STORAGE_PREFIX + "kontinuum_stats",
    };

    function canUseStorage() {
        try {
            const key = STORAGE_PREFIX + "__test__";
            localStorage.setItem(key, "1");
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            return false;
        }
    }

    const storageAvailable = canUseStorage();

    function readJson(key, fallback) {
        if (!storageAvailable) return fallback;
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        try {
            return JSON.parse(raw);
        } catch (error) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        if (!storageAvailable) return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            return;
        }
    }

    function remove(key) {
        if (!storageAvailable) return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            return;
        }
    }

    function getStats(key, fallback) {
        return readJson(key, fallback);
    }

    function saveStats(key, data) {
        writeJson(key, data);
    }

    function getList(key, fallback) {
        const list = readJson(key, fallback || []);
        return Array.isArray(list) ? list : fallback || [];
    }

    function saveList(key, list) {
        if (!Array.isArray(list)) return;
        writeJson(key, list);
    }

    function appendToList(key, item, limit) {
        const list = getList(key, []);
        list.push(item);
        if (Number.isFinite(limit) && limit > 0 && list.length > limit) {
            list.splice(0, list.length - limit);
        }
        writeJson(key, list);
        return list;
    }

    function migrateLegacyKeys() {
        const mappings = [
            { old: "ordgjettespill_rekord", next: StorageKeys.ORD_GUESS_RECORD },
            { old: "ordgjettespill_stats_today", next: StorageKeys.ORD_GUESS_TODAY },
            { old: "ordgjettespill_stats_alltime", next: StorageKeys.ORD_GUESS_ALLTIME },
            { old: "vokabularspill_stats_v1", next: StorageKeys.VOKABULAR_STATS },
            { old: "vokabularspill_practice_list", next: StorageKeys.VOKABULAR_PRACTICE },
            { old: "vokabularspill_v1", next: StorageKeys.LEGACY_STATE },
            { old: "synonymspill_v1", next: StorageKeys.SYNONYM_STORE },
            { old: "kontinuum_stats_v1", next: StorageKeys.KONTINUUM_STATS },
            { old: "vokabulQuickGuess", next: StorageKeys.QUICK_GUESS },
        ];

        mappings.forEach((entry) => {
            const oldValue = localStorage.getItem(entry.old);
            if (oldValue !== null && localStorage.getItem(entry.next) === null) {
                localStorage.setItem(entry.next, oldValue);
            }
            if (oldValue !== null) {
                localStorage.removeItem(entry.old);
            }
        });
    }

    function migrateStorageIfNeeded() {
        if (!storageAvailable) {
            return { migrated: false, reason: "storage-unavailable" };
        }
        const currentRaw = localStorage.getItem(VERSION_KEY);
        const current = Number.parseInt(currentRaw, 10);
        if (Number.isInteger(current) && current >= STORAGE_VERSION) {
            return { migrated: false, version: current };
        }
        migrateLegacyKeys();
        try {
            localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION));
        } catch (error) {
            return { migrated: false, reason: "write-failed" };
        }
        return { migrated: true, version: STORAGE_VERSION };
    }

    window.VokabulStorage = {
        keys: StorageKeys,
        version: STORAGE_VERSION,
        canUseStorage,
        readJson,
        writeJson,
        remove,
        getStats,
        saveStats,
        getList,
        saveList,
        appendToList,
        migrateStorageIfNeeded,
    };
})();
