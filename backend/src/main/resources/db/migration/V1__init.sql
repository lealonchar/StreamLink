CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       name VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                       updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE rooms (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       description VARCHAR(500),
                       created_by BIGINT NOT NULL,
                       status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                       livekit_room_name VARCHAR(255),
                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                       updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

                       CONSTRAINT fk_rooms_created_by
                           FOREIGN KEY (created_by)
                               REFERENCES users(id)
);

CREATE INDEX idx_rooms_created_by
    ON rooms(created_by);

CREATE INDEX idx_rooms_status
    ON rooms(status);


CREATE TABLE room_participants (
                                   id BIGSERIAL PRIMARY KEY,
                                   room_id BIGINT NOT NULL,
                                   user_id BIGINT NOT NULL,
                                   role VARCHAR(20) NOT NULL DEFAULT 'PARTICIPANT',
                                   joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                                   left_at TIMESTAMP WITH TIME ZONE,
                                   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                                   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

                                   CONSTRAINT fk_room_participants_room
                                       FOREIGN KEY (room_id)
                                           REFERENCES rooms(id),

                                   CONSTRAINT fk_room_participants_user
                                       FOREIGN KEY (user_id)
                                           REFERENCES users(id),

                                   CONSTRAINT uk_room_user
                                       UNIQUE (room_id, user_id)
);

CREATE INDEX idx_room_participants_room_id
    ON room_participants(room_id);

CREATE INDEX idx_room_participants_user_id
    ON room_participants(user_id);


CREATE TABLE invite_links (
                              id BIGSERIAL PRIMARY KEY,
                              room_id BIGINT NOT NULL,
                              token VARCHAR(64) NOT NULL UNIQUE,
                              status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                              expires_at TIMESTAMP WITH TIME ZONE,
                              used_at TIMESTAMP WITH TIME ZONE,
                              max_uses INTEGER DEFAULT 1,
                              use_count INTEGER NOT NULL DEFAULT 0,
                              created_by BIGINT NOT NULL,
                              created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                              updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

                              CONSTRAINT fk_invite_links_room
                                  FOREIGN KEY (room_id)
                                      REFERENCES rooms(id),

                              CONSTRAINT fk_invite_links_created_by
                                  FOREIGN KEY (created_by)
                                      REFERENCES users(id)
);

CREATE INDEX idx_invite_links_room_id
    ON invite_links(room_id);

CREATE INDEX idx_invite_links_status
    ON invite_links(status);

CREATE INDEX idx_invite_links_created_by
    ON invite_links(created_by);