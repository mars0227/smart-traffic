/******************************************
* 1: Create Database smart_traffic
******************************************/

CREATE DATABASE IF NOT EXISTS `smart_traffic`
CHARACTER SET utf8
COLLATE utf8_unicode_ci;

SET SQL_MODE='ALLOW_INVALID_DATES';

USE `smart_traffic`;

/******************************************
* 2: Create tables for various ID
******************************************/
/** identity **/
CREATE TABLE IF NOT EXISTS `identity`
(
    `identity_id`           serial COMMENT 'identity id',
    `identity_name`         varchar(64) NOT NULL COMMENT 'manager, vendor, staff',
    `created_at`            timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at`            datetime  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`identity_id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/** user **/
CREATE TABLE IF NOT EXISTS `user`
(
  `user_id`         serial COMMENT 'user id',
  `password`        varchar(64) NOT NULL,
  `email`           varchar(64) DEFAULT NULL,
  `name`            varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `active`          tinyint(1) DEFAULT 0,
  `identity_id`     bigint(11) UNSIGNED NOT NULL,
  `created_at`      timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      datetime  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY (`email`),
  CONSTRAINT `index_user_on_identity_id` FOREIGN KEY (`identity_id`) REFERENCES identity(`identity_id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/** construction location **/
CREATE TABLE IF NOT EXISTS `construction`
(
    `construction_id`       serial COMMENT 'construction id',
    `construction_name`     varchar(64) NOT NULL,
    `created_at`            timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at`            datetime  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`construction_id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/** reservation **/
CREATE TABLE IF NOT EXISTS `reservation`
(
    `reservation_id`        serial COMMENT 'reservation id',
    `creater_id`            bigint(11) UNSIGNED NOT NULL,
    `reviewer_id`           bigint(11) UNSIGNED,
    `construction_id`       bigint(11) UNSIGNED NOT NULL,
    `date`                  varchar(12) NOT NULL,
    `time_slot`             varchar(17) NOT NULL,
    `license_plate_number`  varchar(64) NOT NULL,
    `material`              varchar(64) NOT NULL,
    `image`                 varchar(64) COMMENT 'uploaded image name',
    `state`                 tinyint(3) DEFAULT 1 COMMENT 'enum(created, accepted, refused)',
    `created_at`            timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at`            datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`reservation_id`),
    CONSTRAINT `index_reservation_on_creater_id` FOREIGN KEY (`creater_id`) REFERENCES user(`user_id`),
    CONSTRAINT `index_reservation_on_reviewer_id` FOREIGN KEY (`reviewer_id`) REFERENCES user(`user_id`),
    CONSTRAINT `index_reservation_on_construction_id` FOREIGN KEY (`construction_id`) REFERENCES construction(`construction_id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';