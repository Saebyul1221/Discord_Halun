USE halun;

/* 역할 정보 테이블 */
DROP TABLE IF EXISTS `getrole`;
CREATE TABLE getrole (
    `channel` VARCHAR(255) NOT NULL,
    `messageID` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`channel`, `messageID`)
);

/* 인증 버튼 정보 테이블 */
DROP TABLE IF EXISTS `authentication`;
CREATE TABLE authentication (
    `channel` VARCHAR(255) NOT NULL,
    `messageID` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`channel`, `messageID`)
);

/* 인증 로그 테이블 */
DROP TABLE IF EXISTS `authenticationlogs`;
CREATE TABLE authenticationlogs (
    `index` BIGINT auto_increment,
    `userID` VARChAR(255) NOT NULL,
    `time` TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY(`index`, `userID`)
);

/* 입장 메시지 테이블 */
DROP TABLE IF EXISTS `entry`;
CREATE TABLE `entry` (
    `join` VARCHAR(255) NOT NULL DEFAULT "{user} 님께서 {guild} 에 오셨습니다. 환영해요! 현재 인원 수: **{count}**명",
    `quit` VARCHAR(255) NOT NULL DEFAULT "{user} 님께서 퇴장하셨습니다.. 현재 인원 수: **{count}**명"
);

/* 커스텀 커맨드 테이블 */
DROP TABLE IF EXISTS `customcmd`;
CREATE TABLE `customcmd` (
    `user` VARCHAR(255) NOT NULL,
    `cmd` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL
);