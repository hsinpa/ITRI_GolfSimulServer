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
    nation VARCHAR(150) NOT NULL DEFAULT "Unknown",

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

    FOREIGN KEY (user_id)  REFERENCES Account(id),
    FOREIGN KEY (golf_field_id)  REFERENCES SelfGolfField(id),

    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS Game (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(120) NOT NULL DEFAULT "",
    user_id VARCHAR(200) NOT NULL DEFAULT "",
    map_id VARCHAR(100) NOT NULL DEFAULT "",
    score TEXT NOT NULL,
    retrospect_video_id varchar(250) NOT NULL DEFAULT '',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
