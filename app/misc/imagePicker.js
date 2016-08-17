var ImagePickerManager = require('NativeModules').ImagePickerManager;

export const defaultOptions = {
  cancelButtonTitle: 'Cancelar',
  takePhotoButtonTitle: 'Capturar...',
  chooseFromLibraryButtonTitle: 'Buscar na biblioteca...',
  cameraType: 'front',
  aspectX: 1,
  aspectY: 1,
  quality: 0.2,
  angle: 0,
  allowsEditing: true
};

export function launchCamera(cameraOptions = defaultOptions) {
  return new Promise((resolve, reject) => {
    ImagePickerManager.launchCamera(cameraOptions, (response)  => {
      if(response.error) {
        reject(response.error);
      } else {
        resolve(response);
      }
    });
  });

}
