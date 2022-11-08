// export class Series {
//   processing: boolean = false;
//   tasks: any[] = [];
//   processCallback: (tasks: any) => {};

//   constructor(callback?: (tasks: any) => {}) {
//     this.processCallback = callback;
//   }

//   push(...args: any[]) {
//     this.tasks.push(...args);
//     return this;
//   }

//   async process(callback: (tasks: any) => {} = this.processCallback) {
//     if (this.processing == false) {
//       this.processing = true;
//       await callback(this.tasks.splice(0, 1)[0]);
//       this.processing = false;
//       if (this.tasks.length != 0) {
//         await this.process(callback);
//       }
//     }
//     return this;
//   }
// }

const defaultHandler: SeriesProcess<any, any> = async task =>
  console.log(`Series default handler (${task})`);

export type SeriesProcess<Task = any, Result = void> = (
  task: Task,
) => Promise<Result>;

export class Series<Task = any, Result = void> {
  private processing = false;
  private tasks: Task[] = [];

  constructor(
    private readonly taskHandler: SeriesProcess<Task, Result> = defaultHandler,
  ) {}

  public push(...tasks: Task[]): this {
    this.tasks.push(...tasks);
    return this;
  }

  public async process(handler: SeriesProcess<Task, Result> = this.taskHandler): Promise<this> {
    if (this.processing) {
      return this;
    }
    this.processing = true;

    // цикличный вариант
    while (this.tasks.length > 0) {
      await handler(this.tasks.splice(0, 1)[0]);
    }

    // рекурсивный вариант
    // await handler(this.tasks.splice(0, 1)[0]);
    // if (this.tasks.length !== 0) {
    //   setImmediate(() => void this.process());
    // }
    this.processing = false;
    return this;
  }
}
