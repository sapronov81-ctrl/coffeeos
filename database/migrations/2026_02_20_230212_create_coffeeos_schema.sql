-- This migration script creates tables for subscriptions, audits, chat history, detailed profile fields, and usage tracking.

CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    plan VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audits (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    action_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    chat_message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detailed_profile (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    field_name VARCHAR(255) NOT NULL,
    field_value TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usage_tracking (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    action_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    duration INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Foreign Key Constraints
ALTER TABLE subscriptions ADD CONSTRAINT fk_user_sub FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE audits ADD CONSTRAINT fk_user_audit FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE chat_history ADD CONSTRAINT fk_user_chat FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE detailed_profile ADD CONSTRAINT fk_user_profile FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE usage_tracking ADD CONSTRAINT fk_user_usage FOREIGN KEY (user_id) REFERENCES users(id);

-- Add indexes for performance optimization
CREATE INDEX idx_user_id_sub ON subscriptions(user_id);
CREATE INDEX idx_user_id_audit ON audits(user_id);
CREATE INDEX idx_user_id_chat ON chat_history(user_id);
CREATE INDEX idx_user_id_profile ON detailed_profile(user_id);
CREATE INDEX idx_user_id_usage ON usage_tracking(user_id);