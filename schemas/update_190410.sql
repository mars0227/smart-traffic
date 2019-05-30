ALTER TABLE construction ADD COLUMN active tinyint(1) DEFAULT 0 AFTER construction_name;

UPDATE construction SET active = 1 WHERE construction_name = "HA Queen's Hill Site";