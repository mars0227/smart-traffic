UPDATE reservation SET image = NULL;

ALTER TABLE `reservation` CHANGE `image` `image` bigint(11) UNSIGNED COMMENT 'image number';

/*
make folder by reservation id and move image to their own folder use moveImageToFolder.js
*/