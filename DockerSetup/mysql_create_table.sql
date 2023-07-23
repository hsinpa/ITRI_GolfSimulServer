CREATE TABLE IF NOT EXISTS Account (
	id VARCHAR(200) PRIMARY KEY,
    name NVarchar(100) NOT NULL,
    email NVarchar(100) NOT NULL,
    is_forget_password_mail_send BOOLEAN NOT NULL DEFAULT False,
    password CHAR(64),
    gender INT(1) NOT NULL DEFAULT 0,
    type NVarchar(50) NOT NULL DEFAULT "root",
    token CHAR(64) NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (email)

) CHARACTER SET utf8 COLLATE utf8_unicode_ci;