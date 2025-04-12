DROP TABLE IF EXISTS events;

CREATE TABLE
    IF NOT EXISTS events (
        id STRING PRIMARY KEY,
        first_trigger_at INTEGER,
        next_trigger_at INTEGER,
        trigger_every INTEGER,
        webhook_url STRING,
        webhook_method STRING,
        webhook_params STRING,
        webhook_headers STRING,
        webhook_body STRING
    );