export default class Executable {
  constructor(args = [], command = 'explorer.exe', delay = 0) {
    this.args = args;
    this.command = command;
    this.delay = delay;
    this.hideWindow = false;
    this.logs = [];
    this.metrics = [];
    this.process = null;
  }

  reset() {
    this.logs = [];
    this.metrics = [];
    this.process = null;
  }

  getSavableObject() {
    return {
      args: this.args,
      command: this.command,
      delay: this.delay,
      hideWindow: this.hideWindow,
    };
  }
}
