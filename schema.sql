DROP TABLE IF EXISTS events;

CREATE TABLE
    IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        first_trigger_at INTEGER,
        next_trigger_at INTEGER,
        trigger_every INTEGER,
        webhook_url TEXT,
        webhook_method TEXT,
        webhook_params TEXT,
        webhook_headers TEXT,
        webhook_body TEXT
    );