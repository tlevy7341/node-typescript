import chalk from "chalk";

export default class Logging {
  public static info(message: string): void {
    console.log(chalk.blue(message));
  }

  public static error(message: string): void {
    console.log(chalk.red(message));
  }

  public static success(message: string): void {
    console.log(chalk.green(message));
  }
}
