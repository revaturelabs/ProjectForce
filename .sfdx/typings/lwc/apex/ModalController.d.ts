declare module "@salesforce/apex/ModalController.getBatch" {
  export default function getBatch(param: {trainingID: any}): Promise<any>;
}
declare module "@salesforce/apex/ModalController.getProject" {
  export default function getProject(param: {trackName: any, startDateName: any}): Promise<any>;
}
declare module "@salesforce/apex/ModalController.Save" {
  export default function Save(param: {trainingId: any, newProjectName: any, newComment: any}): Promise<any>;
}
declare module "@salesforce/apex/ModalController.updateCheckBoxStatusRecord" {
  export default function updateCheckBoxStatusRecord(param: {projectStatusToUpdate: any, reviewStatusToUpdate: any}): Promise<any>;
}
