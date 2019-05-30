CREATE TABLE IF NOT EXISTS `alert_switch`
(
    `alert_switch_id`       serial COMMENT 'identity id',
    `user_id`         		varchar(64) NOT NULL COMMENT 'manager, vendor, staff',
    `active`                tinyint(1) DEFAULT 1,
    `created_at`            timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at`            datetime  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`alert_switch_id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

INSERT INTO smart_traffic.alert_switch (user_id)
SELECT 
  user_id
FROM smart_traffic.user
WHERE identity_id = 1
/*TODO: get identity_id from identity table with identity_name = 'Manager'*/