import Client from "../Client";
import Events from "../Events";

export default class EngineDebug extends Events {
  private lastLog = 0;

  constructor() {
    super("debug");
  }

  public run(_client: Client, message: string): void {
    if (process.env.PRODUCTION === "DEV") {
      const now = Date.now();
      if (now - this.lastLog >= 300000) {
        this.lastLog = now;
        console.log(message);
      }
    }
  }
}
