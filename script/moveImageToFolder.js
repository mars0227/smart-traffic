const fs = require('fs');
const uploadFolderPath = '../uploads';

const files = fs.readdirSync(uploadFolderPath);

console.log('ls');
console.log(files);

const images = files.filter(fileName => fileName.includes('.jpg'))
    .filter(fileName => !fileName.includes('image'))

console.log('images');
console.log(images);

// const data = images.map(imageName => [, imageName])
const imageGetReservationId = imageName => imageName.split('.')[0];

images.forEach(imageName => {
    const reservationId = imageGetReservationId(imageName);
    fs.mkdirSync(`${uploadFolderPath}/${reservationId}`);

    const oldPath = `${uploadFolderPath}/${imageName}`;
    const newPath = `${uploadFolderPath}/${reservationId}/1.jpg`;
    fs.renameSync(oldPath, newPath);
    console.log('move', oldPath, 'to', newPath);
});

