declare module "@salesforce/apex/TableApexController.getTableData" {
  export default function getTableData(param: {queryObject: any, queryFields: any}): Promise<any>;
}
declare module "@salesforce/apex/TableApexController.updateTableData" {
  export default function updateTableData(param: {itemsToUpdate: any}): Promise<any>;
}
