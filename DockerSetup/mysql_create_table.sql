CREATE TABLE IF NOT EXISTS Account (
	id VARCHAR(200) PRIMARY KEY,
    name NVarchar(100) NOT NULL,
    email NVarchar(100) NOT NULL,
    is_forget_password_mail_send BOOLEAN NOT NULL DEFAULT False,
    password CHAR(64),
    gender INT(1) NOT NULL DEFAULT 0,
    type NVarchar(50) NOT NULL DEFAULT "root",
    token CHAR(64) NOT NULL,
    height FLOAT(8) NOT NULL DEFAULT 0,
    weight FLOAT(8) NOT NULL DEFAULT 0,
    birthday varchar(40) NOT NUll,
    nation VARCHAR(150) NOT NULL DEFAULT "Unknown",
    avatar_url VARCHAR(500) NOT NULL DEFAULT "",
    profile_picture_num INT(12) NOT NULL DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (email)

) CHARACTER SET utf8 COLLATE utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS SelfGolfField (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    map_id VARCHAR(100) NOT NULL DEFAULT "",
    ok_radius Float(8) NOT NULL DEFAULT 1,
    hole_count int(11) Not Null DEFAULT 9,
    flag_position BOOLEAN NOT NULL DEFAULT FALSE,
    wind_speed VARCHAR(150) NOT NULL DEFAULT "Unknown",
    distance_unit VARCHAR(150) NOT NULL DEFAULT "Unknown",
    birthday VARCHAR(40) NOT NULL DEFAULT "",
    mascot_sound BOOLEAN NOT NULL DEFAULT True,
    auto_ball_supply BOOLEAN NOT NULL DEFAULT True,
    action_detect_platform BOOLEAN NOT NULL DEFAULT True,
    video_replay BOOLEAN NOT NULL DEFAULT True,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS SelfGolfFieldMap (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(200) NOT NULL DEFAULT "",
    golf_field_id int NOT NULL DEFAULT 1,
    mode varchar(50) NOT NULL Default 'competetive_mode';
    FOREIGN KEY (user_id)  REFERENCES Account(id),
    FOREIGN KEY (golf_field_id)  REFERENCES SelfGolfField(id),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS Game (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(120) NOT NULL DEFAULT "",
    user_id VARCHAR(200) NOT NULL DEFAULT "",
    map_id VARCHAR(100) NOT NULL DEFAULT "",
    mode_type VARCHAR(100) NOT NULL DEFAULT "watch_mode",
    par_score TEXT NOT NULL,
    player_count INT(11) Default 1,
    hole_count INT(11) Default 1,
    timestamp VARCHAR(150) NOT NULL DEFAULT "",
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS GolfFieldScreenshotMap (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(200) NOT NULL DEFAULT "",
    golf_field_id int NOT NULL DEFAULT 1,
    image_url VARCHAR(500) NOT NULL DEFAULT "",
    FOREIGN KEY (user_id)  REFERENCES Account(id),
    FOREIGN KEY (golf_field_id)  REFERENCES SelfGolfField(id),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS MiniGolfScore(
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(500) NOT NULL DEFAULT "",
    terrain_id VARCHAR(500) NOT NULL DEFAULT "",
    score int NOT NULL DEFAULT 0,
    game_mode VARCHAR(50) NOT NULL DEFAULT "normal",
    FOREIGN KEY (user_id)  REFERENCES Account(id),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS GoogleStorageAssets(
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tag VARCHAR(100) NOT NULL DEFAULT "",
    url VARCHAR(800) NOT NULL DEFAULT "",
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS GameRecord (
    user_count INT(200) NOT NULL DEFAULT 0,
    totol_play_time INT(200) DEFAULT 0
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
INSERT INTO `GameRecord` (user_count, totol_play_time) VALUES (0, 0);