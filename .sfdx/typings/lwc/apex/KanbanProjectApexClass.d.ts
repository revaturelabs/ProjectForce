declare module "@salesforce/apex/KanbanProjectApexClass.getKanbanColumns" {
  export default function getKanbanColumns(param: {project: any}): Promise<any>;
}
declare module "@salesforce/apex/KanbanProjectApexClass.getOrderOptions" {
  export default function getOrderOptions(param: {project: any}): Promise<any>;
}
declare module "@salesforce/apex/KanbanProjectApexClass.addNewColumn" {
  export default function addNewColumn(param: {stage: any, project: any, order: any}): Promise<any>;
}
declare module "@salesforce/apex/KanbanProjectApexClass.removeColumn" {
  export default function removeColumn(param: {label: any, project: any}): Promise<any>;
}
declare module "@salesforce/apex/KanbanProjectApexClass.getBacklogs" {
  export default function getBacklogs(param: {columnId: any}): Promise<any>;
}
declare module "@salesforce/apex/KanbanProjectApexClass.saveBacklog" {
  export default function saveBacklog(param: {backlog: any}): Promise<any>;
}
declare module "@salesforce/apex/KanbanProjectApexClass.saveBacklogs" {
  export default function saveBacklogs(param: {backlogs: any}): Promise<any>;
}
declare module "@salesforce/apex/KanbanProjectApexClass.addNewBacklog" {
  export default function addNewBacklog(param: {columnId: any, story: any}): Promise<any>;
}
declare module "@salesforce/apex/KanbanProjectApexClass.findProject" {
  export default function findProject(param: {name: any}): Promise<any>;
}
declare module "@salesforce/apex/KanbanProjectApexClass.removeCard" {
  export default function removeCard(param: {cardId: any}): Promise<any>;
}
declare module "@salesforce/apex/KanbanProjectApexClass.updateColumn" {
  export default function updateColumn(param: {columnId: any, title: any}): Promise<any>;
}
declare module "@salesforce/apex/KanbanProjectApexClass.updateCard" {
  export default function updateCard(param: {card: any, story: any}): Promise<any>;
}
