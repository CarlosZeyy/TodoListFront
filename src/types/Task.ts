export interface Task {
  taskId: number;
  title: string;
  description: string;
  finalDate: string;
  status: string;
  creationTimestamp: string;
  updateTimestamp: string;
}

export interface TaskDto {
  title: string;
  description: string;
  finalDate: string;
  status: string;
}
